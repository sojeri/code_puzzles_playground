const assert = require('assert')
const { NaiveGrid } = require('../js/grid')

describe('NaiveGrid', () => {
    describe('new NaiveGrid()', () => {
        it('requires a {rawGrid} Array of Arrays or strings', () => {
            assert.doesNotThrow(() => {
                new NaiveGrid({
                    rawGrid: ['string data'],
                })
                new NaiveGrid({
                    rawGrid: [
                        ['nested', 'matrix', 'data'],
                        [1, 2, 3],
                        ['no', 'type', 'checking'],
                    ],
                })
            })
            assert.throws(() => {
                new NaiveGrid()
            })
            assert.throws(() => {
                new NaiveGrid(["this isn't the required rawGrid named arg"])
            })
            assert.throws(() => {
                new NaiveGrid({ rawGrid: () => {} })
            })
            assert.throws(() => {
                new NaiveGrid({ rawGrid: [] })
            })
        })
        it('sets appropriate size fields', () => {
            const grid = new NaiveGrid({
                rawGrid: ['hello', 'world'],
            })
            assert.strictEqual(grid.height, 2)
            assert.strictEqual(grid.width, 5)
        })
    })
    describe('toString()', () => {
        it('should return `hello\nworld` for simple grid.toString()', () => {
            const grid = new NaiveGrid({
                rawGrid: ['hello', 'world'],
            })
            assert.strictEqual(grid.toString(), 'hello\nworld')
        })
        it('should return `h-e-l-l-o-\nw-o-r-l-d-` for grid.toString() with cell transformer', () => {
            const grid = new NaiveGrid({
                rawGrid: ['hello', 'world'],
                cellToStringCb: cell => `${cell}-`,
            })
            assert.strictEqual(grid.toString(), 'h-e-l-l-o-\nw-o-r-l-d-')
        })
    })
    describe('getCell()', () => {
        it('should return the value at the specified cell', () => {
            const grid = new NaiveGrid({
                rawGrid: ['ABC', 'DEF', 'GHI'],
            })
            const first = grid.getCell(2, 2)
            const second = grid.getCell(1, 0)
            const third = grid.getCell(1, 1)
            const fourth = grid.getCell(0, 0)
            assert.strictEqual(first, 'I')
            assert.strictEqual(second, 'D')
            assert.strictEqual(third, 'E')
            assert.strictEqual(fourth, 'A')
        })
        describe('out of bounds access', () => {
            it('should return null for out of bounds grid.getCell', () => {
                const grid = new NaiveGrid({
                    rawGrid: ['hello', 'world'],
                })
                assert.strictEqual(grid.getCell(75, -1), null)
            })
            it('should return specified null cell value for out of bounds grid.getCell', () => {
                const grid = new NaiveGrid({
                    rawGrid: ['hello', 'world'],
                    nullCellValue: 'placeholder value',
                })
                assert.deepEqual(grid.getCell(75, -1), 'placeholder value')
            })
            it('should NOT return the exact object null cell value for out of bounds grid.getCell', () => {
                const exactObj = { value: -1 }
                const grid = new NaiveGrid({
                    rawGrid: ['hello', 'world'],
                    nullCellValue: exactObj,
                })
                assert.deepEqual(grid.getCell(75, -1), exactObj)
                assert.notStrictEqual(grid.getCell(75, -1), exactObj)
            })
        })
        describe('optional cellActionCb', () => {
            it('takes an optional callback which can further inspect or modify cell data', () => {
                const grid = new NaiveGrid({
                    rawGrid: ['ABC', 'DEF', 'GHI'],
                })
                const cellBefore = grid.getCell(1, 1)
                assert.strictEqual(cellBefore, 'E')

                const modifyCellCb = (row, col, cell) => {
                    grid.setCell(row, col, `${cell} is for elephant`)
                }
                const cellWithModifyCb = grid.getCell(1, 1, modifyCellCb)
                assert.strictEqual(cellWithModifyCb, 'E is for elephant')

                const permanentlyMutatedCell = grid.getCell(1, 1)
                assert.strictEqual(permanentlyMutatedCell, 'E is for elephant')
            })
        })
    })
    describe('setCell()', () => {
        it('sets the specified cell value', () => {
            const grid = new NaiveGrid({
                rawGrid: ['123', '466', '789'],
            })
            assert.deepEqual(grid.getCell(1, 1), '6')

            grid.setCell(1, 1, '5')
            assert.deepEqual(grid.getCell(1, 1), '5')
        })
        describe('out of bounds access', () => {
            it('should throw an error for out of bounds access', () => {
                const grid = new NaiveGrid({
                    rawGrid: ['123', '456', '789'],
                })
                assert.throws(() => {
                    grid.setCell(3, 0, '10')
                })
            })
        })
    })
    describe('get neighbor methods', () => {
        const sharedAlphabetGrid = new NaiveGrid({
            rawGrid: [
                //012 col
                'ABC', // arranged
                'DEF', // for ease of
                'GHI', //  grid comparison
            ],
        })

        describe('getAllNeighbors', () => {
            it('should return all 8 neighbors should they exist in bounds', () => {
                const neighbors = sharedAlphabetGrid.getAllNeighbors(1, 1)
                assert.deepEqual(neighbors, ['D', 'B', 'F', 'H', 'A', 'C', 'I', 'G'])
            })
            it('should return remaining neighbors should some be out of bounds', () => {
                const neighbors = sharedAlphabetGrid.getAllNeighbors(0, 0)
                assert.deepEqual(neighbors, ['B', 'D', 'E'])
            })
        })

        describe('getCardinalNeighbors', () => {
            it('should return all 4 neighbors should they exist', () => {
                const neighbors = sharedAlphabetGrid.getCardinalNeighbors(1, 1)
                assert.deepEqual(neighbors, ['D', 'B', 'F', 'H'])
            })
            it('should return remaining neighbors should some be out of bounds', () => {
                const neighbors = sharedAlphabetGrid.getCardinalNeighbors(0, 0)
                assert.deepEqual(neighbors, ['B', 'D'])
            })
        })

        describe('getOrdinalNeighbors', () => {
            it('should return all 4 neighbors should they exist', () => {
                const neighbors = sharedAlphabetGrid.getOrdinalNeighbors(1, 1)
                assert.deepEqual(neighbors, ['A', 'C', 'I', 'G'])
            })
            it('should return remaining neighbors should some be out of bounds', () => {
                const neighbors = sharedAlphabetGrid.getOrdinalNeighbors(0, 0)
                assert.deepEqual(neighbors, ['E'])
            })
        })
    })
    describe.skip('traversal methods', () => {
        describe('traverse', () => {
            it('throws an error if no inspectCellCb is provided', () => {
                // TODO: implement!
            })
            it('traverses top to bottom, left to right', () => {
                // TODO: implement!
            })
            it('only visits each cell once per cycle', () => {
                // TODO: implement!
            })
        })
        describe('traverseSemiRadially', () => {
            it('throws an error if no inspectCellCb is provided', () => {
                // TODO: implement!
            })
            it('traverses quadrant by quadrant', () => {
                // TODO: implement!
            })
            it('only visits each cell once per cycle', () => {
                // TODO: implement!
            })
        })
    })
})
