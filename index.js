const express = require('express')
const session = require('express-session')
const ejsLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const methodeOverride = require('method-override')

// Router
const activityRouter = require('./routes/activity')

const app = express()

app.set('view engine', 'ejs')

app.use(ejsLayout)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(express.static(__dirname + '/public'))
app.use(cookieParser('1n15KR1p51'))
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: '1n15KR1p51',
}))
app.use(methodeOverride('_method'))
app.use(flash())

app.use(activityRouter)



// listen on port
app.listen(3000, () => console.log('Server Running at http://localhost:3000'));
// app.listen(3000, '192.168.1.76', () => console.log('Server Running at http://localhost:3000'));