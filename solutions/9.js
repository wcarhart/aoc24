// check if the disk is formatted
// this is super greedy but it's simple
const diskFormatted = (disk) => {
    let inFile = true
    for (let element of disk) {
        if (element === '.') {
            inFile = false
        } else if (!inFile) {
            return false
        }
    }

    return true
}

// count the occurences of an element in a list
const count = (list, item) => {
    return list.reduce((total, element) => element === item ? total + 1 : total, 0)
}

// find space of a given length in disk
const findSpace = (disk, size) => {
    let count = 0
    for (let i = 0; i < disk.length; i += 1) {
        if (disk[i] === '.') {
            count += 1
            if (count === size) {
                return [true, i - (size - 1)]
            }
        } else {
            count = 0
        }
    }
    return [false, -1]
}

// build unmodified disk contents
const buildInputs = (lines) => {
    let disk = []
    let onFile = true
    let id = 0
    for (let _element of lines[0]) {
        const element = Number(_element)
        if (onFile) {
            [...Array(element).keys()].forEach(_ => disk.push(id))
            id += 1
        } else {
            [...Array(element).keys()].forEach(_ => disk.push('.'))
        }
        onFile = !onFile
    }

    return [id, disk]
}

const partOne = (lines) => {
    let [_, disk] = buildInputs(lines)

    // set front and back markers
    let back = disk.length - 1
    let front = -1

    while (!diskFormatted(disk)) {
        front += 1

        // if we come across a file block, no need to move
        if (disk[front] !== '.') {
            continue
        }

        // move the back marker up to the next file block to move
        while (disk[back] === '.') {
            back -= 1
        }

        // execute file block move
        disk[front] = disk[back]
        disk[back] = '.'
    }

    // compute checksum
    return disk.reduce((total, item, index) => item !== '.' ? total + item * index : total, 0)
}

const partTwo = (lines) => {
    let [id, disk] = buildInputs(lines)

    for (let back = id; back > 0; back -= 1) {
        // determine size to search for
        const size = count(disk, back)

        // determine if there's a space of that size in the disk
        const [canFit, space] = findSpace(disk, size)

        // if so, and the space is before the current position, make the move
        if (canFit && space < disk.indexOf(back)) {
            // remove file block from current position
            disk = disk.map(item => item === back ? '.' : item)

            // insert file block into new position
            for (let i = 0; i < size; i += 1) {
                disk[space + i] = back
            }
        }
    }

    // compute checksum
    return disk.reduce((total, item, index) => item !== '.' ? total + item * index : total, 0)
}

export { partOne, partTwo }
