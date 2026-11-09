const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./07-2-solution')

describe.skip('07-2-solution', () => {
    describe('solution', () => {
        it('should return 40 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'advent_of_code/2025/07-laboratories/example.txt',
                    true
                ),
                40
            )
        })
        it('should return -1 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'advent_of_code/2025/07-laboratories/input.txt',
                    true
                ),
                -1
            )
        })
    })
})
