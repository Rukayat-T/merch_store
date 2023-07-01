const express =require('express')
const authorization = require('../../middleware/authorization')
const model = require("../../models")

const productsRouter = express.Router()
const Product = model.Product

//create product
productsRouter.post('/create', authorization, async (req, res) =>{
    try {
        const {name, quantity, price} = req.body
        const userId = req.user_id
        console.log(name)
        const checkProduct = await Product.findAll(
                {
                    where: {
                        name : name,
                        UserId: userId
                    }
                }
            )
            const product = checkProduct[0]
            if (product){
                res.status(400).json("This product already exists")
            }
            else{
                const newProduct = await Product.create(
                    {
                        name: name,
                        quantity: quantity,
                        price: price,
                        UserId: userId
                    }
                ).catch((err)=>{console.log(err.message); res.status(500).json(err.message)})
                
                res.status(200).json(newProduct)
            }
    } catch (error) {
        console.log(error.message)
    res.status(500).json(error.message)
    }

})

//get all products
productsRouter.get('/allProducts', authorization, async (req, res) =>{
    try {
        const productsFromDb = await Product.findAll()

        if (productsFromDb.length > 0){
            res.status(200).json(productsFromDb)
        }else{
            res.status(400).json("No products found")
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message) 
    }
})

//get all products by user
productsRouter.get('/allProductsByUser/:id', authorization, async (req, res) =>{
    try {
        const id = req.params.id

        const productsFromDb = await Product.findAll({
            where: {
                UserId : id
            }
        })

        if (productsFromDb.length > 0){
            res.status(200).json(productsFromDb)
        }else{
            res.status(400).json("No products found")
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message) 
    }
})

//get a specific product
productsRouter.get('/:id', authorization, async (req, res) =>{
    try {
        const id = req.params.id

        const productsFromDb = await Product.findAll({
            where: {
                id : id
            }
        })

        if (productsFromDb.length > 0){
            res.status(200).json(productsFromDb)
        }else{
            res.status(400).json("No products found")
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message) 
    }
})

//update product
productsRouter.put('/:id', authorization, async (req, res) =>{
    try {
        const id = req.params.id

        const productsFromDb = await Product.findAll({
            where: {
                id : id
            }
        })

        const {name, quantity, price} = req.body
        const product = productsFromDb[0]

        if (productsFromDb.length > 0){
            if (name) {
                product.name = name
            }
            if (quantity) {
                product.quantity = quantity
            }
            if (price) {
                product.price = price 
            }

            await product.save()
            res.status(202).json(productsFromDb)
            
        }else{
            res.status(404).json(`No product with Id ${id} found `)
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message) 
    }
})

//delete product
productsRouter.delete('/:id', authorization, async (req, res) =>{
    try {
        const id = req.params.id

        const productsFromDb = await Product.findAll({
            where: {
                id : id
            }
        })
        const product = productsFromDb[0]

        if (productsFromDb.length > 0){
            const deleteProduct = await Product.destroy({
                where: {
                    id: id
                }
            })
            res.status(200).json('Product Deleted')
        }else{
            res.status(400).json("No products found")
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message) 
    }
})

module.exports = productsRouter