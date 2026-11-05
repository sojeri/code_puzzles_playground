// https://everybody.codes/event/2026/quests/7
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const logger = getLogger('e 2026 7 1')

function extractClouds(rawInnkeeerRecords) {
    let maxConnections = 0
    let startId = 'NONE'
    const clouds = []

    rawInnkeeerRecords.forEach(line => {
        const parts = line.split(', ')
        const output = {}
        parts.forEach(part => {
            const [key, rawValue] = part.split('=')
            let value = rawValue
            if (key === 'connections') {
                value = rawValue.split(',')
            }
            if (key === 'energy') {
                value = Number(rawValue)
            }
            output[key] = value
        })
        if (output.id) {
            clouds[output.id] = output
            if (output.connections.length > maxConnections) {
                maxConnections = output.connections.length
                startId = output.id
            }
        }
    })

    logger.debug('Clouds:', { maxConnections, startId, ...clouds })

    return { clouds, startId }
}

function solution(rawInnkeeerRecords, maxSteps = 5, goesBoomAt = -1) {
    const { clouds, startId } = extractClouds(rawInnkeeerRecords)
    let currentLoopIds = { [startId]: 1 }

    for (let i = maxSteps; i > 0; i--) {
        let nextLoopIds = {}

        Object.keys(currentLoopIds).forEach(id => {
            const multiple = currentLoopIds[id]
            const totalAdditional = i * multiple
            clouds[id].energy += totalAdditional
            clouds[id].connections.forEach(connect => {
                if (nextLoopIds[connect] !== undefined) {
                    nextLoopIds[connect] += multiple
                } else {
                    nextLoopIds[connect] = multiple
                }
            })
        })

        currentLoopIds = nextLoopIds
    }

    return clouds.reduce((total, cloud) => total + cloud.energy, 0)
}

module.exports = {
    extractClouds,
    solution,
}

/*

Part I

Story section

The analysis of the innkeeper's records revealed that the contamination had spread much further than we had feared. It was not only present in the bread, but also in meat pies, bowls of pottage and, most alarmingly, the kingdom's extremely popular turnip stew.

I decided that we needed the help of someone who understood dark magic far better than any of us. Fortunately, an old friend of mine from the Academy of Magic lived nearby. His name was Sarumonk. We had not spoken for several years, but I was certain that he would remember me.

He did. Unfortunately, by the time we reached his tower, the corruption had already found him. Sarumonk appeared at the highest window, surrounded by black smoke and crackling sparks, and immediately accused me of ruining his final year at the academy. He had apparently never forgiven me for enchanting his graduation robes to shout, "I copied this spell from the textbook!" whenever he raised his wand.

Before I could explain that it had seemed very funny at the time, Sarumonk trapped the rest of the team inside a large iron cage hanging above the tower courtyard. He then challenged me to a lightning duel. There was no time to argue. Sparks were already gathering around the tip of his staff.

I tried to remember the rules of a lightning duel. The aim was to summon lightning from the clouds above the battlefield. To do this, a wizard first had to excite one of the clouds by adding a suitable amount of magical charge to it.

The charge could then travel from one cloud to another. Each cloud could pass part of the charge to several other clouds, but every connection worked in only one direction. A cloud could pass charge to another cloud without being able to receive it back through the same connection.

I remembered a convenient way to record the clouds and their connections:

 id=ID, energy=ENERGY, connections=ID_1,ID_2,...

The

 id 

was the cloud's unique identifier, while

 energy 

described its initial magical energy. The identifiers listed after

 connections 

were the clouds to which it could pass charge directly.

Before facing Sarumonk, I decided to practise the entire process on a small example ( your notes ) and check the total energy the whole system would have after the impulse had finished propagating. I sent a single impulse with a strength of

 5 

into the cloud with the greatest number of outgoing connections and followed its charge as it spread through the sky.

The starting cloud gained

 5 

energy and sent a separate impulse with a strength of

 4 

through each of its outgoing connections. Every cloud reached by an impulse gained energy equal to the impulse's current strength. If that strength was greater than 1, the cloud then sent a separate copy of the impulse through each of its outgoing connections, reducing its strength by 1. An impulse with a strength of

 1 

increased the cloud's energy, but travelled no further.

Different paths were treated separately. If several impulses reached the same cloud, that cloud gained energy from every one of them. Each impulse propagated independently. If a cloud received two impulses of the same strength, it sent two separate impulses through each outgoing connection. An impulse could also return to a cloud that it had already visited through a different connection. A connection could even lead directly back to the same cloud.

Example based on the following notes:

id=1, energy=5, connections=2,5,7
id=2, energy=9, connections=6,7
id=3, energy=3, connections=4
id=4, energy=8, connections=3
id=5, energy=1, connections=6,7
id=6, energy=7, connections=1,7
id=7, energy=6, connections=5

Cloud

 1 

has three outgoing connections, while every other cloud has no more than two, so cloud

 1 

is used as the starting cloud. First,

 5 

energy is added to cloud

 1 

. Then, impulses with a strength of

 4 

are sent to clouds

 2 

,

 5 

and

 7 

. These three impulses continue independently. For example, clouds

 2 

and

 5 

both send an impulse with a strength of

 3 

to cloud

 6 

. As a result,

 3 

energy is added to cloud

 6 

twice.
The total energy added during each stage is:

Strength 5:
cloud 1 received 1 impulse: +5

Strength 4:
cloud 2 received 1 impulse: +4
cloud 5 received 1 impulse: +4
cloud 7 received 1 impulse: +4

Strength 3:
cloud 5 received 1 impulse: +3
cloud 6 received 2 impulses: +6
cloud 7 received 2 impulses: +6

Strength 2:
cloud 1 received 2 impulses: +4
cloud 5 received 2 impulses: +4
cloud 6 received 1 impulse: +2
cloud 7 received 3 impulses: +6

Strength 1:
cloud 1 received 1 impulse: +1
cloud 2 received 2 impulses: +2
cloud 5 received 5 impulses: +5
cloud 6 received 2 impulses: +2
cloud 7 received 5 impulses: +5

Clouds

 3 

and

 4 

are never reached by any impulse, so their energy does not change.
After the propagation finishes, the clouds have the following energy:

Cloud 1: 5 + 10 = 15
Cloud 2: 9 + 6 = 15
Cloud 3: 3 + 0 = 3
Cloud 4: 8 + 0 = 8
Cloud 5: 1 + 16 = 17
Cloud 6: 7 + 10 = 17
Cloud 7: 6 + 21 = 27

The total energy of all the clouds is therefore:
15 + 15 + 3 + 8 + 17 + 17 + 27 =

 102 

.
What was the total energy of all the clouds after the impulse had finished propagating?
*/
