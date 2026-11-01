const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./04-1-solution')

describe('04-1-solution', () => {
    describe('solution', () => {
        it('should return 13 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'advent_of_code/2025/04-printing-department/example.txt',
                    true
                ),
                13
            )
        })
        it('should return 1_419 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'advent_of_code/2025/04-printing-department/input.txt',
                    true
                ),
                1_419
            )
        })
    })
})
