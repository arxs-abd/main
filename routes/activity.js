const express = require('express')
const multer = require('multer')
const fileUpload = require('express-fileupload')

const {home} = require('../controllers/homeController')
const {loginView, loginAuth, logout} = require('../controllers/loginController')
const {admin, addUser, deleteUser, updateUser, updateUserByUser, pagination} = require('../controllers/adminController')
const {uploadPdf, deletePdf, result, resultNone} = require('../controllers/fileController')

const {toLogin, toAddUser, toUpdateUser, toUpdateUserByUser} = require('../middleware/user')
const {adminVerify} = require('../middleware/admin')
const { toAddFile } = require('../middleware/file')
const { fileStorage, fileFilter, fileStorageRes } = require('../config/fileConfig')

const uploadFile = multer({
    storage : fileStorage,
    fileFilter : fileFilter
}).single('upload')

const uploadFileRes = multer({
    storage : fileStorageRes,
    fileFilter : fileFilter
}).single('upload-res')

const router = express.Router()

router.get('/', home)
router.post('/result', uploadFileRes, result)
router.post('/result-none', fileUpload(), resultNone)
router.put('/user', toUpdateUserByUser, updateUserByUser)

router.get('/login', loginView)
router.post('/login', toLogin,  loginAuth)
router.get('/logout', logout)

router.post('/pdf', uploadFile, toAddFile, uploadPdf)
router.delete('/pdf', deletePdf)

router.get('/user', pagination)

// router.use(adminVerify)
router.get('/admin', admin)
router.post('/admin-user', toAddUser, addUser)
router.put('/admin-user', toUpdateUser, updateUser)
router.delete('/admin-user', deleteUser)


module.exports = router