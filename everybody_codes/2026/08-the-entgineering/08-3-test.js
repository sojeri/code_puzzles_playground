const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./08-3-solution')

describe('08-3-solution', () => {
    describe('solution', () => {
        it('should return 100_000,899_889,32_008 for example input', () => {
            const result = runCallbackAgainstFile(
                solution,
                'everybody_codes/2026/08-the-entgineering/example.txt',
                true
            )
            const { totalNewWarriors, totalEnergyNeeded, round } = result
            assert.strictEqual(totalEnergyNeeded, 899_889)
            assert.strictEqual(round, 32_008)
            assert.strictEqual(totalNewWarriors, 100_000)
        })
        it('should return 100_010,899_280,6_020 for puzzle input', () => {
            const result = runCallbackAgainstFile(
                solution,
                'everybody_codes/2026/08-the-entgineering/input2.txt',
                true
            )
            const { totalNewWarriors, totalEnergyNeeded, round } = result
            assert.strictEqual(totalEnergyNeeded, 899_280)
            assert.strictEqual(totalNewWarriors, 100_010)
            assert.strictEqual(round, 6_020)
        })
    })
})
