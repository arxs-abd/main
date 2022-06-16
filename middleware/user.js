const {check, validationResult} = require('express-validator')
const {User} = require('../models/user')

const toLogin = [
    [
        check('nim').isLength({min : 10}),
        check('password').isLength({min : 5}),
        (req, res, next) => {
            const errors = validationResult(req)
            if (errors.isEmpty()) return next()
            if (errors.array()[0].value === '030400' && errors.array()[0].param === 'nim') return next()
            req.flash('errors', 'Your Nim or Password is Wrong')
            return res.redirect('/login')
        }
    ],
]

const toAddUser = [
    check('nim').isLength({min : 4}).custom(async (value) => {
        const isNimExist = await User.findOne({uid : value})
        if (isNimExist) throw new Error('NIM is Already exist')
        return true
    }),
    check('name').isLength({min : 4}),
    check('password').isLength({min : 5}),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) return next()
        req.flash('errors-add-user', 'Failed to Add New User')
        return res.redirect('/admin')
    }
]

const toUpdateUser = [
    check('name').isLength({min : 4}),
    // check('nim').isLength({min : 4}).custom(async value => {
    //     const isNimExist = await User.findOne({uid : value})
    //     if (isNimExist) throw new Error('NIM is Already exist')
    //     return true
    // }),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) return next()
        req.flash('errors-add-user', 'Failed to Update User')
        return res.redirect('/admin')
    }
]

const toUpdateUserByUser = [
    check('nim').isLength({min : 4}).custom(async (value, {req}) => {
        const id = req.body._id
        const isNimExist = await User.findOne({uid : value})
        if (isNimExist && isNimExist._id.toHexString().slice(0, 23) !== id.slice(0, 23)) throw new Error('NIM is Already exist')
        return true
    }),
    check('name').isLength({min : 4}),
    check('password').custom((val) => {
        if (val.length !== 0 && val.length < 5) throw new Error('Minimum Password Length is 4')
        return true
    }),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) return next()
        req.flash('errors-update-user', 'Failed to Update User')
        return res.redirect('/')
    }
]


module.exports = {
    toLogin,
    toAddUser,
    toUpdateUser,
    toUpdateUserByUser
}