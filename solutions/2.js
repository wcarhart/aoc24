const checkValidity = (items) => {
    const sortedAccending = items.toSorted((a, b) => a - b)
    const sortedDescending = sortedAccending.map(e => e).reverse()

    if (JSON.stringify(items) !== JSON.stringify(sortedAccending) && JSON.stringify(items) !== JSON.stringify(sortedDescending)) {
        return false
    }

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
