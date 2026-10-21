import {
  courses,
  INSTITUTIONS,
  GENERAL_REQUIREMENTS,
  BRIDGING_COURSES,
  BRIDGING_INSTITUTES,
  INELIGIBILITY_CRITERIA,
  LOAN_INFORMATION,
} from './data/courses'
import './index.css'

export default function App() {
  return (
    <div className="min-h-screen hero-gradient">
      {/* ── HERO ────────────────────────────────────── */}
      <section className="relative pt-16 pb-12 px-4 text-center overflow-hidden">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div className="relative max-w-3xl mx-auto">
          {/* MOHE badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Ministry of Higher Education, Sri Lanka · Intake 11 · 2026/2027
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Interest-Free Student
            <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #10b981, #3b82f6)' }}>
              Loan Scheme
            </span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Discover all degree programmes available under the IFSLS, explore the course catalogue, or check if <em>you qualify</em> in under a minute.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              { label: 'Programmes', value: courses.length + '+' },
              { label: 'Institutions', value: INSTITUTIONS.length },
              { label: 'Study Streams', value: '5' },
              { label: 'Interest Rate', value: '0%' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-emerald-400" style={{ fontFamily: 'Outfit, sans-serif' }}>{stat.value}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="/eligibility"
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 text-white transition-all shadow-lg shadow-emerald-500/20"
            >
              ✦ Check My Eligibility
            </a>
            <a
              href="/all-courses"
              className="px-6 py-3 rounded-xl font-semibold text-sm glass-card border border-blue-500/30 text-blue-300 hover:border-blue-400 hover:text-white transition-all"
            >
              View Courses →
            </a>
          </div>
        </div>
      </section>

      {/* ── GENERAL REQUIREMENTS ─────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mb-12">
        <div className="glass-card rounded-2xl p-5 border border-slate-700/50">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            📋 General Eligibility Requirements (All Programmes)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GENERAL_REQUIREMENTS.map((requirement, index) => (
              <div key={requirement} className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
                
                <p className="text-xs text-slate-200 leading-relaxed">{requirement}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HANDBOOK DETAILS ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="mb-6">
          <p className="text-xs text-emerald-400 uppercase tracking-widest font-semibold">From the Student Handbook</p>
          <h2 className="text-2xl font-bold text-white mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Bridging courses and loan information</h2>
          <p className="text-sm text-slate-400 mt-2">Bridging requirements depend on your A/L stream, subject passes, and relevant O/L results. Contact a listed DAI for the current course schedule and registration details.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          {Object.values(BRIDGING_COURSES).map(course => (
            <div key={course.title} className="glass-card rounded-2xl p-5 border border-amber-500/20">
              <h3 className="text-base font-semibold text-amber-200">{course.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed mt-2">{course.requirement}</p>
              {course.modules && (
                <ul className="mt-3 space-y-1 text-xs text-slate-400 list-disc list-inside">
                  {course.modules.map(module => <li key={module}>{module}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>

        <details className="glass-card rounded-2xl border border-slate-700/60 mb-4">
          <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-slate-200">DAIs facilitating bridging courses ({BRIDGING_INSTITUTES.length})</summary>
          <div className="overflow-x-auto px-5 pb-5">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 border-b border-slate-700">
                <tr><th className="py-2 pr-4">Institute</th><th className="py-2 pr-4">Contact</th><th className="py-2 pr-4">Telephone</th><th className="py-2">Fee</th></tr>
              </thead>
              <tbody>
                {BRIDGING_INSTITUTES.map(([institute, contact, phone, fee]) => (
                  <tr key={institute} className="border-b border-slate-800 last:border-0">
                    <td className="py-2 pr-4 text-slate-200 font-medium">{institute}</td>
                    <td className="py-2 pr-4 text-slate-400">{contact}</td>
                    <td className="py-2 pr-4 text-slate-400">{phone}</td>
                    <td className="py-2 text-emerald-300">{fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-blue-500/20">
            <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-3">Loan and student obligations</h3>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside">
              {[LOAN_INFORMATION.main, LOAN_INFORMATION.stipend, LOAN_INFORMATION.fourYear, LOAN_INFORMATION.threeYear, ...LOAN_INFORMATION.conditions].map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-rose-500/20">
            <h3 className="text-sm font-semibold text-rose-200 uppercase tracking-wider mb-3">Ineligibility reminders</h3>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside">
              {INELIGIBILITY_CRITERIA.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-violet-500/20 mt-4">
          <h3 className="text-sm font-semibold text-violet-200 uppercase tracking-wider mb-3">Admission, selection, and study rules</h3>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-xs text-slate-300 leading-relaxed">
            <p>• Apply through the IFSLS online system and apply for any number of eligible programmes, but selection is limited to one programme.</p>
            <p>• Selection follows preferences and available seats; when oversubscribed, applicants are ranked by A/L Z-score.</p>
            <p>• All programmes are full-time and conducted in English at approved DAI branches.</p>
            <p>• Each student receives only one opportunity under government provisions.</p>
            <p>• The Ministry of Education and Ministry of Finance jointly supervise the scheme and progress reviews.</p>
            <p>• The registered DAI awards the approved degree certificate after successful completion.</p>
            <p>• Students must sign agreements with the Ministry and the lending bank.</p>
            <p>• Rules may change according to government and Ministry decisions; verify details before applying.</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-8 px-4 text-center">
        <p className="text-xs text-slate-500">
          Data sourced from the IFSLS Intake 11 (2026/2027) guide issued by the Ministry of Higher Education, Sri Lanka.
          Always verify requirements directly with MOHE before applying.
        </p>
        <a href="https://mohe.gov.lk" target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-500 hover:text-emerald-400 mt-1 inline-block">
          mohe.gov.lk →
        </a>
      </footer>

    </div>
  )
}
