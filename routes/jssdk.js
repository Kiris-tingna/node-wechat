'use strict';
var config = require('../config/weixin.js');

module.exports = function (app, api) {
    // 微信内网页
    app.get('/js-sdk', function (req, res){
        // 获取jssdk 配置参数
        api.getJsConfig({ url: config.jsurl + '/js-sdk' }, function (err, result) {
            if(err){
                console.log(err);
            }else{
                res.render('jssdk', {weixin: result});
            }
        })
    })
}