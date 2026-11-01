const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./04-2-solution')

describe('04-2-solution', () => {
    describe('solution', () => {
        it('should return 43 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'advent_of_code/2025/04-printing-department/example.txt',
                    true
                ),
                43
            )
        })
        it('should return 8_739 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'advent_of_code/2025/04-printing-department/input.txt',
                    true
                ),
                8_739
            )
        })
    })
})
