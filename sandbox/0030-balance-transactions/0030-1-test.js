const assert = require('assert')
const { origSln, betterSolution, MESSAGES } = require('./0030-1-solution')

const IntentionallyNotImplementedTest = () => {}
describe('0030-1-solution', () => {
    const PROMPT_EXAMPLE_ACCOUNTS = { acct1: 130, acct2: 90, acct3: 120, acct4: 70 }
    describe('cases I used during interview (note it was actually console.log in coderpad at the time)', () => {
        it('should return [{acct1: {acct4: 30}}, {acct3: {acct2: 10}}] for example input', () => {
            assert.deepEqual(origSln(PROMPT_EXAMPLE_ACCOUNTS), [
                { acct1: { acct4: 30 } },
                { acct3: { acct2: 10 } },
            ])
        })
        it('should return `not satisfied` message for threshold too high', () => {
            const tooHighThreshold = origSln(PROMPT_EXAMPLE_ACCOUNTS, 150)
            assert.deepEqual(tooHighThreshold, MESSAGES.COULD_NOT_BE_SATISFIED)
        })
        it('should handle large account balances just fine', () => {
            const largeNumbers = origSln(
                {
                    acct1: 130 ** 130,
                    acct2: 90 ** 90,
                    acct3: 120 ** 120,
                    acct4: 70 ** 70,
                },
                75 ** 75
            )
            assert.notEqual(largeNumbers, MESSAGES.COULD_NOT_BE_SATISFIED)
            assert.equal(largeNumbers.length, 1)
        })
        describe('test cases discussed but explicitly not implemented during interview', () => {
            it.skip(
                'check very large list of transctions',
                IntentionallyNotImplementedTest
            )
            it.skip('confirm negative threshold result', IntentionallyNotImplementedTest)
        })
    })

    describe('edge cases I realized or implemented after the call ended', () => {
        it('should still return [{acct1: {acct4: 30}}, {acct3: {acct2: 10}}] for example input', () => {
            assert.deepEqual(betterSolution(PROMPT_EXAMPLE_ACCOUNTS), [
                { acct1: { acct4: 30 } },
                { acct3: { acct2: 10 } },
            ])
        })
        it('should still handle large account balances just fine', () => {
            const largeNumbers = betterSolution(
                {
                    acct1: 130 ** 130,
                    acct2: 90 ** 90,
                    acct3: 120 ** 120,
                    acct4: 70 ** 70,
                },
                75 ** 75
            )
            assert.notEqual(largeNumbers, MESSAGES.ACCOUNTS_ALREADY_OVER_THRESHOLD)
            assert.equal(largeNumbers.length, 1)
        })
        it('should return ALL insufficient funds message for threshold too high for all', () => {
            const tooHighThreshold = betterSolution(PROMPT_EXAMPLE_ACCOUNTS, 150)
            assert.deepEqual(tooHighThreshold, MESSAGES.INSUFFICIENT_FUNDS_ALL)
        })
        it('should return SOME insufficient funds message for threshold too high to finish balancing all', () => {
            const tooHighThreshold = betterSolution(PROMPT_EXAMPLE_ACCOUNTS, 110)
            assert.deepEqual(tooHighThreshold, MESSAGES.INSUFFICIENT_FUNDS_SOME)
        })
        it('should return `already over` message for low and negative thresholds', () => {
            const negativeThreshold = betterSolution(PROMPT_EXAMPLE_ACCOUNTS, -1)
            assert.deepEqual(negativeThreshold, MESSAGES.ACCOUNTS_ALREADY_OVER_THRESHOLD)

            const lowThreshold = betterSolution(PROMPT_EXAMPLE_ACCOUNTS, 50)
            assert.deepEqual(lowThreshold, MESSAGES.ACCOUNTS_ALREADY_OVER_THRESHOLD)
        })
        describe('long account lists', () => {
            const getRandomInt = val => Math.floor(Math.random() * val)
            function generateLongAccountList(threshold, howMany = 10_000) {
                const halfsies = Math.floor(threshold / 2)
                const accounts = {}
                for (let i = 1; i <= howMany; i++) {
                    accounts[`account${i}`] = halfsies + getRandomInt(threshold)
                }

                return accounts
            }
            const howManyAccounts = 100_000
            it('should not throw on long account list with small balance', () => {
                assert.doesNotThrow(() => {
                    const threshold = 100
                    const smallBalanceAccounts = generateLongAccountList(
                        threshold,
                        howManyAccounts
                    )
                    const result = betterSolution(smallBalanceAccounts, threshold)
                    assert.notEqual(result, undefined)
                })
            })

            it('should not throw on long account list with large balance', () => {
                assert.doesNotThrow(() => {
                    const threshold = 100 ** 100
                    const largeBalanceAccounts = generateLongAccountList(
                        threshold,
                        howManyAccounts
                    )
                    const result = betterSolution(largeBalanceAccounts, threshold)
                    assert.notEqual(result, undefined)
                })
            })
        })
    })
})
