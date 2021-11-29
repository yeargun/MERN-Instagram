const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGOURI} = require('./keys') 

mongoose.connect(MONGOURI)

require('./models/user')
require('./models/post')


app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))


mongoose.connection.on('connected', ()=> {
    console.log("connected yeah")
})
mongoose.connection.on('error', (err)=> {
    console.log("fault: ",error)
})

app.listen(PORT, ()=>{
    console.log("server is running on", PORT)
})