require('../utils/db')
const mongoose = require('mongoose')
const {stopWord} = require('../utils/stopWord')
const {userSchema} = require('../models/user')
const allChar = ["-", " ", ""]

const fileSchema = {
    name : {
        type : String,
        required : true,
    },
    fileName : {
        type : String,
        required : true
    },
    uploader : {
        type : String,
        required : true
    },
    text : {
        type : String,
        required : true,
    },
}
const File = mongoose.model('File', fileSchema)

const sanitizePdf = (text) => {
    const textFix = text.toLowerCase().replace(/[^a-z0-9 ]/gi, ' ')
    const newData = []
    // remove Stopword
    textFix.toLowerCase().split(' ').forEach(e => {
        e.trim()
        if (e.length > 2 && !stopWord.includes(e) && !allChar.includes(e)) newData.push(e)
    })
    return newData.join(' ')
}
// const newUser = new user({
//     name : 'Aris Akhyar Abdillah',
//     uid : 'H071171505',
//     password : bcrypt.hashSync("12345", salt)
// })

// newUser.save().then(res => {
//     console.log(res)
// })

module.exports = {
    File,
    sanitizePdf
}