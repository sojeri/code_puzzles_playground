const { getLogger, VERBOSITY } = require('./getLogger')

const ModuleLogger = getLogger('NaiveGridLogger :: ')
// const ModuleLogger = getLogger('NaiveGridLogger :: ', VERBOSITY.DEBUG)

const NaiveGridErrors = {
    newGridRequiresArray: 'rawGrid must be an array',
    newGridRequiresLength:
        'rawGrid elements must have a length (they will be accessed with array index syntax)',
    notImplemented: 'this method is not yet implemented sorry',
    outOfBounds: 'attempted to set value of cell outside the grid',
    inspectCellCbNonFunctionError:
        'inspectCellCb must be a function. it will be called for every cell during grid traversal',
}

/**
 * naive implementation of a grid with zero performance optimizations :)
 * NOTE: assumes consistent columns / row length
 * @param rawGrid - REQUIRED: array of objects that have length, eg strings or arrays, to be used as the base grid data
 * @param cellParserCb - optional, callback for transforming input cell data before saving to the grid. (rawCell, row, col) => cell
 * @param cellToStringCb - optional, callback for grid cells when Grid.toString() is called
 * @param nullCellValue - optional, value to return when attempting to access out of bounds cells
 */
class NaiveGrid {
    // fallback
    // TODO: fix #logger or remove instance field
    static ModuleLogger = ModuleLogger

    /** height of the grid, aka how many rows */
    height
    /** width of the grid, aka how many cells per row (assumes regularity) */
    width
    /** raw constructor input */
    rawInput
    /** parsed grid consisting of rows of cells */
    rows
    /** @see cellToStringCb */
    #cellToStringCb
    /** @see nullCellValue */
    #nullCellValue

    constructor(props) {
        const { rawGrid, cellParserCb, cellToStringCb, nullCellValue } = props

        if (!Array.isArray(rawGrid)) throw new Error(NaiveGridErrors.newGridRequiresArray)
        if (!rawGrid[0]['length']) throw new Error(NaiveGridErrors.newGridRequiresLength)

        this.height = rawGrid.length
        this.width = rawGrid[0].length
        this.rawInput = rawGrid

        this.rows = []
        rawGrid.forEach((rawRow, rowIndex) => {
            let row = []

            for (let i = 0; i < this.width; i++) {
                const rawCell = rawRow[i]
                row.push(
                    typeof cellParserCb === 'function'
                        ? cellParserCb(rawCell, rowIndex, i)
                        : rawCell
                )
            }

            this.rows.push(row)
        })

        this.cellToStringCb = cellToStringCb
        this.nullCellValue = nullCellValue
        NaiveGrid.ModuleLogger.debug('initializing NaiveGrid with size', {
            height: this.height,
            width: this.width,
        })
    }

    /** sets the callback to use on cells when Grid.toString() is called */
    set cellToStringCb(cellToStringCb) {
        if (cellToStringCb === undefined) {
            this.#cellToStringCb = cell => cell
        } else {
            this.#cellToStringCb = cellToStringCb
        }
    }

    /** set the value to return when attempting to access out of bounds cells */
    set nullCellValue(nullCellValue) {
        if (nullCellValue === undefined) {
            this.#nullCellValue = null
        } else {
            this.#nullCellValue = nullCellValue
        }
    }

