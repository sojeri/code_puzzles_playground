// https://everybody.codes/event/2026/quests/10
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const { initialize, attemptMove, turnAround, CAVE } = require('./10-1-solution')
const SHOULD_ANIMATE = false
const verbosity = SHOULD_ANIMATE ? VERBOSITY.INFO : VERBOSITY.WARN
const logger = getLogger('ebc 2026 10 2', verbosity)

function solution(rawGrid, maxCollisions = 10) {
    const { nullghosts, grid } = initialize(rawGrid)
    const frames = [
        `\nRound 0                \nCollisions: N/A                    \n${grid.toString()}`,
    ]

    let round = 0
    while (nullghosts.allIds.size > 0) {
        round++
        const ghostsThisRound = {}

        // handle preliminary moves
        nullghosts.allIds.forEach(ngID => {
            const ghost = nullghosts[ngID]
            const probableMove = attemptMove(ghost, grid)
            const moveKey = `${probableMove.row}::${probableMove.col}`
            const ghostRoundInput = { ghost, probableMove }
            if (ghostsThisRound[moveKey] !== undefined) {
                ghostsThisRound[moveKey].push(ghostRoundInput)
            } else {
                ghostsThisRound[moveKey] = [ghostRoundInput]
            }
        })

        let roundCollisions = 0
        let ghostsStillStanding = 0
        // handle ghost collisions & save movements
        Object.values(ghostsThisRound).forEach(location => {
            const ghostsAtLocation = location.filter(
                ghostlyPresence => ghostlyPresence.probableMove.collisions < maxCollisions
            )
            ghostsStillStanding = ghostsAtLocation
            const hasMultipleGhosts = ghostsAtLocation.length > 1
            if (hasMultipleGhosts) roundCollisions += location.length

            let cellDetail
            location.forEach(ghostlyPresence => {
                const { ghost, probableMove } = ghostlyPresence
                roundCollisions += probableMove.wallCollision
                delete probableMove.wallCollision

                // clear out old display location if that won't delete another cute ghost
                const oldLocationKey = `${ghost.row}::${ghost.col}`
                if (ghostsThisRound[oldLocationKey] === undefined) {
                    grid.setCell(ghost.row, ghost.col, CAVE.EMPTY)
                }

                // clear ghost that has reached max hits
                if (probableMove.collisions >= maxCollisions) {
                    delete nullghosts[ghost.id]
                    nullghosts.allIds.delete(ghost.id)
                    if (cellDetail === undefined) {
                        cellDetail = { ...probableMove, value: CAVE.EMPTY }
                    }
                    return
                }

                // save new ghost location
                nullghosts[ghost.id] = { id: ghost.id, ...probableMove }
                if (hasMultipleGhosts) {
                    nullghosts[ghost.id].value = turnAround(probableMove.value)
                    nullghosts[ghost.id].collisions = probableMove.collisions + 1
                }

                // hoist move to update grid display only once per location (vs per ghost)
                cellDetail = probableMove
            })

            grid.setCell(
                cellDetail.row,
                cellDetail.col,
                hasMultipleGhosts ? ghostsAtLocation.length : cellDetail.value
            )
        })

        // no need to store 50,000 frames 😂
        if (SHOULD_ANIMATE) {
            const currentStandingGhosts = Array.from(nullghosts.allIds)
            frames.push(
                [
                    `\nRound ${round}    `,
                    `Ghosts: ${currentStandingGhosts.join()}    `,
                    grid.toString(),
                ].join('\n')
            )
        }
    }

    logger.animate(frames, 200)
    return round
}

module.exports = {
    solution,
}
