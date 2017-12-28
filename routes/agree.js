var express = require('express');
var router = express.Router();
var {
    userModel,
    blogModel
} = require('../mongodb');
var mongoose = require('mongoose');


//POST agree
router.post('/', (req, res) => {
    if (!req.session.account) {
        return res.json({
            code: 0,
            msg: '未登录不能点赞'
        })
    }
    var body = req.body;
    userModel.update({
        _id: req.session.account.userId
    }, {
        $push: {
            agrees: body.blogId
        }
    }, (err) => {
        if (err) return res.json({
            code: 0,
            msg: 'falied'
        });
        var blogId = mongoose.mongo.ObjectId(body.blogId);
        userModel.findById(req.session.account.userId, (err, doc) => {
            if (err) return res.json({
                code: 0,
                msg: 'failed'
            });
            blogModel.update({
                "_id": blogId
            }, {
                $push: {
                    "agrees": doc._id
                }
            }, (err) => {
                if (err) return res.json({
                    code: 0,
                    msg: 'failed'
                })
                res.json({
                    code: 1,
                    msg: 'agreed'
                })
            })
        })
    })
})

//POST disagree
router.post('/cancelAgree', (req, res) => {
    if (!req.session.account) {
        res.json({
            code: 0,
            msg: '用户已过期'
        })
        return
    }
    var body = req.body;
    userModel.update({
        _id: req.session.account.userId
    }, {
        '$pull': {
            agrees: body.blogId
        }
    }, (err, doc) => {
        if (err) return res.json({
            code: 0,
            msg: 'failed'
        });
        var blogId = mongoose.mongo.ObjectId(body.blogId);
        userModel.findById(req.session.account.userId, (err, doc) => {
            if (err) return res.json({
                code: 0,
                msg: 'failed'
            });
            blogModel.update({
                "_id": blogId
            }, {
                $pull: {
                    "agrees": doc._id
                }
            }, (err) => {
                if (err) return res.json({
                    code: 0,
                    msg: 'failed'
                })
                res.json({
                    code: 1,
                    msg: 'disagreed'
                })
            })
        })
    })
})





module.exports = router;