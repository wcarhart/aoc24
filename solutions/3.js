const partOne = (lines) => {
    let result = 0

    for (let line of lines) {
        // get matches of 'mul(#,#)'
        let matches = line.matchAll(/mul\(\d{1,3},\d{1,3}\)/g)
        for (let match of matches) {
            // get numbers between parentheses
            let operands = Array.from(match[0].matchAll(/\d{1,3}/g)).map(m => Number(m[0]))
            result += operands[0] * operands[1]
        }
    }

    return result
}

const partTwo = (lines) => {
    let result = 0
    let enabled = true
    let commands = ['do(', 'don\'t(', 'mul(']

    for (let line of lines) {
        let buffer = ''
        let inCommand = false

        for (let char of line) {
            // build up buffer char by char
            buffer += char

            if (inCommand) {
                // if we reach a ')', we know we've completed a "command"
                if (char === ')') {
                    inCommand = false
                    if (buffer === 'do()') {
                        enabled = true
                    } else if (buffer === 'don\'t()') {
                        enabled = false
                    } else if (/mul\(\d{1,3},\d{1,3}\)/.test(buffer)) {
                        // same logic as part 1
                        if (enabled) {
                            let operands = Array.from(buffer.matchAll(/\d{1,3}/g)).map(b => Number(b[0]))
                            result += operands[0] * operands[1]
                        }
                    }
                    buffer = ''
                } else if (!/\d/.test(char) && char !== ',') {
                    // make sure we don't greedily close parentheses
                    inCommand = false
                    buffer = ''
                }
                continue
            }

            if (commands.includes(buffer)) {
                inCommand = true
            } else if (commands.every(command => !command.startsWith(buffer))) {
                // if it doesn't look like we're going to finish a valid command, abort this buffer
                buffer = ''
            }
        }
    }
    return result
}

export { partOne, partTwo }
