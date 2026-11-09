// https://adventofcode.com/2025/day/7
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const logger = getLogger('aoc 2025 7 1')

const getManifoldTracker = tachyonManifoldLayer => {
    const maxBeams = tachyonManifoldLayer.length
    let totalSplits = 0
    let activeBeamsCount = 0

    const beamTracker = {
        display: [],
    }

    const splitBeam = b => {
        totalSplits++
        addBeam(b - 1)
        removeBeam(b)
        addBeam(b + 1)
    }
    const addBeam = b => {
        if (b > -1 && b < maxBeams) {
            const shouldIncrement = beamTracker[b]
            beamTracker[b] = true
            if (shouldIncrement) activeBeamsCount++
        }
    }
    const removeBeam = b => {
        if (b > -1 && b < maxBeams) {
            const shouldDecrement = beamTracker[b]
            beamTracker[b] = false
            if (shouldDecrement) activeBeamsCount--
        }
    }
    const hasBeam = b => {
        if (b > -1 && b < maxBeams) {
            return beamTracker[b]
        }
        return false
    }
    const getActiveBeamsCount = () => {
        return activeBeamsCount
    }
    const getTotalSplits = () => {
        return totalSplits
    }
    const saveLayer = newLayer => {
        beamTracker.display.push(newLayer)
    }
    const print = () => {
        logger.info('Tachyon Manifold:')
        beamTracker.display.forEach(layer => {
            logger.info(layer.join(''))
        })
        logger.info({ activeBeamsCount, totalSplits })
    }

    for (let b = 0; b < tachyonManifoldLayer.length; b++) {
        beamTracker[b] = false
    }

    return {
        beamTracker,
        splitBeam,
        addBeam,
        removeBeam,
        hasBeam,
        getActiveBeamsCount,
        getTotalSplits,
        saveLayer,
        print,
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

/**
 * processes a given tachyonManifold
 * to count how many times the beam is split
 */
function solution(tachyonManifold) {
    const manifold = getManifoldTracker(tachyonManifold[0])

    const nextLayerStartBeams = []
    tachyonManifold.forEach(rawLayer => {
        const currentLayer = []

        // process current layer
        for (let i = 0; i < rawLayer.length; i++) {
            const bit = rawLayer[i]
            if (manifold.hasBeam(i)) {
                if (bit === BITS.EMPTY) {
                    currentLayer.push(BITS.BEAM_ACTIVE)
                    continue
                }
                if (bit === BITS.BEAM_SPLIT) {
                    currentLayer.pop()
                    currentLayer.push(BITS.BEAM_ACTIVE)
                    currentLayer.push(BITS.BEAM_SPLIT)
                    currentLayer.push(BITS.BEAM_ACTIVE)
                    manifold.splitBeam(i)
                    i++
                    continue
                }
            }

            currentLayer.push(bit)

            if (bit === BITS.BEAM_START) {
                nextLayerStartBeams.push(i)
            }
        }
        manifold.saveLayer(currentLayer)

        // prep next layer
        while (nextLayerStartBeams.length) {
            manifold.addBeam(nextLayerStartBeams.pop())
        }
    })

    manifold.print()

    return manifold.getTotalSplits()
}

module.exports = {
    solution,
}

/*
--- Day 7: Laboratories ---

You thank the cephalopods for the help and exit the trash compactor, finding yourself in the familiar halls of a North Pole research wing.

Based on the large sign that says "teleporter hub", they seem to be researching teleportation; you can't help but try it for yourself and step onto the large yellow teleporter pad.

Suddenly, you find yourself in an unfamiliar room! The room has no doors; the only way out is the teleporter. Unfortunately, the teleporter seems to be leaking magic smoke.

Since this is a teleporter lab, there are lots of spare parts, manuals, and diagnostic equipment lying around. After connecting one of the diagnostic tools, it helpfully displays error code 0H-N0, which apparently means that there's an issue with one of the tachyon manifolds.

You quickly locate a diagram of the tachyon manifold (your puzzle input). A tachyon beam enters the manifold at the location marked S; tachyon beams always move downward. Tachyon beams pass freely through empty space (.). However, if a tachyon beam encounters a splitter (^), the beam is stopped; instead, a new tachyon beam continues from the immediate left and from the immediate right of the splitter.

For example:

.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............

In this example, the incoming tachyon beam (|) extends downward from S until it reaches the first splitter:

.......S.......
.......|.......
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............

At that point, the original beam stops, and two new beams are emitted from the splitter:

.......S.......
.......|.......
......|^|......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............

Those beams continue downward until they reach more splitters:

.......S.......
.......|.......
......|^|......
......|.|......
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............

At this point, the two splitters create a total of only three tachyon beams, since they are both dumping tachyons into the same place between them:

.......S.......
.......|.......
......|^|......
......|.|......
.....|^|^|.....
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............

This process continues until all of the tachyon beams reach a splitter or exit the manifold:

.......S.......
.......|.......
......|^|......
......|.|......
.....|^|^|.....
.....|.|.|.....
....|^|^|^|....
....|.|.|.|....
...|^|^|||^|...
...|.|.|||.|...
..|^|^|||^|^|..
..|.|.|||.|.|..
.|^|||^||.||^|.
.|.|||.||.||.|.
|^|^|^|^|^|||^|
|.|.|.|.|.|||.|

To repair the teleporter, you first need to understand the beam-splitting properties of the tachyon manifold. In this example, a tachyon beam is split a total of 21 times.

Analyze your manifold diagram. How many times will the beam be split?
*/
