const express = require('express')

const userRoutes = require('./modules/User/routes/user.routes')
const adminRoutes = require('./modules/Admin/routes/admin.routes')
const errorMiddleware = require('./middlewares/error.middleware')

const app = express()

app.use(express.json()) // Parse incoming JSON requests

app.use('/api/users', userRoutes) 
app.use('/api/admin', adminRoutes) 

app.use(errorMiddleware)

module.exports = app