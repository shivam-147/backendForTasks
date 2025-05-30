const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const user = require('./routes/User')
const task = require('./routes/Task')
require('dotenv').config()
require('./config/config')()


const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use('/user', user)
app.use('/task', task)
app.use(cors({
    origin: '*'
}))

app.get('/', (req, res) => {
    res.send('hello, world');
})

app.listen(PORT, () => {
    console.log(`server is running is at ${PORT}`);
})