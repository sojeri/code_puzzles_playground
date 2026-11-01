// https://everybody.codes/event/2026/quests/5
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const { NaiveGrid } = require('../../../utils/js/grid')
const logger = getLogger('\nebc 2026 5 1\n')

const LAND_DISPLAY = '#'
const WATER_DISPLAY = '.'
const LAND_THRESHOLD = 5
const MAX_RADAR_CYCLES = 100

/**
 * process a binary grid map to figure out where the heck all the land might be.
 *
 * @see findLand
 * @see NaiveGrid
 *
 * ie, turn this
 * ```
 * Raw Grid:
 * 010100100100001101000
 * 111101001000001110000
 * 101111011000101010011
 * 001000101010000100000
 * 000110100110011001100
 * 000001110111111000000
 * 101100010101011110000
 * 001101100000001010011
 * 001001001111010001001
 * 100011011110011010101
 * 001100101110010010000
 * ```
 * into a rich version of this
 * ```
 * Initial Counts:
 * 335232122110023441100
 * 356563443311144643222
 * 265543443412033632111
 * 133655353523244333332
 * 012225454555444321110
 * 123443435464566533210
 * 033344634253555522122
 * 144442334453444533222
 * 132454544542334433353
 * 033433446864433324131
 * 121233244532223313121
 * ```
 */
function countInkBlots(grid) {
    // process initial counts
    grid.traverse((row, col, cell) => {
        const neighbors = grid.getAllNeighbors(row, col)
        const neighborCount = neighbors.reduce((total, neighbor) => {
            return total + neighbor.value
        }, 0)

        const updatedCell = { ...cell, inkBlotCount: neighborCount }
        grid.setCell(row, col, updatedCell)
    })

    return grid
}

/**
 * process NativeGrid(inkBlotMap) to return land counts
 * @see countInkBlots
 * ie, turn a rich version of this
 * ```
 * Initial Counts:
 * 335232122110023441100
 * 356563443311144643222
 * 265543443412033632111
 * 133655353523244333332
 * 012225454555444321110
 * 123443435464566533210
 * 033344634253555522122
 * 144442334453444533222
 * 132454544542334433353
 * 033433446864433324131
 * 121233244532223313121
 * ```
 * into a count of this
 * ```
 * ..#..................
 * .########....####....
 * .#########..#####....
 * ..################...
 * ...###############...
 * ...###############...
 * ...##############....
 * ..###############....
 * ..################...
 * ..################...
 * .......###...........
 * ```
 */
function findLand(grid) {
    let landCount = 0
    /** marks cell as __neighboring land__ */
    const markOnlyNeighborsLandCb = (row, col, cell) => {
        if (cell.display === LAND_DISPLAY) return
        grid.setCell(row, col, { ...cell, neighborsLand: true })
    }
    /** marks cell as __neighboring land__ and bumps `inkBlotCount` */
    const markAndBumpNeighborsLandCb = (row, col, cell) => {
        if (cell.display === LAND_DISPLAY) return
        grid.setCell(row, col, {
            ...cell,
            inkBlotCount: cell.inkBlotCount + 1,
            neighborsLand: true,
        })
    }
    /** marks a cell as land */
    const markLandCb = (row, col, cell) => {
        if (cell.display === LAND_DISPLAY) return

        if (cell.neighborsLand && cell.inkBlotCount >= LAND_THRESHOLD) {
            // mark qualified cell as land
            const updatedCell = { ...cell, display: LAND_DISPLAY }
            grid.setCell(row, col, updatedCell)
            landCount++

            // handle neighbors
            // if inkBlot val was 1, this cell was already included in neighbor count and doesn't need the bump
            const markNeighboringLandCb =
                cell.value === 0 ? markAndBumpNeighborsLandCb : markOnlyNeighborsLandCb
            grid.getAllNeighbors(row, col, markNeighboringLandCb)
        }
    }

    const midpointRow = Math.floor(grid.height / 2)
    const midpointCol = Math.floor(grid.width / 2)
    grid.getCell(midpointRow, midpointCol, (row, col, cell) => {
        // mark qualified cell as land
        const updatedCell = { ...cell, display: LAND_DISPLAY, neighborsLand: true }
        grid.setCell(row, col, updatedCell)
        landCount++

        // handle neighbors
        // if inkBlot val was 1, this cell was already included in neighbor count and doesn't need the bump
        const markNeighboringLandCb =
            cell.value === 0 ? markAndBumpNeighborsLandCb : markOnlyNeighborsLandCb
        grid.getAllNeighbors(row, col, markNeighboringLandCb)
    })

    let prevLandCount = landCount
    for (let i = 0; i < MAX_RADAR_CYCLES; i++) {
        grid.traverseSemiRadially(markLandCb)
        if (landCount === prevLandCount) {
            logger.info(`it took ${i + 1} radar cycles to find all the land`)
            break
        }
        prevLandCount = landCount
    }

    return landCount
}

const displayCellCounts = c => c.inkBlotCount
const displayCellDisplays = c => c.display
const displayCellValues = c => c.value

