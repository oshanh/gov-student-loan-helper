import { useEffect } from 'react'
import { getRequirementLines } from '../utils/formatRequirement'

const streamLabels = {
    humanities: '📚 Humanities & Social Sciences',
    management: '💼 Management & Commerce',
    science: '🔬 Science',
    engineering: '⚙️ Engineering & Technology',
    ict: '💻 ICT & Computing',
}

export default function CourseModal({ course, onClose }) {
    useEffect(() => {
        const handleKeyDown = event => { if (event.key === 'Escape') onClose() }
        window.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'
        return () => { window.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = '' }
    }, [onClose])

    if (!course) return null
    const requirements = getRequirementLines(course)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(4,8,15,0.88)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
            <div className="glass-card rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeInUp" onClick={event => event.stopPropagation()}>
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium badge-${course.stream}`}>{streamLabels[course.stream] || course.streamLabel}</span>
                        <h2 className="text-xl md:text-2xl font-bold text-white mt-4 leading-snug">{course.title}</h2>
                        <p className="text-slate-400 text-sm mt-1">{course.institutionFull || course.institution}</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-xl" aria-label="Close details">×</button>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-400/40 text-blue-200 text-sm font-bold tracking-wide">Degree code: {course.courseCode || 'Not listed'}</span>
                    <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm">{course.duration} years</span>
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">Rs. {(course.courseFee || 0).toLocaleString()}</span>
                </div>
                <section className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                    <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">Minimum entry requirements</h3>
                    <ul className="space-y-3 text-sm text-slate-200 leading-relaxed">
                        {requirements.map((line, index) => <li key={`${course.id}-modal-requirement-${index}`} className="flex items-start gap-3"><span className="text-emerald-400 font-bold shrink-0" aria-hidden="true">•</span><span>{line}</span></li>)}
                    </ul>
                </section>
                <div className="mt-5 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">General IFSLS requirements</p>
                    <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed list-disc list-inside"><li>A/L in 2023, 2024, or 2025 within the permitted sittings</li><li>Minimum 30 marks in the Common General Test</li><li>English pass through A/L General English or O/L English</li><li>25 years old or below by 27 September 2026</li></ul>
                </div>
                <a href="https://studentloans.mohe.gov.lk/loan_application/asset/documents/student_guide_book_english.pdf" target="_blank" rel="noopener noreferrer" className="mt-5 flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-colors">Verify with MOHE ↗</a>
            </div>
        </div>
    )
}
