const jwt = require('jsonwebtoken')

function IsLoggedIn(req, res, next) {
    if (!req.cookies['token'] || req.cookies['token'] === '')
        res.status(401).send('you need to login first')

    const token = req.cookies['token']
    const user = jwt.verify(token, process.env.JWT_SECRET)
    req.user = user;
    next()
}
module.exports = IsLoggedIn
