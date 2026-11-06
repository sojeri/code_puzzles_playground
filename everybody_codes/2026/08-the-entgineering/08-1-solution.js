// https://everybody.codes/event/2026/quests/8
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const { NaiveGrid } = require('../../../utils/js/grid')
// const logger = getLogger('2026 8 1', VERBOSITY.DEBUG)
const logger = getLogger('2026 8 1', VERBOSITY.INFO)
// const logger = getLogger('2026 8 1')

const PLACEHOLDER = '.'
function solution(rawHexagonalGrid) {
    const grid = new NaiveGrid({
        rawGrid: rawHexagonalGrid,
        cellParserCb: val => (val === PLACEHOLDER ? val : Number(val)),
        nullCellValue: PLACEHOLDER,
    })
    const visibleEnts = new Set()
    let startRow = Math.floor(grid.height / 2)
    let startCol = 0
    let shadow = 0
    let stillCheckingLight = true
    let hexCol = 1
    // which diagonal column loop
    while (stillCheckingLight) {
        // check values in column loop
        for (
            let row = startRow, col = startCol;
            row < grid.height, col < grid.width;
            col++, row++
        ) {
            const cell = grid.getCell(row, col)
            if (cell === PLACEHOLDER) continue
            if (cell > shadow) {
                visibleEnts.add({ cell, row, col, shadow, hexCol })
                shadow = cell - 1
            } else {
                shadow = shadow - 1
            }
        }

        startRow = startRow - 1 >= 0 ? startRow - 1 : 0
        startCol = startCol + 1
        stillCheckingLight = startCol < grid.width
        shadow = 0
        hexCol++
    }

    logger.debug('Visible Ents')
    visibleEnts.forEach(ve => {
        logger.debug(ve)
    })
    return visibleEnts.size
}

module.exports = {
    solution,
}

/*
Quest 8: The Entgineering
   
Part I
Story section
Sarumonk was finally defeated. With one last furious look, he disappeared into a demonic portal that closed behind him without a trace. At the same moment, the cage opened and the rest of the team was free.
We could not celebrate for long. The contaminated food was still spreading through the kingdom, so we needed help from someone who did not have to worry about eating it. That left surprisingly few options. I suggested asking the forest folk for help. Deep in the old woods lived the Ents, strange tree-like creatures with very little interest in bread, meat pies or turnip stew. For once, being made mostly of wood seemed like a considerable advantage.
Frodoff was also getting worse. His eyes often seemed distant, as if he were looking at something none of us could see, and at night he sometimes woke suddenly with a scream.
When we finally reached the Ents and explained what had happened, they agreed to help. Better still, they already had a plan. If the kingdom needed defenders who could not be poisoned by ordinary food, they would simply grow more Ent warriors.
The Ents had prepared special growing fields made of hexagonal plots. Each occupied plot contained one young Ent, whose height was written as a number from

 1 

to

 9 

. They gave me a map of one of the fields ( your notes ).
Growing an army required a continuous supply of energy, so the Ents first needed to know how much energy their field would consume. Their energy source worked much like sunlight: every Ent reached by it required one unit of energy per round.
For the first test round, the energy source stayed in one position and sent energy from the upper left towards the lower right. Because the energy travelled across the field at an angle, the Ents could cast shadows over one another. The shadow line descended across the field, losing one level of height with every hex it crossed. For example, an Ent of height

 6 

shaded the following hexes up to heights

 5 

,

 4 

,

 3 

,

 2 

and

 1 

, before its shadow disappeared completely.
If an Ent was no taller than the shadow reaching its hex, no energy reached it. A taller Ent rose above that shadow and still received energy. Every Ent cast its own shadow according to its height, even if that Ent was itself already in shadow.
I needed to determine how many units of energy were required for this test round.
Example based on the following notes:

....1.9.6.1.7....
...9.2.3.3.8.1...
..7.8.3.5.1.4.3..
.4.6.7.4.1.1.8.9.
4.5.3.6.5.8.9.4.9
.9.5.1.5.6.2.8.9.
..7.7.6.4.6.2.4..
...9.3.8.3.8.4...
....1.6.6.2.8....

Each digit represents the height of one Ent on the hexagonal field. The dots are only used to preserve the layout of the hex grid. During this round, the energy travels diagonally across the field from the upper left to the lower right.
The first line of Ents reached by the energy is:

Direction: ↘

4....
.9...
..7..
...9.
....1

The first Ent, with height

 4 

, receives energy directly. Its shadow reaches the following hexes at heights

 3 

,

 2 

and

 1 

.
The next Ent has height

 9 

, so it rises above the shadow of height

 3 

and also receives energy. Its much larger shadow continues with heights

 8 

,

 7 

,

 6 

, and so on.
The Ent of height

 7 

is therefore hidden by a shadow of height

 8 

. The following Ent of height

 9 

rises above the shadow reaching it and receives energy, while the final Ent of height

 1 

is hidden by its shadow.
With every shaded Ent marked as

 . 

, the complete map is:

Direction: ↘

....1.9.6.1.7....
...9.2.....8.....
..7...3..........
.4.....4.....8.9.
4.5.....5.8.9...9
.9.5.....6.....9.
....7.6...6......
...9...8...8.....
......6.....8....

After all shadows are applied,

 32 

Ents receive energy, so the round requires

 32 

units of energy.
How many units of energy were required for this round?
*/
