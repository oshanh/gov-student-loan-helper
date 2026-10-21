const numberWords = {
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
}

function shortenRequirementText(text) {
    return text
        .replace(/\b(one|two|three|four|five|six)\s*\((?:0*)?(\d+)\)/gi, '$2')
        .replace(/\s+at the G\.C\.E\.\s*\(?([AO]\/L)\)?\s*Examination/gi, ' ($1)')
        .replace(/\s+at the G\.C\.E\s*\(?([AO]\/L)\)?\s*Examination/gi, ' ($1)')
        .replace(/\s+at the GCE\s+([AO]\/L)\s+Examination/gi, ' ($1)')
        .replace(/minimum of/gi, 'Min.')
        .replace(/minimum/gi, 'Min.')
        .replace(/in one and the same sitting/gi, 'in one sitting')
        .replace(/\b(one|two|three|four|five|six)\b/gi, word => numberWords[word.toLowerCase()] || word)
        .replace(/subject stream/gi, 'stream')
        .replace(/from among the subject/gi, 'from')
        .replace(/\bOr\b/g, 'or')
        .replace(/\s{2,}/g, ' ')
        .replace(/\s+([,.;])/g, '$1')
        .trim()
}

export function getRequirementLines(course) {
    const requirement = course.requirement || course.alRequirement || ''
    if (!requirement) return []

    return requirement
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .flatMap(line => line.trim().split(/\s+(?=\d+\.\s)/))
        .map(line => line.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
}

export function getCompactRequirements(course) {
    return getRequirementLines(course)
        .flatMap(line => line.split(/\s+(?:&|and)\s+(?=(?:minimum|min\.|six|at least))/i))
        .map(shortenRequirementText)
        .filter(Boolean)
        .map(text => ({
            level: /O\/L/i.test(text) ? 'O/L' : 'A/L',
            text: text.replace(/\s+\((?:A\/L|O\/L)\)/gi, '').trim(),
        }))
}
