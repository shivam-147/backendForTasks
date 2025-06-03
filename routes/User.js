const express = require('express')
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()
const authenticateToken = require('../middleware/authenticateToken')



router.get('/test', (req, res) => {
    res.status(200).json({ message: 'everything is ok...' })
})

// Register
router.post('/register', async (req, res) => {
    const { fullname, email, password } = req.body

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.json({ error: true, message: 'User already exists' })
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
                res.status(200).json({ error: false, message: 'user registered successfully', accessToken: token })
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
            res.json({ error: true, message: 'Email or password is invalid' })

        bcrypt.compare(password, user.password, (err, result) => {
            if (!result)
                res.json({ error: true, message: 'Email or password is invalid' })

            const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '3600m' })
            res.cookie('token', token)
            req.user = { email: user.email, userId: user._id }
            res.status(200).json({ message: 'Login successful', user: { email: user.email, userId: user._id }, accessToken: token })
        })
    }
    catch (err) {
        res.status(500).json({ message: 'Error at login' })
    }
})

router.get('/logout', authenticateToken, (req, res) => {
    try {
        res.cookie('token', '')
        res.status(200).json({ message: 'user logged out successfully' })
    }
    catch (err) {
        res.status(500).json({ message: 'Error at logout' })
    }
})



module.exports = router;