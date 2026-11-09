// https://everybody.codes/event/2026/quests/10
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const { ascendingSort } = require('../../../utils/js/sorts')
const { initialize, attemptMove, turnAround, DIRECTIONS } = require('./10-1-solution')
const logger = getLogger('ebc 2026 10 3')

const CACHED = {
    GHOST_KEY: 1,
    GRID_KEY: 2,
    SCORE: 3,
}
const wantedDeadOrAlive = id => {
    const { nullghosts, deceased } = getGhostData()
    return nullghosts[id] || deceased[id]
}
const RIP = { row: -1, col: -1, value: '🩻' }

const cachedData = {}
const getCachedGhostValue = (ghost, what) => {
    const { row, col, id, value } = ghost
    const ghostData = getGhostData()
    if (ghostData.deceased[id]) return -1

    if (!cachedData[row]) cachedData[row] = { score: row * 10_000 }
    if (!cachedData[row][col]) {
        cachedData[row][col] = {
            score: cachedData[row].score + col * 100,
            key: `${row},${col}`,
        }
    }
    if (what === CACHED.GRID_KEY) return cachedData[row][col].key

    if (!cachedData[row][col][value]) {
        const dirIndex = DIRECTIONS.indexOf(value)
        cachedData[row][col][value] = {
            score: cachedData[row][col].score + dirIndex * 5,
        }
    }
    if (!cachedData[row][col][value][id]) {
        cachedData[row][col][value][id] = {
            score: cachedData[row][col][value].score + id,
            key: `${id}[${row},${col},${value}]`,
        }
    }
    if (what === CACHED.SCORE) return cachedData[row][col][value][id].score
    if (what === CACHED.GHOST_KEY) return cachedData[row][col][value][id].score
}
const getGridStateCollisions = round => {
    const data = getGhostData()
    let totalCollisions = 0
    const perGhostCollisions = data.origIds.map(id => {
        const ghost = wantedDeadOrAlive(id)
        totalCollisions += ghost.collisions
        return { id, collisions: ghost.collisions }
    })

    return { perGhostCollisions, totalCollisions, round }
}
const getGridStateKey = () => {
    const data = getGhostData()
    return data.origIds
        .map(id => getCachedGhostValue(wantedDeadOrAlive(id), CACHED.SCORE))
        .sort(ascendingSort)
}

const getColl = (gridState, i) => gridState.perGhostCollisions[i].collisions
const getId = (gridState, i) => gridState.perGhostCollisions[i].id
const getPrelimCycleInfo = (gridStates, key, SKIPS) => {
    const state = gridStates[key]
    const first = state.collisions[state.visited[0]]
    const second = state.collisions[state.visited[1]]
    const third = state.collisions[state.visited[2]]

    if (!first.cycle) {
        first.cycle = {}
    }

    if (!first.cycle.size) {
        const firstRoundNum = Number(state.visited[0])
        const secondRoundNum = Number(state.visited[1])
        first.cycle.size = secondRoundNum - firstRoundNum
    }

    if (first.cycle.isCycle === undefined) {
        const firstCycleTotal = second.totalCollisions - first.totalCollisions
        const secondCycleTotal = third.totalCollisions - second.totalCollisions
        first.cycle.isCycle = firstCycleTotal === secondCycleTotal

        const skips = {}
        for (let i = 0; i < first.perGhostCollisions.length && first.cycle.isCycle; i++) {
            const id = getId(second, i)
            const diffOne = getColl(second, i) - getColl(first, i)
            const diffTwo = getColl(third, i) - getColl(second, i)
            first.cycle.isCycle = first.cycle.isCycle && diffOne === diffTwo
            skips[id] = {}
            SKIPS.forEach(size => {
                skips[id][size] = diffOne * size
            })
        }
        first.cycle.skips = skips
    }

    return first.cycle
}

