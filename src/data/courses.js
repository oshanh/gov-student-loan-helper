import { csvCourses } from './courseCatalog'

export const courses = csvCourses

export const INSTITUTIONS = [...new Set(courses.map(course => course.institution))].sort()

export const STREAMS = [
    { id: 'all', label: 'All Streams', emoji: '✨' },
    { id: 'humanities', label: 'Humanities', emoji: '📚' },
    { id: 'management', label: 'Management', emoji: '💼' },
    { id: 'science', label: 'Science', emoji: '🔬' },
    { id: 'engineering', label: 'Engineering', emoji: '⚙️' },
    { id: 'ict', label: 'ICT', emoji: '💻' },
]

export const AL_STREAMS = [
    { id: 'commerce', label: 'Commerce' },
    { id: 'arts', label: 'Arts' },
    { id: 'physical_science', label: 'Physical Science' },
    { id: 'biological_science', label: 'Biological Science' },
    { id: 'engineering_tech', label: 'Engineering Technology' },
    { id: 'bio_systems_tech', label: 'Bio Systems Technology' },
]

export const BRIDGING_COURSES = {}
export const BRIDGING_INSTITUTES = []
export const INELIGIBILITY_CRITERIA = []
export const LOAN_INFORMATION = {
    main: 'The student loan is interest-free under the IFSLS.',
    stipend: 'Students may receive the applicable monthly stipend.',
    fourYear: 'Repayment and study obligations depend on the selected programme.',
    threeYear: 'Repayment and study obligations depend on the selected programme.',
    conditions: [],
}
