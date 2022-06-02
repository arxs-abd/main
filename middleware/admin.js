const adminVerify = (req, res, next) => {
    if (req.session.userName === 'Admin') return next()
    return res.redirect('/')
}


module.exports = {
    adminVerify
}