import { useEffect } from 'react'

const streamLabel = {
    humanities: '📚 Humanities & Social Sciences',
    management: '💼 Management & Commerce',
    science: '🔬 Science',
    engineering: '⚙️ Engineering & Technology',
    ict: '💻 ICT & Computing',
}

const streamBadgeClass = {
    humanities: 'badge-humanities',
    management: 'badge-management',
    science: 'badge-science',
    engineering: 'badge-engineering',
    ict: 'badge-ict',
}

export default function CourseModal({ course, onClose }) {
    useEffect(() => {
        const handleKey = (e) => e.key === 'Escape' && onClose()
        window.addEventListener('keydown', handleKey)
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', handleKey)
            document.body.style.overflow = ''
        }
    }, [onClose])

    if (!course) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(4,8,15,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
        >
            <div
                className="glass-card rounded-3xl p-6 md:p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto animate-fadeInUp"
                style={{ border: '1px solid rgba(16,185,129,0.2)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <div className="flex items-start justify-between mb-5">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${streamBadgeClass[course.stream]}`}>
                        {streamLabel[course.stream]}
                    </span>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors ml-3 shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-white mb-1 leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {course.title}
                </h2>
                <p className="text-emerald-400 font-medium text-sm mb-1">{course.institutionFull || course.institution}</p>
                <p className="text-slate-500 text-xs mb-1">{course.courseCode} · Course fee: Rs. {course.courseFee.toLocaleString()}</p>
                <p className="text-slate-400 text-sm mb-5">
                    ⏱ {course.duration}-Year Degree Programme
                </p>

                {/* Campus locations */}
                {course.campuses && (
                    <div className="mb-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                        <p className="text-xs text-slate-400 font-medium mb-1">📍 Available Campuses</p>
                        <p className="text-sm text-slate-200">{course.campuses.join(', ')}</p>
                    </div>
                )}

                {/* Requirements */}
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                        <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">Complete Minimum Entry Qualification</p>
                        <p className="text-sm text-slate-200 leading-relaxed">{course.requirement || course.alRequirement}</p>
                    </div>

                    {course.olRequirement && (
                        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                            <p className="text-xs font-semibold text-violet-300 uppercase tracking-wider mb-2">O/L Requirements</p>
                            <p className="text-sm text-slate-200 leading-relaxed">{course.olRequirement}</p>
                        </div>
                    )}

                    {course.specialNote && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                            <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">⚠ Special Condition</p>
                            <p className="text-sm text-amber-200 leading-relaxed">{course.specialNote}</p>
                        </div>
                    )}
                </div>

                {/* General requirements */}
                <div className="mt-5 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">📋 General IFSLS Requirements (All Programmes)</p>
                    <ul className="text-xs text-slate-300 space-y-1 leading-relaxed list-disc list-inside">
                        <li>A/L in 2023, 2024, or 2025 (not exceeding 3 sittings)</li>
                        <li>Minimum 30 marks in Common General Test</li>
                        <li>'S' pass in General English (A/L) OR English (O/L)</li>
                        <li>25 years old or below by 27 September 2026</li>
                    </ul>
                </div>

                {/* CTA */}
                <a
                    href="https://mohe.gov.lk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-colors"
                >
                    Apply via MOHE Portal
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        </div>
    )
}
