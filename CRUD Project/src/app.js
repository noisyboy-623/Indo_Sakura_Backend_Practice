const express = require('express')

const userRoutes = require('./routes/user.routes')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()

app.use(express.json()) // Parse incoming JSON requests

app.use('/api/users', userRoutes) 

app.use(errorMiddleware)

module.exports = app