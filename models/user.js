const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcrypt')

require('../utils/db')

const userSchema = new mongoose.Schema( {
    name : {
        type : String,
        required : true,
    },
    uid : {
        type : String,
        required : true,
    },
    // file : [File],
    password : {
        type : String,
        required : true,
    },
})
userSchema.plugin(mongoosePaginate)
const User = mongoose.model('User', userSchema )


const salt = bcrypt.genSaltSync(10)

const verifyPassword = (password, h) => {
    return bcrypt.compare(password, h)
}

const createPassword = (password) => {
    return bcrypt.hashSync(password, salt)
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
    User,
    userSchema,
    verifyPassword,
    createPassword
}