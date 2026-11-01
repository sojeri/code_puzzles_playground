const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./05-2-solution')

describe('05-2-solution', () => {
    describe('solution', () => {
        it('should still return land=137 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/05-the-cartograffity/example.txt',
                    true
                ).landCount,
                137
            )
        })
        it('should now also return sand=69 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/05-the-cartograffity/example.txt',
                    true
                ).sandCount,
                69
            )
        })
        it('should return landCount=10_404, sand=1_089 for puzzle input', () => {
            assert.deepEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/05-the-cartograffity/input2.txt',
                    true
                ),
                { landCount: 10_404, sandCount: 1_089 }
            )
        })
    })
})
