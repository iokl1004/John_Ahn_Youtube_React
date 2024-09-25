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
        if(subscribe.length !== 0) { // 0이 아닐경우, 구독을 하고 있다는 뜻.
            result = true
        }
        res.status(200).json({ success : true, subscribed : result })
    })
})

// 구독 취소
router.post('/unSubscribe', (req, res) => {
    // findOneAndDelete : filter와 일치하는 컬렉션에서 첫 번째 일치 문서를 삭제.
    Subscriber.findOneAndDelete({ userTo : req.body.userTo, userFrom : req.body.userFrom })
    .exec((err, doc) => {
        if(err) return res.status(400).json({ success : false, err});
            res.status(200).json({ success : true, doc})
    })
})

// 구독
router.post('/Subscribe', (req, res) => {
    const subscribe = new Subscriber(req.body);

    subscribe.save((err, doc) => {
        if(err) return res.json({ success : false, err });
        res.status(200).json ({ success : true});
    });
})

module.exports = router;