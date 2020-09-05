var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var mongoose= require('mongoose')
const port = process.env.PORT || 5000;

var app = express()
app.use(cors())
app.use(
    bodyParser.urlencoded({
        extended:false
    }))
//const mongoURI = 'mongodb://localhost:27017/newDB' //--->locally
const mongoURI ='mongodb+srv://apiTest:1234@cluster0.au6hy.mongodb.net/test'
mongoose.connect(
    mongoURI, {
        useNewUrlParser:true
}
).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))

var routes = require('./routes/routes')
app.use('./routes',routes)
app.listen(port, function () { console.log('Server Is Connected') })