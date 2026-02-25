//server.ts
import express, { Application } from "express"
import bodyParser from "body-parser"
import { loadContainer } from "./src/utils/container"

const app: Application = express()

app.use(express.json({ limit: "15mb" }))
app.use(bodyParser.json())

loadContainer(app)