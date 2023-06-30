const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())

app.use(express.json())
const port = 4000
app.listen(port, ()=>{
    console.log(`Server started on ${port}.`
    )
})