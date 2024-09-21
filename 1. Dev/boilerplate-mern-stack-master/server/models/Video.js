const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    // 쓰는 사람의 ID
    writer : {
        // models/User.js 의 모든 정보를 불러올 수 있다!
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    title : {
        type : String,
        maxlength : 50
    },
    description : {
        type : String
    },
    privacy : {
        type : Number
    },
    filePath : {
        type : String
    },
    category : {
        type : String,
    },
    views : {
        type : Number,
        default : 0
    },
    duration : {
        type : String,
    },
    thumbnail : {
        type : String,
    },
}, { timestamps : true })   // 데이터를 만든 시각을 저장한다



const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }