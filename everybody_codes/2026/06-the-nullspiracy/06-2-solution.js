// https://everybody.codes/event/2026/quests/6
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const { getAllRecipes, getFullIngredients, NULL_KEYWORD } = require('./06-1-solution')
const logger = getLogger('e 2026 6 2')

function solution(recipeList) {
    const allRecipes = getAllRecipes(recipeList)
    const recipesUsingNull = new Set()
    Object.keys(allRecipes).forEach(name => {
        const ingredients = getFullIngredients(name, allRecipes)
        if (ingredients.has(NULL_KEYWORD)) {
            recipesUsingNull.add(name)
        }
    })
    return recipesUsingNull.size
}

module.exports = {
    solution,
}

/*
Part II
We carefully examined every ingredient used to make

 NULL 

, but found nothing suspicious. None appeared to contain even the smallest trace of dark magic.
We decided to investigate the records from the opposite direction. This time, we examined a larger selection of the documents ( your notes ). Instead of checking what had been used to make

 NULL 

, we wanted to find out which other products had been made using it. If the contamination had already spread through the local supply chain, this would show us how serious the problem had become.
Example based on the following notes:

BRDS:FLWR,SLTT,YSTS
FLWR:SLTT,YSTS
SLTT:YSTS,MLKK,BTTR
NULL:BRDS,FLWR,SLTT
YSTS:BRDS,FLWR
MLKK:SPCS,NULL
HNYN:BRDS,FLWR,SLTT,YSTS

The product identified as

 MLKK 

used

 NULL 

directly.
The product

 SLTT 

used

 MLKK 

, so it used

 NULL 

indirectly. Following the records further showed that

 BRDS 

,

 FLWR 

,

 YSTS 

and

 HNYN 

also used

 NULL 

indirectly.
The products that used

 NULL 

directly or indirectly were:

 MLKK 

,

 SLTT 

,

 BRDS 

,

 FLWR 

,

 YSTS 

and

 HNYN 

.
There were therefore

 6 

different products that used

 NULL 

.
How many different products used

 NULL 

directly or indirectly? 
*/