    /** value to return when attempting to access out of bounds cells */
    get nullCellValue() {
        if (Array.isArray(this.#nullCellValue)) {
            return [...this.#nullCellValue]
        }

        if (typeof this.#nullCellValue === 'object' && this.#nullCellValue !== null) {
            return { ...this.#nullCellValue }
        }

        return this.#nullCellValue
    }

    /** returns the string representation of this NaiveGrid instance */
    toString() {
        return this.rows.map(row => row.map(this.#cellToStringCb).join('')).join('\n')
    }

    /** returns true if given row/col is in grid bounds */
    isCellInBounds(row, col) {
        return row >= 0 && row < this.height && col >= 0 && col < this.width
    }

    /** returns the cell value from the row and column specified */
    getCell(row, col, cellActionCb) {
        if (this.isCellInBounds(row, col)) {
            if (cellActionCb !== undefined) {
                cellActionCb(row, col, this.rows[row][col])
            }
            return this.rows[row][col]
        }

        return this.nullCellValue
    }

    /** sets the specified cell value or throws an out of bounds error */
    setCell(row, col, newCellValue, cellActionCb) {
        if (this.isCellInBounds(row, col)) {
            this.getCell(row, col, cellActionCb)
            this.rows[row][col] = newCellValue
            return this.getCell(row, col)
        }

        throw new Error(NaiveGridErrors.outOfBounds)
    }

    /** returns an ordered array of [west, north, east, south] neighbor cells */
    getCardinalNeighbors(row, col, cellActionCb) {
        const LEFT = col - 1
        const ABOVE = row - 1
        const RIGHT = col + 1
        const BELOW = row + 1

        const above = this.getCell(ABOVE, col, cellActionCb)
        const left = this.getCell(row, LEFT, cellActionCb)
        const right = this.getCell(row, RIGHT, cellActionCb)
        const below = this.getCell(BELOW, col, cellActionCb)

        return [left, above, right, below].filter(v => v != this.nullCellValue)
    }

    /** returns an ordered array of [NW, NE, SE, SW] neighbor cells */
    getOrdinalNeighbors(row, col, cellActionCb) {
        const LEFT = col - 1
        const ABOVE = row - 1
        const RIGHT = col + 1
        const BELOW = row + 1

        const aboveLeft = this.getCell(ABOVE, LEFT, cellActionCb)
        const aboveRight = this.getCell(ABOVE, RIGHT, cellActionCb)
        const belowLeft = this.getCell(BELOW, LEFT, cellActionCb)
        const belowRight = this.getCell(BELOW, RIGHT, cellActionCb)

        return [aboveLeft, aboveRight, belowRight, belowLeft].filter(
            v => v != this.nullCellValue
        )
    }

    /** returns an ordered array of neighbor cells [W, N, E, S, NW, NE, SE, SW] */
    getAllNeighbors(row, col, cellActionCb) {
        const cardinal = this.getCardinalNeighbors(row, col, cellActionCb)
        const ordinal = this.getOrdinalNeighbors(row, col, cellActionCb)

        return cardinal.concat(ordinal)
    }

    /**
     * inspects every cell in semi-radial quadrant flow.
     * throws an error if required inspectCellCb is not a function.
     *
     * eg, given quadrants
     * ```
     * ---------
     * | 1 | 2 |
     * ----M----
     * | 4 | 3 |
     * ---------
     * ```
     * traverses each quadrant starting from midpoint M
     * in the following order:
     *
     * - 1 2 3 4
     *
     * or NW, NE, SE, SW
     */
    traverseSemiRadially(inspectCellCb) {
        if (typeof inspectCellCb !== 'function') {
            throw new Error(inspectCellCbNonFunctionError)
        }

        const startRow = Math.floor(this.height / 2)
        const startCol = Math.floor(this.width / 2)

        // quadrant 1 -- contains midpoint column and row
        for (let row = startRow; row >= 0; row--) {
            for (let col = startCol; col >= 0; col--) {
                this.getCell(row, col, inspectCellCb)
            }
        }
        // quadrant 2 -- contains midpoint row, does not need to cover midpoint column
        for (let row = startRow; row >= 0; row--) {
            for (let col = startCol + 1; col < this.width; col++) {
                this.getCell(row, col, inspectCellCb)
            }
        }
        // quadrant 3 -- does not need to cover midpoint row or column
        for (let row = startRow + 1; row < this.height; row++) {
            for (let col = startCol + 1; col >= 0; col--) {
                this.getCell(row, col, inspectCellCb)
            }
        }
        // quadrant 4 -- does not need to cover midpoint row or column
        for (let row = startRow + 1; row < this.height; row++) {
            for (let col = startCol + 1; col < this.width; col++) {
                this.getCell(row, col, inspectCellCb)
            }
        }
    }

    /**
     * inspects every cell from top to bottom, left to right.
     * throws an error if required inspectCellCb is not a function.
     */
    traverse(inspectCellCb) {
        if (typeof inspectCellCb !== 'function') {
            throw new Error(inspectCellCbNonFunctionError)
        }

        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                this.getCell(row, col, inspectCellCb)
            }
        }
    }
}

module.exports = {
    NaiveGrid,
    NaiveGridErrors,
}
