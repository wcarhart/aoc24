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

// determine unique vectors in an array of vectors
const computeUniquePositions = (positions) => {
    let uniquePositions = []

    for (let position of positions) {
        addPosition(uniquePositions, position)
    }

    return uniquePositions
}

// create a deep copy of a vector
const copyVector = (target) => {
    return [target[0], target[1]]
}

// create a deep copy of a grid
const copyGrid = (grid) => {
    return grid.map(row => row.map(col => col))
}

// change velocity to simulate a clockwise turn
const turnRight = (velocity) => {
    if (velocity[0] === -1 && velocity[1] === 0) {
        return [0, 1]
    }
    
    if (velocity[0] === 0 && velocity[1] === 1) {
        return [1, 0]
    }
    
    if (velocity[0] === 1 && velocity[1] === 0) {
        return [0, -1]
    }
    
    return [-1, 0]
}

// check if we've seen this vector before in a list of vectors (e.g. positions)
const seen = (positions, target) => {
    for (let position of positions) {
        if (position[0] === target[0] && position[1] === target[1]) {
            return true
        }
    }

    return false
}

// check if we've visited a position at a given velocity before
const visited = (targetPosition, targetVelocity, positions, velocities) => {
    let index = 0
    let foundPosition = false
    for (let position of positions) {
        if (position[0] === targetPosition[0] && position[1] === targetPosition[1]) {
            foundPosition = true
            break
        }
        index += 1
    }

    if (!foundPosition) {
        return false
    }

    return velocities[index][0] === targetVelocity[0] && velocities[index][1] === targetVelocity[1]
}

// build initial grid, position, and velocity
const buildInputs = (lines) => {
    let grid = []
    let position = [null, null]
    let velocity = [-1, 0]
    for (let [index, line] of lines.entries()) {
        grid.push(line.split(''))
        if (line.includes('^')) {
            position[0] = index
            position[1] = line.indexOf('^')
        }
    }

    return [grid, position, velocity]
}

// execute next step in movement path
const executeStep = (grid, position, velocity, positions, velocities, cycles) => {
    // we'll make deep copies of inputs to not disturb them while running
    // this is expensive (and affects the brute force approach's performance),
    // but is important to ensure we're not unintentionally mutating arrays by
    // passing them by reference
    let _position = copyVector(position)
    let _velocity = copyVector(velocity)
    let _positions = positions.map(p => copyVector(p))
    let _velocities = velocities.map(v => copyVector(v))

    // compute target move
    let target = [_position[0] + _velocity[0], _position[1] + _velocity[1]]

    // if cycles aren't allowed, validate path
    if (!cycles) {
        if (visited(target, velocity, positions, velocities)) {
            throw new Error('Cycle detected')
        }
    }

    // check if we're off the grid
    let done = false
    let dim = grid.length
    if (target[0] < 0 || target[0] >= dim || target[1] < 0 || target[1] >= dim) {
        done = true
    }

    if (!done) {
        // perform move
        if (grid[target[0]][target[1]] === '#') {
            // if we're blocked by an obstacle, turn clockwise
            _velocity = turnRight(_velocity)
        } else {
            // execute forward movement
            _position = copyVector(target)

            // track visited positions
            _positions.push(_position)
            _velocities.push(_velocity)
        }
    }

    return [_position, _velocity, _positions, _velocities, done]
}

const executePath = (grid, position, velocity, positions, velocities, cycles) => {
    // execute movement path until grid exit
    let done = false
    while (!done) {
        // execute next step
        [position, velocity, positions, velocities, done] = executeStep(grid, position, velocity, positions, velocities, cycles)
    }

    return [positions, velocities]
}

const partOne = (lines) => {
    // build grid
    let [grid, position, velocity] = buildInputs(lines)

    // compute path
    let [positions, _] = executePath(grid, position, velocity, [position], [velocity], true)

    // compute result
    return computeUniquePositions(positions).length
}

const bruteForce = (lines) => {
    // build starting grid
    let [initialGrid, position, velocity] = buildInputs(lines)

    // build all possible grids
    let grids = [initialGrid]
    for (let [row, rowValue] of initialGrid.entries()) {
        for (let [col, _] of rowValue.entries()) {
            let copy = initialGrid.map(r => r.map(c => c))
            if (copy[row][col] === '.') {
                copy[row][col] = '#'
                grids.push(copy)
            }
        }
    }

    // brute force approach - run through every possible grid
    // this is very expensive, takes ~30min to run on laptop
    // because of the deep array copies, shallow copies would
    // speed it up quite a bit but the deep copies are needed
    // for the none brute force approach
    let obstacles = 0
    for (let grid of grids) {
        try {
            let _ = executePath(grid, position, velocity, [position], [velocity], false)
        } catch (e) {
            obstacles += 1
        }
    }

    return obstacles
}

// this could be much faster, this is greedy with how many times it deep copies the arrays
const partTwo = (lines) => {
    // build grid
    let [initialGrid, position, velocity] = buildInputs(lines)

    // compute unmodified path
    let [positions, _] = executePath(initialGrid, position, velocity, [position], [velocity], true)

    // build possible grids based on unmodified path
    let grids = []
    let obstacles = []
    for (let p of positions) {
        // don't override our starting position
        if (p[0] === position[0] && p[1] === position[1]) {
            continue
        }

        // we only want unique grids
        if (seen(obstacles, p)) {
            continue
        }

        // simulate an obstacle along the path
        let grid = copyGrid(initialGrid)
        grid[p[0]][p[1]] = '#'
        grids.push(grid)
        obstacles.push(copyVector(p))
    }

    // check generated grids for cycles
    let count = 0
    for (let grid of grids) {
        try {
            executePath(grid, position, velocity, [position], [velocity], false)
        } catch (e) {
            count += 1
        }
    }

    return count
}

export { partOne, partTwo }
