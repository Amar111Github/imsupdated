
const Jwt = require('jsonwebtoken')
require('dotenv').config()

const userAuth = async(req, res, next) => {
    let tokan = req.headers['authorization'];

    if(tokan) {
        tokan = tokan.split(' ')[1]
        Jwt.verify(tokan, process.env.SALTKEY, (err, valid) => {
            if(err) {
                res.status(401).json({
                    message : 'enter valid tokan'
                })
            } else {
                next()
            }
        })
    } else {
        res.status(403).json({
            message : 'Try Again a some Time Letter'
        })
    }

  
}

module.exports = userAuth