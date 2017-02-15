'use strict';
var config = require('../config/weixin.js');

module.exports = function (app, api) {
    // 微信内网页
    app.get('/js-sdk', function (req, res){
        var param = {
            url: config.jsurl + '/js-sdk'
        }
        // 获取jssdk 配置参数
        api.getJsConfig(param, function (err, result) {
            if(err){
                console.log(err);
            }else{
                console.log(result);
                res.render('jssdk', {weixin: result});
            }
        })
    });
}