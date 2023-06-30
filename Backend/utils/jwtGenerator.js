const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtGenerator = (id, email, name) =>{
    const payload = {
        user_id: id,
        email: email,
        name: name
    }
    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "1hr"})
}

module.exports = jwtGenerator
