const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./06-3-solution')

describe('06-3-solution', () => {
    describe('solution', () => {
        it('should return 3 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/06-the-nullspiracy/example2.txt',
                    true
                ),
                3
            )
        })
        it('should return 1_633 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/06-the-nullspiracy/input3.txt',
                    true
                ),
                1_633
            )
        })
    })
})
