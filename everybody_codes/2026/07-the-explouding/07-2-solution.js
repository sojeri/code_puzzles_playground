// https://everybody.codes/event/2026/quests/7
const { solution: solutionV1 } = require('./07-1-solution')

function solution(rawClouds) {
    return solutionV1(rawClouds, 10)
}

module.exports = {
    solution,
}

/*

Part II

I decided to practise once more using a slightly larger arrangement of clouds ( your notes ). This time, I used the full impulse strength of

 10 

. The impulse still began in the cloud with the greatest number of outgoing connections. That cloud gained

 10 

energy, and the impulse then propagated through successive stages with strengths of

 9 

,

 8 

,

 7 

and so on, until the final stage used

 1 

.
Example based on the following notes:

id=1, energy=5, connections=2,5,7
id=2, energy=9, connections=6,7
id=3, energy=3, connections=4
id=4, energy=8, connections=3
id=5, energy=1, connections=6,7
id=6, energy=7, connections=1,7
id=7, energy=6, connections=5

As in Part I, cloud

 1 

has the greatest number of outgoing connections, so it is used as the starting cloud and receives the initial impulse. The total energy added during each stage is listed here. After all ten stages, the clouds have the following energy:

Cloud 1: 5 + 147 = 152
Cloud 2: 9 + 83 = 92
Cloud 3: 3 + 0 = 3
Cloud 4: 8 + 0 = 8
Cloud 5: 1 + 343 = 344
Cloud 6: 7 + 242 = 249
Cloud 7: 6 + 462 = 468

The total energy of all the clouds is therefore:
152 + 92 + 3 + 8 + 344 + 249 + 468 =

 1316 



id=1, energy=5, connections=2,3,5,7
id=2, energy=9, connections=1,3,4,5,6,7
id=3, energy=3, connections=1,2,4,6,7
id=4, energy=8, connections=1,2,7
id=5, energy=1, connections=2,3,4,6
id=6, energy=7, connections=1,2,3,4
id=7, energy=6, connections=1,2,4,6

In this example, cloud

 2 

has the greatest number of outgoing connections, so it is used as the starting cloud and receives the initial impulse. The total energy added during each stage is listed here.
The total energy of all the clouds after the impulse finishes propagating is:

 1214633 

What was the total energy of all the clouds after the impulse had finished propagating?
*/
