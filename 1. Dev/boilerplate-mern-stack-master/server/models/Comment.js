const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
    writer : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    postId : {
        type : Schema.Types.ObjectId,
        ref : 'Video'
    },
    responseTo : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    content : {
        type : String
    }
}, { timestamps : true })   // 데이터를 만든 시각을 저장한다



const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment }