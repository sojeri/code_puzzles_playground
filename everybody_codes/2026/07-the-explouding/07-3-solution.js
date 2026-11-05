// https://everybody.codes/event/2026/quests/7
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const logger = getLogger('e 2026 7 3')

/**
 * base in input array data, returns a new obj shape:
 * ```
 * {
 *     [id]: { id, energy: int, connections: Set(id[]) },
 *     allIds: Set(id[]),
 * }
 * ```
 */
function extractClouds(rawInnkeeerRecords) {
    const clouds = {
        allIds: new Set(),
    }

    rawInnkeeerRecords.forEach(line => {
        const parts = line.split(', ')
        const output = {}
        parts.forEach(part => {
            const [key, rawValue] = part.split('=')
            let value = rawValue
            if (key === 'connections') {
                value = new Set(rawValue.split(','))
            }
            if (key === 'energy') {
                value = Number(rawValue)
            }
            output[key] = value
        })
        if (output.id) {
            clouds[output.id] = output
            clouds.allIds.add(output.id)
        }
    })

    return clouds
}

/**
 * processes a starting cloud ID to figure out final system energy
 * after all pulses and explosions are handled
 */
function getCloudEnergy(rawInnkeeerRecords, startId, startPulse, explodesAt) {
    // using rawInnkeeperRecords to reduce need to deep clone the clouds
    const clouds = extractClouds(rawInnkeeerRecords)
    const pulses = {
        initialTrigger: {
            value: startPulse,
            currentLoopIds: { [startId]: 1 },
            triggeredBy: 'initial',
        },
    }

    let actualTicks = 0
    let ticks = startPulse
    const hasTicksRemaining = () => ticks > 0
    while (hasTicksRemaining()) {
        logger.debug('ticks remaining:', ticks, 'actual ticks:', actualTicks)
        let didAnyCloudsExplode = false

        // process all pulses
        Object.keys(pulses).forEach(pid => {
            const pulse = pulses[pid]
            if (pulse.value <= 0) return

            let nextLoopIds = {}

            Object.keys(pulse.currentLoopIds).forEach(id => {
                const multiple = pulse.currentLoopIds[id]
                const totalAdditional = pulse.value * multiple
                clouds[id].energy += totalAdditional
                clouds[id].connections.forEach(cid => {
                    if (nextLoopIds[cid] !== undefined) {
                        nextLoopIds[cid] += multiple
                    } else {
                        nextLoopIds[cid] = multiple
                    }
                })
            })

            pulse.currentLoopIds = nextLoopIds
            pulse.value -= 1
        })

        // handle explosions
        clouds.allIds.forEach(id => {
            if (clouds[id].energy < explodesAt) return
            logger.debug('\n\n\n\n\nhandling explosion of ID', id)

            didAnyCloudsExplode = true

            // create new pulse
            const newPulse = {
                value: startPulse,
                currentLoopIds: {},
                triggeredBy: id,
            }
            clouds[id].connections.forEach(cid => {
                newPulse.currentLoopIds[cid] = 1
            })
            pulses[crypto.randomUUID()] = newPulse

            // erase cloud
            clouds.allIds.forEach(cid => {
                if (clouds[cid].connections.delete(id)) {
                    logger.debug('removed connection from', cid, '=>', id)
                }
            })
            delete clouds[id]
            clouds.allIds.delete(id)
            Object.keys(pulses).forEach(pid => {
                if (pulses[pid].currentLoopIds[id] !== undefined) {
                    delete pulses[pid].currentLoopIds[id]
                }
            })
        })

        // loop reset
        ticks = didAnyCloudsExplode ? startPulse : ticks - 1
        actualTicks++

        Object.keys(pulses).forEach(pid => {
            if (pulses[pid].value <= 0) {
                logger.debug(
                    'removing fully spent pulse, triggered by',
                    pulses[pid].triggeredBy
                )
                delete pulses[pid]
            }
        })
    }

    const cloudsReducer = (total, id) => total + clouds[id].energy
    return clouds.allIds.reduce(cloudsReducer, 0)
}

function getBestCloudPulse(rawInnkeeerRecords, maxSteps = 5, goesBoomAt = -1) {
    const clouds = extractClouds(rawInnkeeerRecords)
    let max = -1
    clouds.allIds.forEach(id => {
        const finalCloudEnergy = getCloudEnergy(
            rawInnkeeerRecords,
            id,
            maxSteps,
            goesBoomAt
        )
        clouds[id].finalCloudEnergy = finalCloudEnergy
        max = finalCloudEnergy > max ? finalCloudEnergy : max
    })

    return max
}

function getSolution(maxSteps = 5, goesBoomAt = -1) {
    return rawInnkeeerRecords =>
        getBestCloudPulse(rawInnkeeerRecords, maxSteps, goesBoomAt)
}

const exampleSolution = getSolution(10, 100)
const solution = getSolution(10, 1_000_000)

module.exports = {
    solution,
    exampleSolution,
}

/*

Part III

Sarumonk had no intention of waiting for me to finish my calculations. Before I could even raise my staff, he fired his energy impulse into the clouds. I watched the charge spread across the sky until one of the clouds flashed brightly and burst apart. That was when I remembered one rather important rule of lightning duels.

If a cloud reached an energy of at least

 1000000 

, it exploded. An exploded cloud disappeared from the system, so its energy was no longer included in the total energy of the remaining clouds.

An explosion also released another burst of energy. After exploding, the cloud sent a new impulse with a strength of

 10 

through each of its outgoing connections. Those new impulses propagated exactly as before, decreasing to 9, 8, 7 and so on.

Understanding the order of events was crucial.

    First, all clouds received and passed on the impulses of the current stage as usual.
    After that, every cloud that had reached the limit exploded.
    Each explosion generated an additional impulse with a strength of

     10 

    for every outgoing connection. These new impulses joined the ones already passed on, as if they had all been emitted at exactly the same moment, and travelled together during the next stage.
    Once a cloud had exploded, it could no longer receive or pass any later impulses.

I still had only one shot, with a strength of

 10 

, but the cloud with the greatest number of outgoing connections was no longer an obvious choice. Every cloud that exploded disappeared, taking its energy out of the final total. With explosions able to trigger further impulses, I needed to find a new strategy.

Using the arrangement of clouds ( your notes ), I had to determine which cloud to hit with my initial impulse so that the total energy of all clouds remaining after the entire propagation was as high as possible.

Example based on the following notes:

id=1, energy=5, connections=2,5,7
id=2, energy=9, connections=6,7
id=3, energy=3, connections=4
id=4, energy=8, connections=3
id=5, energy=1, connections=6,7
id=6, energy=7, connections=1,7
id=7, energy=6, connections=5

To make the explosions easier to follow in this small example, the explosion limit is reduced to

 100 

.
When cloud

 2 

is used as the starting cloud, cloud

 7 

eventually reaches

 135 

energy and explodes. Its explosion sends a new impulse with a strength of

 10 

to cloud

 5 

.
During the following stage, clouds

 5 

and

 6 

also reach the explosion limit. All impulses in that stage are processed first. The two clouds then explode and generate additional impulses for the next stage.
After the entire propagation finishes, clouds

 5 

,

 6 

and

 7 

have exploded. The remaining clouds have the following energy:

Cloud 1: 94
Cloud 2: 82
Cloud 3: 3
Cloud 4: 8

Their total energy is therefore:
94 + 82 + 3 + 8 =

 187 

The stage-by-stage process is listed here.
Every other starting cloud results in a lower total energy:

cloud 1: 108
cloud 2: 187 <- best
cloud 3: 94
cloud 4: 94
cloud 5: 101
cloud 6: 11
cloud 7: 159



For easier debugging of this rather complicated task,
one more example is available  here.

The  calculation file contains the results by starting cloud,
as well as the detailed process for the best choice.

What was the highest total energy of all the clouds remaining after sending the initial impulse into the best possible cloud?

*/
