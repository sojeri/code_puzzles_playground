const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./08-1-solution')

describe('08-1-solution', () => {
    describe('solution', () => {
        it('should return 32 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/08-the-entgineering/example.txt',
                    true
                ),
                32
            )
        })
        it('should return 188 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/08-the-entgineering/input.txt',
                    true
                ),
                188
            )
        })
    })
})
