// https://everybody.codes/event/2026/quests/8
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const { NaiveGrid } = require('../../../utils/js/grid')
const logger = getLogger('2026 8 2')

const PLACEHOLDER = '.'
const DEFAULT_DIRECTIONS = [
    'top-left',
    'top-right',
    'right',
    'bottom-right',
    'bottom-left',
    'left',
]

/**
 * given a direction and grid, returns obj with shape:
 * - startRow, startCol: where to start checking diagonal columns
 * - getNextRowStart, getNextColStart: functions to get next diagonal column start
 * - getNextValCol: function for current diagonal column to move to next cell
 */
function getLoopValues(direction, grid) {
    const decrementVal = val => (val - 1 >= 0 ? val - 1 : 0)
    const incrementVal = val => val + 1
    const incrementValLimit = limit => val => (val + 1 < limit ? val + 1 : limit - 1)
    const midpointRow = Math.floor(grid.height / 2)
    const finalCol = grid.width - 1

    switch (direction) {
        case 'top-left':
            return {
                startRow: midpointRow,
                startCol: 0,
                getNextRowStart: decrementVal,
                getNextColStart: incrementVal,
                getNextValCol: (row, col) => ({ row: row + 1, col: col + 1 }),
                decrementVal,
            }
        case 'top-right':
            return {
                startRow: midpointRow,
                startCol: finalCol,
                getNextRowStart: decrementVal,
                getNextColStart: decrementVal,
                getNextValCol: (row, col) => ({ row: row + 1, col: col - 1 }),
                decrementVal,
            }
        case 'bottom-left':
            return {
                startRow: midpointRow,
                startCol: 0,
                getNextRowStart: incrementValLimit(grid.height),
                getNextColStart: incrementValLimit(grid.width),
                getNextValCol: (row, col) => ({ row: row - 1, col: col + 1 }),
                decrementVal,
            }
        case 'bottom-right':
            return {
                startRow: midpointRow,
                startCol: finalCol,
                getNextRowStart: incrementValLimit(grid.height),
                getNextColStart: decrementVal,
                getNextValCol: (row, col) => ({ row: row - 1, col: col - 1 }),
                decrementVal,
            }
        case 'left':
            return {
                startRow: 0,
                startCol: 0,
                getNextRowStart: incrementValLimit(grid.height),
                getNextColStart: () => 0,
                getNextValCol: (row, col) => ({ row, col: col + 1 }),
                decrementVal,
            }
        case 'right':
            return {
                startRow: 0,
                startCol: finalCol,
                getNextRowStart: incrementValLimit(grid.height),
                getNextColStart: () => finalCol,
                getNextValCol: (row, col) => ({ row, col: col - 1 }),
                decrementVal,
            }
    }
    throw new Error('invalid direction:', direction)
}

function getVisibleEntsCount(direction, grid) {
    const visibleEnts = new Set()
    const loopUtils = getLoopValues(direction, grid)
    let startRow = loopUtils.startRow
    let startCol = loopUtils.startCol
    let shadow = 0
    let hexCol = 1

    // which diagonal column loop
    while (hexCol <= grid.height && grid.isCellInBounds(startRow, startCol)) {
        // check values in column loop
        let row = startRow
        let col = startCol
        let cellsChecked = 0
        while (grid.isCellInBounds(row, col)) {
            const cell = grid.getCell(row, col)
            const next = loopUtils.getNextValCol(row, col)
            if (cell !== PLACEHOLDER) {
                cellsChecked++
                if (cell > shadow) {
                    visibleEnts.add({ cell, row, col, shadow, hexCol })
                    logger.debug('visible', { cell, row, col, shadow, hexCol })
                    shadow = cell - 1
                } else {
                    logger.debug('NOT visible', { cell, row, col, shadow, hexCol })
                    shadow = shadow - 1
                }
            }

            row = next.row
            col = next.col
        }

        startRow = loopUtils.getNextRowStart(startRow)
        startCol = loopUtils.getNextColStart(startCol)
        shadow = 0
        hexCol = cellsChecked > 0 ? hexCol + 1 : hexCol
        logger.debug('next loop vals', { startRow, startCol, shadow })
    }

    logger.info('Visible Ents')
    visibleEnts.forEach(ve => {
        logger.info(ve)
    })
    return visibleEnts.size
}

function solution(rawHexagonalGrid, directions = DEFAULT_DIRECTIONS) {
    const grid = new NaiveGrid({
        rawGrid: rawHexagonalGrid,
        cellParserCb: val => (val === PLACEHOLDER ? val : Number(val)),
        nullCellValue: PLACEHOLDER,
    })

    return directions.reduce((total, dir) => total + getVisibleEntsCount(dir, grid), 0)
}

module.exports = {
    solution,
    getLoopValues,
    PLACEHOLDER,
    DEFAULT_DIRECTIONS,
}
/*

Part II
Everything seemed simple enough until the Ents showed us one of their real growing fields. The energy source was not fixed in one place. Instead, it travelled around the entire field.
A complete circuit consisted of

 6 

rounds. In each round, the source occupied the next position and sent energy along one of the six straight directions of the hexagonal grid:

 ↘ 

,

 ↙ 

,

 ← 

,

 ↖ 

,

 ↗ 

and

 → 

.
The rules for shadows remained exactly the same. During this test, the same field was used for all six rounds. As before, every Ent reached by the energy required one unit of energy in that round.
Gimlock immediately declared that such an unnecessarily complicated mechanism had obviously been designed by Elves. Legolink denied this so firmly that I decided not to ask any further questions.
The Ents needed to know how much energy one complete circuit required. Using the growing field ( your notes ), I needed to count the Ents receiving energy in each of the six rounds and add those six values together.
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

The same field is used for all six rounds of one complete circuit. The number of Ents receiving energy, and therefore the energy required in each round, is:

Round: 1
Direction: ↘
Energy: 32

....1.9.6.1.7....
...9.2.....8.....
..7...3..........
.4.....4.....8.9.
4.5.....5.8.9...9
.9.5.....6.....9.
....7.6...6......
...9...8...8.....
......6.....8....

Round: 2
Direction: ↙
Energy: 32

....1.9.6.1.7....
...9.....3.8.1...
....8...5...4.3..
.....7.......8.9.
......6...8.9...9
.9.....5.....8.9.
..7.7.6..........
...9...8...8.....
........6...8....

Round: 3
Direction: ←
Energy: 29

......9.6...7....
...9.......8.1...
....8...5...4.3..
.....7.........9.
..5.........9...9
.9.5...........9.
..7.7.6...6...4..
...9...8...8.4...
......6.....8....

Round: 4
Direction: ↖
Energy: 32

......9.6...7....
...9.......8.....
..7.8............
...6.7.......8.9.
......6...8.9...9
.9.....5.....8.9.
....7...4.....4..
...9...8.3.8.4...
....1.6.6.2.8....

Round: 5
Direction: ↗
Energy: 30

......9.6........
...9.......8.....
..7.8...5........
.4...7.........9.
4.......5.8.9...9
.9...........8.9.
..7...6...6......
...9.3.8...8.....
....1.6.6.2.8....

Round: 6
Direction: →
Energy: 32

....1.9.....7....
...9.......8.....
..7.8............
.4.6.7.......8.9.
4.5...6...8.9...9
.9.......6...8.9.
..7.7.....6......
...9...8...8.....
....1.6.6...8....

The energy required for the complete six-round circuit is therefore:

32 + 32 + 29 + 32 + 30 + 32 =

 187 
*/
