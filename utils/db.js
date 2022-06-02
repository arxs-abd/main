const mongoose = require('mongoose')
const URI = 'mongodb://127.0.0.1:27017'
const DB = 'latihan'

mongoose.connect(`${URI}/${DB}`, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
})