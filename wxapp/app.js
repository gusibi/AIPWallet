//app.js
var config = require('./config.js');
var common = require('./common.js');

App({
    onLaunch: function() {
    },
    checkLogin: function(cb) {
        // 先从本地存储中查找 userInfo
        // 如果有认为已经登录
        // 如果没有再次登录
        var that = this;
        var userInfo = common.get_storage("userInfoWithJwt")
        if (userInfo) {
            that.globalData.userInfo = userInfo
            that.globalData.jwt = userInfo.jwt
        }
        if (that.globalData.jwt) {
            cb && cb();
        } else {
            common.login(cb ? cb : function() {})
        }
    },
    globalData: {
        userInfo: null,
        jwt: null,
        currentPage: "homepage",
    }
})