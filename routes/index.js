var users = require('./users');
var blog = require('./blog');
var upload = require('./upload');
var agree = require('./agree');

var wsTrendNumber = require('./wStreet/wsTrendNumber')

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.redirect('/blog?activeIndex=1')
    });

    app.use('/users', users);
    app.use('/blog', blog);
    app.use('/upload', upload);
    app.use('/agree', agree);

    //华尔街见闻api
    app.use('/wsTrendNumber',wsTrendNumber)
}