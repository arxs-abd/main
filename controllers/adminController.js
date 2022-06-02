require('../utils/db')
const {User, createPassword} = require('../models/user')
const {File} = require('../models/files')

const admin = async (req, res) => {
    const allUser = await User.find()
    const allFile = await File.find()
    // res.send(allUser)
    res.render('../views/admin-page', {
        layout : 'main',
        user : req.session.userName,
        allUser : allUser,
        allFile : allFile,
        errorsUser : req.flash('errors-add-user'),
        successUser : req.flash('success-add-user'),
        errorsFile : req.flash('errors-add-file'),
        successFile : req.flash('success-add-file'),
    })
}

const addUser = async (req, res) => {
    const nim = req.body.nim
    const userName = req.body.name
    const password = req.body.password
    const newUser = await new User({
        uid : nim,
        name : userName,
        password : createPassword(password)
    })
    newUser.save()
    req.flash('success-add-user', 'New User Has Been Added')
    return res.redirect('/admin')
}

const updateUser = async (req, res) => {
    const name = req.body.name
    const uid = req.body.nim
    // const user = await User.findOne({uid : uid})

    await User.updateOne({
        uid : uid
    },
    {
        $set : {
            uid : uid,
            name : name,
        }
    })

    req.flash('success-add-user', 'User Has Been Updated')
    return res.redirect('/admin')
}

const updateUserByUser = async (req, res) => {
    const name = req.body.name
    const uid = req.body.nim
    const password = req.body.password
    // return res.send(req.body)
    // const user = await User.findOne({uid : uid})
    const update = {
        uid : uid,
        name : name,
    }
    if (password.length != 0) update.password = createPassword(password)
    // console.log(update)

    // return res.send(update)

    await User.updateOne({
        _id : req.body._id
    },
    {
        $set : update
    })

    const newUserUpdate = await User.findOne({_id : req.body._id})
    req.session.details = newUserUpdate

    req.flash('success-update-user', 'User Has Been Updated')
    return res.redirect('/')
}

const deleteUser = async (req, res) => {
    // return res.send(req.body)
    const id = req.body.id
    const name = req.body.name
    await User.deleteOne({_id : id})
    req.flash('success-add-user', `User ${name} Has Been Deleted`)
    return res.redirect('/admin')
}

const pagination = async (req, res) => {
    const {limit : lim, pages} = req.query
    const {limit, offset} = getPagination(pages, lim)

    const data = await User.paginate({}, {offset, limit})
    const result = {
        totalItems : data.totalDocs,
        data : data.docs,
        totalPages : data.totalPages,
        currentPage : data.page - 1,
    }
    res.send(result)
}

const getPagination = (page, size) => {
    const limit = size ? +size : 3
    const offset = page ? page * limit : 0
    return { limit, offset }
}


module.exports = {
    admin,
    addUser,
    updateUser,
    deleteUser,
    updateUserByUser,
    pagination
}