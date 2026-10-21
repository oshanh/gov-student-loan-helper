import { getRequirementLines } from '../utils/formatRequirement'

const streamStyles = {
    humanities: ['badge-humanities', '📚', 'Humanities'],
    management: ['badge-management', '💼', 'Management'],
    science: ['badge-science', '🔬', 'Science'],
    engineering: ['badge-engineering', '⚙️', 'Engineering'],
    ict: ['badge-ict', '💻', 'ICT'],
}

export default function CourseCard({ course, onViewDetails, index = 0 }) {
    const [badgeClass, emoji, streamLabel] = streamStyles[course.stream] || ['badge-ict', '🎓', course.streamLabel || 'Programme']
    const requirements = getRequirementLines(course)

    return (
        <article className="glass-card card-glow rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 animate-fadeInUp" style={{ animationDelay: `${index * 40}ms` }}>
            <div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass}`}>{emoji} {streamLabel}</span>
                <h2 className="font-semibold text-white text-base leading-snug mt-3">{course.title}</h2>
                <p className="text-xs text-slate-400 mt-1">{course.institution}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex px-2.5 py-1 rounded-md bg-blue-500/15 border border-blue-400/40 text-blue-200 text-xs font-bold tracking-wide">{course.courseCode || 'CODE N/A'}</span>
                <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-full">⏱ {course.duration} years</span>
                <span className="text-xs text-emerald-300">Rs. {(course.courseFee || 0).toLocaleString()}</span>
            </div>
            <div className="border-t border-slate-800 pt-3">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-2">Entry requirements</p>
                <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                    {requirements.slice(0, 3).map((line, requirementIndex) => <li key={`${course.id}-requirement-${requirementIndex}`} className="flex items-start gap-2"><span className="text-emerald-400 shrink-0" aria-hidden="true">•</span><span>{line}</span></li>)}
                </ul>
                {requirements.length > 3 && <p className="text-[11px] text-slate-500 mt-2">+ {requirements.length - 3} more requirement{requirements.length - 3 === 1 ? '' : 's'}</p>}
            </div>
            <button type="button" onClick={() => onViewDetails(course)} className="mt-auto w-full py-2.5 rounded-xl text-sm font-medium text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-400 transition-all">View full requirements →</button>
        </article>
    )
}
