//index.js
const { $Toast } = require('../../ui/iview/base/index');

var common = require('../../common.js');
var config = require('../../config.js');

//获取应用实例
const app = getApp()

Page({
    data: {
        current: 'homepage',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        assetsStatistics: {
            "change": 0,
            "profit_holders": 0,
            "profit": 0,
            "asset_holders": 0,
            "valuation_date": "2006-01-02"
        },
        fundAssetStatistics: [],
        stockAssetStatistics: []
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    handleError(message) {
        $Toast({
            content: message,
            type: 'error'
        });
    },
    onPullDownRefresh: function() {
        var that = this;
        that.refreshAsset();
        that.getAssetsStatistics();
        that.getAsset();
        // that.get_asset('stock');
        wx.stopPullDownRefresh()
    },
    onLoad: function() {
        var that = this;
        app.checkLogin(that.getAssetsStatistics);
        app.checkLogin(that.getAsset);
        // app.checkLogin(that.get_asset('stock'));
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.data,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    /**
 * 用户点击右上角分享
 */
    onShareAppMessage: function () {

    },
    refreshAsset: function(asset_type) {
        var that = this;
        var userInfo = app.globalData.userInfo
        common.request({ // 发送请求 获取 jwt
            url: '/v1/assets/refresh',
                header: {
                    Authorization: "Bearer " + userInfo.jwt
                },
                method: "GET",
                success: function(res) {
                    if (res.statusCode === 200) {
                        // 得到 asset 数据 
                        console.log(res.data)
                        // that.setData({
                        //     fundAssetStatistics: res.data
                        // })
                    } else {
                        // 提示错误信息
                        wx.showToast({
                            title: res.data.message,
                            icon: 'success',
                            duration: 2000
                        });
                    }
                },
                fail: function(res) {
                    console.log('网络错误');
                }
            })
    },
    assetSttistictRefresh: function() {
        var that = this;
        var userInfo = app.globalData.userInfo
            // asset_type = asset_type || "fund"
        common.request({ // 发送请求 获取 jwt
            url: '/v1/assets/statistics/refresh',
            header: {
                Authorization: "Bearer " + userInfo.jwt
            },
            method: "GET",
            success: function(res) {
                if (res.statusCode === 200) {
                    // 得到 asset 数据 
                    that.setData({
                        assetsStatistics: res.data
                    })
                } else {
                    // 提示错误信息
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 2000
                    });
                }
            },
            fail: function(res) {
                console.log('assetSttistictRefresh error');
            }
        })
    },
    getAsset: function(asset_type) {
        var that = this;
        var userInfo = app.globalData.userInfo
        asset_type = asset_type || "fund"
        common.request({ // 发送请求 获取 jwt
            url: '/v1/assets?asset_type=' + asset_type,
            header: {
                Authorization: "Bearer " + userInfo.jwt 
            },
            method: "GET",
            success: function(res) {
                if (res.statusCode === 200) {
                    // 得到 asset 数据 
                    if (asset_type == "fund") {
                        that.setData({
                            fundAssetStatistics: res.data
                        })
                    } else if (asset_type == 'stock') {
                        that.setData({
                            stockAssetStatistics: res.data
                        })
                    }
                } else {
                    // 提示错误信息
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 2000
                    });
                }
            },
            fail: function(res) {
                console.log('get_asset fail');
            }
        })
    },
    getAssetsStatistics: function() {
        var that = this;
        var userInfo = app.globalData.userInfo
        common.request({ // 发送请求 获取 jwt
            url: '/v1/assets/statistics',
            header: {
                Authorization: "Bearer " + userInfo.jwt
            },
            method: "GET",
            success: function(res) {
                if (res.statusCode === 200) {
                    // 得到 asset 数据 
                    that.setData({
                        assetsStatistics: res.data
                    })
                } else {
                    // 提示错误信息
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 2000
                    });
                }
            },
            fail: function(res) {
                console.log('request token fail');
            }
        })
    },
    /**
     * 点击历史记录按钮，跳转到历史页面
     */
    getFundTransactions: function (event) {
        var that = this;
        console.log(event)
        var symbol = event.currentTarget.id;
        if (symbol == "") {
            that.handleError("错误的基金代码");
        }
        wx.navigateTo({
            url: '/pages/transaction-history/index?symbol=' + symbol
        })
    },
    getUserInfo: function(e) {
        // 触发注册流程
        common.register(this)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    handleChange: function({ detail }) {
        common.navChange(detail);
    },
    showAssetDaily: function(e){
        var symbol = e.currentTarget.id;
        wx.navigateTo({
            url: '/pages/asset-history/index?symbol=' + symbol,
        })
    }
})