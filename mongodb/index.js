var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/zhihu', (err) => {
    if (err) {
        console.log(err);
        return
    }
    console.log('mongodb connected')
})

var userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    password: {
        type: String
    },
    tags: {
        type: String
    },
    blogs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'blog'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }],
    agrees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog'
    }]
})

var userModel = mongoose.model('user', userSchema, 'user');

var blogSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    authorName:{
        type: String,
        ref: 'user'
    },
    authorTags: {
        type: String,
        ref: 'user'
    },
    image: {
        type: String
    },
    title: {
        type: String
    },
    abstract: {
        type: String
    },
    content: {
        type: String
    },
    topic: {
        type: String
    },
    createtime: {
        type: String
    },
    agrees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
})

var blogModel = mongoose.model('blog', blogSchema, 'blog');

var commentSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    authorName:{
        type: String,
        ref: 'user'
    },
    blogId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'blog'
    },
    content:{
        type:String
    }
    
})

var commentModel = mongoose.model('comment', userSchema, 'comment');

// 应用与华尔街见闻
let wsTrendNumberSchema = new mongoose.Schema({
    title:{
        type:String
    },
    shortContent:{
        type:String
    },
    trendDatas:[{
        standard:{
            type:String
        },
        number:{
            type:Number
        },
        trend:{
            type:String
        },
        percent:{
            type:Number
        }
    }]
})
let wsTrendNumberModel = mongoose.model('wsTrendNumber',wsTrendNumberSchema,'wsTrendNumber')

module.exports = {
    userModel,
    blogModel,
    commentModel,
    wsTrendNumberModel
}