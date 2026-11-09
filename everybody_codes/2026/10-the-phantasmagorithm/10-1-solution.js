// https://everybody.codes/event/2026/quests/10
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const { NaiveGrid } = require('../../../utils/js/grid')
const logger = getLogger('ebc 2026 10 1')

const CAVE = {
    EMPTY: '.',
    WALL: '#',
    NULLGHOST_LEFT: '<',
    NULLGHOST_RIGHT: '>',
    NULLGHOST_UP: '^',
    NULLGHOST_DOWN: 'v',
}

const isWall = cell => cell === CAVE.WALL
const isEmpty = cell => cell === CAVE.EMPTY
const isNullghost = cell =>
    cell === CAVE.NULLGHOST_LEFT ||
    cell === CAVE.NULLGHOST_RIGHT ||
    cell === CAVE.NULLGHOST_UP ||
    cell === CAVE.NULLGHOST_DOWN

/** clockwise */
const DIRECTIONS = [
    CAVE.NULLGHOST_LEFT,
    CAVE.NULLGHOST_UP,
    CAVE.NULLGHOST_RIGHT,
    CAVE.NULLGHOST_DOWN,
]

const turnClockwise = direction => {
    const dirIndex = DIRECTIONS.indexOf(direction)
    const nextDirIndex = (dirIndex + 1) % DIRECTIONS.length
    return DIRECTIONS[nextDirIndex]
}
const turnAround = direction => {
    const dirIndex = DIRECTIONS.indexOf(direction)
    const nextDirIndex = (dirIndex + 2) % DIRECTIONS.length
    return DIRECTIONS[nextDirIndex]
}
const attemptMove = (ghost, grid) => {
    let row = -1
    let col = -1
    switch (ghost.value) {
        case CAVE.NULLGHOST_DOWN:
            row = ghost.row + 1
            col = ghost.col
            break
        case CAVE.NULLGHOST_UP:
            row = ghost.row - 1
            col = ghost.col
            break
        case CAVE.NULLGHOST_LEFT:
            row = ghost.row
            col = ghost.col - 1
            break
        case CAVE.NULLGHOST_RIGHT:
            row = ghost.row
            col = ghost.col + 1
            break
    }

    const probableNextCell = grid.getCell(row, col)
    if (isWall(probableNextCell)) {
        return {
            col: ghost.col,
            row: ghost.row,
            wallCollision: 1,
            value: turnClockwise(ghost.value),
            collisions: ghost.collisions + 1,
        }
    }

    return {
        row,
        col,
        value: ghost.value,
        wallCollision: 0,
        collisions: ghost.collisions,
    }
}

const initialize = rawGrid => {
    const nullghosts = {
        allIds: new Set(),
    }
    const printCell = cell => {
        if (isEmpty(cell)) return '   '
        if (isWall(cell)) return '🧱|'
        return `👻${cell}`
    }

    let ghostId = 1
    const grid = new NaiveGrid({
        rawGrid,
        cellParserCb: (value, row, col) => {
            if (isNullghost(value)) {
                const id = ghostId++
                nullghosts[id] = { id, row, col, value, collisions: 0 }
                nullghosts.allIds.add(id)
            }
            return value
        },
        cellToStringCb: printCell,
        nullCellValue: CAVE.WALL,
    })

    return {
        /**
         * cave grid dispay
         * @see NaiveGrid
         */
        grid,
        /**
         * collection of:
         * ```
         * id => { id, row, col, value(aka direction) }
         * ```
         * plus root level set of all IDs
         */
        nullghosts,
    }
}

function solution(rawGrid, rounds = 10) {
    const { nullghosts, grid } = initialize(rawGrid)
    const frames = [
        `\nRound 0                \nCollisions: N/A                    \n${grid.toString()}`,
    ]

    let totalCollisions = 0
    for (let round = 0; round < rounds; round++) {
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
        // handle ghost collisions & save movements
        Object.values(ghostsThisRound).forEach(location => {
            const hasMultipleGhosts = location.length > 1
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

                // save new ghost location
                nullghosts[ghost.id] = {
                    id: ghost.id,
                    ...probableMove,
                    value: hasMultipleGhosts
                        ? turnAround(probableMove.value)
                        : probableMove.value,
                }

                // hoist move to update grid display only once per location (vs per ghost)
                cellDetail = probableMove
            })

            grid.setCell(
                cellDetail.row,
                cellDetail.col,
                hasMultipleGhosts ? location.length : cellDetail.value
            )
        })

        totalCollisions += roundCollisions
        frames.push(
            `\nRound ${round + 1}    \nCollisions: ${roundCollisions}    \n${grid.toString()}`
        )
    }

    logger.animate(frames)

    return totalCollisions
}

module.exports = {
    solution,
    initialize,
    CAVE,
    isEmpty,
    isNullghost,
    isWall,
    DIRECTIONS,
    attemptMove,
    turnClockwise,
    turnAround,
}

