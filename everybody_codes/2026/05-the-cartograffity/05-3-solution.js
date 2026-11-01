// https://everybody.codes/event/2026/quests/5
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const { NaiveGrid } = require('../../../utils/js/grid')
const {
    countInkBlots,
    findLand,
    LAND_DISPLAY,
    WATER_DISPLAY,
    displayCellCounts,
    displayCellValues,
    displayCellDisplays,
} = require('./05-1-solution')
const { findSand } = require('./05-2-solution')

const logger = getLogger('\nebc 2026 5 3\n')

const TREE_DISPLAY = '@'
const SUSTAINABLE_FOREST_THRESHOLD = 4

/** @see findSand but for trees */
function plantTrees(grid) {
    let treeCount = 0

    /** TFW you refuse to not brute force the potato stamp 😂 */
    const getRadialNeighbors = (row, col) => {
        const [W, N, E, S] = grid.getCardinalNeighbors(row, col)
        const [W_W, W_N, _W_E, W_S, W_NW, _W_NE, _W_SE, W_SW] = grid.getAllNeighbors(
            W.row,
            W.col
        )
        const [_N_W, N_N, _N_E, _N_S, N_NW, N_NE, _N_SE, _N_SW] = grid.getAllNeighbors(
            N.row,
            N.col
        )
        const [_E_W, E_N, E_E, E_S, _E_NW, E_NE, E_SE, _E_SW] = grid.getAllNeighbors(
            E.row,
            E.col
        )
        const [_S_W, _S_N, _S_E, S_S, _S_NW, _S_NE, S_SE, S_SW] = grid.getAllNeighbors(
            S.row,
            S.col
        )

        return [
            // there is a method to my madness
            // prettier destroyed how I spaced them,
            // but you can still sort of see the potato stamp
            // on the lines that used to be the end of the clusters
            N_NW,
            N_N,
            N_NE, // .+++.
            W_NW,
            W_N,
            N,
            E_N,
            E_NE, // +++++
            W_W,
            W,
            E,
            E_E, // ++X++
            W_SW,
            W_S,
            S,
            E_S,
            E_SE, // +++++
            S_SW,
            S_S,
            S_SE, // .+++.
        ]
    }
    /** meticulously verifies whether potato stamp fits around current cell */
    const canHasPotatoStamp = (row, col) => {
        const neighbors = getRadialNeighbors(row, col)
        return neighbors.reduce((canHasTree, neighbor) => {
            const isLand = neighbor.display === LAND_DISPLAY
            const isTree = neighbor.display === TREE_DISPLAY
            return canHasTree && (isLand || isTree)
        }, true)
    }
    /** marks cell as __tree__ if it qualifies. */
    const markPossibleTreeCb = (row, col, cell) => {
        if (cell.display !== LAND_DISPLAY) return
        if (cell.treeCount < SUSTAINABLE_FOREST_THRESHOLD) return
        if (cell.neighborsSand) return

        // mark qualified cell as tree
        const updatedCell = { ...cell, display: TREE_DISPLAY }
        grid.setCell(row, col, updatedCell)
        treeCount++
    }

    // mark initial potato stamp trees
    grid.traverse((row, col, cell) => {
        if (cell.display !== LAND_DISPLAY) return

        if (canHasPotatoStamp(row, col)) {
            grid.setCell(row, col, { ...cell, display: TREE_DISPLAY })
            treeCount++
        }
    })
    logger.debug('Initial Trees')
    logger.debug(grid.toString())

    const EXACTLY_TWO_STEPS = 2
    for (let i = 0; i < EXACTLY_TWO_STEPS; i++) {
        // count all the trees
        grid.traverse((row, col, cell) => {
            const neighbors = grid.getAllNeighbors(row, col)
            const neighborCount = neighbors.reduce((total, neighbor) => {
                if (neighbor.display === TREE_DISPLAY) return total + 1
                return total
            }, 0)

            const updatedCell = { ...cell, treeCount: neighborCount }
            grid.setCell(row, col, updatedCell)
        })

        // sustainably grow forest
        grid.traverse(markPossibleTreeCb)
    }

    return treeCount
}

const createGrid = rawBinaryGrid => {
    const initialCell = {
        inkBlotCount: 0,
        sandCount: 0,
        value: 0,
        display: WATER_DISPLAY,
        neighborsLand: false,
        neighborsSand: false,
        row: -1,
        col: -1,
    }
    return new NaiveGrid({
        rawGrid: rawBinaryGrid,
        cellParserCb: (rawCellValue, row, col) => {
            return {
                ...initialCell,
                value: Number(rawCellValue),
                row,
                col,
            }
        },
        cellToStringCb: displayCellValues,
        nullCellValue: { ...initialCell },
    })
}

/** process raw binary grid map into a count of how many cells are land */
function solution(rawBinaryGrid) {
    const grid = createGrid(rawBinaryGrid)
    logger.debug('Raw Grid:')
    logger.debug(grid.toString())

    const inkBlotGrid = countInkBlots(grid)
    grid.cellToStringCb = displayCellCounts
    logger.debug('Initial Counts:')
    logger.debug(grid.toString())

    const landCount = findLand(inkBlotGrid)
    grid.cellToStringCb = displayCellDisplays
    logger.debug('Land Map:')
    logger.debug(grid.toString())
    logger.info({ landCount, waterCount: grid.height * grid.width - landCount })

    const sandCount = findSand(inkBlotGrid)
    logger.debug('Sand Map:')
    logger.debug(grid.toString())
    logger.debug({ landCount, sandCount })

    const treeCount = plantTrees(inkBlotGrid)
    logger.info('Final Map:')
    logger.info(grid.toString())
    logger.info({ landCount, sandCount, treeCount })

    return { landCount, sandCount, treeCount }
}

