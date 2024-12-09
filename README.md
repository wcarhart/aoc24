# Advent of Code 2024
👋 These are my solutions for Advent of Code 2024! _Maybe I'll actually finish this year..._

## Getting started
To start working on a new day, use the `start` and `run` commands and pass in the `DAY` index (e.g. `3`).
```bash
node app.js start DAY
node app.js run DAY
```

## Need help?
There's a built-in help menu.
```bash
node app.js -h
```

## Testing
Usually when writing the solution, it's easier to test with the provided dummy example or custom scenarios. To do this, put these in a local file (e.g. `test.txt`), and then use the `test` command.
```bash
node app.js test DAY test.txt
```

## Other options
To run multiple days, use:
```bash
node app.js run 1 3 7
```

To run a range of days, like days 1 through 5 use:
```bash
node app.js run {1..5}
```
