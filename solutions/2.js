const checkValidity = (items) => {
    // first, check if either all increasing or all decreasing
    const sortedAccending = items.toSorted((a, b) => a - b)
    const sortedDescending = sortedAccending.map(e => e).reverse()

    // this is SUPER greedy, but fine because the arrays are very small
    if (JSON.stringify(items) !== JSON.stringify(sortedAccending) && JSON.stringify(items) !== JSON.stringify(sortedDescending)) {
        return false
    }

    // next, determine if all items are within 3 of each other
    let previous = null
    for (let item of items) {
        if (previous === null) {
            previous = item
            continue
        }

        if (previous === item || Math.abs(previous - item) > 3) {
            return false
        }

        previous = item
    }

    return true
}

const partOne = (lines) => {
    let count = 0
    for (let line of lines) {
        const items = line.split(' ').map(i => Number(i))

        if (checkValidity(items)) {
            count += 1
        }
    }

    return count
}

const generatePossibilities = (items) => {
    let possibilities = [items.map(i => i)]
    for (let i = 0; i < items.length; i += 1) {
        possibilities.push(items.slice(0,i).concat(items.slice(i + 1, items.length)))
    }
    return possibilities
}

const partTwo = (lines) => {
    // we'll use the same logic as part one, but we'll brute force by generating all possibilities of the lists
    let count = 0
    for (let line of lines) {
        const items = line.split(' ').map(i => Number(i))
        const possibilities = generatePossibilities(items)

        let valid = false
        for (let possibility of possibilities) {
            if (checkValidity(possibility)) {
                valid = true
                break
            }
        }

        if (valid) {
            count += 1
        }
    }

    return count
}

export { partOne, partTwo }
