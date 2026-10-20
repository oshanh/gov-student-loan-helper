import { useMemo, useState } from 'react'
import { courses, INSTITUTIONS, STREAMS } from '../data/courses'

export default function AllCoursesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStream, setSelectedStream] = useState('all')
    const [selectedInstitution, setSelectedInstitution] = useState('all')
    const [selectedDuration, setSelectedDuration] = useState('all')

    const filteredCourses = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()

        return courses.filter(course => {
            const matchesStream = selectedStream === 'all' || course.stream === selectedStream
            const matchesInstitution = selectedInstitution === 'all' || course.institution === selectedInstitution
            const matchesDuration = selectedDuration === 'all' || course.duration === Number(selectedDuration)
            const matchesSearch = !query || [
                course.institution,
                course.title,
                course.courseCode,
                course.requirement,
                course.alRequirement,
            ].some(value => value?.toLowerCase().includes(query))

            return matchesStream && matchesInstitution && matchesDuration && matchesSearch
        })
    }, [searchQuery, selectedStream, selectedInstitution, selectedDuration])

    const clearFilters = () => {
        setSearchQuery('')
        setSelectedStream('all')
        setSelectedInstitution('all')
        setSelectedDuration('all')
    }

    return (
        <main className="min-h-screen hero-gradient px-4 py-8 md:py-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors mb-6"
                    >
                        ← Back to programme browser
                    </a>
                    <p className="text-xs text-emerald-400 uppercase tracking-widest font-semibold">IFSLS Intake 11 · 2026/2027</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mt-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        All programme information
                    </h1>
                    <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                        Browse all {courses.length} degree programmes in one table, including institution, duration, fee, and minimum entry qualification.
                    </p>
                </header>

                <section className="glass-card rounded-2xl p-4 md:p-5 mb-5" aria-label="Filter programmes">
                    <div className="flex flex-col lg:flex-row gap-3">
                        <label className="relative flex-1 min-w-[220px]">
                            <span className="sr-only">Search programmes</span>
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                            </svg>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={event => setSearchQuery(event.target.value)}
                                placeholder="Search title, institute, code, or requirement..."
                                className="input-glow w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200 text-sm placeholder-slate-500"
                            />
                        </label>
                        <select
                            value={selectedStream}
                            onChange={event => setSelectedStream(event.target.value)}
                            className="input-glow px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm"
                            aria-label="Filter by stream"
                        >
                            <option value="all">All Streams</option>
                            {STREAMS.filter(stream => stream.id !== 'all').map(stream => (
                                <option key={stream.id} value={stream.id}>{stream.label}</option>
                            ))}
                        </select>
                        <select
                            value={selectedInstitution}
                            onChange={event => setSelectedInstitution(event.target.value)}
                            className="input-glow px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm"
                            aria-label="Filter by institute"
                        >
                            <option value="all">All Institutes</option>
                            {INSTITUTIONS.map(institution => (
                                <option key={institution} value={institution}>{institution}</option>
                            ))}
                        </select>
                        <select
                            value={selectedDuration}
                            onChange={event => setSelectedDuration(event.target.value)}
                            className="input-glow px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm"
                            aria-label="Filter by duration"
                        >
                            <option value="all">All Durations</option>
                            <option value="3">3 Years</option>
                            <option value="4">4 Years</option>
                        </select>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="px-4 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-400 hover:border-slate-500 hover:text-white transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                        Showing <span className="text-emerald-400 font-semibold">{filteredCourses.length}</span> of {courses.length} programmes
                    </p>
                </section>

                <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="max-h-[65vh] overflow-auto">
                        <table className="w-full min-w-[1000px] border-collapse text-left">
                            <caption className="sr-only">All IFSLS degree programmes and their entry requirements</caption>
                            <thead className="bg-slate-800/95 sticky top-0 z-10">
                                <tr className="border-b border-slate-700">
                                    <th scope="col" className="px-4 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider w-16">S/N</th>
                                    <th scope="col" className="px-4 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider w-40">Institute</th>
                                    <th scope="col" className="px-4 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider min-w-[300px]">Title of the degree</th>
                                    <th scope="col" className="px-4 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider w-32">Duration</th>
                                    <th scope="col" className="px-4 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider w-36">Course fee</th>
                                    <th scope="col" className="px-4 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider min-w-[420px]">Minimum entry qualification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredCourses.map((course, index) => (
                                    <tr key={course.id} className="hover:bg-emerald-500/5 transition-colors align-top">
                                        <td className="px-4 py-4 text-sm text-slate-500">{index + 1}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-emerald-300">{course.institution}</td>
                                        <td className="px-4 py-4 text-sm text-slate-200">
                                            <span className="block">{course.title}</span>
                                            {course.courseCode && <span className="text-xs text-slate-500 mt-1 block">{course.courseCode}</span>}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-300">{course.duration} years</td>
                                        <td className="px-4 py-4 text-sm text-slate-300 whitespace-nowrap">Rs. {course.courseFee.toLocaleString()}</td>
                                        <td className="px-4 py-4 text-sm text-slate-400 leading-relaxed">{course.requirement || course.alRequirement}</td>
                                    </tr>
                                ))}
                                {filteredCourses.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-16 text-center text-sm text-slate-400">
                                            No programmes match your search and filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className="text-xs text-slate-500 text-center mt-6">
                    Data sourced from the IFSLS Intake 11 (2026/2027) guide. Verify requirements directly with MOHE before applying.
                </p>
            </div>
        </main>
    )
}
