// https://everybody.codes/event/2026/quests/8
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const { NaiveGrid } = require('../../../utils/js/grid')
const { PLACEHOLDER, getLoopValues, DEFAULT_DIRECTIONS } = require('./08-2-solution')
const logger = getLogger('2026 8 3')

function handleRound(direction, grid, round) {
    const loop = getLoopValues(direction, grid)
    let startRow = loop.startRow
    let startCol = loop.startCol
    let shadow = 0
    let hexCol = 1
    let visibleEnts = 0
    let newWarriors = 0
    const gridBeforeRound = grid.toString()

    // which diagonal column loop
    while (hexCol <= grid.height && grid.isCellInBounds(startRow, startCol)) {
        // check values in column loop
        let row = startRow
        let col = startCol
        let cellsChecked = 0
        while (grid.isCellInBounds(row, col)) {
            let cell = grid.getCell(row, col)
            const next = loop.getNextValCol(row, col)
            const shouldSprout = cell.isSeed && cell.seedGrowthRemaining === 0
            const receivesEnergy = cell.value > shadow && !cell.isSeed
            const spawnsWarrior = receivesEnergy && cell.value === 9
            let nextShadow = shadow

            if (cell.value !== PLACEHOLDER) {
                cellsChecked++
                nextShadow = receivesEnergy
                    ? loop.decrementVal(cell.value)
                    : loop.decrementVal(shadow)

                if (cell.isSeed && cell.seedGrowthRemaining > 0) {
                    cell = grid.setCell(row, col, {
                        ...cell,
                        value: 'X',
                        seedGrowthRemaining: cell.seedGrowthRemaining - 1,
                    })
                }

                if (receivesEnergy) visibleEnts++

                if (spawnsWarrior) {
                    newWarriors++
                    cell = grid.setCell(row, col, {
                        value: '*',
                        seedGrowthRemaining: 2,
                        isSeed: true,
                    })
                } else if (receivesEnergy) {
                    cell = grid.setCell(row, col, { ...cell, value: cell.value + 1 })
                }

                if (shouldSprout) {
                    cell = grid.setCell(row, col, {
                        value: 1,
                        seedGrowthRemaining: -1,
                        isSeed: false,
                    })
                }
            }

            row = next.row
            col = next.col
            shadow = nextShadow
        }

        startRow = loop.getNextRowStart(startRow)
        startCol = loop.getNextColStart(startCol)
        shadow = 0
        hexCol = cellsChecked > 0 ? hexCol + 1 : hexCol
        logger.debug('next loop vals', { startRow, startCol, shadow })
    }

    logger.info(`GRID BEFORE round ${round + 1}\n`, gridBeforeRound, '\n')
    logger.info(`Round: ${round + 1}`)
    logger.info(`Direction: ${direction}`)
    logger.info(`Energy: ${visibleEnts}`)
    logger.info(`New warriors: ${newWarriors}\n`)

    return { newWarriors, energyNeeded: visibleEnts }
}

function solution(rawHexagonalGrid, directions = DEFAULT_DIRECTIONS, goal = 100_000) {
    const nullCellValue = {
        value: PLACEHOLDER,
        isSeed: false,
        seedGrowthRemaining: 0,
    }
    const grid = new NaiveGrid({
        rawGrid: rawHexagonalGrid,
        cellParserCb: val => {
            if (val === PLACEHOLDER) return nullCellValue
            return { ...nullCellValue, value: Number(val) }
        },
        cellToStringCb: cell => cell.value,
        nullCellValue,
    })
    let totalNewWarriors = 0
    let totalEnergyNeeded = 0

    let round = 0
    while (totalNewWarriors < goal) {
        let currentDirection = directions[round % directions.length]
        const { newWarriors, energyNeeded } = handleRound(currentDirection, grid, round)
        totalNewWarriors += newWarriors
        totalEnergyNeeded += energyNeeded
        round++
    }

    return { totalNewWarriors, totalEnergyNeeded, round }
}

module.exports = {
    solution,
}

