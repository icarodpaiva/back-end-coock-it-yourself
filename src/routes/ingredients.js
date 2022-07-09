import { Router } from 'express'
import mongoose from 'mongoose'
import recipeSchema from '../mongoose/Schema/recipeSchema.js'

const ingredients = Router()
const Recipe = mongoose.model('recipe', recipeSchema)

// show all recipes with described ingredients or more
ingredients.get('/:ingredients', async (req, res) => {
  const { ingredients } = req.params
  const allIngredients = ingredients.split('_')

  try {
    const recipes = await Recipe.find({
      ingredients: {
        $elemMatch: {
          ingredient: allIngredients
        }
      }
    }).sort({ name: 1 })

    const result = recipes.filter(({ ingredients }) =>
      allIngredients.every(myfilter =>
        ingredients.map(({ ingredient }) => ingredient).includes(myfilter)
      )
    )

    if (result.length !== 0) {
      res.status(200).json(result)
    } else {
      res.status(400).json({ error: 'no recipes found' })
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: 'cannot get' })
  }
})

// show recipes only with the described ingredients
ingredients.get('/:ingredients/restricted', async (req, res) => {
  const { ingredients } = req.params
  const allIngredients = ingredients.split('_')

  try {
    const recipes = await Recipe.find({
      ingredients: {
        $elemMatch: {
          ingredient: allIngredients
        }
      }
    }).sort({ name: 1 })

    const result = recipes.filter(({ ingredients }) =>
      allIngredients.every(
        myfilter =>
          ingredients.map(({ ingredient }) => ingredient).includes(myfilter) &&
          ingredients.length === allIngredients.length
      )
    )

    if (result.length !== 0) {
      res.status(200).json(result)
    } else {
      res.status(400).json({ error: 'no recipes found' })
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: 'cannot get' })
  }
})

export default ingredients
