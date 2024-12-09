const buildInputs = (lines) => {
    let rules = {}
    let updates = []

    let doneWithRules = false
    for (let line of lines) {

        // if we see an empty line we are done parsing rules and can move on to updates
        if (line === '') {
            doneWithRules = true
            continue
        }

        if (doneWithRules) {
            updates.push(line.split(','))
        } else {
            // we want rules to be a map of the leading item to the following items
            const parts = line.split('|')
            if (parts[0] in rules) {
                rules[parts[0]].push(parts[1])
            } else {
                rules[parts[0]] = [parts[1]]
            }
        }
    }

    return [rules, updates]
}

const determineValidUpdates = (rules, updates) => {
    let validUpdates = []
    let invalidUpdates = []

    for (let update of updates) {
        let valid = true
        
        for (let [index, item] of update.entries()) {
            // slice the array, then check the remaining values are valid based on our parsed rules
            if (!update.slice(index + 1).every(param => item in rules && rules[item].includes(param))) {
                valid = false
            }
        }

        // we return both valid and invalid to be used separately for parts 1 and 2
        if (valid) {
            validUpdates.push(update)
        } else {
            invalidUpdates.push(update)
        }
    }

    return [validUpdates, invalidUpdates]
}

const partOne = (lines) => {
    const [rules, updates] = buildInputs(lines)
    const [validUpdates, _] = determineValidUpdates(rules, updates)
    return validUpdates.reduce((total, item) => total + Number(item[Math.floor(item.length / 2)]), 0)
}

const partTwo = (lines) => {
    const [rules, updates] = buildInputs(lines)
    const [_, invalidUpdates] = determineValidUpdates(rules, updates)

    // this problem is effectively sorting elements but by our rules mapping instead of by numerical value
    invalidUpdates.forEach(update => update.sort((a, b) => {
        // if neither elements is in the rules, they're effectively equivalent
        if (!(a in rules) && !(b in rules)) {
            return 0
        }

        // if only the second element is in the rules, return greater than
        if (!(a in rules)) {
            return 1
        }

        // if only the first element is in the rules, return less than
        if (!(b in rules)) {
            return -1
        }

        // if the first element is specified in the rules to come first, return less than
        if (rules[a].includes(b)) {
            return -1
        }

        // we assume at this point that the second item is specified in the rules to come first, so return greater than
        return 1
    }))

    return invalidUpdates.reduce((total, item) => total + Number(item[Math.floor(item.length / 2)]), 0)
}

export { partOne, partTwo }
