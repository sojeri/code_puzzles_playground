// https://adventofcode.com/2025/day/4
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const {
    getInitialWarehouseState,
    canMarkPaperAccessible,
    CONTENTS,
} = require('./04-1-solution')
const logger = getLogger('aoc 2025 4\n')

const MAX_CYCLES = 500

const getForkliftOptimizer = warehouse => {
    let accessibleRolls = 0
    const decrementNeighborsCb = (row, col, cell) => {
        const updatedCell = { ...cell, paperNeighbors: cell.paperNeighbors - 1 }
        warehouse.setCell(row, col, updatedCell)
    }
    const markAccessibleRollsCb = (row, col, cell) => {
        if (canMarkPaperAccessible(cell)) {
            const updatedCell = { ...cell, contents: CONTENTS.PAPER_ACCESSIBLE }
            warehouse.setCell(row, col, updatedCell)
            warehouse.getAllNeighbors(row, col, decrementNeighborsCb)
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

    let prevCount = getAccessibleRollsCount()
    for (let i = 0; i < MAX_CYCLES; i++) {
        warehouse.traverse(markAccessibleRollsCb)
        if (getAccessibleRollsCount() === prevCount) {
            logger.info(`it took ${i + 1} cycles to remove all the paper we could`)
            break
        }
        prevCount = getAccessibleRollsCount()
    }
    logger.debug('Warehouse Stacks:')
    logger.debug(warehouse.toString())

    return getAccessibleRollsCount()
}

module.exports = {
    solution,
}

/*
--- Part Two ---

Now, the Elves just need help accessing as much of the paper as they can.

Once a roll of paper can be accessed by a forklift, it can be removed. Once a roll of paper is removed, the forklifts might be able to access more rolls of paper, which they might also be able to remove. How many total rolls of paper could the Elves remove if they keep repeating this process?

Starting with the same example as above, here is one way you could remove as many rolls of paper as possible, using highlighted @ to indicate that a roll of paper is about to be removed, and using x to indicate that a roll of paper was just removed:

Initial state:
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

Remove 13 rolls of paper:
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

Remove 12 rolls of paper:
.......x..
.@@.x.x.@x
x@@@@...@@
x.@@@@..x.
.@.@@@@.x.
.x@@@@@@.x
.x.@.@.@@@
..@@@.@@@@
.x@@@@@@@.
....@@@...

Remove 7 rolls of paper:
..........
.x@.....x.
.@@@@...xx
..@@@@....
.x.@@@@...
..@@@@@@..
...@.@.@@x
..@@@.@@@@
..x@@@@@@.
....@@@...

Remove 5 rolls of paper:
..........
..x.......
.x@@@.....
..@@@@....
...@@@@...
..x@@@@@..
...@.@.@@.
..x@@.@@@x
...@@@@@@.
....@@@...

Remove 2 rolls of paper:
..........
..........
..x@@.....
..@@@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@x.
....@@@...

Remove 1 roll of paper:
..........
..........
...@@.....
..x@@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@..
....@@@...

Remove 1 roll of paper:
..........
..........
...x@.....
...@@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@..
....@@@...

Remove 1 roll of paper:
..........
..........
....x.....
...@@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@..
....@@@...

Remove 1 roll of paper:
..........
..........
..........
...x@@....
...@@@@...
...@@@@@..
...@.@.@@.
...@@.@@@.
...@@@@@..
....@@@...

Stop once no more rolls of paper are accessible by a forklift. In this example, a total of 43 rolls of paper can be removed.

Start with your original diagram. How many rolls of paper in total can be removed by the Elves and their forklifts?
*/
