import csvText from '../../course-details-structured new.csv?raw'

const courseRows = csvText.match(/^\d+,.*$/gm) || []
const institutions = courseRows
    .map(row => row.split(',')[2]?.trim())
    .filter(Boolean)

export const courses = courseRows.map((_, index) => ({ id: index + 1 }))
export const INSTITUTIONS = [...new Set(institutions)].sort()

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

export const GENERAL_REQUIREMENTS = [
    'G.C.E. A/L examination passed in 2023, 2024, or 2025 and qualified for university entrance.',
    'Simple (S) passes for all three A/L subjects in one sitting, within a maximum of three sittings.',
    'At least 30 marks for the Common General Test, within a maximum of three sittings.',
    'Simple (S) pass for A/L General English or O/L English Language.',
    'Age 25 years or below on 27 September 2026.',
]

export const BRIDGING_COURSES = {
    ict: {
        title: 'Bridging Course for ICT Degrees',
        requirement: 'Required when the candidate has neither qualified from the A/L Physical Science or Engineering Technology stream nor obtained an ICT S pass at A/L in any attempt.',
        modules: [
            'Foundational Mathematics: 60 direct contact hours, 4 credits',
            'Computational Thinking: 60 direct contact hours (30T + 30P), 3 credits',
            'English and Communication Skills: 30 direct contact hours, 2 credits',
        ],
    },
    management: {
        title: 'Bridging Course for Management Degrees',
        requirement: 'Required when the candidate has neither qualified from the A/L Commerce stream nor obtained an Economics S pass as a main subject in any stream in one sitting.',
    },
}

export const BRIDGING_INSTITUTES = [
    ['SLIIT', 'Ms. Chamini Weerakkody', '011 754 3392', 'Rs. 25,000'],
    ['CINEC', 'Ms. Ruwani Karunadasa', '076 9442866', 'Rs. 75,000'],
    ['HORIZON', 'Mr. Sanjeewa Kuruppu', '071 1175175', 'Rs. 25,000'],
    ['KIU', 'Mr. Savindu Ishara', '076 7334744', 'Rs. 25,000'],
    ['SLTC', 'Mr. Asitha Wijayawardena / Mr. Tharindu Nimsara', '071 140 5836 / 070 568 9968', 'Rs. 20,000'],
    ['SAEGIS', 'Mr. Denethra Kalana', '074 3478176', 'Rs. 25,000'],
    ['ESOFT', 'Mr. S. Thenukshan', '077 782 5038', 'Rs. 20,000'],
    ['ICBT', 'Mr. Vinoth Rabindrakumar', '0773 427287', 'Free of Charge'],
    ['BCI', 'Ms. Prasansha Tissera / Ms. Ashani Perera', '070 603 5100 / 074 016 5896', 'Rs. 25,000'],
    ['NIIBS', 'Dr. Sajeewa Pemasinghe', '011 2 904 675 / 011 2 904 676', 'Rs. 25,000'],
    ['SIBA', 'Mr. T.R.S. Meetiyagoda / Ms. Bhagya Thilakarathne', '070 7 940 940 / 081 24 21 693', 'Rs. 25,000'],
    ['ICASL', 'Ms. Isuri Samarawickrama', '011 2 807 407', 'Rs. 20,000'],
]

export const INELIGIBILITY_CRITERIA = [
    'Sat the G.C.E. A/L examination more than three occasions.',
    'Already selected or registered as an internal student for a UGC state university degree based on eligible A/L results.',
    'Selected or registered for a first degree at another state higher educational institute established under an Act of Parliament.',
    'Selected or registered at a College of Education for a diploma course.',
    'Selected or registered for a three-year-or-more full-time HND at SLIATE or NDES at IET of NAITA.',
    'Registered for a three-year diploma at a university college established under the University of Vocational Technology.',
    'Selected or registered for another degree programme fully or partially funded by public funds.',
    'Selected or registered for a Bachelor degree under a government foreign scholarship.',
    'Already registered for a full-time degree at an IFSLS-associated DAI.',
    'Already obtained a Bachelor degree or relevant qualification covered by the listed exclusions.',
    'Provided false information or forged documents for admission or registration.',
]

export const LOAN_INFORMATION = {
    main: 'The government provides an interest-free loan up to Rs. 1,500,000 for approved four-year degree programmes and an additional discretionary loan up to Rs. 300,000 for other expenses.',
    stipend: 'Students may opt for an additional interest-free stipend loan of Rs. 75,000 per year: Rs. 300,000 total for four-year programmes or Rs. 225,000 total for three-year programmes, paid quarterly at Rs. 18,750.',
    fourYear: 'Four-year degrees have a five-year grace period (four years of study plus one year post-study), followed by seven years of repayment in 84 equal monthly instalments.',
    threeYear: 'Three-year degrees have a four-year grace period (three years of study plus one year post-study), followed by eight years of repayment in 96 equal monthly instalments.',
    conditions: [
        'The total loan period is 12 years and government bears the interest during the loan period.',
        'Students must enter agreements with the Ministry and lending bank; parents or legal custodians act as first guarantor and a close relative as second guarantor.',
        'Semester fees are disbursed directly by the bank to the relevant DAI.',
        'Students must earn at least a Credit (C) pass in every compulsory subject and maintain 80% attendance.',
        'Failed compulsory subjects must be repeated at the student’s expense until at least a C pass is obtained.',
        'If a student drops out or defaults, outstanding capital and government-borne interest may become payable, with CRIB consequences for the student and guarantors.',
        'The loan must be settled in full before overseas travel.',
        'The degree certificate is awarded by the registered DAI after successful completion.',
    ],
}

export const LOAN_LIMITS = {
    fourYear: {
        humanities: 800000,
        management: 900000,
        scienceChemical: 1200000,
        sciencePhysical: 1000000,
        engineering: 1500000,
        bioTechnology: 1000000,
        engineeringTechnology: 1000000,
        ictBachelorInformationTechnology: 800000,
        ictBachelorScience: 1000000,
    },
    threeYear: {
        humanities: 600000,
        management: 600000,
        engineering: 800000,
        ictBachelorInformationTechnology: 600000,
        ictBachelorScience: 800000,
    },
}
