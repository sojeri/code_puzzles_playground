const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./05-1-solution')

describe('05-1-solution', () => {
    describe('solution', () => {
        it('should also return 137 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/05-the-cartograffity/example.txt',
                    true
                ),
                137
            )
        })
        it('should return 1_226 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/05-the-cartograffity/input.txt',
                    true
                ),
                1_226
            )
        })
    })
})
