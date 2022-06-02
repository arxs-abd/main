const multer = require('multer')
const fileStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'public/docs')
    },
    filename : (req, file, cb) => {
        cb(null, new Date().getTime() +  '-' + file.originalname)
    }
})
const fileStorageRes = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'public/result')
    },
    filename : (req, file, cb) => {
        cb(null, new Date().getTime() +  '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    // console.log(file.mimetype)
    if (file.mimetype == 'application/pdf') cb(null, true)
    else cb(null, false)
}

module.exports = {
    fileStorage,
    fileStorageRes,
    fileFilter
}