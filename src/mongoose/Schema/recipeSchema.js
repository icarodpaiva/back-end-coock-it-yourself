import mongoose from 'mongoose'

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    ingredients: [
      {
        ingredient: { type: String, required: true },
        ingredientUnit: { type: String, required: true },
        ingredientQuantity: { type: Number, required: true }
      }
    ],
    tools: [{ type: String, required: false }],
    preparation: {
      time: {
        timeUnit: { type: String, required: true },
        timeQuantity: { type: Number, required: true }
      },
      howToMake: [{ type: String, required: true }]
    },
    servingsPerPerson: { type: Number, required: true }
  },
  { versionKey: false }
)

export default recipeSchema
