// compute the endpoints of a given ray
// by plotting them on the computed line
const computeRay = (start, end) => {
    const diffRow = start[0] - end[0]
    const diffCol = start[1] - end[1]

    return [start[0] + diffRow, start[1] + diffCol]
}

// compute the two antinodes for two given nodes
const computeNodes = (nodeA, nodeB) => {
    return [computeRay(nodeA, nodeB), computeRay(nodeB, nodeA)]
}

// compute all nodes on a line within a specified grid size
const computeLine = (start, end, dim) => {
    let done = false
    let nodes = []
    while (!done) {
        let result = computeRay(start, end)
        if (isValidNode(result, dim)) {
            nodes.push(result)
            end = copyNode(start)
            start = copyNode(result)
        } else {
            done = true
        }
    }
    return nodes
}

// effectively list --> set --> list for a list of coordinates
const deduplicateNodes = (nodes) => {
    let set = new Set()
    for (let node of nodes) {
        set.add(node.join(','))
    }
    return Array.from(set).map(item => item.split(',').map(e => Number(e)))
}

// determines if a node is within the grid's bounds
const isValidNode = (node, dim) => {
    return node[0] >= 0 && node[0] < dim && node[1] >= 0 && node[1] < dim
}

// deep copy a position
const copyNode = (node) => {
    return node.map(n => n)
}

const buildInputs = (lines) => {
    let coordinates = {}
    for (let [row, line] of lines.entries()) {
        for (let [col, value] of line.split('').entries()) {
            if (value !== '.') {
                if (value in coordinates) {
                    coordinates[value].push([row, col])
                } else {
                    coordinates[value] = [[row, col]]
                }
            }
        }
    }
    return coordinates
}

const partOne = (lines) => {
    // build coordinate map
    const coordinates = buildInputs(lines)
    const dim = lines.length

    // compute antinodes
    let nodes = []
    for (let signal in coordinates) {
        const points = coordinates[signal]
        for (let i = 0; i < points.length; i += 1) {
            for (let j = i + 1; j < points.length; j += 1) {
                nodes.push(...computeNodes(points[i], points[j]))
            }
        }
    }

    // make sure the antinodes are unique
    nodes = deduplicateNodes(nodes)

    // count valid antinodes
    return nodes.reduce((total, node) => isValidNode(node, dim) ? total + 1 : total, 0)
}

const partTwo = (lines) => {
    // build coordinate map
    const coordinates = buildInputs(lines)
    const dim = lines.length

    // compute antinodes
    let nodes = []
    for (let signal in coordinates) {
        const points = coordinates[signal]
        for (let i = 0; i < points.length; i += 1) {
            for (let j = i + 1; j < points.length; j += 1) {
                // from A to B
                let start = copyNode(points[i])
                let end = copyNode(points[j])
                nodes.push(...computeLine(start, end, dim))

                // from B to A
                start = copyNode(points[j])
                end = copyNode(points[i])
                nodes.push(...computeLine(start, end, dim))
            }
        }
    }

    // make sure the antinodes are unique, include original coordinates
    nodes = nodes.concat(...Object.values(coordinates))
    return deduplicateNodes(nodes).length
}

export { partOne, partTwo }
