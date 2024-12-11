// add a new vector to a set of vectors (prevents duplicates)
const addPosition = (positions, target) => {
    let seen = false
    for (let position of positions) {
        if (position[0] === target[0] && position[1] === target[1]) {
            seen = true
            break
        }
    }

    if (!seen) {
        positions.push(target)
    }
}

const partOne = (lines) => {
    const grid = lines.map(line => line.split('').map(item => Number(item)))
    const dim = grid.length

    // determine starting locations
    let starts = []
    for (let [row, line] of grid.entries()) {
        for (let [col, value] of line.entries()) {
            if (value === 0) {
                starts.push([row, col])
            }
        }
    }

    // iterate through trailheads
    let count = 0
    for (let start of starts) {
        let stack = [start]
        let ends = []
        while (stack.length > 0) {
            let position = stack.shift()
            let value = grid[position[0]][position[1]]

            // check if we're at the top of the map
            if (value === 9) {
                addPosition(ends, position)
                continue
            }

            // check up neighbor
            if (position[0] > 0 && grid[position[0] - 1][position[1]] === value + 1) {
                stack.unshift([position[0] - 1, position[1]])
            }

            // check down neighbor
            if (position[0] < dim - 1 && grid[position[0] + 1][position[1]] === value + 1) {
                stack.unshift([position[0] + 1, position[1]])
            }

            // check left neighbor
            if (position[1] > 0 && grid[position[0]][position[1] - 1] === value + 1) {
                stack.unshift([position[0], position[1] - 1])
            }

            // check right neighbor
            if (position[1] < dim - 1 && grid[position[0]][position[1] + 1] === value + 1) {
                stack.unshift([position[0], position[1] + 1])
            }
        }
        count += ends.length
    }

    return count
}

const partTwo = (lines) => {
    const grid = lines.map(line => line.split('').map(item => Number(item)))
    const dim = grid.length

    // determine starting locations
    let starts = []
    for (let [row, line] of grid.entries()) {
        for (let [col, value] of line.entries()) {
            if (value === 0) {
                starts.push([row, col])
            }
        }
    }

    // iterate through trailheads
    let trailheads = []
    for (let start of starts) {
        let stack = [start]
        let count = 0
        while (stack.length > 0) {
            let position = stack.shift()
            let value = grid[position[0]][position[1]]

            // check if we're at the top of the map
            if (value === 9) {
                count += 1
                continue
            }

            // check up neighbor
            if (position[0] > 0 && grid[position[0] - 1][position[1]] === value + 1) {
                stack.unshift([position[0] - 1, position[1]])
            }

            // check down neighbor
            if (position[0] < dim - 1 && grid[position[0] + 1][position[1]] === value + 1) {
                stack.unshift([position[0] + 1, position[1]])
            }

            // check left neighbor
            if (position[1] > 0 && grid[position[0]][position[1] - 1] === value + 1) {
                stack.unshift([position[0], position[1] - 1])
            }

            // check right neighbor
            if (position[1] < dim - 1 && grid[position[0]][position[1] + 1] === value + 1) {
                stack.unshift([position[0], position[1] + 1])
            }
        }
        trailheads.push(count)
    }

    return trailheads.reduce((a, b) => a + b)
}

export { partOne, partTwo }
