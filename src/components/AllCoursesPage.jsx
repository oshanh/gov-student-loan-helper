import { useMemo, useState } from 'react'
import csvText from '../../course-details-structured new.csv?raw'
import CourseModal from './CourseModal'

const streamMetadata = {
    'Humanities & Social Sciences': { id: 'humanities', label: 'Humanities', emoji: '📚' },
    'Management & Commerce': { id: 'management', label: 'Management', emoji: '💼' },
    Science: { id: 'science', label: 'Science', emoji: '🔬' },
    'Engineering & Technology': { id: 'engineering', label: 'Engineering', emoji: '⚙️' },
    Computing: { id: 'ict', label: 'ICT & Computing', emoji: '💻' },
}

function parseCsv(text) {
    const records = []
    let record = []
    let field = ''
    let quoted = false

    for (let index = 0; index < text.length; index += 1) {
        const character = text[index]
        const nextCharacter = text[index + 1]

        if (character === '"') {
            if (quoted && nextCharacter === '"') {
                field += '"'
                index += 1
            } else {
                quoted = !quoted
            }
        } else if (character === ',' && !quoted) {
            record.push(field.trim())
            field = ''
        } else if ((character === '\n' || character === '\r') && !quoted) {
            if (character === '\r' && nextCharacter === '\n') index += 1
            record.push(field.trim())
            if (record.some(Boolean)) records.push(record)
            record = []
            field = ''
        } else {
            field += character
        }
    }

    if (field || record.length) {
        record.push(field.trim())
        if (record.some(Boolean)) records.push(record)
    }

    if (records.length < 2) {
        throw new Error('The course CSV does not contain any course records.')
    }

    const headers = records[0].map(header => header.replace(/^\uFEFF/, '').trim())
    return records.slice(1).map((values, index) => {
        if (values.length !== headers.length) {
            throw new Error(`Course CSV row ${index + 2} has ${values.length} columns; expected ${headers.length}.`)
        }

        return Object.fromEntries(headers.map((header, fieldIndex) => [header, values[fieldIndex]]))
    })
}

