const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./07-2-solution')

describe('07-2-solution', () => {
    describe('solution', () => {
        it('should return 1_214_633 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/07-the-explouding/example2.txt',
                    true
                ),
                1_214_633
            )
        })
        it('should return 124_144_282 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/07-the-explouding/input2.txt',
                    true
                ),
                124_144_282
            )
        })
    })
})
