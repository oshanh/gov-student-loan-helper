import { useMemo, useState } from 'react'
import csvText from '../../course-details-structured new.csv?raw'
import CourseCard from './CourseCard'
import CourseModal from './CourseModal'
import { AL_SUBJECTS } from '../data/al'

const gradeOptions = ['A', 'B', 'C', 'S', 'F / Not Sat']
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

const institutions = [...new Set(courses.map(course => course.institution))].sort()
const streamOptions = [
    ['all', 'All streams'],
    ['humanities', 'Humanities'],
    ['management', 'Management'],
    ['science', 'Science'],
    ['engineering', 'Engineering'],
    ['ict', 'ICT & Computing'],
]

const isPass = grade => passGrades.includes(grade)
const isCredit = grade => creditGrades.includes(grade)

function normalizeSubject(subject) {
    return subject.toLowerCase()
        .replace(/information\s*(?:&|and)\s*communication\s*technology/g, 'ict')
        .replace(/combined\s+maths/g, 'combined mathematics')
        .replace(/higher\s+maths/g, 'higher mathematics')
        .trim()
}

function getRequirementAlternatives(requirement) {
    const lines = requirement
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .flatMap(line => line.trim().split(/\s+(?=\d+\.\s)/))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean)
    return lines.length ? lines : [requirement]
}

function matchesAlternative(alternative, course, answer) {
    const requirement = alternative.toLowerCase()
    const entries = Object.keys(answer.alSubjects).map(key => ({
        subject: normalizeSubject(answer.alSubjects[key]),
        grade: answer.alGrades[key],
    }))
    const grades = entries.map(entry => entry.grade)
    const passes = grades.filter(isPass).length
    const credits = grades.filter(isCredit).length
    const hasSubject = (names, minimum = 'S') => entries.some(entry =>
        names.map(normalizeSubject).includes(entry.subject) &&
        (minimum === 'C' ? isCredit(entry.grade) : isPass(entry.grade)),
    )
    const anyStream = /any\s+(?:subject\s+)?stream/.test(requirement)
    const streamRequirements = [
        ['commerce', 'commerce'],
        ['arts', 'arts'],
        ['physical science', 'physical_science'],
        ['biological science', 'biological_science'],
        ['engineering technology', 'engineering_tech'],
        ['bio-system', 'bio_systems_tech'],
    ]
    const requiredStreams = streamRequirements
        .filter(([label]) => requirement.includes(label))
        .map(([, stream]) => stream)
    const streamMatches = anyStream || !requiredStreams.length || requiredStreams.includes(answer.alStream)
    if (!streamMatches) return false

    const requiredCredits = requirement.match(/(?:3|three)\s*(?:\([^)]*\))?\s*(?:credits?|c)\b/i)
    const minimumPasses = requirement.match(/(?:3|three)\s*(?:\([^)]*\))?\s*(?:simple\s*)?(?:pass|passes|s)\b/i)
    if (requiredCredits && credits < 3) return false
    if (!requiredCredits && minimumPasses && passes < 3) return false
    if (!requiredCredits && !minimumPasses && passes < 3) return false

    if (requirement.includes('general english') && !isPass(answer.alEnglish)) return false
    if (requirement.includes('o/l') && requirement.includes('english')) {
        const englishRequired = requirement.includes('credit') ? isCredit(answer.olEnglish) : isPass(answer.olEnglish)
        if (!englishRequired) return false
    }
    if (requirement.includes('o/l') && requirement.includes('mathematics')) {
        const mathRequired = requirement.includes('credit') ? isCredit(answer.olMath) : isPass(answer.olMath)
        if (!mathRequired) return false
    }
    if (requirement.includes('sinhala') || requirement.includes('tamil')) {
        const languageRequired = requirement.includes('credit') ? isCredit(answer.olLanguage) : isPass(answer.olLanguage)
        if (!languageRequired) return false
    }
    if (/\b(?:6|six)\s+passes?\b/.test(requirement) && Number(answer.olPasses) < 6) return false
    if (requirement.includes('business & accounting') && !isCredit(answer.olBusinessAccounting)) return false
    if (requirement.includes('sports') && !answer.sportsAchievement) return false
    if (requirement.includes('three') && requirement.includes('credit') && requirement.includes('english') && !isCredit(answer.olEnglish)) return false

    if (requirement.includes('combined mathematics')) {
        if (requirement.includes('/') || requirement.includes('from combined')) {
            if (!hasSubject(['combined mathematics']) && !hasSubject(['higher mathematics'])) return false
        } else if (!hasSubject(['combined mathematics'])) return false
    }
    const hasPhysics = hasSubject(['physics'])
    const hasChemistry = hasSubject(['chemistry'])
    if (requirement.includes('physics') && requirement.includes('chemistry')) {
        if (/physics\s+or\s+chemistry|chemistry\s+or\s+physics/.test(requirement)) {
            if (!hasPhysics && !hasChemistry) return false
        } else if (!hasPhysics || !hasChemistry) {
            return false
        }
    } else if (requirement.includes('physics') && /(main subject|pass in|subject)/.test(requirement) && !hasPhysics) {
        return false
    } else if (requirement.includes('chemistry') && /(main subject|pass in|subject)/.test(requirement) && !hasChemistry) {
        return false
    }
    if (requirement.includes('english as a main subject') && !hasSubject(['english'])) return false
    if (requirement.includes('accounting') && requirement.includes('main subject') && !hasSubject(['accounting'])) return false
    if (/(biology|chemistry|physics|agriculture)/.test(requirement) && requirement.includes('from biology')) {
        if (entries.filter(entry => ['biology', 'chemistry', 'physics', 'agriculture'].includes(entry.subject) && isPass(entry.grade)).length < 3) return false
    }

    if (requirement.includes('bridging course')) {
        const bridgePassed = Number(answer.bridgingMark) >= 50
        const ictReady = ['physical_science', 'engineering_tech'].includes(answer.alStream) || isPass(answer.ictGrade)
        const managementReady = answer.alStream === 'commerce' || isPass(answer.economicsGrade)
        const prequalified = course.stream === 'ict' ? ictReady : course.stream === 'management' ? managementReady : false
        if (!prequalified && !bridgePassed) return false
    }
    return true
}

