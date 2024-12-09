import { readFileSync, statSync, copyFileSync, openSync } from 'node:fs'
import path from 'node:path'

// build the help menu message
const showHelp = (commands) => {
    const help = [
        'Script for working on Advent of Code puzzles',
        '',
        'Usage: node app.js [-h/--help] [-f/--force] CMD DAY+',
        `  CMD  the command to run, options are: ${commands.join(', ')}`,
        '  DAY  the number day to run (must have corresponding puzzle and solution input)'
    ]
    console.log(help.join('\n'))
}

// build the missing input file error message
const showMissingInputFileError = (day) => {
    let error = [
        `Missing input file for day ${day}!`,
        `  Create an official input file with \`node app.js start ${day}\``,
        `  Test a custom input file with \`node app.js test ${day} FILE\``
    ]
    console.error(error.join('\n'))
}

// check if provided day is valid
const validateDay = (day) => {
    const value = parseInt(day)
    if (typeof value !== 'number' || isNaN(value)) {
        console.error('Incorrect usage, run `node app,js -h` for help')
        process.exit(1)
    }

    if (value === 0) {
        console.error('Nice try! Days are start with 1 for Advent of Code, so day 0 doesn\'t exist, but here\'s a bear for your troubles: ʕ•ᴥ•ʔ')
        process.exit(1)
    }
}

// check if a filepath is a valid, existing file
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

// check if a filepath is a valid, existing directory
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

// start working on a new day
const start = (solutionDir, inputDir, templateFile, day, force) => {
    const solutionFile = `${path.join(solutionDir, day)}.js`
    const inputFile = `${path.join(inputDir, day)}.txt`

    // we expect there to be a ./template.js file
    if (!isValidFile(templateFile)) {
        console.error('Missing template JS file! Did you remove it? There should be a template file called \'template.js\' in the current directory')
        process.exit(1)
    }

    // we expect there not to be a ./solutions/<day>.js file
    if (isValidFile(solutionFile) && !force) {
        console.error(`Solution file '${solutionFile}' already exists! Blow it away with -f/--force`)
        process.exit(1)
    }

    // we expect there not to be a ./input/<day>.js file
    if (isValidFile(inputFile) && !force) {
        console.error(`Input file '${inputFile}' already exists! Blow it away with -f/--force`)
        process.exit(1)
    }

    // create an empty input file and templated solution file for the given day
    copyFileSync(templateFile, solutionFile)
    openSync(inputFile, 'w')
}

// run a day against the official input file
const run = async (solutionDir, inputDir, day) => {
    const inputFile = `${path.join(inputDir, day)}.txt`
    return await runWithData(solutionDir, inputFile, day)
}

// test a day against a dummy input file
const test = async (solutionDir, inputFile, day) => {
    if (inputFile === undefined) {
        showMissingInputFileError(day)
        process.exit(1)
    }
    return await runWithData(solutionDir, inputFile, day)
}

// internal helper for running an actual solution given an input file
const runWithData = async (solutionDir, inputFile, day) => {
    // validate the solution file
    const solutionFile = `${path.join(solutionDir, day)}.js`
    if (!isValidFile(solutionFile)) {
        console.error(`Missing solution file for day ${day}! Create one with \`node app.js start ${day}\``)
        process.exit(1)
    }

    // validate the input file
    if (!isValidFile(inputFile)) {
        showMissingInputFileError(day)
        process.exit(1)
    }

    // acquire inputs
    const { partOne, partTwo } = await import(solutionFile)
    const data = readFileSync(inputFile).toString()
    const lines = data.split('\n')

    // run the built solution
    let result = partOne(lines)
    console.log(`=== Day ${day} ===`)
    console.log(`1: ${result}`)
    result = partTwo(lines)
    console.log(`2: ${result}`)
}

const main = async () => {
    // determine (expected) globals and filepaths
    const parts = import.meta.url.split('/')
    parts.pop()
    const cwd = parts.join('/').replace(/^file:/, '')
    const solutionDir = path.join(cwd, 'solutions')
    const inputDir = path.join(cwd, 'input')
    const templateFile = path.join(cwd, 'template.js')

    // validate directories
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

    // we can skip the first two command line args assuming they will be 'node' and 'app.js'
    process.argv.shift()
    process.argv.shift()

    // our list of valid commands
    const COMMANDS = ['help', 'start', 'test', 'run']

    // search for help menu flag
    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        showHelp(COMMANDS)
        process.exit()
    }

    // search for force flag
    let force = false
    if (process.argv.includes('-f') || process.argv.includes('--force')) {
        force = true
    }

    // validate command
    const cmd = process.argv.shift()
    if (!COMMANDS.includes(cmd)) {
        console.error(`Invalid command '${cmd}', options are: ${COMMANDS.join(', ')}`)
        console.error('Run `node app.js -h` for help')
        process.exit(1)
    }

    // run the specified command
    let day
    switch (cmd) {
        case 'help':
            showHelp(COMMANDS)
            process.exit()
        case 'start':
            day = process.argv.shift()
            validateDay(day)
            start(solutionDir, inputDir, templateFile, day, force)
            break
        case 'test':
            day = process.argv.shift()
            validateDay(day)
            const inputFile = process.argv.shift()
            await test(solutionDir, inputFile, day)
            break
        case 'run':
            if (process.argv.length === 0) {
                console.error('Incorrect usage, run `node app,js -h` for help')
                process.exit(1)
            }
            for (let day of process.argv) {
                validateDay(day)
                await run(solutionDir, inputDir, day)
            }
            break
        default:
            console.error('Invalid command state, not sure what happened!')
            process.exit(1)
    }
}

main()
