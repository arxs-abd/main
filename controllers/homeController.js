const { File } = require('../models/files')

require('../utils/db')

const home = async (req, res) => {
    const fileUser = await File.find({uploader : req.session._id})
    res.render('../views/home-page', {
        layout : 'main',
        user : req.session.userName,
        details : req.session.details,
        errorsUpdate : req.flash('errors-update-user'),
        successUpdate : req.flash('success-update-user'),
        errorsFile : req.flash('errors-add-file'),
        successFile : req.flash('success-add-file'),
        file : fileUser
    })
}

module.exports = {
    home
}