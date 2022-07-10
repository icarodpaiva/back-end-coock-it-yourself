import mongoose from "mongoose"
import express from "express"
import router from "./routes/routes.js"

const db = mongoose.connection
const port = process.env.PORT ?? 2525
const server = express()

mongoose.connect(
  "mongodb+srv://admin:WGFgvkQQDp24m0hg@cockityourself.udn8j.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
)
db.on("error", err => console.log(err))
db.once("open", () => console.log("conected"))

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.use(router)

server.listen(port, () => console.log(`server online em localhost:${port}`))