function matchesCourse(course, answer) {
    const alGrades = Object.values(answer.alGrades)
    if (answer.alYear && !['2023', '2024', '2025'].includes(answer.alYear)) return false
    if (Number(answer.alSittings) > 3 || Number(answer.commonGeneralTest) < 30 || Number(answer.age) > 25) return false
    if (alGrades.filter(isPass).length < 3) return false
    if (!isPass(answer.olEnglish) && !isPass(answer.alEnglish)) return false
    return getRequirementAlternatives(course.requirement).some(alternative => matchesAlternative(alternative, course, answer))
}

function Grades({ value, onChange }) {
    return <div className="flex gap-2 flex-wrap">{gradeOptions.map(grade => <button type="button" key={grade} onClick={() => onChange(grade)} className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${value === grade ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'glass-card border-slate-700 text-slate-300 hover:border-slate-500'}`}>{grade}</button>)}</div>
}

function SubjectSelect({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const filteredSubjects = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase()
        return AL_SUBJECTS.filter(subject => !normalizedQuery || subject.toLowerCase().includes(normalizedQuery))
    }, [query])
    const selectSubject = subject => {
        onChange(subject)
        setQuery('')
        setIsOpen(false)
    }

    return <div className="relative">
        <button type="button" onClick={() => setIsOpen(open => !open)} className="input-glow w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-left text-sm text-slate-300">
            {value || 'Select subject'}
            <span className="float-right text-slate-500">{isOpen ? '▲' : '▼'}</span>
        </button>
        {isOpen && <div className="absolute left-0 right-0 z-20 mt-2 rounded-xl border border-slate-700 bg-slate-900 shadow-xl overflow-hidden">
            <input autoFocus type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search subjects..." className="w-full px-3 py-2.5 bg-slate-800 border-b border-slate-700 text-sm text-slate-200 outline-none placeholder:text-slate-500" />
            <div className="max-h-56 overflow-y-auto p-1">
                {filteredSubjects.length ? filteredSubjects.map(subject => <button type="button" key={subject} onClick={() => selectSubject(subject)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-emerald-500/15 hover:text-emerald-200 ${value === subject ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300'}`}>{subject}</button>) : <p className="px-3 py-3 text-sm text-slate-500">No subjects found.</p>}
            </div>
        </div>}
    </div>
}

