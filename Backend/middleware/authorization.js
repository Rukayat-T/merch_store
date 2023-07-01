const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = async (req, res, next) => {
    try {
        const jwToken = req.header('token')
        if (!jwToken){
            return res.status(403).json('Not Authorized')
        }
        else{
            const payload = jwt.verify(jwToken, process.env.jwtSecret)
            req.user_id = payload.user_id
            
        }
        next()
    } catch (error) {
        console.log(error.message)
        return res.status(403).json('Not Authorized')
        
    }
   
}