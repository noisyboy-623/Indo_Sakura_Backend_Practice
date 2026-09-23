require('dotenv').config()

const app = require('./app')
const connectDB = require('./db/connection')

connectDB()

app.listen(3000, () => {
    console.log('Server running on port 3000')
})
