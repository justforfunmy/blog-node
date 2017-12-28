var express = require('express');
var router = express.Router();
var {
    userModel
} = require('../mongodb')

/* GET login view */
router.get('/login', (req, res, next) => {
    
    var account = req.session.account || {
        userName: '',
        password: ''
    };
    res.render('login', {
        account: account
    });
});
// GET signUp view
router.get('/signUp', (req, res, next) => {
    res.render('signUp', {
        error: false
    });
});
//POST signUp
router.post('/signUp', (req, res) => {
    let body = req.body;
    
    if (body.password !== body.rePassword) {
        res.render('signUp', {
            error: true,
            msg: "两次密码不一致"
        })
    } else {
        userModel.create({
            name: body.userName,
            password: body.password,
            tags: body.tags
        }, (err, doc) => {
            if (err) {
                res.render('noticeMsg', {
                    noticeMsg: '系统错误',
                    directTo: '/users/signUp'
                });
            } else {
                if (body.remembered === 'true') {
                    
                    req.session.account = {
                        userId: doc._id,
                        userName: body.userName,
                        password: body.password
                    }

                } else {
                    req.session = null;
                }
                
                res.render('noticeMsg', {
                    noticeMsg: '注册成功',
                    directTo: '/users/login'
                });

            }
        })

    }
})

//POST login
router.post('/login', (req, res) => {
    let body = req.body;
    userModel.findOne({
        name: body.userName,
        password: body.password
    }, (err, doc) => {
        
        if (err) {
            res.render('noticeMsg', {
                noticeMsg: '系统错误',
                directTo: '/users/login'
            });
        } else {
            if (doc) {
                req.session.account = {
                    userId:doc._id,
                    userName: body.userName,
                    password: body.password
                };
                console.log(req.session.account)
                res.render('noticeMsg', {
                    noticeMsg: '登录成功',
                    directTo: '/blog?activeIndex=1'
                })
            } else {
                res.render('noticeMsg', {
                    noticeMsg: '用户名或密码错误',
                    directTo: '/users/login'
                })
            }
        }
    })
})

//GET logout
router.get('/logout', (req, res) => {
    req.session.account = null;
    res.json({
        msg: 'logout done',
        code: '1'
    })
})

module.exports = router;