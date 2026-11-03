const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./06-2-solution')

describe('06-2-solution', () => {
    describe('solution', () => {
        it('should return 6 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/06-the-nullspiracy/example.txt',
                    true
                ),
                6
            )
        })
        it('should return 827 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/06-the-nullspiracy/input2.txt',
                    true
                ),
                827
            )
        })
    })
})
