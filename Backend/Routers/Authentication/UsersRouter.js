const express =require('express')
const bcrypt = require('bcrypt')
const jwtGenerator = require('../../utils/jwtGenerator')
const validInfo = require('../../middleware/validInfo')
const authorization = require('../../middleware/authorization')
const {User} = require("../../models")

const usersRouter = express.Router()

usersRouter.post('/register', validInfo, async (req, res) => {

/* 
destructure req.body
check if user already exists, then return error
else  bcrypt the password
save the new user
generate token
 */
try {
    const {name, email, password} = req.body
   const checkUser = await User.findAll(
        {
            where: {
                email : email
            }
        }
    )
    const user = checkUser[0]
    if (user){
        res.status(400).json("This user already exists")
    }
    else{
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const encryptedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create(
            {
                name: name,
                email: email,
                password: encryptedPassword
            }
        ).catch((err)=>{console.log(err.message); res.status(500).json(err.message)})
        
        const token = jwtGenerator(newUser.id, newUser.email, newUser.name)
        res.json({"token": token})


        }
    res.status(200).json("hello world")
    
} catch (error) {
    console.log(error.message)
    res.status(500).json(error.message)
    
}
})

usersRouter.post('/login', validInfo, async (req, res) => {

    /* 
destructure req.body
check if user already exists, if not return error
check if password is same ad db password
generate token
 */

    try {

        const {email, password} = req.body

        const checkUser = await User.findAll(
            {
                where: {
                    email : email
                }
            }
        )
        const user = checkUser[0] 
        if (!user){
            res.status(401).json("Password or Email is incorrect")
        }
        else{
           const validPassword = await bcrypt.compare(password, user.password)
           if (!validPassword){
            res.status(401).json("Password or Email is incorrect")
           }
           else{
            const token = jwtGenerator(user.id, user.email, user.name)
            res.send({'token': token})
           }
        }  
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message)
    }
})

usersRouter.get('/allUsers', authorization, async (req, res) => {
    try {
       const usersFromDb = await User.findAll()
       
       const users = []

       for (let i = 0; i< usersFromDb.length; i++)
       {
        const user = {
            id : '',
            name: '',
            email: '',
            createdAt: '',
            updatedAt: ''
           }
        user.id = usersFromDb[i].id
        user.name = usersFromDb[i].name
        user.email = usersFromDb[i].email
        user.createdAt = usersFromDb[i].createdAt
        user.updatedAt = usersFromDb[i].updatedAt
        users.push(user)
       }
       res.status(200).json(users)
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message)
    }

})

usersRouter.get('/:id', authorization, async (req, res) => {
    try {
        const id = req.params.id
        const userFromDb = await User.findAll({
            where: {
                id: id
            }
        })

        const currUser = userFromDb[0]
        const user = {
            id : '',
            name: '',
            email: '',
            createdAt: '',
            updatedAt: ''
           }

        if (currUser) {
            user.id = currUser.id
            user.name = currUser.name
            user.email = currUser.email
            user.createdAt = currUser.createdAt
            user.updatedAt = currUser.updatedAt
             res.status(200).json(user)
        }
        else{
            res.status(404).json('User not found')
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message)
        
    }
})

usersRouter.put('/:id', authorization, async (req, res) => {
    try {
        const id = req.params.id
        const userFromDb = await User.findAll({
            where: {
                id: id
            }
        })

        const {name, email} = req.body

        if(userFromDb[0])
        {
            if(email){
                userFromDb[0].email = email
            }
            if (name){
                userFromDb[0].name = name
            }
           
            
            await userFromDb[0].save()
            res.status(203).json(userFromDb)
        }
        else{
            res.status(404).json('User not found')
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message) 
    }
})

usersRouter.delete('/:id', authorization, async (req, res) => {
    try {
        const id = req.params.id
        const userFromDb = await User.findAll({
            where: {
                id: id
            }
        })

        if(userFromDb[0])
        {
            const deleteUser = await User.destroy({
                where: {
                    id: id
                }
            })
            res.status(203).json('User Deleted')
        }
        else{
            res.status(404).json('User not found')
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message) 
    }
})

usersRouter.get('/authorize', authorization, async (req, res) => {
    try {
        res.json(true)
        
    } catch (error) {
        console.log(error.message)
        res.status(400).send({"message:": error.message})
    }
})

module.exports = usersRouter