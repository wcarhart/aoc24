import { readFileSync, statSync, copyFileSync, openSync } from 'node:fs'
import path from 'node:path'

const showHelp = (COMMANDS) => {
    const help = [
        'Script for working on Advent of Code puzzles',
        '',
        'Usage: node app.js [-h/--help] [-f/--force] CMD DAY+',
        `  CMD  the command to run, options are ${COMMANDS.join(', ')}`,
        '  DAY  the number day to run (must have corresponding puzzle and solution input)'
    ]
    console.log(help.join('\n'))
}

const run = async (solutionDir, inputDir, day) => {
    const { partOne, partTwo } = await import(`${path.join(solutionDir, day)}.js`)
    const data = readFileSync(`${path.join(inputDir, day)}.txt`).toString()
    const lines = data.split('\n')

    let result = partOne(lines)
    console.log(`=== Day ${day} ===`)
    console.log(`1: ${result}`)
    result = partTwo(lines)
    console.log(`2: ${result}`)
}

const isValidFile = (filepath) => {
    let stat
    try {
        stat = statSync(filepath)
    } catch (e) {
        return false
    }

    if (stat) {
        if (stat.isFile) {
            return true
        }
    }

    return false
}

const isValidDirectory = (dirpath) => {
    let stat
    try {
        stat = statSync(dirpath)
    } catch (e) {
        return false
    }

    if (stat) {
        if (stat.isDirectory) {
            return true
        }
    }

    return false
}

const start = (solutionDir, inputDir, templateFile, day, force) => {
    const solutionFile = `${path.join(solutionDir, day)}.js`
    const inputFile = `${path.join(inputDir, day)}.txt`

    if (!isValidFile(templateFile)) {
        console.error('Missing template JS file! Did you remove it? There should be a template file called \'template.js\' in the current directory')
        process.exit(1)
    }

    if (isValidFile(solutionFile) && !force) {
        console.error(`Solution file '${solutionFile}' already exists! Blow it away with -f/--force`)
        process.exit(1)
    }

    if (isValidFile(inputFile) && !force) {
        console.error(`Input file '${inputFile}' already exists! Blow it away with -f/--force`)
        process.exit(1)
    }

    copyFileSync(templateFile, solutionFile)
    openSync(inputFile, 'w')
}

const main = async () => {
    const parts = import.meta.url.split('/')
    parts.pop()
    const cwd = parts.join('/').replace(/^file:/, '')
    const solutionDir = path.join(cwd, 'solutions')
    const inputDir = path.join(cwd, 'input')
    const templateFile = path.join(cwd, 'template.js')

    if (!isValidDirectory(solutionDir)) {
        console.error('Missing solutions directory! Did you remove it? There should be a directory called \'solutions\' in the current directory')
        process.exit(1)
    }

    if (!isValidDirectory(inputDir)) {
        console.error('Missing inputs directory! Did you remove it? There should be a directory called \'input\' in the current directory')
        process.exit(1)
    }

    if (!isValidFile(templateFile)) {
        console.error('Missing template file! Did you remove it? There should be a template file called \'template.js\' in the current directory')
        process.exit(1)
    }

    process.argv.shift()
    process.argv.shift()

    const COMMANDS = ['start', 'run']

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        showHelp(COMMANDS)
        process.exit()
    }

    let force = false
    if (process.argv.includes('-f') || process.argv.includes('--force')) {
        force = true
    }

    const cmd = process.argv.shift()
    if (!COMMANDS.includes(cmd)) {
        console.error(`Invalid command '${cmd}', options are: ${COMMANDS.join(', ')}`)
        console.error('Run `node app.js -h` for help')
        process.exit(1)
    }

    if (process.argv.length === 0) {
        console.error('Incorrect usage, run `node app,js -h` for help')
        process.exit(1)
    }

    switch (cmd) {
        case 'run':
            for (let day of process.argv) {
                await run(solutionDir, inputDir, day)
            }
            break
        case 'start':
            start(solutionDir, inputDir, templateFile, process.argv[0], force)
            break
        default:
            console.error('Invalid command state, not sure what happened!')
            process.exit(1)
    }
}

main()
