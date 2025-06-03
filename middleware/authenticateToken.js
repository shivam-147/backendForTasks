const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const header = req.headers['authorization']
    const token = header && header.split(' ')[1]

    if (!token)
        return res.json({ error: true, message: 'you need to login first' })

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err)
            return res.json({ error: true, message: 'invalid token' })
        req.user = user
        next()
    })
}

module.exports = authenticateToken