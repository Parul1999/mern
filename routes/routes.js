const express = require('express')
const users = express.Router()
const cors = require('cors');//cross origin resource sharing
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const Users=require('../modals/User')

users.use(cors())
Secret_Key = 'secret'

users.post('/register', (req, res) => {
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password
    }
    User.findOne(userData.email).then(user => {                             //User is a name of a database
        if (!user) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                userData.password = hash
                User.create(userData).then(user => { res.json({ status: user.email + 'Registered' }) })
            }).catch(err => {
                res.send('error:' + err)
            })
        }
        else{
            res.json({error:'User already registered'})

        }
    }).catch(err=>{
        res.send(err)
    })
})
users.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    // Passwords match
                    const payload = {
                        _id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email
                    }
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    })
                    res.send(token)
                } else {
                    // Passwords don't match
                    res.json({ error: 'Password Incorrect' })
                }
            } else {
                res.json({ error: 'User does not exist' })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

users.get('/profile',(req,res)=>
{
    var decode = jwt.verify(req.headers['authorization'],process.env.Secret_Key)
    User.findOne({
        _id:decode._id
    }).then(user=>{
        if(user)
    {
        res.json(user)
    }
        else
    {
        res.json({error:'User Not Found'})
    }
    
        }).catch(err=>
            {res.send('error'+err)})
})
module.exports=users