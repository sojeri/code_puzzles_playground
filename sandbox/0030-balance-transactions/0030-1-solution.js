const ORIG_NOT_POSSIBLE_MESSAGE =
    'sorry this account + threshold set could not be satisfied'

/**
 * Write a function to help maintains a set of internal accounts, which need to stay at or above some threshold.
 *
 * Task: Build a planner function which takes in a collection of accounts and prints a list of transfers to be made by the caller.
 *
 * Example:
 *
 * Let's say our threshold is 100, and some of our bank accounts' balances are above and some are below that threshold.
 * How do you transfer money between them so that they all have at least 100?
 *
 * Current account balances:
 * - Acct1: 130
 * - Acct2: 90
 * - Acct3: 120
 * - Acct4: 70
 *
 * Potential Output:
 * - Acct1 -> Acct2: 10
 * - Acct1 -> Acct4: 20
 * - Acct3 -> Acct4: 10
 *
 * Problem:
 * Implement a function that takes two inputs:
 * - accounts (dictionary/map)
 * - threshold (integer)
 *
 * And prints out the transfers you would make to make the accounts meet the threshold.
 *
 * end of interview callouts:
 * - runtime complexity: n log n
 * - space complexity: n
 */
function origSln(accounts, threshold = 100) {
    const output = []

    // n log n
    const ascending = Object.keys(accounts).sort((a, b) => {
        return accounts[a] - accounts[b]
    })

    let l = 0
    let low = accounts[ascending[l]]
    let lowNeeds = threshold - low
    for (let h = ascending.length - 1; h >= 0; h--) {
        let leftover = accounts[ascending[h]] - threshold

        while (leftover > 0 && l < ascending.length && lowNeeds > 0) {
            const valueMoved = lowNeeds <= leftover ? lowNeeds : leftover
            const transaction = { [ascending[h]]: { [ascending[l]]: valueMoved } }
            output.push(transaction)
            leftover -= valueMoved
            lowNeeds -= valueMoved

            if (lowNeeds === 0) {
                l++
                low = accounts[ascending[l]]
                lowNeeds = threshold - low
            }
        }
    }

    return output.length > 0 ? output : ORIG_NOT_POSSIBLE_MESSAGE
}

/** added for @see betterSolution, not during the interview */
const MESSAGES = {
    INSUFFICIENT_FUNDS_ALL: 'all accounts below the threshold',
    INSUFFICIENT_FUNDS_SOME: 'some accounts could not be satisfied',
    COULD_NOT_BE_SATISFIED: ORIG_NOT_POSSIBLE_MESSAGE,
    ACCOUNTS_ALREADY_OVER_THRESHOLD: 'all accounts already over the threshold',
}

/**
 * a better version of @see origSln
 * with better error string output
 *
 * algorithm complexity:
 * - runtime: `n log n` simple, `3n log n` if we're not rounding
 * - space: `n` simple, `2n` if we're not rounding
 */
function betterSolution(accounts, threshold = 100) {
    // SPACE: worst case would be n
    // if one account has all the funds, we'd need one transaction for each other record
    const output = []

    // SPACE: n. technically slightly less than n since it's just the key, not the full account info
    // RUNTIME: [].sort n log n (+ n from Object.keys)
    const ascending = Object.keys(accounts).sort((a, b) => accounts[a] - accounts[b])

    // SPACE: constant, disregarding because we already have n or 2n
    let l = 0
    let low = accounts[ascending[l]]
    let lowNeeds = threshold - low
    if (lowNeeds <= 0) return MESSAGES.ACCOUNTS_ALREADY_OVER_THRESHOLD

    // SPACE: constant, disregarding
    // RUNTIME: (additional + 2n from l and h loops -- only one complete iteration of each counter)
    for (let h = ascending.length - 1; h >= 0; h--) {
        let leftover = accounts[ascending[h]] - threshold

        while (leftover > 0 && l < ascending.length && lowNeeds > 0) {
            const valueMoved = lowNeeds <= leftover ? lowNeeds : leftover
            const transaction = { [ascending[h]]: { [ascending[l]]: valueMoved } }
            output.push(transaction)
            leftover -= valueMoved
            lowNeeds -= valueMoved

            if (lowNeeds === 0) {
                l++
                low = accounts[ascending[l]]
                lowNeeds = threshold - low
            }
        }
    }

    const lowStillNeedsFunds = low < threshold && lowNeeds > 0
    if (lowStillNeedsFunds) {
        return output.length > 0
            ? MESSAGES.INSUFFICIENT_FUNDS_SOME
            : MESSAGES.INSUFFICIENT_FUNDS_ALL
    }

    return output
}

module.exports = {
    MESSAGES,
    origSln,
    betterSolution,
}
