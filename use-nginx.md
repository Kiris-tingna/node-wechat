执行node app.js后，监听127.0.0.1:3000端口
通过Nginx proxy_pass自动转到3000端口
server {
    listen       80;
    server_name your server name;

    access_log /www/wx.yjion.com/logs/access.log;
    error_log /www/wx.yjion.com/logs/error.log;

    location / {
        proxy_pass http://localhost:3000;
    }
}