import { Router } from 'express'
import mongoose from 'mongoose'
import recipeSchema from '../mongoose/Schema/recipeSchema.js'

const tools = Router()
const Recipe = mongoose.model('recipe', recipeSchema)

// show all recipes with described tools
tools.get('/:tools', async (req, res) => {
  const { tools } = req.params
  const allTools = tools.split('_')

  try {
    const result = await Recipe.find({
      tools: { $all: allTools }
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

// show only recipes with described tools
tools.get('/:tools/restricted', async (req, res) => {
  const { tools } = req.params
  const allTools = tools.split('_').sort()

  try {
    const result = await Recipe.find({ tools: allTools }).sort({ name: 1 })
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

export default tools
