const assert = require('assert')
const runCallbackAgainstFile = require('../../../utils/js/runCbAgainstFileAsArray')
const { solution } = require('./08-2-solution')

describe('08-2-solution', () => {
    const dirSln = direction => input => solution(input, [direction])
    describe('single directions', () => {
        it('should still return 32 for example input and top-left', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    dirSln('top-left'),
                    'everybody_codes/2026/08-the-entgineering/example.txt',
                    true
                ),
                32
            )
        })
        it('should return 32 for example input and top-right', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    dirSln('top-right'),
                    'everybody_codes/2026/08-the-entgineering/example.txt',
                    true
                ),
                32
            )
        })
        it('should return 29 for example input and right', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    dirSln('right'),
                    'everybody_codes/2026/08-the-entgineering/example.txt',
                    true
                ),
                29
            )
        })
        it('should return 32 for example input and left', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    dirSln('left'),
                    'everybody_codes/2026/08-the-entgineering/example.txt',
                    true
                ),
                32
            )
        })
        it('should return 32 for example input and bottom-right', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    dirSln('bottom-right'),
                    'everybody_codes/2026/08-the-entgineering/example.txt',
                    true
                ),
                32
            )
        })
        it('should return 30 for example input and bottom-left', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    dirSln('bottom-left'),
                    'everybody_codes/2026/08-the-entgineering/example.txt',
                    true
                ),
                30
            )
        })
    })
    describe('solution', () => {
        it('should return 187 for example input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/08-the-entgineering/example.txt',
                    true
                ),
                187
            )
        })
        it('should return 1_080 for puzzle input', () => {
            assert.strictEqual(
                runCallbackAgainstFile(
                    solution,
                    'everybody_codes/2026/08-the-entgineering/input.txt',
                    true
                ),
                1_080
            )
        })
    })
})