/*

Part I

Story section

The Ents finally began their assault on Nulldor. They marched straight towards the fortress from the front, making enough noise to ensure that every guard inside knew exactly where to look.

While all that attention was focused on them, we slipped away towards a network of old caves nearby. According to our maps, the tunnels eventually led beneath Nulldor and connected with forgotten passages under the fortress.

Getting inside the caves was easy. Getting through them was not. We soon discovered that the tunnels were guarded by a very strange kind of magical creature.

We called them Nullghosts. They drifted through the caves in different directions, changing course whenever something blocked their way and behaving even more strangely when they ran into one another.

If we wanted to reach Nulldor without attracting any more attention than necessary, we first had to understand exactly how these creatures moved.

After watching the Nullghosts for a while, we noticed something useful. Every collision made them fade a little. The more collisions a Nullghost experienced during its wandering, the weaker and less visible it became. If we could understand how often they collided, perhaps getting past them would not be so difficult.

We mapped the part of the caves ahead of us and marked the positions of all the Nullghosts ( your notes ).

The map used the following symbols:

 . empty space
 # cave wall
 > Nullghost moving right
 < Nullghost moving left
 ^ Nullghost moving up
 v Nullghost moving down

The Nullghosts moved in rounds. During each round, every Nullghost tried to move one space in its current direction. All of them moved at the same time. If a Nullghost tried to move into a

 # 

wall, it stayed where it was and turned 90 degrees clockwise. Each Nullghost that hit a wall counted as one collision. In the example below, both hit a wall during the move from Round 2 to Round 3, causing two collisions in total:

Round 1   Round 2   Round 3   Round 4
.....     .....     .....     ...^.
>.#.<     .>#<.     .v#^.     ..#..
.....     .....     .....     .v...

Collisions between Nullghosts worked differently. They were checked only after every Nullghost had finished its movement for the round. If two or more Nullghosts then occupied the same space, each of them turned around exactly once (a 180-degree turn), regardless of how many Nullghosts shared that space. Each Nullghost involved counted as one collision, so a group of 2, 3 or 4 caused 2, 3 or 4 collisions in total, respectively. For example, the three Nullghosts below finish the round on the same space. Each counts as one collision, so they cause three collisions in total:

Round 1   Round 2   Round 3
...v...   .......   ...^...
..>.<..   ...3...   ..<.>..
.......   .......   .......

This also meant that Nullghosts could sometimes pass straight through one another without colliding. For example, two Nullghosts moving towards each other from neighbouring spaces could swap places during a round without colliding, because they finished the round on different spaces:

Round 1   Round 2   Round 3   Round 4
......    ......    ......    ......
.>..<.    ..><..    ..<>..    .<..>.
......    ......    ......    ......

We watched them for exactly

 10 

rounds to find the total number of collisions during that time.
Example based on the following notes:

###########
#####.#####
###.....###
##.......##
##.>>.<<.##
#v...>...v#
##...v...##
##.......##
###.....###
#####.#####
###########

The maps below show what happened during the next

 10 

rounds. If several Nullghosts occupied the same space at the end of a round, a digit represented the number of Nullghosts on that space. Any Nullghosts involved in a collision are shown in bold.

Round: 1
Collisions: 4

###########
#####.#####
###.....###
##.......##
##..>2<..##
#<....>..<#
##.......##
##...v...##
###.....###
#####.#####
###########

Round: 2
Collisions: 3

###########
#####.#####
###.....###
##.......##
##..<2>..##
#^.....><.#
##.......##
##.......##
###..v..###
#####.#####
###########

Round: 3
Collisions: 1

###########
#####.#####
###.....###
##.......##
##.<<.>>.##
#>.....<>.#
##.......##
##.......##
###.....###
#####v#####
###########

Round: 4
Collisions: 1

###########
#####.#####
###.....###
##.......##
##<<...>>##
#.>...<..>#
##.......##
##.......##
###.....###
#####<#####
###########

Round: 5
Collisions: 8

###########
#####.#####
###.....###
##.......##
##2.....2##
#..>.<...v#
##.......##
##.......##
###.....###
#####^#####
###########

Round: 6
Collisions: 3

###########
#####.#####
###.....###
##......^##
##.>...<.##
#.v.2....<#
##.......##
##.......##
###..^..###
#####.#####
###########

Round: 7
Collisions: 1

###########
#####.#####
###.....###
##......>##
##..>.<..##
#..<.>..<.#
##v......##
##...^...##
###.....###
#####.#####
###########

Round: 8
Collisions: 3

###########
#####.#####
###.....###
##......v##
##...2...##
#.<...><..#
##...^...##
##v......##
###.....###
#####.#####
###########

Round: 9
Collisions: 1

###########
#####.#####
###.....###
##.......##
##..<.>.v##
#<...^<>..#
##.......##
##<......##
###.....###
#####.#####
###########

Round: 10
Collisions: 4

###########
#####.#####
###.....###
##.......##
##.<.^.>.##
#^...<..2.#
##.......##
##^......##
###.....###
#####.#####
###########

In round 1, two Nullghosts tried to move into walls, while another two finished the round on the same space. This caused

 4 

collisions.

In round 2, one Nullghost collided with a wall and another two finished on the same space, giving

 3 

collisions.
In round 3, only one Nullghost collided with a wall, giving

 1 

collision.
Round 4 also produced only

 1 

collision, this time with a wall near the bottom of the cave.

Round 5 was much more chaotic. First, every Nullghost tried to move. Those that tried to enter a wall stayed where they were and immediately turned 90 degrees clockwise. Only after all movement had been resolved were collisions between Nullghosts checked. Any Nullghosts that then shared a space turned once again, this time to face the opposite direction.

In this round, four Nullghosts collided with walls, while two pairs of Nullghosts finished the round on the same spaces. This caused

 8 

collisions in total.
In round 6, one Nullghost collided with a wall and two finished on the same space, giving

 3 

collisions.

Round 7 contained a single collision with a wall.

In round 8, one Nullghost collided with a wall and another two finished on the same space. This caused

 3 

collisions.

Round 9 contained another single collision with a wall.

Finally, in round 10, two Nullghosts collided with walls and another two finished on the same space, causing

 4 

collisions.

The number of collisions in each round was therefore:

Round:       1   2   3   4   5   6   7   8   9  10
Collisions:  4   3   1   1   8   3   1   3   1   4

The total number of collisions was:

4 + 3 + 1 + 1 + 8 + 3 + 1 + 3 + 1 + 4 =

 29 

How many collisions occurred during the 10 rounds? 
*/
