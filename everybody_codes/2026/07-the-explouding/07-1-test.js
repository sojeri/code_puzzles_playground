const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./07-1-solution')

describe('07-1-solution', () => {
    describe('solution', () => {
        it('should return 102 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/07-the-explouding/example.txt',
                    true
                ),
                102
            )
        })
        it('should return 257 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/07-the-explouding/input.txt',
                    true
                ),
                257
            )
        })
    })
})
