import { Router } from 'express'
import mongoose from 'mongoose'
import recipeSchema from '../mongoose/Schema/recipeSchema.js'
import { validateData, organizeData, verifyId } from './middleware.js'
import ingredients from './ingredients.js'
import tools from './tools.js'
import time from './time.js'

const router = Router()
const Recipe = mongoose.model('recipe', recipeSchema)

// register recipes
router.post('/recipe', validateData, organizeData, async (req, res) => {
  const { imageUrl, preparation, servingsPerPerson } = req.body
  const { name, ingredients, tools } = res.locals

  const recipe = new Recipe({
    name,
    imageUrl,
    ingredients,
    tools,
    preparation,
    servingsPerPerson
  })

  try {
    await recipe.save()
    return res.status(201).json(recipe)
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: 'cannot post' })
  }
})

// show the last recipe added
router.get('/last', async (req, res) => {
  try {
    const result = await Recipe.find().sort({ $natural: -1 }).limit(1)
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

// show recipe with described id
router.get('/id/:id', async (req, res) => {
  try {
    const result = await Recipe.find({ _id: req.params.id })
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

// show all recipes
router.get('/recipe', async (req, res) => {
  try {
    const result = await Recipe.find().sort({ name: 1 })
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

// show recipes with described name
router.get('/name/:name', async (req, res) => {
  const regexName = new RegExp(req.params.name)
  try {
    const result = await Recipe.find({ name: regexName }).sort({ name: 1 })
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

// show recipes with described time of preparation
router.use('/ingredients', ingredients)

// show recipes with described tools
router.use('/tools', tools)

// show recipes with described time of preparation
router.use('/time', time)

// edit recipes
router.put(
  '/recipe/:id',
  verifyId,
  validateData,
  organizeData,
  async (req, res) => {
    const { id } = req.params
    const { name, imageUrl, preparation, servingsPerPerson } = req.body
    const { ingredients, tools } = res.locals

    try {
      await Recipe.updateOne(
        {
          _id: id
        },
        {
          $set: {
            _id: id,
            name,
            imageUrl,
            ingredients,
            tools,
            preparation,
            servingsPerPerson
          }
        }
      )

      const result = await Recipe.findById(id)
      res.status(200).json(result)
    } catch (err) {
      console.log(err)
      res.status(400).json({ error: 'cannot put' })
    }
  }
)

// delet recipes
router.delete('/recipe/:id', verifyId, async (req, res) => {
  const { id } = req.params

  try {
    await Recipe.deleteOne({
      _id: id
    })

    res.status(204).json()
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: 'cannot delete' })
  }
})

// Page not found
router.use((req, res) => {
  res.status(404).json({ error: 'page not found' })
})

export default router
