var config = require('./config.js');

var numberToLetter = function (num) {
    num2letter = {
        0: 'A',
        1: 'B',
        2: 'C',
        3: 'D',
        4: 'E',
        5: 'F',
        6: 'G',
        7: 'H',
        8: 'I',
        9: 'J'
    }
    return num2letter[num]
}

var request = function (option) {
    var url = config.host + option.url;

    var Authorization = option.header.Authorization || config.basic_token;
    wx.request({
        url: url,
        data: option.data || {},
        method: option.method && option.method.toUpperCase() || 'GET',
        header: {
            'content-type': 'application/json',
            'Authorization': Authorization
        },
        success: function (res) {
            var code = res.statusCode;
            if (/^2\d{2}$/.test(code)) {
                typeof option.success === 'function' && option.success(res);
            } else if (code === 403 || code === 401) {
                login()
            } else {
                typeof option.fail === 'function' && option.fail(res);
            }
        },
        fail: function (res) {
            typeof option.fail === 'function' && option.fail(res);
        },
        complete: function (res) {
            typeof option.complete === 'function' && option.complete(res);
        }
    })
}

var login = function (option) {
    var app = getApp()
    // 登录部分代码
    wx.login({
        // 调用 login 获取 code
        success: function (res) {
            var code = res.code;
            // success
            wx.request({ // 发送请求 获取 jwt
                url: config.host + '/auth/jwt?code=' + code,
                header: {
                    Authorization: config.basic_token
                },
                method: "POST",
                success: function (res) {
                    if (res.statusCode === 201) {
                        // 得到 jwt 后存储到 storage，
                        wx.showToast({
                            title: '登录成功',
                            icon: 'success'
                        });
                        app.globalData.userInfo = res.data
                        app.globalData.jwt = res.data.jwt
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (app.userInfoReadyCallback) {
                            app.userInfoReadyCallback(res)
                        }
                        option && option();
                        // 将数据存入 storage
                        set_storage("userInfoWithJwt", res.data, 86400 * 7)
                    } else {
                        // 提示错误信息
                        wx.showToast({
                            title: res.data.message,
                            icon: 'success',
                            duration: 2000
                        });
                    }
                },
                fail: function (res) {
                    console.log('request token fail');
                }
            })
        },
        fail: function () {
            // fail
        },
        complete: function () {
            // complete
        }
    })
}

var register = function (option) {
    // 注册代码
    var app = getApp();
    wx.login({ // 调用登录接口获取 code
        success: function (res) {
            var code = res.code;
            wx.getUserInfo({
                // 调用 getUserInfo 获取 encryptedData 和 iv
                success: function (res) {
                    // success
                    app.globalData.userInfo = res.userInfo;
                    var encryptedData = res.encryptedData || 'encry';
                    var iv = res.iv || 'iv';
                    wx.request({ // 请求注册用户接口
                        url: config.host + '/auth/users?code=' + code,
                        header: {
                            Authorization: config.basic_token
                        },
                        data: {
                            username: encryptedData,
                            password: iv,
                        },
                        method: "POST",
                        success: function (res) {
                            if (res.statusCode === 201) {
                                wx.showToast({
                                    title: '注册成功',
                                    icon: 'success'
                                });
                                // login(option);
                                app.globalData.userInfo = res.data
                                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                // 所以此处加入 callback 以防止这种情况
                                if (app.userInfoReadyCallback) {
                                    app.userInfoReadyCallback(res)
                                }
                                option && option();
                                // 将数据存入 storage
                                set_storage("userInfoWithJwt", res.data, 86400 * 7)
                            } else if (res.statusCode === 400) {
                                wx.showToast({
                                    title: '用户已注册',
                                    icon: 'success'
                                });
                            } else if (res.statusCode === 403) {
                                wx.showToast({
                                    title: res.data.text,
                                    icon: 'success'
                                });
                            }
                        },
                        fail: function (res) {
                            console.log('request token fail');
                        }
                    })
                },
                fail: function () {
                    // fail
                },
                complete: function () {
                    // complete
                }
            })
        }
    })
}

var navChange = function (detail) {
    var app = getApp();
    var currentPage = app.globalData.currentPage;
    if (currentPage == detail.key){
        return
    }else{
        app.globalData.currentPage = detail.key
        if (detail.key == "collection") {
            wx.redirectTo({
                url: '/pages/collection/collection'
            })
        } else if (detail.key == "homepage") {
            wx.redirectTo({
                url: '/pages/index/index'
            })
        }
    }
}

var get_storage = function (key) {
    // 取出数据先判断是否过期，如果过期删除数据
    try {
        var value = wx.getStorageSync(key)
        if (value) {
            // Do something with return value
            return value
        }
    } catch (e) {
        // Do something when catch error
        console.log(e)
    }
}

var set_storage = function (key, value, expires) {
    // 存储的结构为 data= {'expires_in': 123, 'value': value}
    wx.setStorageSync(key, value)
    try {
        wx.setStorageSync(key, value)
    } catch (e) {
        console.log(e)
     }
}

module.exports = {
    login: login,
    register: register,
    request: request,
    get_storage: get_storage,
    set_storage: set_storage,
    navChange: navChange,
}