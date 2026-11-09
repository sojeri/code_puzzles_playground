const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./10-2-solution')

describe('10-2-solution', () => {
    const getSln = size => input => solution(input, size)
    const size10 = getSln(10)
    const size10_000 = getSln(10_000)
    describe('solution', () => {
        it('should return 53 for example input and 10 collisions', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    size10,
                    'everybody_codes/2026/10-the-phantasmagorithm/example.txt',
                    true
                ),
                53
            )
        })
        it('should return 50_000 for example input and 10_000', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    size10_000,
                    'everybody_codes/2026/10-the-phantasmagorithm/example.txt',
                    true
                ),
                50_000
            )
        })
        it('should return 136_753 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    size10_000,
                    'everybody_codes/2026/10-the-phantasmagorithm/input2.txt',
                    true
                ),
                136_753
            )
        })
    })
})
