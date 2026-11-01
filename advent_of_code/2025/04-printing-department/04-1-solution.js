// https://adventofcode.com/2025/day/4
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const { NaiveGrid } = require('../../../utils/js/grid')
const logger = getLogger('aoc 2025 4\n')

/** warehouse stack markers */
const CONTENTS = {
    EMPTY: '.',
    PAPER_NOT_REACHABLE: '@',
    PAPER_ACCESSIBLE: 'x',
}

const createGrid = rawGrid => {
    const defaultEmptyCell = {
        contents: CONTENTS.EMPTY,
        paperNeighbors: 0,
    }
    return new NaiveGrid({
        rawGrid,
        nullCellValue: defaultEmptyCell,
        cellParserCb: rawContents => ({
            ...defaultEmptyCell,
            contents: rawContents,
        }),
        cellToStringCb: cell => cell.contents,
    })
}

const ACCESS_THRESHOLD = 4
const canMarkPaperAccessible = cell => {
    if (cell.contents !== CONTENTS.PAPER_NOT_REACHABLE) return false
    return cell.paperNeighbors < ACCESS_THRESHOLD
}

const getInitialWarehouseState = rawGridData => {
    const warehouse = createGrid(rawGridData)

    warehouse.traverse((row, col, cell) => {
        const neighbors = warehouse.getAllNeighbors(row, col)
        const paperNeighbors = neighbors.reduce((total, neighbor) => {
            if (neighbor.contents === CONTENTS.PAPER_NOT_REACHABLE) return total + 1
            return total
        }, 0)
        const updatedCell = { ...cell, paperNeighbors }
        warehouse.setCell(row, col, updatedCell)
    })

    return warehouse
}

const getForkliftOptimizer = warehouse => {
    let accessibleRolls = 0
    const markAccessibleRollsCb = (row, col, cell) => {
        if (canMarkPaperAccessible(cell)) {
            const updatedCell = { ...cell, contents: CONTENTS.PAPER_ACCESSIBLE }
            warehouse.setCell(row, col, updatedCell)
            accessibleRolls++
        }
    }
    const getAccessibleRollsCount = () => accessibleRolls

    return { getAccessibleRollsCount, markAccessibleRollsCb }
}

function solution(rawGridData) {
    const warehouse = getInitialWarehouseState(rawGridData)

    const { getAccessibleRollsCount, markAccessibleRollsCb } =
        getForkliftOptimizer(warehouse)
    warehouse.traverse(markAccessibleRollsCb)

    logger.info('Warehouse Stacks:')
    logger.info(warehouse.toString())

    return getAccessibleRollsCount()
}

module.exports = {
    getInitialWarehouseState,
    canMarkPaperAccessible,
    CONTENTS,
    solution,
}

/*
--- Day 4: Printing Department ---

You ride the escalator down to the printing department. They're clearly getting ready for Christmas; they have lots of large rolls of paper everywhere, and there's even a massive printer in the corner (to handle the really big print jobs).

Decorating here will be easy: they can make their own decorations. What you really need is a way to get further into the North Pole base while the elevators are offline.

"Actually, maybe we can help with that," one of the Elves replies when you ask for help. "We're pretty sure there's a cafeteria on the other side of the back wall. If we could break through the wall, you'd be able to keep moving. It's too bad all of our forklifts are so busy moving those big rolls of paper around."

If you can optimize the work the forklifts are doing, maybe they would have time to spare to break through the wall.

The rolls of paper (@) are arranged on a large grid; the Elves even have a helpful diagram (your puzzle input) indicating where everything is located.

For example:

..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.

The forklifts can only access a roll of paper if there are fewer than four rolls of paper in the eight adjacent positions. If you can figure out which rolls of paper the forklifts can access, they'll spend less time looking and more time breaking down the wall to the cafeteria.

In this example, there are 13 rolls of paper that can be accessed by a forklift (marked with x):

..xx.xx@x.
x@@.@.@.@@
@@@@@.x.@@
@.@@@@..@.
x@.@@@@.@x
.@@@@@@@.@
.@.@.@.@@@
x.@@@.@@@@
.@@@@@@@@.
x.x.@@@.x.

Consider your complete diagram of the paper roll locations. How many rolls of paper can be accessed by a forklift?
*/
