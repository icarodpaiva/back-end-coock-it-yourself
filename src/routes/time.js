import { Router } from 'express'
import mongoose from 'mongoose'
import recipeSchema from '../mongoose/Schema/recipeSchema.js'

const time = Router()
const Recipe = mongoose.model('recipe', recipeSchema)

// show all recipes with described time or less
time.get('/:timeUnit/:timeQuantity', async (req, res) => {
  let { timeUnit, timeQuantity } = req.params

  try {
    const result = await Recipe.find({
      'preparation.time.timeUnit': timeUnit,
      'preparation.time.timeQuantity': { $lte: timeQuantity }
    }).sort({ name: 1 })

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

// show only recipes with described time
time.get('/:timeUnit/:timeQuantity/restricted', async (req, res) => {
  const { timeUnit, timeQuantity } = req.params

  try {
    const result = await Recipe.find({
      'preparation.time.timeUnit': timeUnit,
      'preparation.time.timeQuantity': timeQuantity
    }).sort({ name: 1 })
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

export default time