module.exports = {
    solution,
}

/*

Part III

Gimlock stared at the latest map in complete disbelief. "Don't tell me these maps can even show trees. What next, potato stamps?" Legolink quietly opened a small wooden chest filled with... potato stamps. Gimlock blinked. Without a word, Legolink picked up a potato stamp carved into the shape of a tree, then took out another map ( your notes ) to demonstrate the procedure.

First, reconstruct the land and sand exactly as before. Once both have been determined, the remaining land can be decorated with trees. A tree can be added at X whenever the following 5 by 5 pattern fits:

.+++.
+++++
++X++
+++++
.+++.

For every land cell, treat that cell as

 X 

and examine the area around it:
Dots

 . 

represent cells that are irrelevant. Every

 + 

marks a cell that must contain either land

 # 

or a tree

 @ 

. If all cells marked with

 + 

meet this condition, the land cell at

 X 

becomes a tree

 @ 

. Check every land cell in this way.

Once all possible trees have been added with the stamp, the forest grows for exactly two more steps. During each step, a land cell becomes a tree if:

    at least

     4 

    of its eight neighbouring cells are already trees, and
    none of its eight neighbouring cells is sand.

Each of these two steps is applied simultaneously across the entire map. This means that trees added during a step may only affect the following step.

Example based on the following notes:

010100100100001101000
111101001000001110000
101111011000101010011
001000101010000100000
000110100110011001100
000001110111111000000
101100010101011110000
001101100000001010011
001001001111010001001
100011011110011010101
001100101110010010000

This is the same map as in the previous parts, so the land and sand have already been determined. Legolink now checks the remaining land cells from top to bottom and from left to right. Whenever all cells marked with

 + 

contain land or trees, the cell at

 X 

becomes a tree

 @ 

. Trees added earlier may therefore make later stamp positions valid.
The maps below show every successful use of the stamp. The two forest-growth steps are shown separately afterwards.

..=..................   ..=..................   ..=..................   ..=..................
.========....====....   .========....====....   .========....====....   .========....====....
.====###==..=====....   .====###==..=====....   .====###==..=====....   .====###==..=====....
..==#####====##===...   ..==#####====##===...   ..==#####====##===...   ..==#####====##===...
...=##@#########==...   ...=##@#########==...   ...=##@#########==...   ...=##@#########==...
...=############==...   ...=##@#########==...   ...=##@@########==...   ...=##@@########==...
...=############=....   ...=############=....   ...=############=....   ...=##@#########=....
..==############=....   ..==############=....   ..==############=....   ..==############=....
..===##########===...   ..===##########===...   ..===##########===...   ..===##########===...
..================...   ..================...   ..================...   ..================...
.......===...........   .......===...........   .......===...........   .......===...........

..=..................   ..=..................   ..=..................   ..=..................
.========....====....   .========....====....   .========....====....   .========....====....
.====###==..=====....   .====###==..=====....   .====###==..=====....   .====###==..=====....
..==#####====##===...   ..==#####====##===...   ..==#####====##===...   ..==#####====##===...
...=##@#########==...   ...=##@#########==...   ...=##@#########==...   ...=##@#########==...
...=##@@########==...   ...=##@@########==...   ...=##@@########==...   ...=##@@########==...
...=##@@########=....   ...=##@@@#######=....   ...=##@@@@######=....   ...=##@@@@@#####=....
..==############=....   ..==############=....   ..==############=....   ..==############=....
..===##########===...   ..===##########===...   ..===##########===...   ..===##########===...
..================...   ..================...   ..================...   ..================...
.......===...........   .......===...........   .......===...........   .......===...........

..=..................   ..=..................   ..=..................
.========....====....   .========....====....   .========....====....
.====###==..=====....   .====###==..=====....   .====###==..=====....
..==#####====##===...   ..==#####====##===...   ..==#####====##===...
...=##@#########==...   ...=##@#########==...   ...=##@#########==...
...=##@@########==...   ...=##@@########==...   ...=##@@########==...
...=##@@@@@@####=....   ...=##@@@@@@@###=....   ...=##@@@@@@@@##=....
..==############=....   ..==############=....   ..==############=....
..===##########===...   ..===##########===...   ..===##########===...
..================...   ..================...   ..================...
.......===...........   .......===...........   .......===...........

During the first growth step,

 1 

additional land cell becomes tree:

..=..................
.========....====....
.====###==..=====....
..==#####====##===...
...=##@#########==...
...=##@@@#######==...
...=##@@@@@@@@##=....
..==############=....
..===##########===...
..================...
.......===...........

During the second growth step,

 2 

additional land cells become trees:

..=..................
.========....====....
.====###==..=====....
..==#####====##===...
...=##@@########==...
...=##@@@@######==...
...=##@@@@@@@@##=....
..==############=....
..===##########===...
..================...
.......===...........

The final map contains

 14 

tree cells.
How many cells on the map are occupied by trees?
*/
