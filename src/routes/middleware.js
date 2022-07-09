import mongoose from 'mongoose'
import recipeSchema from '../mongoose/Schema/recipeSchema.js'

const Recipe = mongoose.model('recipe', recipeSchema)

// validate post data
export const validateData = (req, res, next) => {
  const { name, imageUrl, ingredients, tools, preparation, servingsPerPerson } =
    req.body

  if (
    name &&
    imageUrl &&
    ingredients &&
    tools &&
    preparation &&
    servingsPerPerson
  ) {
    const { time, howToMake } = preparation

    if (howToMake && time) {
      const validateIngredients = ingredients.every(item => {
        return item.ingredient && item.ingredientUnit && item.ingredientQuantity
      })

      if (
        ingredients.length > 0 &&
        validateIngredients &&
        howToMake.length > 0
      ) {
        const { timeUnit, timeQuantity } = time

        if (!timeUnit || !timeQuantity) {
          return res.status(400).json({ error: 'missing terceary data' })
        }
      } else {
        return res.status(400).json({ error: 'missing secundary data' })
      }
    } else {
      return res.status(400).json({ error: 'missing secundary data' })
    }
  } else {
    return res.status(400).json({ error: 'missing main data' })
  }

  next()
}

// organize post ingredients and tools, transform for lower case ingredients, tools and name
export const organizeData = (req, res, next) => {
  let { name, ingredients, tools } = req.body

  name = name.toLowerCase()

  const ingredientsAux = ingredients.sort((a, b) => {
    if (a.ingredient < b.ingredient) {
      return -1
    } else if (a.ingredient > b.ingredient) {
      return 1
    } else {
      return 0
    }
  })

  ingredients = ingredientsAux.map(function (a) {
    a.ingredient = a.ingredient.toLowerCase()
    return a
  })

  const toolsAux = tools.sort()

  tools = toolsAux.map(tool => {
    return tool.toLowerCase()
  })

  res.locals.name = name
  res.locals.ingredients = ingredients
  res.locals.tools = tools

  next()
}

// verify if Id exist
export const verifyId = async (req, res, next) => {
  const { id } = req.params
  const alphanumeric = /^[a-zA-Z0-9]+$/

  if (!alphanumeric.test(id) || id.length !== 24) {
    return res.status(400).json({ error: 'id not found' })
  }

  const result = await Recipe.find({ _id: id })

  if (result.length <= 0) {
    return res.status(400).json({ error: 'id not found' })
  }

  next()
}
