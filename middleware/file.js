const {check, validationResult} = require('express-validator')
const fs = require('fs')

const toAddFile = [
    check('title').isLength({min : 4}),
    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) return next()
        req.flash('errors-add-file', 'Failed to Add New File')
        if (typeof req.file === 'undefined') {
            return res.redirect('/admin')
        }
        fs.unlink(`public/docs/${req.file.filename}`, (error) => {
            return res.redirect('/admin')
        })
    }
]

module.exports = {
    toAddFile
}