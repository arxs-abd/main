const pdfParse = require('pdf-parse')
const {File, sanitizePdf} = require('../models/files')
const {promisify} = require('util')
const fs = require('fs')
const { User } = require('../models/user')

const allChar = ["-", " ", ""]


const unlink = promisify(fs.unlink)

const uploadPdf = async (req, res) => {
    // return res.send(req.file)
    const location = `${req.file.destination}/${req.file.filename}`
    const text = (await pdfParse(location)).text
    const result = sanitizePdf(text)

    const newFile = new File({
        name : req.body.title,
        fileName : req.file.filename,
        uploader : req.session._id,
        text : result,
    })

    newFile.save()
    req.flash('success-add-file', 'File Has Been Added')
    if (req.session.userName != 'Admin') return res.redirect('/')
    return res.redirect('/admin')
}

const deletePdf = async (req, res) => {
    // res.send(req.body)
    const id = req.body.id
    const oldFile = await File.findOne({_id : id})
    // return res.send(oldFile.fileName)
    fs.unlink(`public/docs/${oldFile.fileName}`, async(err) => {
        await File.deleteOne({_id : id})
        req.flash('success-add-file', 'File Has Been Deleted')
        return res.redirect('/admin')
    })
}

const resultNone = async (req, res) => {
    const allUser = await User.find({}, {_id : 1, name : 1})
    const allFile = await File.find({}, {name : 1, text : 1, uploader : 1, fileName : 1})

    const location = req.files['upload-res']
    const text = (await pdfParse(location)).text
    const resultText = sanitizePdf(text)
    const dataFile = {
        name : req.files['upload-res'].name,
        char : text.length,
        word : text.split(' ').length,
        size : req.files['upload-res'].size,
    }

    const result = {
        fileUpload : dataFile,
        data : resultText,
        user : allUser,
        file : allFile,
    }
    res.send(result)
}

const result = async (req, res) => {
    const allUser = await User.find({}, {_id : 1, name : 1})
    const allFile = await File.find({}, {name : 1, text : 1, uploader : 1, fileName : 1})
    let result
    if (req.body.text !== '') {
        result = sanitizePdf(req.body.text)
    } else {
        const location = req.file.path
        const text = (await pdfParse(location)).text
        result = sanitizePdf(text)
    }
    
    let allData = {}
    
    const retirve = {
        fileInformation : req.file,
        resultAll : [],
    }

    retirve.fileInformation.length = separator(result.length)
    retirve.fileInformation.word = separator(result.split(' ').length)
    
    addDict(result, allData)
    allFile.forEach(files => {
        addDict(files.text, allData)
    })

    for (const prop in allData) {
        if (result.split(' ').includes(prop)) {
            let index = 0
            result.split(' ').forEach(x => {
                if (prop === x) index += 1
            })
            allData[prop]["s"] = index
        } else {
            allData[prop]["s"] = 0
        }

        allFile.forEach((e, i) => {
            if (e.text.split(' ').includes(prop)) {
                let index = 0
                e.text.split(' ').forEach(x => {
                    if (prop === x) index += 1
                })
                allData[prop]["s" + (i + 1)] = index
            } else {
                allData[prop]["s" + (i + 1)] = 0
            }
        })

    }
    
    const objectData = Object.keys(allData)[0]
    const varObject = Object.keys(allData[objectData])
    varObject.shift()


    varObject.forEach((e, i) => {
        allFile[i].text = ''
        let aTimesB = 0
        let aa = 0
        let bb = 0
    
        Object.keys(allData).forEach(f => {
            aTimesB += allData[f]['s'] * allData[f][e]
            aa += allData[f]['s'] * allData[f]['s']
            bb += allData[f][e] * allData[f][e]
        })
    
        const resultSimilarity = (2 * aTimesB) / (aa + bb)
        // console.log(`Similarity Data ${i + 1} Is ${Math.round(resultSimilarity * 100)} %`)
        const resForRetervie = {
            file : allFile[i],
            result : Math.round(resultSimilarity * 100)
        }
        retirve.resultAll.push(resForRetervie)
    
    
    })

    retirve.resultAll.sort((a, b) => (a.result < b.result) ? 1 : -1)

    
    let resultPlag = 0
    retirve.resultAll.forEach(e => {
        resultPlag += e.result
    })
    retirve.plag = Math.round(resultPlag / retirve.resultAll.length)
    retirve.resultAll = retirve.resultAll.filter(file => {
        return file.result > 50
    })
    
    await unlink(location)
    

    res.render('../views/result-page', {
        layout : 'main',
        user : allUser,
        result : retirve
    })
}

function addDict(datax, to) {
    datax.toLowerCase().split(' ').forEach(e => {
        e.trim()
        if (!to.hasOwnProperty(e)) to[e] = {}
    })
}

function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return str.join(".");
}

module.exports = {
    uploadPdf,
    deletePdf,
    result,
    resultNone,
}