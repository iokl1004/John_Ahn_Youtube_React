const express = require('express');
const router = express.Router();

const { Subscriber } = require("../models/Subscriber");

// 해당 영상의 구독자 수 가져오기
router.post('/subscribeNumber', (req, res) => {
    Subscriber.find({ 'userTo' : req.body.userTo })
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err);
        return res.status(200).json({ success : true, subscribeNumber : subscribe.length })
    })
})

// 내가 정말 해당 영상을 구독을 하고 있는지?
router.post('/subscribed', (req, res) => {
    Subscriber.find({ 'userTo' : req.body.userTo, 'userFrom' : req.body.userFrom })
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err);
        let result = false
        if(subscribe.lenth !== 0) { // 0이 아닐경우, 구독을 하고 있다는 뜻.
            result = true
        }
        res.status(200).json({ success : true, subscribed : result })
    })
})

module.exports = router;