/*
Part III

The tests were complete, but the Ents needed one final calculation before starting continuous production. They had to know how much energy would be required to grow enough warriors.

In the actual process, the field changed after every round. Each Ent receiving energy grew by one level. When an Ent of height

 9 

received energy, it became a fully grown warrior. It left the field and joined the army, leaving a seed behind in its place.
The seed remained underground for the next

 3 

rounds, required no energy and cast no shadow during that time. After remaining underground for three complete rounds, it sprouted as a new Ent of height

 1 

at the start of the following round. From then on, it followed the normal growing rules again.

The energy source continued its six-round circuit exactly as before. In every round, it moved to the next position, and every Ent reached by the energy required one unit of energy. All the rules for shadows remained unchanged, and all shadows were determined before any Ents grew during that round.

The Ents estimated that the mission needed an army of at least

 100000 

fully grown warriors. Production therefore continued until at least that many Ents had left the field and joined the army.

Using the growing field ( your notes ), I needed to simulate the complete production process and add the full energy required in every round, including the round in which the army first reached at least

 100000 

warriors.
Example based on the following notes:

....1.9.6.1.7....
...9.2.3.3.8.1...
..7.8.3.5.1.4.3..
.4.6.7.4.1.1.8.9.
4.5.3.6.5.8.9.4.9
.9.5.1.5.6.2.8.9.
..7.7.6.4.6.2.4..
...9.3.8.3.8.4...
....1.6.6.2.8....

In every round, the energy source moves to the next of its six positions. Every Ent receiving energy uses one unit of energy and grows by one level. An Ent of height

 9 

that receives energy leaves the field as a new warrior, and its seed remains underground for three rounds before sprouting again at height

 1 

.
The first ten rounds are shown below. Each map shows the field at the start of the round. Ents receiving energy are marked in bold. The symbol

 X 

represents a seed that is still underground and does not require energy.

Round: 1
Direction: ↘
Energy: 32
New warriors: 8

....1.9.6.1.7....
...9.2.3.3.8.1...
..7.8.3.5.1.4.3..
.4.6.7.4.1.1.8.9.
4.5.3.6.5.8.9.4.9
.9.5.1.5.6.2.8.9.
..7.7.6.4.6.2.4..
...9.3.8.3.8.4...
....1.6.6.2.8....

Round: 2
Direction: ↙
Energy: 31
New warriors: 6

....2.X.7.2.8....
...X.3.3.3.9.1...
..8.8.4.5.1.4.3..
.5.6.7.5.1.1.9.X.
5.6.3.6.6.9.X.4.X
.X.6.1.5.7.2.8.X.
..7.8.7.4.7.2.4..
...X.3.9.3.9.4...
....1.7.6.2.9....

Round: 3
Direction: ←
Energy: 29
New warriors: 5

....3.X.8.3.9....
...X.4.3.4.X.2...
..9.9.4.6.1.5.4..
.5.6.8.6.1.1.X.X.
5.6.3.7.6.X.X.5.X
.X.7.1.5.7.2.9.X.
..8.9.8.4.8.2.5..
...X.3.X.3.X.5...
....1.7.7.2.X....

Round: 4
Direction: ↖
Energy: 22
New warriors: 4

....3.X.9.3.X....
...X.5.3.5.X.3...
..X.X.4.7.1.6.5..
.5.6.9.7.2.2.X.X.
5.7.3.8.7.X.X.6.X
.X.8.1.5.7.2.X.X.
..8.X.9.4.9.2.6..
...X.4.X.3.X.6...
....1.8.8.3.X....

Round: 5
Direction: ↗
Energy: 25
New warriors: 5

....3.1.X.3.X....
...1.5.3.6.X.3...
..X.X.4.8.1.7.6..
.5.6.X.8.2.2.X.1.
5.7.3.9.7.X.1.7.1
.1.9.1.6.7.2.X.1.
..9.X.X.5.X.2.7..
...1.4.X.4.X.7...
....2.9.9.4.X....

Round: 6
Direction: →
Energy: 27
New warriors: 1

....4.1.X.3.X....
...1.6.3.6.1.3...
..X.X.4.9.1.8.7..
.6.6.X.8.2.2.1.1.
6.8.3.X.8.1.1.8.1
.2.X.2.7.8.2.X.1.
..X.X.X.5.X.2.8..
...2.5.1.4.1.8...
....3.X.X.5.1....

Round: 7
Direction: ↘
Energy: 28
New warriors: 8

....5.1.X.4.1....
...2.7.3.7.1.3...
..1.1.5.X.1.9.7..
.7.7.X.9.2.2.1.1.
7.9.3.X.9.1.1.9.1
.3.X.3.8.9.2.1.1.
..X.1.X.6.X.2.9..
...3.6.1.5.1.9...
....4.X.X.6.1....

Round: 8
Direction: ↙
Energy: 27
New warriors: 1

....6.2.1.5.2....
...3.8.4.8.1.4...
..2.1.5.X.1.X.8..
.8.8.1.X.3.2.1.1.
8.X.3.X.X.1.1.X.1
.3.X.3.9.X.3.1.1.
..X.1.1.6.1.3.X..
...3.6.1.5.1.X...
....5.X.X.7.1....

Round: 9
Direction: ←
Energy: 31
New warriors: 6

....7.3.2.6.3....
...3.9.5.9.1.5...
..2.1.6.X.2.X.9..
.9.9.1.X.4.2.1.2.
9.X.3.1.X.1.1.X.2
.3.1.3.X.X.3.2.2.
..1.1.1.7.1.4.X..
...4.6.1.6.1.X...
....5.1.1.8.2....

Round: 10
Direction: ↖
Energy: 26
New warriors: 1

....8.3.2.7.4....
...3.X.5.X.1.6...
..2.1.7.1.2.X.X..
.X.X.1.X.5.3.1.3.
X.X.4.2.X.2.2.X.3
.4.1.4.X.X.4.3.3.
..1.1.1.8.1.5.X..
...4.7.1.7.2.X...
....5.1.1.9.3....

The army reaches

 100000 

Ent warriors after

 32008 

rounds. Additional simulation details are available here.
Across all these rounds, the field requires a total of

 899889 

units of energy.
How many units of energy were required to grow an army of at least

 100000 

Ent warriors? 
*/
