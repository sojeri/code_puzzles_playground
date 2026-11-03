// https://everybody.codes/event/2026/quests/6
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const logger = getLogger('e 2026 6 1')

function parseRecipe(rawRecipe) {
    const [name, recipe] = rawRecipe.split(':')
    const ingredients = recipe.split(',')

    return { name, ingredients }
}

function getAllRecipes(rawRecipes) {
    const allRecipes = {}
    rawRecipes.forEach(item => {
        const { name, ingredients } = parseRecipe(item)
        allRecipes[name] = ingredients
    })

    return allRecipes
}

function getFullIngredients(name, allRecipes) {
    const allIngredients = new Set(allRecipes[name])

    const seen = {}
    const addIngredient = name => {
        if (seen[name] || name === undefined) return

        seen[name] = true
        allIngredients.add(name)

        if (allRecipes[name]) {
            allRecipes[name].forEach(addIngredient)
        }
    }

    const ingredients = allRecipes[name]
    ingredients.forEach(addIngredient)
    allIngredients.delete(name)

    return allIngredients
}

const NULL_KEYWORD = 'NULL'
function solution(recipeList) {
    const allRecipes = getAllRecipes(recipeList)
    logger.debug('All Recipes:')
    logger.debug({ ...allRecipes })

    const nullIngredients = getFullIngredients(NULL_KEYWORD, allRecipes)
    logger.info(nullIngredients)

    return nullIngredients.size
}

module.exports = {
    getAllRecipes,
    getFullIngredients,
    NULL_KEYWORD,
    solution,
}

/*

Part I
Story section
Understanding all the stamps used on the elven maps took us two full days. By the time Legolink finally declared that we were ready to continue, we were tired, hungry and no longer certain that getting lost would have been any more complicated. We stopped at a small roadside inn called The Tipsy Turnip.
Everything seemed perfectly ordinary until the food arrived. Frodoff suddenly became restless. He kept looking around the room, shifting in his chair and glancing nervously at his backpack. A moment later, a thin trail of black smoke began to rise from the egg. That was rarely a sign of anything pleasant.
We carefully moved the egg closer to each dish to see which one caused the strongest reaction. When we brought it near the bread, the smoke immediately grew thicker and darker. Legolink took a closer look at the innkeeper and the other guests. Their tired faces, sudden bursts of anger and suspicious glances no longer seemed quite so ordinary. The contaminated bread had probably been served throughout the area for some time.
Luckily, the kingdom required the origin of every ingredient to be recorded. The innkeeper therefore had documents showing which ingredients had been used to make each product, which ingredients had been used to make those ingredients, and so on.
The innkeeper brought us a large collection of documents describing the origin of every product and ingredient used to prepare our food. To begin with, we examined only a small part of those records ( your notes ). Each product and ingredient had been assigned a four-letter identifier, presumably because actual names would have made the records far too easy to understand.
Each record had the following format:

 ITEM:INGREDIENT_1,INGREDIENT_2,... 



For example:

 BRTS:FLWR,SLTT,MLKK 

This record meant that the item identified as

 BRTS 

had been made directly from the ingredients identified as

 FLWR 

,

 SLTT 

and

 MLKK 

.
Those ingredients could, in turn, have been made from other ingredients. The same ingredient could be used in several different items, and some chains of ingredients could even lead back to an item that we had already examined. If an identifier never appeared on the left-hand side of a record, it represented a basic ingredient that had not been made from anything else.
Frodoff suddenly pointed at one particularly suspicious identifier:

 NULL 

. He wondered whether it might somehow be connected to Nulldor. That was enough reason for us to investigate it first. Starting with

 NULL 

, we searched for every ingredient used to make it, both directly and indirectly. We counted each different ingredient only once, even if it was used in several items or could be reached through several different chains. We did not count

 NULL 

itself, even if a chain of ingredients led back to it.
Example based on the following notes:

BRDS:FLWR,SLTT,YSTS
FLWR:SLTT,YSTS
SLTT:YSTS,MLKK,BTTR
NULL:BRDS,FLWR,SLTT
YSTS:BRDS,FLWR
MLKK:SPCS,NULL
HNYN:BRDS,FLWR,SLTT,YSTS

The item identified as

 NULL 

had been made directly from three ingredients:

 BRDS 

,

 FLWR 

and

 SLTT 

.
We then examined the records for those ingredients. This led us to three additional ingredients:

 YSTS 

,

 MLKK 

and

 BTTR 

. The record for

 MLKK 

led us to one final ingredient,

 SPCS 

.
The ingredients used directly or indirectly to make

 NULL 

were:

 BRDS 

,

 FLWR 

,

 SLTT 

,

 YSTS 

,

 MLKK 

,

 BTTR 

and

 SPCS 

.
There were therefore

 7 

different ingredients used to make

 NULL 

.
How many different ingredients were used directly or indirectly to make

 NULL 

?
*/
