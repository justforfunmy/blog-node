var express = require('express');
var router = express.Router();
var path = require('path');
var multiparty = require('multiparty');
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');


//图片上传


router.post('/', (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = 'uploads'; //上传文件的保存路径
    form.keepExtensions = true; //保存扩展名
    form.maxFieldsSize = 20 * 1024 * 1024; //上传文件的最大大小
    form.parse(req, function(err, fields, file) {
        var filePath = '';
        //如果提交文件的form中将上传文件的input名设置为tmpFile，就从tmpFile中取上传文件。否则取for in循环第一个上传的文件。  
        if (file.tmpFile) {
            filePath = file.tmpFile.path;
        } else {
            for (var key in file) {
                if (file[key].path && filePath === '') {
                    filePath = file[key].path;
                    break;
                }
            }
        }
        //文件移动的目录文件夹，不存在时创建目标文件夹  
        var targetDir = path.resolve(__dirname, '../public/files');
        if (!fs.existsSync(targetDir)) {
            fs.mkdir(targetDir);
        }
        var fileExt = filePath.substring(filePath.lastIndexOf('.'));
        //判断文件类型是否允许上传  
        if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
            var err = new Error('此文件类型不允许上传');
            res.json({ code: -1, message: '此文件类型不允许上传' });
        } else {
            //以当前时间戳对上传文件进行重命名  
            var fileName = new Date().getTime() + fileExt;
            var targetFile = path.join(targetDir, fileName);
            //移动文件  
            fs.rename(filePath, targetFile, function(err) {
                if (err) {
                    console.info(err);
                    res.json({ code: 0, message: '操作失败' });
                } else {
                    //上传成功，返回文件的相对路径  
                    var fileUrl = '/files/' + fileName;
                    res.json({ code: 1, fileUrl: fileUrl, message: '上传成功' });
                }
            });
        }
    });

})

module.exports = router;