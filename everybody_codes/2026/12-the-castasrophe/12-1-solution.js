//
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const logger = getLogger('e 2026 12 1')

function solution(grid) {
    const magmaBlocks = {}
    for (let r = 0; r < grid.length; r++) {
        magmaBlocks[r] = {}
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] === '#') {
                let length = 1
                if (magmaBlocks[r][c - 1] !== undefined) {
                    length += magmaBlocks[r][c - 1].length
                    delete magmaBlocks[r][c - 1]
                }

                let height = 1
                if (
                    magmaBlocks[r - 1] !== undefined &&
                    magmaBlocks[r - 1][c] !== undefined
                ) {
                    height += magmaBlocks[r - 1][c].height
                    delete magmaBlocks[r - 1][c]
                }
                magmaBlocks[r][c] = { height, length }
            }
        }
    }
    let spellsRequired = 0
    Object.values(magmaBlocks).forEach(row => {
        Object.values(row).forEach(({ height, length }) => {
            spellsRequired += height > length ? length : height
        })
    })
    return spellsRequired
}

module.exports = {
    solution,
}
