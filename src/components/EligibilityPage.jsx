import { useState } from 'react'
import csvText from '../../course-details-structured new.csv?raw'
import CourseCard from './CourseCard'
import CourseModal from './CourseModal'

const gradeOptions = ['A', 'B', 'C', 'S', 'F / Not Sat']
const subjectOptions = ['Combined Mathematics', 'Higher Mathematics', 'Physics', 'Chemistry', 'Biology', 'Agriculture', 'Mathematics', 'ICT', 'Economics', 'Accounting', 'English', 'Other']
const streams = [['commerce', 'Commerce'], ['arts', 'Arts'], ['physical_science', 'Physical Science'], ['biological_science', 'Biological Science'], ['engineering_tech', 'Engineering Technology'], ['bio_systems_tech', 'Bio Systems Technology']]
const streamIds = { 'Humanities & Social Sciences': 'humanities', 'Management & Commerce': 'management', Science: 'science', 'Engineering & Technology': 'engineering', Computing: 'ict' }
const passGrades = ['A', 'B', 'C', 'S']
const creditGrades = ['A', 'B', 'C']

function parseCsv(text) {
    const rows = []
    let row = []
    let field = ''
    let quoted = false
    for (let i = 0; i < text.length; i += 1) {
        const character = text[i]
        if (character === '"') {
            if (quoted && text[i + 1] === '"') { field += '"'; i += 1 } else quoted = !quoted
        } else if (character === ',' && !quoted) { row.push(field.trim()); field = '' }
        else if ((character === '\n' || character === '\r') && !quoted) {
            if (character === '\r' && text[i + 1] === '\n') i += 1
            row.push(field.trim())
            if (row.some(Boolean)) rows.push(row)
            row = []; field = ''
        } else field += character
    }
    if (field || row.length) { row.push(field.trim()); rows.push(row) }
    const headers = rows[0].map(header => header.replace(/^\uFEFF/, '').trim())
    return rows.slice(1).map(values => Object.fromEntries(headers.map((header, i) => [header, values[i] || ''])))
}

const courses = parseCsv(csvText).map(row => {
    const stream = streamIds[row.Stream]
    const requirement = row['Entry Requirement'].replace(/\s+/g, ' ').trim()
    return {
        id: Number(row['S/N']),
        stream,
        streamLabel: row.Stream,
        streamEmoji: stream === 'humanities' ? '📚' : stream === 'management' ? '💼' : stream === 'science' ? '🔬' : stream === 'engineering' ? '⚙️' : '💻',
        institution: row['Name of the Institute'],
        institutionFull: row['Name of the Institute'],
        courseCode: row['Degree Code'],
        title: row['Title of the Degree'],
        duration: Number.parseInt(row['Course Duration'], 10),
        courseFee: Number(row['Course Fee (Rs.)'].replace(/,/g, '')),
        requirement,
        alRequirement: requirement,
    }
})

const isPass = grade => passGrades.includes(grade)
const isCredit = grade => creditGrades.includes(grade)

