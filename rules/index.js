var crypto = require('crypto');
var package_info = require('../package.json');
var request = require('request');
/**
 * 初始化路由规则
 */
module.exports = function(webot) {

/*
 * 订阅消息
 */
webot.set('subscribe', {
    pattern: function(info) {
        return info.is('event') && info.param.event === 'subscribe';
    },
    handler: function(info) {
        return '欢迎订阅LCY微信机器人';
    }
});

/**
 * 普通消息
 */
webot.set('hi', '你好');
webot.set({
    'acfun': 'Acfun二次元',
    'bilibili': '我好想没使用过'
})
/**
 * 普通消息组
 * 支持一次性加多个 方便后台数据库存储规则
 * good morning 打个招呼吧
 * time 几点
 */ 
webot.set(
[{
    pattern: /^(早上?好?|(good )?moring)[啊\!！\.。]*$/i,
    handler: function (info){
        var d = new Date();
        var h = d.getHours();
        if (h < 3) return '[嘘] 我这边还是深夜呢，别吵着大家了';
        if (h < 5) return '这才几点钟啊，您就醒了？';
        if (h < 7) return '早啊官人！您可起得真早呐~ 给你请安了！\n 今天想参加点什么活动呢？';
        if (h < 9) return 'Morning, sir! 新的一天又开始了！您今天心情怎么样？';
        if (h < 12) return '这都几点了，还早啊...';
        if (h < 14) return '人家中午饭都吃过了，还早呐？';
        if (h < 17) return '如此美好的下午，是很适合出门逛逛的';
        if (h < 21) return '早，什么早？找碴的找？';
        if (h >= 21) return '您还是早点睡吧...';
    }
},{
    pattern: /^(几点了|time)\??$/i,
    handler: function(info) {
        var d = new Date();
        var h = d.getHours();
        var t = '现在是服务器时间' + h + '点' + d.getMinutes() + '分';
        if (h < 4 || h > 22) return t + '，夜深了，早点睡吧 [月亮]';
        if (h < 6) return t + '，您还是再多睡会儿吧';
        if (h < 9) return t + '，又是一个美好的清晨呢，今天准备去哪里玩呢？';
        if (h < 12) return t + '，一日之计在于晨，今天要做的事情安排好了吗？';
        if (h < 15) return t + '，午后的冬日是否特别动人？';
        if (h < 19) return t + '，又是一个充满活力的下午！今天你的任务完成了吗？';
        if (h <= 22) return t + '，这样一个美好的夜晚，有没有去看什么演出？';
        return t;
    }
}]);

/*
 * 富文本
 */
webot.set('help', {
    pattern: /^(help|\?)$/i,
    handler: function (info) {
        var reply = {
            title: '感谢你收听webot机器人',
            pic: 'https://raw.github.com/node-webot/webot-example/master/qrcode.jpg',
            url: 'https://github.com/node-webot/webot-example',
            description: [
                '你可以试试以下指令:',
                '重看本指令请回复help或问号',
                '更多指令请回复more',
                'PS: 点击下面的「查看全文」将跳转到我的github页'
            ].join('\n')
        }

        return reply; // 返回值如果是json 则回复图文消息列表
    }
});
/*
 * 异步必须使用next(null, reply)
 * 来返回结果
 */
webot.set('animate', {
    pattern: /animate|动漫+/i,
    handler: function(info, next) {
        var _options = {
            url: 'http://apis.baidu.com/acman/zhaiyanapi/tcrand',
            headers: {
                'apikey': '074256286db9c5bfa2d73f4b1d0d3e97'
            }
        }
        request(_options, function (error, response, body){
            var _data = JSON.parse(body);
            return next(null, {
                title: _data.source,
                description: [_data.taici, _data.catcn].join('\n')
            });
        });   
    }
});

webot.set('who_are_you', {
    pattern: /who|你是[谁\?]+/i,// pattern 既可以是函数，也可以是 regexp 或 字符串(模糊匹配)
    handler: ['我是神马机器人', '微信机器人']// 回复handler也可以直接是字符串或数组，如果是数组则随机返回一个子元素
});

// 正则匹配后的匹配组存在info.query中
webot.set('your_name', {
    pattern: /^(?:my name is|i am|我(?:的名字)?(?:是|叫)?)\s*(.*)$/i,
    handler: '你好,{1}'
});


//发送图片,我将返回其hash值
webot.set('hash_img', {
    pattern: function(info){
        return info.is('image');
    },
    handler: function(info, next){
        try{
            var MD5 = crypto.createHash('md5');
            var promise = request(info.param.picUrl);
            promise.on('data', function (data) {
                MD5.update(data);
            });
            promise.on('end', function() {
                return next(null, '你的图片hash: ' + MD5.digest('hex'));
            });
        }catch(e){
            return '生成图片hash失败: ' + e;
        }
    }
});

// 回复图文消息
// 发送news,我将回复图文消息你
webot.set('reply_news', {
    pattern: /^news\s*(\d*)$/,
    handler: function(info){
        var reply = [
        {title: '微信机器人', description: '微信机器人测试帐号：webot', pic: 'https://raw.github.com/node-webot/webot-example/master/qrcode.jpg', url: 'https://github.com/node-webot/webot-example'},
        {title: '豆瓣同城微信帐号', description: '豆瓣同城微信帐号二维码：douban-event', pic: 'http://i.imgur.com/ijE19.jpg', url: 'https://github.com/node-webot/weixin-robot'},
        {title: '图文消息3', description: '图文消息描述3', pic: 'https://raw.github.com/node-webot/webot-example/master/qrcode.jpg', url: 'http://www.baidu.com'}
        ];
        // 发送 "news 1" 时只回复一条图文消息
        return Number(info.param[1]) == 1 ? reply[0] : reply;
    }
});

// 可以指定图文消息的映射关系
webot.config.mapping = function(item, index, info){
    //item.title = (index+1) + '> ' + item.title;
    return item;
}

//所有消息都无法匹配时的fallback
// 利用 error log 收集听不懂的消息，以利于接下来完善规则
webot.set(/.*/, function (info){    
    info.flag = true;
    return '你发送了「' + info.text + '」,可惜我太笨了,听不懂. 发送: help 查看可用的指令';
});

}