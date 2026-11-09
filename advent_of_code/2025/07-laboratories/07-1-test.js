const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./07-1-solution')

describe('07-1-solution', () => {
    describe('solution', () => {
        it('should return 21 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'advent_of_code/2025/07-laboratories/example.txt',
                    true
                ),
                21
            )
        })
        it('should return 1_635 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'advent_of_code/2025/07-laboratories/input.txt',
                    true
                ),
                1_635
            )
        })
    })
})