function matchesCourse(course, answer) {
    const requirement = course.requirement.toLowerCase()
    const grades = Object.values(answer.alGrades)
    const entries = Object.keys(answer.alSubjects).map(key => ({ subject: answer.alSubjects[key].toLowerCase(), grade: answer.alGrades[key] }))
    const hasSubject = (names, credit = false) => entries.some(entry => names.includes(entry.subject) && (credit ? isCredit(entry.grade) : isPass(entry.grade)))
    const passes = grades.filter(isPass).length
    const credits = grades.filter(isCredit).length
    const anyStream = requirement.includes('any stream') || requirement.includes('any subject stream')

    if (!isPass(answer.olEnglish) && !isPass(answer.alEnglish)) return false
    if (passes < 3) return false
    if (requirement.includes('general english') && !isPass(answer.alEnglish)) return false
    if (requirement.includes('o/l') && requirement.includes('english') && requirement.includes('credit') && !isCredit(answer.olEnglish)) return false
    if (requirement.includes('o/l') && requirement.includes('english') && !requirement.includes('credit') && !isPass(answer.olEnglish)) return false
    if (requirement.includes('mathematics') && requirement.includes('credit') && !isCredit(answer.olMath)) return false
    if (requirement.includes('mathematics') && !requirement.includes('credit') && !isPass(answer.olMath)) return false
    if ((requirement.includes('sinhala') || requirement.includes('tamil')) && !(requirement.includes('credit') ? isCredit(answer.olLanguage) : isPass(answer.olLanguage))) return false
    if (requirement.includes('six') && Number(answer.olPasses) < 6) return false
    if (requirement.includes('business & accounting') && !isCredit(answer.olBusinessAccounting)) return false
    if (requirement.includes('sports') && !answer.sportsAchievement) return false
    if (requirement.includes('credit') && requirement.includes('simple') && credits < 2) return false

    const streamMatch = (requirement.includes('commerce') && answer.alStream === 'commerce') ||
        (requirement.includes('physical science') && answer.alStream === 'physical_science') ||
        (requirement.includes('biological science') && answer.alStream === 'biological_science') ||
        (requirement.includes('engineering technology') && answer.alStream === 'engineering_tech') ||
        (requirement.includes('bio-system') && answer.alStream === 'bio_systems_tech')
    if (!anyStream && /(commerce|physical science|biological science|engineering technology|bio-system)/.test(requirement) && !streamMatch) return false
    if (requirement.includes('combined maths') && !hasSubject(['combined mathematics', 'higher mathematics'])) return false
    if (requirement.includes('combined mathematics') && !hasSubject(['combined mathematics'])) return false
    if (requirement.includes('physics') && requirement.includes('chemistry') && !hasSubject(['physics']) && !hasSubject(['chemistry'])) return false
    if (requirement.includes('english as a main subject') && !hasSubject(['english'])) return false
    if (requirement.includes('accounting') && requirement.includes('main subject') && !hasSubject(['accounting'])) return false
    if (requirement.includes('sports') && !answer.sportsAchievement) return false

    if (requirement.includes('bridging course')) {
        const bridgePassed = Number(answer.bridgingMark) >= 50
        const ictReady = ['physical_science', 'engineering_tech'].includes(answer.alStream) || isPass(answer.ictGrade) || bridgePassed
        const managementReady = answer.alStream === 'commerce' || isPass(answer.economicsGrade) || bridgePassed
        if (course.stream === 'ict' && !ictReady) return false
        if (course.stream === 'management' && !managementReady) return false
        if (!['ict', 'management'].includes(course.stream) && !bridgePassed) return false
    }
    return true
}

