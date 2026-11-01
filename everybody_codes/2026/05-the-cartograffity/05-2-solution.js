// https://everybody.codes/event/2026/quests/5
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const { NaiveGrid } = require('../../../utils/js/grid')
const {
    countInkBlots,
    findLand,
    LAND_DISPLAY,
    LAND_THRESHOLD,
    WATER_DISPLAY,
    displayCellCounts,
    displayCellValues,
    displayCellDisplays,
} = require('./05-1-solution')

const logger = getLogger('\nebc 2026 5 2\n')

const SAND_DISPLAY = '='

/** sand equivalent of both @see countInkBlots and @see findLand */
function findSand(grid) {
    let sandCount = 0

    /**
     * marks cell as __neighboring sand__, then marks it as __being sand__ if it qualifies
     * bumps `sandCount` before checking sand eligibility
     */
    const markAndBumpNeighborsSandCb = (row, col, cell) => {
        const updatedCell = grid.setCell(row, col, {
            ...cell,
            sandCount: cell.sandCount + 1,
            neighborsSand: true,
        })
        if (updatedCell.sandCount >= LAND_THRESHOLD) {
            markSandCb(row, col, updatedCell)
        }
    }
    /** marks a cell as sand */
    const markSandCb = (row, col, cell) => {
        if (cell.display !== LAND_DISPLAY) return

        let neighbors
        if (cell.neighborsSand && cell.sandCount >= LAND_THRESHOLD) {
            // mark qualified cell as sand
            const updatedCell = { ...cell, display: SAND_DISPLAY }
            grid.setCell(row, col, updatedCell)
            sandCount++

            // handle neighbors
            neighbors = grid.getAllNeighbors(row, col, markAndBumpNeighborsSandCb)
        }
    }

    // mark initial ring of sand
    grid.traverse((row, col, cell) => {
        if (cell.display !== LAND_DISPLAY) return

        let neighborsSand = false
        const neighbors = grid.getAllNeighbors(row, col)
        for (let i = 0; i < neighbors.length; i++) {
            const neighbor = neighbors[i]
            if (neighbor.display === WATER_DISPLAY) {
                neighborsSand = true
                break
            }
        }

        if (neighborsSand) {
            const updatedCell = { ...cell, neighborsSand, display: SAND_DISPLAY }
            grid.setCell(row, col, updatedCell)
            sandCount++
        }
    })
    logger.debug('Initial Sand Ring')
    logger.debug(grid.toString())

    // process initial sand counts
    grid.traverse((row, col, cell) => {
        const neighbors = grid.getAllNeighbors(row, col)

        let neighborCount = 0

        neighbors.forEach(neighbor => {
            if (neighbor.display === SAND_DISPLAY) {
                neighborCount++
            }
        })

        const updatedCell = {
            ...cell,
            sandCount: neighborCount,
            neighborsSand: neighborCount > 0,
        }
        grid.setCell(row, col, updatedCell)
    })

    // let the good sands roll
    grid.traverse(markSandCb)

    return sandCount
}

const createGrid = rawBinaryGrid => {
    return new NaiveGrid({
        rawGrid: rawBinaryGrid,
        cellParserCb: rawCellValue => {
            return {
                inkBlotCount: 0,
                sandCount: 0,
                value: Number(rawCellValue),
                display: WATER_DISPLAY,
                neighborsLand: false,
                neighborsSand: false,
            }
        },
        cellToStringCb: displayCellValues,
        nullCellValue: {
            inkBlotCount: 0,
            sandCount: 0,
            value: 0,
            display: WATER_DISPLAY,
            neighborsLand: false,
            neighborsSand: false,
        },
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
    logger.debug('Preliminary Land Map:')
    logger.debug(grid.toString())
    logger.info({ landCount, waterCount: grid.height * grid.width - landCount })

    const sandCount = findSand(inkBlotGrid)
    logger.info('Final Land Map:')
    logger.info(grid.toString())
    logger.info({ landCount, sandCount })

    return { landCount, sandCount }
}

module.exports = {
    solution,
    findSand,
    SAND_DISPLAY,
}

/*

Part II

Gimlock was still not impressed. He pointed out that such a map could not even tell the difference between solid land and a sandy beach. Legolink calmly picked up another map ( your notes ) and assured us that it could.

First, reconstruct the land exactly as in the previous part. Once the entire land surface has been found, the sandy coastline can be determined.

Every land cell that is adjacent to at least one water cell, including diagonal neighbours, immediately becomes sand

 = 

. Always treat the map as if it were surrounded by water on all sides, so every cell on the edge of the map is considered adjacent to water. The remaining sand is then found in much the same way as the land was in the previous part. A land cell becomes sand if at least

 5 

of its eight neighbouring cells are already marked as sand

 = 

. Continue until no more cells can become sand.
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

This is exactly the same example as in the previous part, so we already know what the reconstructed land looks like.

..#..................
.########....####....
.#########..#####....
..################...
...###############...
...###############...
...##############....
..###############....
..################...
..################...
.......###...........

First, every land cell adjacent to water becomes sand

 = 

. This includes diagonal neighbours. The map is also treated as if it were surrounded by water on all sides, so every land cell on its edge becomes sand as well.

..=..................
.========....====....
.==#####==..==##=....
..==#####====###==...
...=#############=...
...=############==...
...=############=....
..==############=....
..=#############==...
..======#=========...
.......===...........

The remaining sand is found in much the same way as the land in the previous part. During each step, every land cell with at least

 5 

neighbouring sand cells also becomes sand.

..=..................   ..=..................   ..=..................
.========....====....   .========....====....   .========....====....
.===####==..==#==....   .====###==..=====....   .====###==..=====....
..==#####====###==...   ..==#####====###==...   ..==#####====##===...
...=############==...   ...=############==...   ...=############==...
...=############==...   ...=############==...   ...=############==...
...=############=....   ...=############=....   ...=############=....
..==############=....   ..==############=....   ..==############=....
..==###########===...   ..===##########===...   ..===##########===...
..================...   ..================...   ..================...
.......===...........   .......===...........   .......===...........

After the third growth step, no more land cells have at least five sand neighbours, so the process stops.
The reconstructed beach contains

 69 

sand cells.

How many cells on the map are occupied by sand?
*/
