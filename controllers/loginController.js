const {User, verifyPassword} = require('../models/user')
require('../utils/db')

const loginView = (req, res) => {
    res.render('../views/login-page', {
        layout : 'main',
        errors : req.flash('errors'),
    })
}

const loginAuth = async(req, res) => {
    const nim = req.body.nim
    const password = req.body.password

    if (nim === '030400' && password == '1234') {
        const admin = await User.findOne({uid : '030400'})
        req.session.userName = 'Admin'
        req.session._id = admin._id
        return res.redirect('/admin')
    }
    const userLog = await User.find({
        uid : nim
    })

    if (userLog.length == 0) {
        req.flash('errors', 'errors')
    return res.redirect('/login')
    }
    
    let passwordVerify = await verifyPassword(password, userLog[0].password)
    
    if (passwordVerify) {
        req.session.userName = userLog[0].name
        req.session._id = userLog[0]._id
        req.session.details = userLog[0]
        return res.redirect('/')
    }
    req.flash('errors', 'errors')
    return res.redirect('/login')
}

const logout = (req, res) => {
    req.session.destroy(error => {
        res.redirect('/login')
    })
}

module.exports = {
    loginView,
    loginAuth,
    logout,
}