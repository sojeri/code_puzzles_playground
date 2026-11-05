const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution, exampleSolution } = require('./07-3-solution')

describe('07-3-solution', () => {
    describe('solution', () => {
        it('should return 187 for first example input with no args', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    exampleSolution,
                    'everybody_codes/2026/07-the-explouding/example.txt',
                    true
                ),
                187
            )
        })
        it('should return 28_690_730 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/07-the-explouding/input3.txt',
                    true
                ),
                28_690_730
            )
        })
    })
})
