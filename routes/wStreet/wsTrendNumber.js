let express = require('express');
let router = express.Router();
let {wsTrendNumberModel} = require('../../mongodb')

router.get('/',(req,res)=>{
    wsTrendNumberModel.find({},(err,doc)=>{
        if(err){
            return res.json({code:0,msg:'获取失败'})
        }else{
            return res.json({
                code:1,
                data:doc
            })
        }
    })
})

module.exports = router;