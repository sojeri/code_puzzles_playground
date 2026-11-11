const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./12-1-solution')

describe('12-1-solution', () => {
    describe('solution', () => {
        it('should return 7 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/12-the-castasrophe/example.txt',
                    true
                ),
                7
            )
        })
        it('should return 230 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/12-the-castasrophe/input.txt',
                    true
                ),
                230
            )
        })
    })
})
