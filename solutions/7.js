// make a deep copy of an list
const deepCopy = (list) => {
    return list.map(item => item)
}

// build map of callibration equations
const buildInputs = (lines) => {
    let callibrations = []
    for (let line of lines) {
        let parts = line.split(':')
        callibrations.push([Number([parts[0]]), parts[1].split(' ').filter(item => item !== '').map(item => Number(item))])
    }
    return callibrations
}

// check if a given set of operands can be combined into the target resultant
const isValid = (target, operands, concatenate) => {
    let queue = [[operands.shift(), operands]]

    while (queue.length > 0) {
        // pop item off the queue
        let [result, _remaining] = queue.shift()

        if (_remaining.length === 0) {
            // if we've found the target, we're done
            if (result === target) {
                return true
            }
            // otherwise, this branch is invalid
            continue
        }

        // push product, sum
        let remaining = deepCopy(_remaining)
        let next = remaining.shift()
        if (result * next <= target) {
            queue.push([result * next, remaining])
        }
        if (result + next <= target) {
            queue.push([result + next, remaining])
        }
        if (concatenate) {
            if (Number(`${result}${next}`) <= target) {
                queue.push([Number(`${result}${next}`), remaining])
            }
        }
    }

    return false
}

const partOne = (lines) => {
    let valid = []
    const callibrations = buildInputs(lines)
    for (let [target, operands] of callibrations) {
        if (isValid(target, operands, false)) {
            valid.push(target)
        }
    }

    return valid.reduce((a, b) => a + b, 0)
}

const partTwo = (lines) => {
    let valid = []
    const callibrations = buildInputs(lines)
    for (let [target, operands] of callibrations) {
        if (isValid(target, operands, true)) {
            valid.push(target)
        }
    }

    return valid.reduce((a, b) => a + b, 0)
}

export { partOne, partTwo }
