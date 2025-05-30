const express = require('express')
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()
const IsLoggedIn = require('../middleware/IsLoggedIn')


router.get('/', IsLoggedIn, (req, res) => {
    const token = req.cookies['token']
    const user = jwt.verify(token, process.env.JWT_SECRET)
    console.log(req.user)
    res.json(user)
})

// Register
router.post('/register', async (req, res) => {

    const { fullname, email, password } = req.body

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }
        // hash the password
        bcrypt.genSalt(10, async (err, salt) => {
            bcrypt.hash(password, salt, (err, result) => {
                const user = new User({
                    fullname,
                    email,
                    password: result
                })
                user.save()

                const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET)
                res.cookie('token', token)
                res.status(200).json({ message: 'user registered successfully', user: { email: user.email, userId: user._id } })
            })
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error: register' })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user)
            res.status(500).json({ message: 'Email or password is invalid' })

        bcrypt.compare(password, user.password, (err, result) => {
            if (!result)
                res.status(500).json({ message: 'Email or password is invalid' })

            const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET)
            res.cookie('token', token)
            req.user = { email: user.email, userId: user._id }
            res.status(200).json({ message: 'Login successful', user: { email: user.email, userId: user._id } })
        })
    }
    catch (err) {
        res.status(500).json({ message: 'Error at login' })
    }
})

router.get('/logout', IsLoggedIn, (req, res) => {
    try {
        res.cookie('token', '')
        res.status(200).json({ message: 'user logged out successfully' })
    }
    catch (err) {
        res.status(500).json({ message: 'Error at logout' })
    }
})


module.exports = router;