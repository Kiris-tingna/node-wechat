'use strict';
var express = require('express');
var webot = require('weixin-robot');
var weapi = require('wechat-api');
var config = require('./config/weixin.js');
var menu = require('./config/menu.js');
var app = express();

// --------------------- view engine ------------------------
var handlebars = require('express-handlebars').create({
    defaultLayout: 'index', //default layout
    helpers: {
        section: function (name, options) {     // section block
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 80);// 本地调试端口地址

app.use(express.static(__dirname + '/public')); // static 中间件

// --------------------- wechat api --------------------------
var api = new weapi(config.appid, config.appsecret);

// ---------------------- url ------------------------
// 简单对话
require('./rules')(webot);
webot.watch(app, {token: config.token, path: '/wechat'});

// 创建菜单
api.createMenu(menu, null);

// js sdk内页
require('./routes/jssdk.js')(app, api);


app.listen(app.get('port'), function () {
    console.log('Express started at http://localhost:' + app.get('port'));
});

// use nginx
// app.set('port', 3000);
// app.enable('trust proxy');