function Grades({ value, onChange }) {
    return <div className="flex gap-2 flex-wrap">{gradeOptions.map(grade => <button type="button" key={grade} onClick={() => onChange(grade)} className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${value === grade ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'glass-card border-slate-700 text-slate-300 hover:border-slate-500'}`}>{grade}</button>)}</div>
}

const emptyAnswer = {
    alStream: '', alSubjects: { one: '', two: '', three: '' }, alGrades: { one: '', two: '', three: '' },
    ictGrade: '', economicsGrade: '', olMath: '', olEnglish: '', olLanguage: '', olScience: '', olBusinessAccounting: '', olPasses: '', alEnglish: '', bridgingMark: '', sportsAchievement: false,
}

export default function EligibilityPage() {
    const [step, setStep] = useState(1)
    const [answer, setAnswer] = useState(emptyAnswer)
    const [results, setResults] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const update = (key, value) => setAnswer(previous => ({ ...previous, [key]: value }))
    const updateNested = (key, field, value) => setAnswer(previous => ({ ...previous, [key]: { ...previous[key], [field]: value } }))
    const ready = step === 1 ? Boolean(answer.alStream) : step === 2 ? Object.values(answer.alSubjects).every(Boolean) && Object.values(answer.alGrades).every(Boolean) : Boolean(answer.olMath && answer.olEnglish)
    const submit = () => setResults({
        courses: courses.filter(course => matchesCourse(course, answer)),
        bridging: {
            ict: !isPass(answer.ictGrade) && !['physical_science', 'engineering_tech'].includes(answer.alStream),
            management: answer.alStream !== 'commerce' && !isPass(answer.economicsGrade),
        },
    })

    return (
        <main className="min-h-screen hero-gradient px-4 py-8 md:py-12">
            <div className="max-w-7xl mx-auto">
                <a href="/" className="text-sm text-emerald-400 hover:text-emerald-300">← Back to home</a>
                {!results ? <section className="max-w-2xl mx-auto mt-8">
                    <p className="text-xs text-emerald-400 uppercase tracking-[0.2em] font-semibold text-center">Personalised course matching</p>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center mt-2">Check your eligibility</h1>
                    <p className="text-slate-400 text-center mt-2 mb-8">Answer questions about your A/L and O/L results to find matching programmes.</p>
                    <div className="glass-card rounded-3xl p-6 md:p-8">
                        <p className="text-xs text-emerald-400 uppercase tracking-widest">Step {step} of 3</p>
                        <div className="h-1 bg-slate-800 rounded-full my-5"><div className="h-1 bg-emerald-500 rounded-full" style={{ width: `${step * 33.333}%` }} /></div>
                        {step === 1 && <div className="space-y-2">{streams.map(([id, label]) => <button type="button" key={id} onClick={() => update('alStream', id)} className={`w-full text-left px-4 py-3 rounded-xl border text-sm ${answer.alStream === id ? 'bg-emerald-500/15 border-emerald-400 text-emerald-200' : 'glass-card border-slate-700 text-slate-300'}`}>{label}</button>)}<div className="border-t border-slate-800 mt-5 pt-5 space-y-4"><label className="block text-xs text-slate-400">A/L ICT grade</label><Grades value={answer.ictGrade} onChange={value => update('ictGrade', value)} /><label className="block text-xs text-slate-400">A/L Economics grade</label><Grades value={answer.economicsGrade} onChange={value => update('economicsGrade', value)} /></div></div>}
                        {step === 2 && <div className="space-y-5">{['one', 'two', 'three'].map((field, index) => <div key={field}><label className="block text-sm text-slate-400 mb-2">A/L subject {index + 1}</label><select value={answer.alSubjects[field]} onChange={event => updateNested('alSubjects', field, event.target.value)} className="input-glow w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm"><option value="">Select subject</option>{subjectOptions.map(subject => <option key={subject}>{subject}</option>)}</select><div className="mt-2"><Grades value={answer.alGrades[field]} onChange={value => updateNested('alGrades', field, value)} /></div></div>)}</div>}
                        {step === 3 && <div className="space-y-5">{[['olMath', 'O/L Mathematics'], ['olEnglish', 'O/L English'], ['olBusinessAccounting', 'O/L Business & Accounting Studies'], ['olLanguage', 'O/L Sinhala or Tamil'], ['olScience', 'O/L Science']].map(([key, label]) => <div key={key}><label className="block text-sm text-slate-400 mb-2">{label}</label><Grades value={answer[key]} onChange={value => update(key, value)} /></div>)}<label className="block text-sm text-slate-400">Total O/L passes<input type="number" value={answer.olPasses} onChange={event => update('olPasses', event.target.value)} className="input-glow w-full mt-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm" /></label><label className="flex gap-2 text-xs text-slate-300"><input type="checkbox" checked={answer.sportsAchievement} onChange={event => update('sportsAchievement', event.target.checked)} className="accent-emerald-500" />Sports achievement requirement is met</label><label className="block text-sm text-slate-400">Bridging course average<input type="number" value={answer.bridgingMark} onChange={event => update('bridgingMark', event.target.value)} className="input-glow w-full mt-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm" /></label><div><label className="block text-sm text-slate-400 mb-2">A/L General English</label><Grades value={answer.alEnglish} onChange={value => update('alEnglish', value)} /></div></div>}
                        <div className="flex gap-3 mt-8">{step > 1 && <button type="button" onClick={() => setStep(step - 1)} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300">← Back</button>}<button type="button" disabled={!ready} onClick={() => step === 3 ? submit() : setStep(step + 1)} className="flex-1 py-3 rounded-xl bg-emerald-500 disabled:opacity-40 text-white font-semibold">{step === 3 ? '🔍 Find My Courses' : 'Continue →'}</button></div>
                    </div>
                </section> : <section className="mt-8"><div className="flex justify-between items-end gap-4 mb-8"><div><p className="text-xs text-emerald-400 uppercase tracking-widest">Eligibility results</p><h1 className="text-3xl font-extrabold text-white mt-2">Courses that may suit you</h1><p className="text-slate-400 mt-2">{results.courses.length} programme{results.courses.length === 1 ? '' : 's'} matched.</p></div><button type="button" onClick={() => { setResults(null); setStep(1); setAnswer(emptyAnswer) }} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm">Check again</button></div>{results.courses.length === 0 ? <div className="glass-card rounded-2xl p-12 text-center text-slate-300">No programmes matched. Verify your results and programme requirements with MOHE.</div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{results.courses.map((course, index) => <CourseCard key={course.id} course={course} index={index} onViewDetails={setSelectedCourse} />)}</div>}</section>}
            </div>
            {selectedCourse && <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
        </main>
    )
}
