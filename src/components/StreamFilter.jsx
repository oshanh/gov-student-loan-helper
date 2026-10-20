import { STREAMS } from '../data/courses'

const streamColors = {
    all: 'border-slate-500 text-slate-300 hover:border-slate-400',
    humanities: 'border-violet-500/40 text-violet-300 hover:border-violet-400',
    management: 'border-amber-500/40 text-amber-300 hover:border-amber-400',
    science: 'border-teal-500/40 text-teal-300 hover:border-teal-400',
    engineering: 'border-blue-500/40 text-blue-300 hover:border-blue-400',
    ict: 'border-emerald-500/40 text-emerald-300 hover:border-emerald-400',
}

const streamActiveColors = {
    all: 'bg-slate-600 border-slate-400 text-white',
    humanities: 'bg-violet-500/20 border-violet-400 text-violet-200',
    management: 'bg-amber-500/20 border-amber-400 text-amber-200',
    science: 'bg-teal-500/20 border-teal-400 text-teal-200',
    engineering: 'bg-blue-500/20 border-blue-400 text-blue-200',
    ict: 'bg-emerald-500/20 border-emerald-400 text-emerald-200',
}

export default function StreamFilter({ activeStream, onStreamChange }) {
    return (
        <div className="flex flex-wrap gap-2 justify-center">
            {STREAMS.map((stream) => {
                const isActive = activeStream === stream.id
                return (
                    <button
                        key={stream.id}
                        onClick={() => onStreamChange(stream.id)}
                        className={`
              px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
              ${isActive
                                ? streamActiveColors[stream.id]
                                : `glass-card ${streamColors[stream.id]} hover:bg-white/5`
                            }
            `}
                    >
                        <span className="mr-1.5">{stream.emoji}</span>
                        {stream.label}
                    </button>
                )
            })}
        </div>
    )
}
