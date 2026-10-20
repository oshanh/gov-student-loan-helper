import { useState } from 'react'
import { courses, AL_STREAMS } from '../data/courses'

const steps = [
    { id: 1, title: 'Your A/L Stream', desc: 'What subject stream did you sit for?' },
    { id: 2, title: 'Your A/L Grades', desc: 'What grades did you achieve?' },
    { id: 3, title: 'Your O/L Results', desc: 'Check your O/L qualifications.' },
]

const GRADE_OPTIONS = ['A', 'B', 'C', 'S', 'F / Not Sat']
const SUBJECT_OPTIONS = [
    'Combined Mathematics', 'Physics', 'Chemistry', 'Biology', 'Agriculture',
    'Higher Mathematics', 'Mathematics', 'ICT', 'Economics', 'Accounting', 'English', 'Other',
]
const PASS_GRADES = ['A', 'B', 'C', 'S']

function GradePicker({ label, value, onChange }) {
    return (
        <div>
            <label className="block text-xs text-slate-400 mb-2">{label}</label>
            <div className="flex gap-2 flex-wrap">
                {GRADE_OPTIONS.map(grade => (
                    <button
                        key={grade}
                        onClick={() => onChange(grade)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                            value === grade
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                                : 'glass-card border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                    >
                        {grade}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default function EligibilityChecker({ onResults, onClose }) {
    const [step, setStep] = useState(1)
    const [alStream, setAlStream] = useState('')
    const [grades, setGrades] = useState({ sub1: '', sub2: '', sub3: '' })
    const [subjects, setSubjects] = useState({ sub1: '', sub2: '', sub3: '' })
    const [ictGrade, setIctGrade] = useState('')
    const [economicsGrade, setEconomicsGrade] = useState('')
    const [olMath, setOlMath] = useState('')
    const [olBusinessAccounting, setOlBusinessAccounting] = useState('')
    const [olEnglish, setOlEnglish] = useState('')
    const [olLanguage, setOlLanguage] = useState('')
    const [olScience, setOlScience] = useState('')
    const [olPasses, setOlPasses] = useState('')
    const [alEnglish, setAlEnglish] = useState('')
    const [sportsAchievement, setSportsAchievement] = useState(false)
    const [bridgingMark, setBridgingMark] = useState('')

    const getMatchingCourses = () => {
        const subGrades = [grades.sub1, grades.sub2, grades.sub3]
        const subjectEntries = Object.keys(subjects).map(key => ({ name: subjects[key], grade: grades[key] }))
        const cCount = subGrades.filter(g => ['A', 'B', 'C'].includes(g)).length
        const sCount = subGrades.filter(g => ['A', 'B', 'C', 'S'].includes(g)).length
        const hasOlMathC = ['A', 'B', 'C'].includes(olMath)
        const hasOlMathS = PASS_GRADES.includes(olMath)
        const hasOlBusinessAccountingC = ['A', 'B', 'C'].includes(olBusinessAccounting)
        const hasOlEngS = ['A', 'B', 'C', 'S'].includes(olEnglish)
        const hasOlEngC = ['A', 'B', 'C'].includes(olEnglish)
        const hasOlLanguageS = PASS_GRADES.includes(olLanguage)
        const hasOlLanguageC = ['A', 'B', 'C'].includes(olLanguage)
        const hasOlScienceC = ['A', 'B', 'C'].includes(olScience)
        const hasAlEngS = ['S', 'C', 'B', 'A'].includes(alEnglish)
        const hasEnglish = hasAlEngS || hasOlEngS
        const hasICTPass = ['A', 'B', 'C', 'S'].includes(ictGrade)
        const hasEconomicsPass = ['A', 'B', 'C', 'S'].includes(economicsGrade)
        const needsICTBridge = !['physical_science', 'engineering_tech'].includes(alStream) && !hasICTPass
        const needsManagementBridge = alStream !== 'commerce' && !hasEconomicsPass
        const hasBridgePass = Number(bridgingMark) >= 50
        const hasSubject = (name, minimum = 'S') => {
            const accepted = minimum === 'C' ? ['A', 'B', 'C'] : PASS_GRADES
            return subjectEntries.some(subject => subject.name === name && accepted.includes(subject.grade))
        }
        const hasApprovedSubject = (names, minimum = 'S') => names.some(name => hasSubject(name, minimum))

        const matched = courses.filter(course => {
            const req = course.requirement.toLowerCase()
            if (!hasEnglish) return false
            const isCommerce = req.includes('commerce')
            const isAnyStream = req.includes('any subject stream') || req.includes('any stream')
            const requiredStreams = [
                isCommerce && 'commerce',
                req.includes('physical science') && 'physical_science',
                req.includes('biological science') && 'biological_science',
                (req.includes('engineering technology') || req.includes('technology stream')) && 'engineering_tech',
                (req.includes('bio-system') || req.includes('bio systems technology')) && 'bio_systems_tech',
            ].filter(Boolean)

            if (!isAnyStream && requiredStreams.length > 0) {
                const streamMatches = requiredStreams.some(stream => stream === alStream || (stream === 'engineering_tech' && alStream === 'physical_science'))
                if (!streamMatches) return false
            }

            const requiresTwoCredits = req.includes('two') && req.includes('credit') && req.includes('one') && req.includes('simple')
            if (requiresTwoCredits && !(cCount >= 2 && sCount >= 3)) return false
            if (!requiresTwoCredits && cCount < 3 && !req.includes('simple') && !req.includes('simple (s)')) return false
            if (req.includes('combined mathematics') && req.includes('physics') && req.includes('chemistry')) {
                if (!hasSubject('Combined Mathematics') || !hasSubject('Physics') || !hasSubject('Chemistry')) return false
                if (req.includes('two') && !(subjectEntries.filter(s => ['Combined Mathematics', 'Physics', 'Chemistry'].includes(s.name) && ['A', 'B', 'C'].includes(s.grade)).length >= 2)) return false
            }
            if (req.includes('including combined mathematics') && !hasSubject('Combined Mathematics')) return false
            if (req.includes('english shall be one') || req.includes('including english as one')) {
                if (!hasSubject('English')) return false
            }
            if (req.includes('with “accounting” as a main subject') && !hasSubject('Accounting')) return false
            if (req.includes('biology, chemistry, physics and agriculture') && !hasApprovedSubject(['Biology', 'Chemistry', 'Physics', 'Agriculture'])) return false
            if (req.includes('sports') && !sportsAchievement) return false

            if (req.includes('general english') && !hasAlEngS) return false
            if (req.includes('o/l') && req.includes('mathematics') && req.includes('credit') && !hasOlMathC) return false
            if (req.includes('o/l') && req.includes('mathematics') && req.includes('simple') && !hasOlMathS) return false
            if (req.includes('o/l') && req.includes('english') && req.includes('credit') && !hasOlEngC) return false
            if (req.includes('o/l') && req.includes('english') && req.includes('simple') && !hasOlEngS) return false
            if (req.includes('business & accounting studies') && !hasOlBusinessAccountingC) return false
            if (req.includes('sinhala or tamil') && req.includes('credit') && !hasOlLanguageC) return false
            if (req.includes('sinhala or tamil') && !req.includes('credit') && !hasOlLanguageS) return false
            if (req.includes('six') && Number(olPasses) < 6) return false
            if (req.includes('science') && req.includes('ordinary level') && req.includes('credit') && !hasOlScienceC) return false
            if (req.includes('bridging course')) {
                const ictRouteReady = hasICTPass || ['physical_science', 'engineering_tech'].includes(alStream) || hasBridgePass
                const managementRouteReady = alStream === 'commerce' || hasEconomicsPass || hasBridgePass
                if (course.stream === 'ict' && !ictRouteReady) return false
                if (course.stream === 'management' && !managementRouteReady) return false
                if (!['ict', 'management'].includes(course.stream) && !hasBridgePass) return false
            }

            return sCount >= 3
        })

        return {
            courses: matched,
            bridging: {
                ict: needsICTBridge,
                management: needsManagementBridge,
                hasICTPass,
                hasEconomicsPass,
                hasOlMathC,
                hasOlBusinessAccountingC,
            },
        }
    }

    const canProceed = () => {
        if (step === 1) return alStream !== ''
        if (step === 2) return grades.sub1 && grades.sub2 && grades.sub3 && subjects.sub1 && subjects.sub2 && subjects.sub3
        if (step === 3) return olMath !== '' && olEnglish !== ''
        return false
    }

    const handleNext = () => {
        if (step < 3) setStep(s => s + 1)
        else {
            const result = getMatchingCourses()
            onResults(result.courses, result.bridging)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(4,8,15,0.9)', backdropFilter: 'blur(10px)' }}
        >
            <div
                className="glass-card rounded-3xl p-6 md:p-8 w-full max-w-lg"
                style={{ border: '1px solid rgba(16,185,129,0.25)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-xs text-emerald-400 font-medium uppercase tracking-widest mb-1">
                            Step {step} of 3
                        </p>
                        <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            {steps[step - 1].title}
                        </h2>
                        <p className="text-sm text-slate-400 mt-0.5">{steps[step - 1].desc}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-slate-800 rounded-full mb-6">
                    <div
                        className="h-1 bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                {/* Step 1: A/L Stream */}
                {step === 1 && (
                    <div className="space-y-2">
                        {AL_STREAMS.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setAlStream(s.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 
                  ${alStream === s.id
                                        ? 'bg-emerald-500/15 border-emerald-400 text-emerald-200'
                                        : 'glass-card border-slate-700 text-slate-300 hover:border-slate-500'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                        <div className="mt-4 space-y-3 border-t border-slate-800 pt-4">
                            <p className="text-xs text-slate-400">These subjects determine whether a stream-specific bridging course is required.</p>
                            <GradePicker label="A/L ICT Grade (any attempt)" value={ictGrade} onChange={setIctGrade} />
                            <GradePicker label="A/L Economics Grade (main subject, one sitting)" value={economicsGrade} onChange={setEconomicsGrade} />
                        </div>
                    </div>
                )}

                {/* Step 2: A/L Grades */}
                {step === 2 && (
                    <div className="space-y-4">
                        {['sub1', 'sub2', 'sub3'].map((key, i) => (
                            <div key={key}>
                                <label className="block text-sm text-slate-400 mb-2">A/L Subject {i + 1}</label>
                                <select
                                    value={subjects[key]}
                                    onChange={e => setSubjects(prev => ({ ...prev, [key]: e.target.value }))}
                                    className="input-glow w-full mb-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm"
                                >
                                    <option value="">Select subject</option>
                                    {SUBJECT_OPTIONS.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                                </select>
                                <div className="flex gap-2 flex-wrap">
                                    {GRADE_OPTIONS.map(g => (
                                        <button
                                            key={g}
                                            onClick={() => setGrades(prev => ({ ...prev, [key]: g }))}
                                            className={`px-4 py-2 rounded-xl text-sm border transition-all
                        ${grades[key] === g
                                                    ? g === 'F / Not Sat'
                                                        ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                                                        : 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                                                    : 'glass-card border-slate-700 text-slate-300 hover:border-slate-500'
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 3: O/L results + English */}
                {step === 3 && (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">O/L Mathematics Grade</label>
                            <div className="flex gap-2 flex-wrap">
                                {GRADE_OPTIONS.map(g => (
                                    <button
                                        key={g}
                                        onClick={() => setOlMath(g)}
                                        className={`px-4 py-2 rounded-xl text-sm border transition-all
                      ${olMath === g
                                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                                                : 'glass-card border-slate-700 text-slate-300 hover:border-slate-500'
                                            }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">O/L English Language Grade</label>
                            <div className="flex gap-2 flex-wrap">
                                {GRADE_OPTIONS.map(g => (
                                    <button
                                        key={g}
                                        onClick={() => setOlEnglish(g)}
                                        className={`px-4 py-2 rounded-xl text-sm border transition-all
                      ${olEnglish === g
                                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                                                : 'glass-card border-slate-700 text-slate-300 hover:border-slate-500'
                                            }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <GradePicker
                            label="O/L Business & Accounting Studies Grade (required for non-Commerce Applied Accounting applicants)"
                            value={olBusinessAccounting}
                            onChange={setOlBusinessAccounting}
                        />

                        <GradePicker
                            label="O/L Sinhala or Tamil Grade"
                            value={olLanguage}
                            onChange={setOlLanguage}
                        />

                        <GradePicker
                            label="O/L Science Grade (when specified)"
                            value={olScience}
                            onChange={setOlScience}
                        />

                        <div>
                            <label className="block text-xs text-slate-400 mb-2">Total O/L passes</label>
                            <input
                                type="number"
                                min="0"
                                max="9"
                                value={olPasses}
                                onChange={e => setOlPasses(e.target.value)}
                                placeholder="Enter total passes"
                                className="input-glow w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm"
                            />
                        </div>

                        <label className="flex items-center gap-2 text-xs text-slate-300">
                            <input type="checkbox" checked={sportsAchievement} onChange={e => setSportsAchievement(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                            I have the required school, zonal, provincial, national, or international sports achievement
                        </label>

                        <div>
                            <label className="block text-xs text-slate-400 mb-2">Bridging course average (if completed)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={bridgingMark}
                                onChange={e => setBridgingMark(e.target.value)}
                                placeholder="Enter percentage, e.g. 50"
                                className="input-glow w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">A/L General English Grade <span className="text-slate-500">(optional)</span></label>
                            <div className="flex gap-2 flex-wrap">
                                {['S', 'C', 'B', 'A', 'Not Sat'].map(g => (
                                    <button
                                        key={g}
                                        onClick={() => setAlEnglish(g)}
                                        className={`px-4 py-2 rounded-xl text-sm border transition-all
                      ${alEnglish === g
                                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                                                : 'glass-card border-slate-700 text-slate-300 hover:border-slate-500'
                                            }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-7">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(s => s - 1)}
                            className="flex-1 py-3 rounded-xl text-sm font-medium border border-slate-700 text-slate-300 hover:border-slate-500 transition-all"
                        >
                            ← Back
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all"
                    >
                        {step === 3 ? '🔍 Find My Courses' : 'Continue →'}
                    </button>
                </div>
            </div>
        </div>
    )
}
