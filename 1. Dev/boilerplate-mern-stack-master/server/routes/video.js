const express = require('express');
const router = express.Router();
//const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");   // multer를 이용하여 파일을 저장한다!
var ffmpeg = require("fluent-ffmpeg");

// config 옵션이라고 생각하면 된다!
let storage = multer.diskStorage({
    // 파일을 올릴때 저장할지 설명을 해주는것이다.
    destination : (req, file, cb) => {
        cb(null, "uploads/");
    },

    // 저장을 할 때 어떤 파일이름으로 저장을 할지
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },

    // mp4만 파일이 저장 가능 하도록!
    fileFilter : (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
        // 만약 png 파일도 출력을 하고 싶다면?!
        // if (ext !== '.mp4' || ext !== '.png') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

// 파일은 하나만(싱글)
const upload = multer({ storage : storage}).single("file");

router.post('/uploadfiles', (req, res) => {
    // 클라이언트에서 받은 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if(err) {
            return res.json({ success : false, err})
        }
        
        // url은? 파일을 업로드 하면 upload 폴더 안에 들어가는데 그 경로를 클라이언트에 보내준다!
        return  res.json({
              success : true
            , url : res.req.file.path
            , fileName : res.req.file.filename
        })
    })
})

router.post('/thumbnail', (req, res) => {
    // 썸네일 생성하고 비디오 러닝타입도 가져오기

    let filePath = ""
    let fileDuration = ""

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })

    // 썸네일 생성
    // 클라이언트에서 전달 받은 비디오 저장 경로
    ffmpeg(req.body.url)
    .on('filenames', function (filenames) {
        console.log('Will generate ' + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    // 썸네일을 생성 후 뭐할 것 인지?
    .on('end', function() {
        console.log('Screenshots taken');
        return res.json({ success : true, url : filePath, fileDuration : fileDuration})
    })
    // 에러 발생 시 뭐 할 것인지?!
    .on('error', function (err) {
        console.error(err);
        return res.json({ success: false, err});
    })
    //  옵션을 줄수가 있다!
    .screenshots({
        count : 3,  // 세개의 썸네일을 찍을 수 있다!
        folder : 'uploads/thumbnails',  // 저장할 폴더
        size : '320x240',               // 사이즈
        filename : 'thumbnail-%b.png'   // 파일 명
    })
})

module.exports = router;