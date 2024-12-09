const partOne = (lines) => {
    // build 2D grid
    let grid = []
    for (let line of lines) {
        grid.push(line.split(''))
    }

    // set search parameters
    const dim = grid.length
    const searchLength = 'XMAS'.length - 1

    let count = 0
    for (let [row, rowValue] of grid.entries()) {
        for (let [col, colValue] of rowValue.entries()) {
            // search for 'X' characters
            if (colValue !== 'X') {
                continue
            }

            // horizontal left
            if (col >= searchLength) {
                if (grid[row][col - 1] === 'M' && grid[row][col - 2] === 'A' && grid[row][col - 3] === 'S') {
                    count += 1
                }
            }

            // horizontal right
            if (col < dim - searchLength) {
                if (grid[row][col + 1] === 'M' && grid[row][col + 2] === 'A' && grid[row][col + 3] === 'S') {
                    count += 1
                }
            }

            // vertical up
            if (row >= searchLength) {
                if (grid[row - 3][col] === 'S' && grid[row - 2][col] === 'A' && grid[row - 1][col] === 'M') {
                    count += 1
                }
            }

            // vertical down
            if (row < dim - searchLength) {
                if (grid[row + 1][col] === 'M' && grid[row + 2][col] === 'A' && grid[row + 3][col] === 'S') {
                    count += 1
                }
            }

            // diagonal up right
            if (row >= searchLength && col < dim - searchLength) {
                if (grid[row - 1][col + 1] === 'M' && grid[row - 2][col + 2] === 'A' && grid[row - 3][col + 3] === 'S') {
                    count += 1
                }
            }

            // diagonal down right
            if (row < dim - searchLength && col < dim - searchLength) {
                if (grid[row + 1][col + 1] === 'M' && grid[row + 2][col + 2] === 'A' && grid[row + 3][col + 3] === 'S') {
                    count += 1
                }
            }

            // diagonal down left
            if (row < dim - searchLength && col >= searchLength) {
                if (grid[row + 1][col - 1] === 'M' && grid[row + 2][col - 2] === 'A' && grid[row + 3][col - 3] === 'S') {
                    count += 1
                }
            }

            // diagonal up left
            if (row >= searchLength && col >= searchLength) {
                if (grid[row - 1][col - 1] === 'M' && grid[row - 2][col - 2] === 'A' && grid[row - 3][col - 3] === 'S') {
                    count += 1
                }
            }
        }
    }

    return count
}

const partTwo = (lines) => {
    // build 2D grid
    let grid = []
    for (let line of lines) {
        grid.push(line.split(''))
    }

    // set search parameters
    const dim = grid.length

    let count = 0
    for (let [row, rowValue] of grid.entries()) {
        // we can skip the outer rows
        if (row === 0 || row === dim - 1) {
            continue
        }

        for (let [col, colValue] of rowValue.entries()) {
            // we can skip the outer columns
            if (col === 0 || col === dim - 1) {
                continue
            }

            // search for 'X' characters
            if (colValue !== 'A') {
                continue
            }

            // M.M
            // .A.
            // S.S
            if (grid[row - 1][col - 1] === 'M' && grid[row - 1][col + 1] === 'M' && grid[row + 1][col + 1] === 'S' && grid[row + 1][col - 1] === 'S') {
                count += 1
                continue
            }

            // S.M
            // .A.
            // S.M
            if (grid[row - 1][col - 1] === 'S' && grid[row - 1][col + 1] === 'M' && grid[row + 1][col + 1] === 'M' && grid[row + 1][col - 1] === 'S') {
                count += 1
                continue
            }

            // S.S
            // .A.
            // M.M
            if (grid[row - 1][col - 1] === 'S' && grid[row - 1][col + 1] === 'S' && grid[row + 1][col + 1] === 'M' && grid[row + 1][col - 1] === 'M') {
                count += 1
                continue
            }

            // M.S
            // .A.
            // M.S
            if (grid[row - 1][col - 1] === 'M' && grid[row - 1][col + 1] === 'S' && grid[row + 1][col + 1] === 'S' && grid[row + 1][col - 1] === 'M') {
                count += 1
            }
        }
    }
    
    return count
}

export { partOne, partTwo }
