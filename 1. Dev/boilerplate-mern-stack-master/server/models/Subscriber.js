const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
    userTo : {
        type: Schema.Types.ObjectId,
        ref : 'User'
    },
    userFrom : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
}, { timestamps : true })   // 데이터를 만든 시각을 저장한다



const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }