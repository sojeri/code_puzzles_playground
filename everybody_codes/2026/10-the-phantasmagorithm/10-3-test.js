const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./10-3-solution')

// it's been finishing in about 1-2 minutes, but leaving 5 for safety
const FIVE_MINUTES_MS = 6 * 60 * 60 * 1_000
describe('10-3-solution', function () {
    this.timeout(FIVE_MINUTES_MS)
    const getSln = size => input => solution(input, size)
    const size10 = getSln(10)
    const size10_000 = getSln(10_000)
    describe('part 2 answers again', () => {
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
    const size_watwatwatwatwat = getSln(1_000_000_000_000)
    describe('part 3 madness', () => {
        it('should return 13_314_695_352_588 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    size_watwatwatwatwat,
                    'everybody_codes/2026/10-the-phantasmagorithm/example2.txt',
                    true
                ),
                13_314_695_352_588
            )
        })
        it('should return 13_854_910_713_927 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    size_watwatwatwatwat,
                    'everybody_codes/2026/10-the-phantasmagorithm/input3.txt',
                    true
                ),
                13_854_910_713_927
            )
        })
    })
})
