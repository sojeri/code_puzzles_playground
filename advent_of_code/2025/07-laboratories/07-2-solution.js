// https://adventofcode.com/2025/day/7
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const logger = getLogger('aoc 2025 7 2', VERBOSITY.DEBUG)

const getManifoldTrackerV2 = tachyonManifold => {
    const base = tachyonManifold
    const layers = base.length
    const distinctPaths = new Set()

    const getKey = ({ layer, bit }) => `L${layer}, B${bit}`
    const savePath = positions => {
        distinctPaths.add(positions.map(p => getKey(p)).join('-'))
    }

    const getDistinctPaths = () => {
        return distinctPaths
    }

    const getDistinctPathsCount = () => {
        return distinctPaths.size
    }

    return {
        layers,
        base,
        savePath,
        getDistinctPaths,
        getDistinctPathsCount,
    }
}

/** all possible bits in the tachyon manifold */
const BITS = {
    /** a beam is moving through this bit */
    BEAM_ACTIVE: '|',
    /** if a beam passes through this bit, it splits to either side */
    BEAM_SPLIT: '^',
    /** a beam starts directly below this bit */
    BEAM_START: 'S',
    /** space a beam could pass through unobstructed */
    EMPTY: '.',
}

function continuePath(manifold, position, pathSoFar) {
    if (position.layer >= manifold.layers) {
        manifold.savePath(pathSoFar)
        return
    }

    const path = [...pathSoFar, position]
    const layer = manifold.base[position.layer]
    const bit = layer[position.bit]
    if (bit !== BITS.BEAM_SPLIT) {
        continuePath(
            manifold,
            {
                layer: position.layer + 1,
                bit: position.bit,
            },
            path
        )
        return
    }

    continuePath(
        manifold,
        {
            layer: position.layer,
            bit: position.bit - 1,
        },
        path
    )
    continuePath(
        manifold,
        {
            layer: position.layer,
            bit: position.bit + 1,
        },
        path
    )
}

/**
 * processes a given tachyonManifold
 * to count how many times the beam is split
 */
function solution(tachyonManifold) {
    const manifold = getManifoldTrackerV2(tachyonManifold)
    const firstLayer = tachyonManifold[0]
    const startingBit = firstLayer.indexOf(BITS.BEAM_START)

    const startingPosition = { layer: 1, bit: startingBit }
    continuePath(manifold, startingPosition, [])

    return manifold.getDistinctPathsCount()
}

module.exports = {
    solution,
}

/*
--- Part Two ---

With your analysis of the manifold complete, you begin fixing the teleporter. However, as you open the side of the teleporter to replace the broken manifold, you are surprised to discover that it isn't a classical tachyon manifold - it's a quantum tachyon manifold.

With a quantum tachyon manifold, only a single tachyon particle is sent through the manifold. A tachyon particle takes both the left and right path of each splitter encountered.

Since this is impossible, the manual recommends the many-worlds interpretation of quantum tachyon splitting: each time a particle reaches a splitter, it's actually time itself which splits. In one timeline, the particle went left, and in the other timeline, the particle went right.

To fix the manifold, what you really need to know is the number of timelines active after a single particle completes all of its possible journeys through the manifold.

In the above example, there are many timelines. For instance, there's the timeline where the particle always went left:

.......S.......
.......|.......
......|^.......
......|........
.....|^.^......
.....|.........
....|^.^.^.....
....|..........
...|^.^...^....
...|...........
..|^.^...^.^...
..|............
.|^...^.....^..
.|.............
|^.^.^.^.^...^.
|..............

Or, there's the timeline where the particle alternated going left and right at each splitter:

.......S.......
.......|.......
......|^.......
......|........
......^|^......
.......|.......
.....^|^.^.....
......|........
....^.^|..^....
.......|.......
...^.^.|.^.^...
.......|.......
..^...^|....^..
.......|.......
.^.^.^|^.^...^.
......|........

Or, there's the timeline where the particle ends up at the same point as the alternating timeline, but takes a totally different path to get there:

.......S.......
.......|.......
......|^.......
......|........
.....|^.^......
.....|.........
....|^.^.^.....
....|..........
....^|^...^....
.....|.........
...^.^|..^.^...
......|........
..^..|^.....^..
.....|.........
.^.^.^|^.^...^.
......|........

In this example, in total, the particle ends up on 40 different timelines.

Apply the many-worlds interpretation of quantum tachyon splitting to your manifold diagram. In total, how many different timelines would a single tachyon particle end up on?
*/
