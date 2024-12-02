const partOne = (lines) => {
    // build lists
    let left = []
    let right = []
    for (let line of lines) {
        const parts = line.split(/ +/)
        left.push(Number(parts[0]))
        right.push(Number(parts[1]))
    }

    // sort lists
    left.sort()
    right.sort()

    // compute distance score
    let total = 0
    let index = 0
    while (index < left.length) {
        total += Math.abs(left[index] - right[index])
        index += 1
    }

    return total
}

const countInstances = (list, item) => {
    return list.reduce((accumulator, currentValue) => {
        return currentValue === item ? accumulator + 1 : accumulator;
    }, 0);
}

const partTwo = (lines) => {
    // build lists
    let left = []
    let right = []
    for (let line of lines) {
        const parts = line.split(/ +/)
        left.push(Number(parts[0]))
        right.push(Number(parts[1]))
    }

    // compute similarity score
    let similarity = 0
    const memo = {}
    for (let item of left) {
        const count = countInstances(right, item)
        similarity += item * count
    }

    return similarity
}

export { partOne, partTwo }
