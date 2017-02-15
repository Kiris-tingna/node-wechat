var config = require('./weixin.js');

module.exports = {
    "button":[{
        "type": "click",
        "name": "今日",
        "key": "acfun"
    },{
        "name":"菜单",
        "sub_button":[{
            "type": "view",
            "name": "跳转",
            "url": config.jsurl + "/js-sdk"
        },{
            "type": "click",
            "name": "赞",
            "key": "bilibili"
        }]
    }]
}