const getCycleSkip = (gridStates, key, nullghosts, limit, SKIPS) => {
    const cycle = getPrelimCycleInfo(gridStates, key, SKIPS)
    if (!cycle.isCycle) {
        return { whichSkip: 0, canSkip: false, skips: {}, adjustedSize: 0 }
    }

    const state = gridStates[key]
    const first = state.collisions[state.visited[0]]
    let currentSkipIndex = 0
    let currentSkip = SKIPS[currentSkipIndex]
    let canSkip = true

    for (let i = 0; i < first.perGhostCollisions.length && canSkip; i++) {
        const id = getId(first, i)
        const idSkips = cycle.skips[id]
        if (nullghosts.allIds.has(id)) {
            const currentColls = nullghosts[id].collisions
            while (
                currentSkipIndex < SKIPS.length &&
                currentColls + idSkips[currentSkip] >= limit
            ) {
                currentSkipIndex += 1
                currentSkip = SKIPS[currentSkipIndex]
            }
            canSkip = canSkip && currentColls + idSkips[currentSkip] < limit
        }
    }

    return {
        whichSkip: currentSkip,
        canSkip,
        skips: cycle.skips,
        adjustedSize: cycle.size * currentSkip,
    }
}

const generateSkips = limit => {
    const skips = []
    for (let skip = 1; skip < limit; skip *= 10 ** (skips.length > 2 ? 2 : 1)) {
        skips.unshift(skip)
    }
    return skips
}

let getGhostData
function solution(rawGrid, maxCollisions = 10) {
    const { nullghosts, grid } = initialize(rawGrid)
    const origIds = [...nullghosts.allIds]
    const deceased = {}
    getGhostData = () => ({ nullghosts, origIds, deceased })
    const seenGridStates = {}
    let round = 0
    const SKIPS = generateSkips(maxCollisions)
    const skipsStats = {}
    SKIPS.forEach(skip => {
        skipsStats[skip] = 0
    })

    logger.info('Starting Main Computation', new Date().toLocaleTimeString())
    while (nullghosts.allIds.size > 0) {
        round++
        const ghostsThisRound = {}

        // handle preliminary moves
        nullghosts.allIds.forEach(id => {
            const ghost = nullghosts[id]
            const move = attemptMove(ghost, grid)
            const moveKey = getCachedGhostValue(move, CACHED.GRID_KEY)
            const ghostRoundInput = { ghost, move }
            if (ghostsThisRound[moveKey] !== undefined) {
                ghostsThisRound[moveKey].push(ghostRoundInput)
            } else {
                ghostsThisRound[moveKey] = [ghostRoundInput]
            }
        })

        // handle ghost collisions & save movements
        Object.values(ghostsThisRound).forEach(location => {
            const ghostsAtLocation = location.filter(
                ghostlyPresence => ghostlyPresence.move.collisions < maxCollisions
            ).length

            location.forEach(gp => {
                delete gp.move.wallCollision
                const id = gp.ghost.id

                // clear ghost that has reached max hits
                if (gp.move.collisions >= maxCollisions) {
                    deceased[id] = { id, ...RIP }
                    deceased[id].collisions = gp.move.collisions
                    deceased[id].round = round
                    delete nullghosts[id]
                    nullghosts.allIds.delete(id)
                    return
                }

                // save new ghost location
                nullghosts[id] = { id, ...gp.move }
                if (ghostsAtLocation > 1) {
                    nullghosts[id].value = turnAround(gp.move.value)
                    nullghosts[id].collisions = gp.move.collisions + 1
                }
            })
        })

        const gridStateKey = getGridStateKey()
        if (seenGridStates[gridStateKey] === undefined) {
            seenGridStates[gridStateKey] = {
                visited: [round],
                collisions: {
                    [round]: getGridStateCollisions(round),
                },
            }
        } else if (seenGridStates[gridStateKey].visited.length < 3) {
            seenGridStates[gridStateKey].visited.push(round)
            seenGridStates[gridStateKey].collisions[round] = getGridStateCollisions(round)
        }

        if (seenGridStates[gridStateKey].visited.length > 2) {
            const cycle = getCycleSkip(
                seenGridStates,
                gridStateKey,
                nullghosts,
                maxCollisions,
                SKIPS
            )
            if (cycle.canSkip) {
                round += cycle.adjustedSize
                skipsStats[cycle.whichSkip]++
                nullghosts.allIds.forEach(id => {
                    nullghosts[id].collisions += cycle.skips[id][cycle.whichSkip]
                })
            }
        }
    }

    logger.info('Computation finished', new Date().toLocaleTimeString())
    logger.info('Skips Used:', SKIPS.map(s => `${s}=${skipsStats[s]}`).join(','))
    logger.info('Result', round.toLocaleString())
    return round
}

module.exports = {
    solution,
}
