const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')



router.post('/register', (req,res)=>{
    const {name,email,password,pic} = req.body
    if(!email || !password || !name){
        return res.status(422).json({error:"please fill all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exists with that email"})
        }
        bcrypt.hash(password,12)
        .then(hashedPassword=>{
            const user = new User({
                email,
                password:hashedPassword,
                name,
                pic
            })
            user.save()
            .then(user=>{
                res.json({message:"saved successfuly"})
            })
            .catch(err=>{
                console.log("some errors while registering:",err)
            })
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/login',(req,res)=>{
    const{email,password} = req.body
    if(!email || !password){
        return req.status(422).json({error:"please fill required fields"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})



module.exports = router