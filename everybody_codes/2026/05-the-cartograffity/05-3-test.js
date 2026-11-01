const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./05-3-solution')

describe('05-3-solution', () => {
    describe('solution', () => {
        const sharedExampleOutput = runCallbackAgainstFile(
            solution,
            'everybody_codes/2026/05-the-cartograffity/example.txt',
            true
        )
        it('should still return land=137 for example input', () => {
            assert.strictEqual(sharedExampleOutput.landCount, 137)
        })
        it('should still return sand=69 for example input', () => {
            assert.strictEqual(sharedExampleOutput.sandCount, 69)
        })
        it('should now also return trees=14 for example input', () => {
            assert.strictEqual(sharedExampleOutput.treeCount, 14)
        })
        it('should return land=10_404, sand=1_089, trees=8_098 for part 1 input', () => {
            assert.deepEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/05-the-cartograffity/input.txt',
                    true
                ),
                {
                    landCount: 1_226,
                    sandCount: 314,
                    treeCount: 524,
                }
            )
        })
        it('should return land=10_404, sand=1_089, trees=8_098 for part 2 input', () => {
            assert.deepEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/05-the-cartograffity/input2.txt',
                    true
                ),
                {
                    landCount: 10_404,
                    sandCount: 1_089,
                    treeCount: 8_098,
                }
            )
        })
        it('should return land=20_840, sand=5_328, trees=9_493 for puzzle input', () => {
            assert.deepEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/05-the-cartograffity/input3.txt',
                    true
                ),
                {
                    landCount: 20_840,
                    sandCount: 5_328,
                    treeCount: 9_493,
                }
            )
        })
    })
})
