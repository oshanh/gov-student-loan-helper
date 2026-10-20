const streamBadgeClass = {
    humanities: 'badge-humanities',
    management: 'badge-management',
    science: 'badge-science',
    engineering: 'badge-engineering',
    ict: 'badge-ict',
}

const streamLabel = {
    humanities: 'Humanities',
    management: 'Management',
    science: 'Science',
    engineering: 'Engineering',
    ict: 'ICT',
}

const streamEmoji = {
    humanities: '📚',
    management: '💼',
    science: '🔬',
    engineering: '⚙️',
    ict: '💻',
}

export default function CourseCard({ course, onViewDetails, index }) {
    return (
        <div
            className="glass-card card-glow rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 cursor-pointer animate-fadeInUp"
            style={{ animationDelay: `${index * 40}ms` }}
            onClick={() => onViewDetails(course)}
        >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 truncate">{course.institution}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{course.courseCode} · Rs. {course.courseFee.toLocaleString()}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${streamBadgeClass[course.stream]}`}>
                    {streamEmoji[course.stream]} {streamLabel[course.stream]}
                </span>
            </div>

            {/* Duration badge */}
            <div className="flex items-center gap-2">
                <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-full">
                    ⏱ {course.duration} Year{course.duration > 1 ? 's' : ''}
                </span>
                {course.minGrade === 'C' && (
                    <span className="text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300 px-2.5 py-1 rounded-full">
                        ★ Needs Credit passes
                    </span>
                )}
            </div>

            {/* AL requirement preview */}
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                <span className="text-slate-300 font-medium">A/L: </span>
                {course.alRequirement}
            </p>

            {/* View details button */}
            <button
                onClick={(e) => { e.stopPropagation(); onViewDetails(course); }}
                className="mt-auto w-full py-2 rounded-xl text-sm font-medium text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-200"
            >
                View Full Requirements →
            </button>
        </div>
    )
}
