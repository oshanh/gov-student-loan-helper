import { useState, useMemo } from 'react'
import {
  courses,
  INSTITUTIONS,
  BRIDGING_COURSES,
  BRIDGING_INSTITUTES,
  INELIGIBILITY_CRITERIA,
  LOAN_INFORMATION,
} from './data/courses'
import StreamFilter from './components/StreamFilter'
import CourseCard from './components/CourseCard'
import CourseModal from './components/CourseModal'
import EligibilityChecker from './components/EligibilityChecker'
import './index.css'

export default function App() {
  const [activeStream, setActiveStream] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useState('all')
  const [selectedDuration, setSelectedDuration] = useState('all')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showChecker, setShowChecker] = useState(false)
  const [eligibilityResults, setEligibilityResults] = useState(null)
  const [bridgingInfo, setBridgingInfo] = useState(null)

  const filteredCourses = useMemo(() => {
    let list = eligibilityResults !== null ? eligibilityResults : courses
    if (activeStream !== 'all') list = list.filter(c => c.stream === activeStream)
    if (selectedInstitution !== 'all') list = list.filter(c => c.institution === selectedInstitution)
    if (selectedDuration !== 'all') list = list.filter(c => c.duration === Number(selectedDuration))
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.institution.toLowerCase().includes(q) ||
        c.alRequirement.toLowerCase().includes(q)
      )
    }
    return list
  }, [activeStream, searchQuery, selectedInstitution, selectedDuration, eligibilityResults])

  const handleEligibilityResults = (matched, bridging) => {
    setEligibilityResults(matched)
    setBridgingInfo(bridging)
    setShowChecker(false)
    setActiveStream('all')
    setSelectedInstitution('all')
    setSelectedDuration('all')
    setSearchQuery('')
  }

  const clearEligibility = () => {
    setEligibilityResults(null)
    setBridgingInfo(null)
  }

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
            Discover all degree programmes available under the IFSLS — filter by stream, institution, or check if <em>you qualify</em> in under a minute.
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
            <button
              onClick={() => { setShowChecker(true); setEligibilityResults(null) }}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 text-white transition-all shadow-lg shadow-emerald-500/20"
            >
              ✦ Check My Eligibility
            </button>
            <a
              href="#browse"
              className="px-6 py-3 rounded-xl font-semibold text-sm glass-card border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition-all"
            >
              Browse All Courses ↓
            </a>
            <a
              href="/all-courses"
              className="px-6 py-3 rounded-xl font-semibold text-sm glass-card border border-blue-500/30 text-blue-300 hover:border-blue-400 hover:text-white transition-all"
            >
              View All Info in Table →
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
            { icon: '📅', title: 'A/L Year & passes', desc: '2023, 2024 or 2025; S passes in all 3 subjects in one sitting (maximum 3 sittings)' },
              { icon: '📊', title: 'Common General Test', desc: 'Minimum 30 marks' },
              { icon: '🇬🇧', title: 'English', desc: 'S pass at A/L General English OR O/L English' },
              { icon: '🎂', title: 'Age Limit', desc: '25 years or below by 27 Sep 2026' },
            ].map(req => (
              <div key={req.title} className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
                <div className="text-xl mb-1">{req.icon}</div>
                <p className="text-xs font-semibold text-slate-200 mb-1">{req.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{req.desc}</p>
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

      {/* ── BROWSE SECTION ───────────────────────────── */}
      <section id="browse" className="max-w-7xl mx-auto px-4 pb-24">
        {/* Section title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {eligibilityResults !== null ? '🎯 Your Eligible Courses' : 'Browse All Programmes'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Showing <span className="text-emerald-400 font-semibold">{filteredCourses.length}</span> programme{filteredCourses.length !== 1 ? 's' : ''}
              {eligibilityResults !== null && ` matching your qualifications`}
            </p>
          </div>
          {eligibilityResults !== null && (
            <div className="flex items-center gap-2">
              <button onClick={clearEligibility} className="text-xs px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all">
                ✕ Clear eligibility filter
              </button>
            </div>
          )}
        </div>

        {bridgingInfo && (
          <div className="grid md:grid-cols-2 gap-3 mb-6">
            <div className={`rounded-xl p-4 border ${bridgingInfo.ict ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
              <p className="text-sm font-semibold text-slate-100">ICT bridging status</p>
              <p className="text-xs text-slate-300 mt-1">{bridgingInfo.ict ? 'Required for ICT degrees. This route also requires at least a C pass in O/L Mathematics.' : 'Not required: your stream or A/L ICT S-or-higher pass meets the handbook condition.'}</p>
            </div>
            <div className={`rounded-xl p-4 border ${bridgingInfo.management ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
              <p className="text-sm font-semibold text-slate-100">Management bridging status</p>
              <p className="text-xs text-slate-300 mt-1">{bridgingInfo.management ? 'Required for Management degrees unless you have Commerce or an Economics S-or-higher pass in one sitting.' : 'Not required: Commerce or an Economics S-or-higher pass meets the handbook condition.'}</p>
            </div>
          </div>
        )}

        {/* Filters row */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Stream tabs */}
          <StreamFilter activeStream={activeStream} onStreamChange={setActiveStream} />

          {/* Search + secondary filters */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search bar */}
            <div className="relative flex-1 min-w-[220px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search courses or institutions…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-glow w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200 text-sm placeholder-slate-500"
              />
            </div>

            {/* Institution filter */}
            <select
              value={selectedInstitution}
              onChange={e => setSelectedInstitution(e.target.value)}
              className="input-glow px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm"
            >
              <option value="all">All Institutions</option>
              {INSTITUTIONS.map(inst => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>

            {/* Duration filter */}
            <select
              value={selectedDuration}
              onChange={e => setSelectedDuration(e.target.value)}
              className="input-glow px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm"
            >
              <option value="all">All Durations</option>
              <option value="3">3 Years</option>
              <option value="4">4 Years</option>
            </select>
          </div>
        </div>

        {/* Course grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-slate-400 text-lg">No programmes match your filters.</p>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your search or clearing the eligibility filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCourses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                index={index}
                onViewDetails={setSelectedCourse}
              />
            ))}
          </div>
        )}
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

      {/* ── MODALS ───────────────────────────────────── */}
      {showChecker && (
        <EligibilityChecker
          onResults={handleEligibilityResults}
          onClose={() => setShowChecker(false)}
        />
      )}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  )
}
