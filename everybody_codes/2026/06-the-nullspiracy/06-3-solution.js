// https://everybody.codes/event/2026/quests/6
const { getLogger, VERBOSITY } = require('../../../utils/js/getLogger')
const { NULL_KEYWORD, getAllRecipes } = require('./06-1-solution')

const logger = getLogger('e 2026 6 3') //, VERBOSITY.DEBUG)

const NULL_LIKE_TESTER = new RegExp(NULL_KEYWORD)
const isNullLike = name => {
    return NULL_LIKE_TESTER.test(name)
}
function hasTooManyNullLikeParts(name, allRecipes) {
    const baseIngredients = allRecipes[name] || []
    const allIngredients = new Set(baseIngredients)
    const nullLikeArr = baseIngredients?.filter(isNullLike)
    const nullLikeIngredients = new Set(nullLikeArr)

    const seen = {}
    const addIngredient = name => {
        if (seen[name] || name === undefined) return

        seen[name] = true
        allIngredients.add(name)
        if (isNullLike(name)) nullLikeIngredients.add(name)

        if (allRecipes[name]) {
            allRecipes[name].forEach(addIngredient)
        }
    }

    baseIngredients.forEach(addIngredient)
    allIngredients.delete(name)

    logger.debug({ name, baseIngredients, nullLikeIngredients })

    return nullLikeIngredients.size > 1
}

function solution(recipeList) {
    console.log('wwwaaat')
    const allRecipes = getAllRecipes(recipeList)
    logger.info('All Recipes:')
    logger.info({ ...allRecipes })

    let count = 0
    Object.keys(allRecipes).forEach(recipe => {
        if (hasTooManyNullLikeParts(recipe, allRecipes)) {
            count++
        }
    })

    return count
}

module.exports = {
    solution,
}