function formatRequirementLines(value) {
    return value
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .flatMap(line => line.trim().split(/\s+(?=\d+\.\s)/))
        .map(line => line.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
}

function getCourses() {
    return parseCsv(csvText).map(row => {
        const stream = streamMetadata[row.Stream]
        if (!stream) throw new Error(`Unsupported course stream: "${row.Stream}".`)

        const title = row['Title of the Degree'].replace(/\s+/g, ' ').trim()
        const requirementLines = formatRequirementLines(row['Entry Requirement'])
        const requirement = requirementLines.join(' ')
        return {
            id: Number(row['S/N']),
            stream: stream.id,
            streamLabel: stream.label,
            streamEmoji: stream.emoji,
            institution: row['Name of the Institute'].replace(/\s+/g, ' ').trim(),
            institutionFull: row['Name of the Institute'].replace(/\s+/g, ' ').trim(),
            courseCode: row['Degree Code'].replace(/\s+/g, '').trim(),
            title,
            duration: Number.parseInt(row['Course Duration'], 10),
            courseFee: Number(row['Course Fee (Rs.)'].replace(/,/g, '')),
            requirement,
            requirementLines,
            alRequirement: requirement,
        }
    })
}

const courses = getCourses()
const institutions = [...new Set(courses.map(course => course.institution))].sort()

function formatFee(value) {
    return `Rs. ${value.toLocaleString('en-LK')}`
}

export default function AllCoursesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStream, setSelectedStream] = useState('all')
    const [selectedInstitution, setSelectedInstitution] = useState('all')
    const [selectedDuration, setSelectedDuration] = useState('all')
    const [selectedCourse, setSelectedCourse] = useState(null)

    const filteredCourses = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        return courses.filter(course => {
            const matchesStream = selectedStream === 'all' || course.stream === selectedStream
            const matchesInstitution = selectedInstitution === 'all' || course.institution === selectedInstitution
            const matchesDuration = selectedDuration === 'all' || course.duration === Number(selectedDuration)
            const searchableText = [
                course.title,
                course.courseCode,
                course.institution,
                course.streamLabel,
                course.requirement,
            ].join(' ').toLowerCase()
            return matchesStream && matchesInstitution && matchesDuration && (!query || searchableText.includes(query))
        })
    }, [searchQuery, selectedStream, selectedInstitution, selectedDuration])

    return (
        <main className="min-h-screen hero-gradient px-4 py-8 md:py-12">
            <div className="max-w-[1600px] mx-auto">
                <header className="mb-8">
                    <a href="/" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                        ← Back to course explorer
                    </a>
                    <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs text-emerald-400 uppercase tracking-[0.2em] font-semibold">IFSLS Intake 11 · 2026/2027</p>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2">All courses</h1>
                            <p className="text-slate-400 mt-2 max-w-2xl">
                                Browse the complete course catalogue and entry requirements from the structured MOHE data.
                            </p>
                        </div>
                        <div className="glass-card rounded-xl px-4 py-3 text-left md:text-right">
                            <p className="text-2xl font-bold text-emerald-400">{filteredCourses.length}</p>
                            <p className="text-xs text-slate-400">of {courses.length} programmes shown</p>
                        </div>
                    </div>
                </header>

                <section className="glass-card rounded-2xl p-4 mb-6" aria-label="Course filters">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                        <label className="xl:col-span-2">
                            <span className="sr-only">Search courses</span>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={event => setSearchQuery(event.target.value)}
                                placeholder="Search by course, institute, stream, or requirement..."
                                className="input-glow w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200 text-sm placeholder-slate-500"
                            />
                        </label>
                        <label>
                            <span className="sr-only">Filter by stream</span>
                            <select value={selectedStream} onChange={event => setSelectedStream(event.target.value)} className="input-glow w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-sm">
                                <option value="all">All streams</option>
                                {Object.values(streamMetadata).map(stream => <option key={stream.id} value={stream.id}>{stream.emoji} {stream.label}</option>)}
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

                <section className="glass-card rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px] text-left border-collapse">
                            <thead className="bg-slate-800/80">
                                <tr className="text-xs text-slate-400 uppercase tracking-wider">
                                    <th className="px-4 py-4 font-semibold w-16">#</th>
                                    <th className="px-4 py-4 font-semibold">Stream</th>
                                    <th className="px-4 py-4 font-semibold">Institute</th>
                                    <th className="px-4 py-4 font-semibold">Degree code</th>
                                    <th className="px-4 py-4 font-semibold min-w-[300px]">Degree programme</th>
                                    <th className="px-4 py-4 font-semibold">Duration</th>
                                    <th className="px-4 py-4 font-semibold">Fee</th>
                                    <th className="px-4 py-4 font-semibold min-w-[320px]">Entry requirement</th>
                                    <th className="px-4 py-4 font-semibold">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredCourses.map(course => (
                                    <tr key={course.id} className="align-top hover:bg-white/[0.03] transition-colors">
                                        <td className="px-4 py-4 text-sm text-slate-500">{course.id}</td>
                                        <td className="px-4 py-4 text-sm text-slate-300">
                                            <span className={`inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium badge-${course.stream}`}>
                                                {course.streamEmoji} {course.streamLabel}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-slate-200">{course.institution}</td>
                                        <td className="px-4 py-4 text-sm text-slate-300 whitespace-nowrap">{course.courseCode}</td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm font-semibold text-white">{course.title}</p>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-300 whitespace-nowrap">{course.duration} years</td>
                                        <td className="px-4 py-4 text-sm text-emerald-300 whitespace-nowrap">{formatFee(course.courseFee)}</td>
                                        <td className="px-4 py-4 text-sm text-slate-400 leading-relaxed">
                                            <div className="space-y-2">
                                                {course.requirementLines.map((line, index) => (
                                                    <p key={`${course.id}-requirement-${index}`} className="flex items-start gap-2">
                                                        <span className="text-emerald-400 shrink-0" aria-hidden="true">•</span>
                                                        <span>{line}</span>
                                                    </p>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <button onClick={() => setSelectedCourse(course)} className="whitespace-nowrap text-xs font-medium text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 px-3 py-2 rounded-lg transition-colors">
                                                View details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredCourses.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-4xl mb-3">🔍</p>
                            <p className="text-slate-300">No courses match these filters.</p>
                            <p className="text-sm text-slate-500 mt-1">Try a different search or clear a filter.</p>
                        </div>
                    )}
                </section>

                <p className="text-xs text-slate-500 text-center mt-6">
                    Data sourced from the IFSLS Intake 11 (2026/2027) guide. Always verify requirements directly with MOHE before applying.
                </p>
            </div>

            {selectedCourse && <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
        </main>
    )
}