const emptyAnswer = {
    alStream: '', alSubjects: { one: '', two: '', three: '' }, alGrades: { one: '', two: '', three: '' },
    alYear: '', alSittings: '', commonGeneralTest: '', age: '', ictGrade: '', economicsGrade: '', olMath: '', olEnglish: '', olLanguage: '', olScience: '', olBusinessAccounting: '', olPasses: '', alEnglish: '', bridgingMark: '', sportsAchievement: false,
}

export default function EligibilityPage() {
    const [step, setStep] = useState(1)
    const [answer, setAnswer] = useState(emptyAnswer)
    const [results, setResults] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStream, setSelectedStream] = useState('all')
    const [selectedInstitution, setSelectedInstitution] = useState('all')
    const [selectedDuration, setSelectedDuration] = useState('all')
    const update = (key, value) => setAnswer(previous => ({ ...previous, [key]: value }))
    const updateNested = (key, field, value) => setAnswer(previous => ({ ...previous, [key]: { ...previous[key], [field]: value } }))
    const ready = step === 1
        ? Boolean(answer.alStream && answer.alYear && answer.alSittings && answer.commonGeneralTest && answer.age)
        : step === 2
            ? Object.values(answer.alSubjects).every(Boolean) && Object.values(answer.alGrades).every(Boolean)
            : Boolean(answer.olMath && answer.olEnglish)
    const filteredResults = useMemo(() => {
        if (!results) return []
        const query = searchQuery.trim().toLowerCase()
        return results.courses.filter(course => {
            const matchesStream = selectedStream === 'all' || course.stream === selectedStream
            const matchesInstitution = selectedInstitution === 'all' || course.institution === selectedInstitution
            const matchesDuration = selectedDuration === 'all' || course.duration === Number(selectedDuration)
            const searchableText = [course.title, course.courseCode, course.institution, course.streamLabel, course.requirement].join(' ').toLowerCase()
            return matchesStream && matchesInstitution && matchesDuration && (!query || searchableText.includes(query))
        })
    }, [results, searchQuery, selectedStream, selectedInstitution, selectedDuration])
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
                        {step === 1 && <div className="space-y-4">
                            <label className="block text-sm text-slate-400">A/L stream</label>
                            {streams.map(([id, label]) => <button type="button" key={id} onClick={() => update('alStream', id)} className={`w-full text-left px-4 py-3 rounded-xl border text-sm ${answer.alStream === id ? 'bg-emerald-500/15 border-emerald-400 text-emerald-200' : 'glass-card border-slate-700 text-slate-300'}`}>{label}</button>)}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-800 mt-5 pt-5">
                                <label className="text-sm text-slate-400">A/L year
                                    <select value={answer.alYear} onChange={event => update('alYear', event.target.value)} className="input-glow w-full mt-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm"><option value="">Select year</option><option>2023</option><option>2024</option><option>2025</option></select>
                                </label>
                                <label className="text-sm text-slate-400">A/L sittings
                                    <input type="number" min="1" max="3" value={answer.alSittings} onChange={event => update('alSittings', event.target.value)} className="input-glow w-full mt-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm" />
                                </label>
                                <label className="text-sm text-slate-400">Common General Test marks
                                    <input type="number" min="0" max="100" value={answer.commonGeneralTest} onChange={event => update('commonGeneralTest', event.target.value)} className="input-glow w-full mt-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm" />
                                </label>
                                <label className="text-sm text-slate-400">Age on 27 Sep 2026
                                    <input type="number" min="1" max="100" value={answer.age} onChange={event => update('age', event.target.value)} className="input-glow w-full mt-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm" />
                                </label>
                            </div>
                            <div className="border-t border-slate-800 pt-4 space-y-4"><label className="block text-xs text-slate-400">A/L ICT grade</label><Grades value={answer.ictGrade} onChange={value => update('ictGrade', value)} /><label className="block text-xs text-slate-400">A/L Economics grade</label><Grades value={answer.economicsGrade} onChange={value => update('economicsGrade', value)} /></div>
                        </div>}
                        {step === 2 && <div className="space-y-5">{['one', 'two', 'three'].map((field, index) => <div key={field}><label className="block text-sm text-slate-400 mb-2">A/L subject {index + 1}</label><SubjectSelect value={answer.alSubjects[field]} onChange={value => updateNested('alSubjects', field, value)} /><div className="mt-2"><Grades value={answer.alGrades[field]} onChange={value => updateNested('alGrades', field, value)} /></div></div>)}</div>}
                        {step === 3 && <div className="space-y-5">{[['olMath', 'O/L Mathematics'], ['olEnglish', 'O/L English'], ['olBusinessAccounting', 'O/L Business & Accounting Studies'], ['olLanguage', 'O/L Sinhala or Tamil'], ['olScience', 'O/L Science']].map(([key, label]) => <div key={key}><label className="block text-sm text-slate-400 mb-2">{label}</label><Grades value={answer[key]} onChange={value => update(key, value)} /></div>)}<label className="block text-sm text-slate-400">Total O/L passes<input type="number" value={answer.olPasses} onChange={event => update('olPasses', event.target.value)} className="input-glow w-full mt-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm" /></label><label className="flex gap-2 text-xs text-slate-300"><input type="checkbox" checked={answer.sportsAchievement} onChange={event => update('sportsAchievement', event.target.checked)} className="accent-emerald-500" />Sports achievement requirement is met</label><label className="block text-sm text-slate-400">Bridging course average<input type="number" value={answer.bridgingMark} onChange={event => update('bridgingMark', event.target.value)} className="input-glow w-full mt-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm" /></label><div><label className="block text-sm text-slate-400 mb-2">A/L General English</label><Grades value={answer.alEnglish} onChange={value => update('alEnglish', value)} /></div></div>}
                        <div className="flex gap-3 mt-8">{step > 1 && <button type="button" onClick={() => setStep(step - 1)} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300">← Back</button>}<button type="button" disabled={!ready} onClick={() => step === 3 ? submit() : setStep(step + 1)} className="flex-1 py-3 rounded-xl bg-emerald-500 disabled:opacity-40 text-white font-semibold">{step === 3 ? '🔍 Find My Courses' : 'Continue →'}</button></div>
                    </div>
                </section> : <section className="mt-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                        <div>
                            <p className="text-xs text-emerald-400 uppercase tracking-widest">Eligibility results</p>
                            <h1 className="text-3xl font-extrabold text-white mt-2">Courses that may suit you</h1>
                            <p className="text-slate-400 mt-2">{filteredResults.length} of {results.courses.length} matched programmes shown.</p>
                        </div>
                        <button type="button" onClick={() => { setResults(null); setStep(1); setAnswer(emptyAnswer); setSearchQuery(''); setSelectedStream('all'); setSelectedInstitution('all'); setSelectedDuration('all') }} className="self-start px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm">Check again</button>
                    </div>
                    <section className="glass-card rounded-2xl p-4 mb-6" aria-label="Eligibility result filters">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                            <label className="xl:col-span-2">
                                <span className="sr-only">Search eligible courses</span>
                                <input type="search" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Search eligible courses, institutes, or requirements..." className="input-glow w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200 text-sm placeholder-slate-500" />
                            </label>
                            <label>
                                <span className="sr-only">Filter by stream</span>
                                <select value={selectedStream} onChange={event => setSelectedStream(event.target.value)} className="input-glow w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm">
                                    {streamOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                </select>
                            </label>
                            <label>
                                <span className="sr-only">Filter by institute</span>
                                <select value={selectedInstitution} onChange={event => setSelectedInstitution(event.target.value)} className="input-glow w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm">
                                    <option value="all">All institutes</option>
                                    {institutions.map(institution => <option key={institution} value={institution}>{institution}</option>)}
                                </select>
                            </label>
                            <label>
                                <span className="sr-only">Filter by duration</span>
                                <select value={selectedDuration} onChange={event => setSelectedDuration(event.target.value)} className="input-glow w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm">
                                    <option value="all">All durations</option>
                                    <option value="3">3 years</option>
                                    <option value="4">4 years</option>
                                </select>
                            </label>
                        </div>
                    </section>
                    {filteredResults.length === 0 ? <div className="glass-card rounded-2xl p-12 text-center text-slate-300">No eligible programmes match these filters.</div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{filteredResults.map((course, index) => <CourseCard key={course.id} course={course} index={index} onViewDetails={setSelectedCourse} />)}</div>}
                </section>}
            </div>
            {selectedCourse && <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
        </main>
    )
}
