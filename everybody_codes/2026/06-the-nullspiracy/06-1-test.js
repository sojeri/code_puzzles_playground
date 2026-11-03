const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./06-1-solution')

describe('06-1-solution', () => {
    describe('solution', () => {
        it('should return 7 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/06-the-nullspiracy/example.txt',
                    true
                ),
                7
            )
        })
        it('should return 50 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/06-the-nullspiracy/input.txt',
                    true
                ),
                50
            )
        })
    })
})