const createGrid = rawBinaryGrid => {
    return new NaiveGrid({
        rawGrid: rawBinaryGrid,
        cellParserCb: rawCellValue => {
            return {
                inkBlotCount: 0,
                value: Number(rawCellValue),
                display: WATER_DISPLAY,
                neighborsLand: false,
            }
        },
        cellToStringCb: displayCellValues,
        nullCellValue: {
            inkBlotCount: 0,
            value: 0,
            display: WATER_DISPLAY,
            neighborsLand: false,
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
    logger.info('Land Map:')
    logger.info(grid.toString())
    logger.info({ landCount })

    return landCount
}

module.exports = {
    solution,
    countInkBlots,
    findLand,
    WATER_DISPLAY,
    LAND_DISPLAY,
    LAND_THRESHOLD,
    MAX_RADAR_CYCLES,
    displayCellCounts,
    displayCellDisplays,
    displayCellValues,
}

/*
Quest 5: The Cartograffity
   
Part I
Story section

Once the tournament results had finally been calculated, the elves officially declared Legolink Pointereye their greatest warrior. As promised, he joined our expedition. Before we set off, the Grand Council handed us several maps to guide us safely to Nulldor.

With an elven warrior leading the way, we expected a smooth journey. During our very first stop, however, Frodoff picked up one of the maps. He turned it one way, then the other, held it upside down, frowned, and started the whole process again.

Gimlock watched this strange performance for a moment before suggesting that the elves had probably made another perfectly sensible invention. Perhaps the missing details appeared only to people who already knew where they were going.

It turned out that neither explanation was correct. The route was perfectly visible, and the destination had been marked just as clearly. The problem was that nothing else was on the map. There were only lighter and darker patches, like the static on an old crystal ball that had lost its signal.

Gimlock stared at the map for a while before handing it back. "At least it's consistently elven." Since we would all need to use these maps on the journey to Nulldor, we agreed that everyone should learn how to read them. Legolink offered to explain everything from the beginning.

Legolink explained that the lighter and darker patches were not random at all. To make the maps easier to read, we could represent every lighter cell as

 0 

and every darker cell as

 1 

( your notes ). Every map had an odd number of rows and an odd number of columns. This meant that it always had exactly one central cell.
To reconstruct the land, begin by drawing a single land cell, represented by

 # 

, in the exact centre of the map. From that point, new pieces of land are gradually added around the land that has already been discovered. Consider every cell that touches the current land horizontally, vertically or diagonally.
A cell becomes land if at least

 5 

of its eight neighbouring cells are either already marked as land

 # 

, or dark cells

 1 

on the original map. Whenever a cell meets this condition, replace it with

 # 

. It becomes part of the known land and may allow more cells around it to be attached. Continue until no more land cells can be added.
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

The first step is to mark the central cell of the map as land

#

. The diagrams below highlight all cells adjacent to the known land, including those touching only at a corner, as these are the only cells that can be added to the land next.

010100100100001101000
111101001000001110000
101111011000101010011
001000101010000100000
000110100110011001100
0000011101#1111000000
101100010101011110000
001101100000001010011
001001001111010001001
100011011110011010101
001100101110010010000

After repeatedly attaching every possible cell, the reconstructed land looks like this:

010100100100001101000   010100100100001101000   010100100100001101000   010100100100001101000
111101001000001110000   111101001000001110000   111101001000001110000   111101001000001110000
101111011000101010011   101111011000101010011   101111011#00101010011   10111101##00101010011
001000101010000100000   001000101#10000100000   001000101#1#0#0100000   0010001########100000
000110100###011001100   000110100####11001100   0001101#######1001100   000110#########001100
0000011101#1111000000   00000111#####11000000   00000111######1000000   000001#########000000
1011000101#1011110000   1011000101#1011110000   10110001######1110000   1011000########110000
001101100000001010011   001101100##0001010011   00110110####001010011   0011011#######1010011
001001001111010001001   001001001111010001001   00100100###1010001001   0010010####1010001001
100011011110011010101   100011011110011010101   100011011110011010101   10001101###0011010101
001100101110010010000   001100101110010010000   001100101110010010000   001100101110010010000

010100100100001101000   010100100100001101000   010100100100001101000   01#100100100001101000
111101001000001110000   111101##10000####0000   111######0000####0000   11#######0000####0000
101111####001###10011   1011######001###10011   101#######00####10011   10########00#####0011
00100##########100000   0010############00000   001##############0000   001##############0000
00011##########001100   00011###########01100   0001############01100   000##############1100
000001##########00000   0000############00000   000##############0000   000##############0000
101100##########10000   10110###########10000   1011############10000   101##############0000
001101##########10011   001101##########10011   0011#############0011   001##############0011
001001#########001001   00100###########01001   0010#############1001   001##############1001
100011#####0011010101   10001#########1010101   10001###########10101   100#1#############101
001100101#10010010000   0011001#1#10010010000   0011001###10010010000   0011001###10010010000

01#100100100001101000   01#100100100001101000   ..#..................
1########0000####0000   1########0000####0000   .########....####....
1#########00#####0011   1#########00#####0011   .#########..#####....
001###############000   00################000   ..################...
000##############1100   000###############100   ...###############...
000###############000   000###############000   ...###############...
101##############0000   101##############0000   ...##############....
00###############0011   00###############0011   ..###############....
001###############001   00################001   ..################...
10################101   10################101   ..################...
0011001###10010010000   0011001###10010010000   .......###...........

The final diagram shows only land cells as

 # 

and water cells as

 . 

for better readability.
The reconstructed land contains

 137 

cells.
How many cells on the map are occupied by land?

*/
