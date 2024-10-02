const express = require('express');
const router = express.Router();

// model 가져오기
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

// Like

// 해당 영상의 좋아요 정보들 가져오기
router.post("/getLikes", (req, res) => {
    let variable = {}

    // 해당 비디오의 좋아요 일경우
    if(req.body.videoId) {
        variable = { videoId : req.body.videoID}
    } else {
        variable = { videoId : req.body.commentID}
    }

    Like.find(variable)
    .exec((err, likes) => {
        if(err) return res.status(400).send(err)
            res.status(200).json({ success : true, likes })
    })
});

// 해당 영상의 싫어요 정보들 가져오기
router.post("/getDisLikes", (req, res) => {
    let variable = {}

    // 해당 비디오의 좋아요 일경우
    if(req.body.videoId) {
        variable = { videoId : req.body.videoID}
    } else {
        variable = { videoId : req.body.commentID}
    }

    Dislike.find(variable)
    .exec((err, dislikes) => {
        if(err) return res.status(400).send(err)
            res.status(200).json({ success : true, dislikes })
    })
});

module.exports = router;