const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./10-1-solution')

describe('10-1-solution', () => {
    describe('solution', () => {
        it('should return 29 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/10-the-phantasmagorithm/example.txt',
                    true
                ),
                29
            )
        })
        it('should return 50 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/10-the-phantasmagorithm/input.txt',
                    true
                ),
                50
            )
        })
    })
})
