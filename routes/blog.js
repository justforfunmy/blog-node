var express = require('express');
var router = express.Router();
var {
    userModel,
    blogModel
} = require('../mongodb')


router.get('/', (req, res) => {
    var params = {};
    var agreeList=[];
    
    if (req.session.account) {
        params = {
            activeIndex: req.query.activeIndex,
            userName: req.session.account.userName
        };
    } else {
        params = {
            activeIndex: req.query.activeIndex,
            userName: null
        };
    }

    if (req.query.activeIndex == 1) {
        blogModel.find({}, (err, docs) => {
            if (err) return res.render('blog', params);
            if(req.session.account){
                userModel.findById(req.session.account.userId,(err,doc)=>{
                    if(err) return res.render('/');
                    agreeList = doc.agrees;
                    res.render('blog', Object.assign(params, {
                        blogList: docs
                    },{agreeList}))
                })
            }else{
                res.render('blog', Object.assign(params, {
                    blogList: docs
                },{agreeList}))
            }
            
        })
    }
})

router.get('/newBlog', (req, res) => {
    if (!req.session.account) {
        res.render('noticeMsg', {
            noticeMsg: '你还没登录',
            directTo: '/users/login'
        });
        return
    }
    res.render('newBlog')
})

router.post('/newBlog', (req, res) => {
    if (!req.session.account) {
        return res.render('noticeMsg', {
            noticeMsg: '用户已过期',
            directTo: '/users/login'
        })
    }
    var createtime = new Date();
    var authorName = req.session.account.userName;
    userModel.findOne({
        name: authorName
    }, (err, doc) => {
        if (err) return res.render('noticeMsg', {
            noticeMsg: '系统错误',
            directTo: '/blog/newBlog'
        })
        var author = {
            authorId: doc._id,
            authorName: doc.name,
            authorTags: doc.tags
        };
        var _blog = Object.assign(author, req.body, {
            createtime
        });
        console.log(_blog);
        blogModel.create(_blog, (err, doc) => {
            if (err) return res.render('noticeMsg', {
                noticeMsg: '提交失败，请重试',
                directTo: '/blog/newBlog'
            })
            res.redirect('/')
        })
    })
})

module.exports = router;