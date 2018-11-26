// pages/asset-history/index.js
const { $Toast } = require('../../ui/iview/base/index');
const app = getApp()

var common = require('../../common.js');
var config = require('../../config.js');
var utils = require('../../utils/util.js');

Page({

    /**
     * 默认取最进30天数据
     */
    data: {
        fundAsset: null,
        fundAssetDailies: null,
        currentSymbol: null,
        currentFundInfo: null
    },
    handleError(message) {
        $Toast({
            content: message,
            type: 'error'
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var symbol = options.symbol;
        that.setData({
            currentSymbol: symbol
        });
        // 获取基金详情
        that.getFundInfo(symbol);
        // 获取基金收益详情
        that.getFundsAsset(symbol);
        // 刷新每日收益数据
        that.refreshAssetDaily(symbol)
        // 获取每日数据
        that.getFundsAssetDailies(symbol);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
       * 根据基金获取基金详情
       */
    getFundInfo: function (symbol) {
        var that = this;
        var userInfo = app.globalData.userInfo
        // asset_type = asset_type || "fund"
        common.request({ // 发送请求 获取 jwt
            url: '/v1/funds/' + symbol,
            header: {
                Authorization: "Bearer " + userInfo.jwt
            },
            method: "GET",
            success: function (res) {
                if (res.statusCode === 200) {
                    // 得到 fund_info 数据 
                    that.setData({
                        currentFundInfo: res.data
                    })
                } else {
                    // 提示错误信息
                    that.handleError("没有记录")
                }
            },
            fail: function (res) {
                that.handleError("没有记录")
            }
        })
    },
    /**
       * 获取基金收益详情
       */
    getFundsAsset: function (symbol) {
        var that = this;
        var userInfo = app.globalData.userInfo
        // asset_type = asset_type || "fund"
        common.request({ // 发送请求 获取 jwt
            url: '/v1/funds/' + symbol + '/asset',
            header: {
                Authorization: "Bearer " + userInfo.jwt
            },
            method: "GET",
            success: function (res) {
                if (res.statusCode === 200) {
                    // 得到 fund_asset 数据 
                    that.setData({
                        fundAsset: res.data
                    })
                } else {
                    // 提示错误信息
                    that.handleError("没有记录")
                }
            },
            fail: function (res) {
                that.handleError("没有记录")
            }
        })
    },
    /**
     * 跳转到交易历史页面
     */
    getFundTransactions: function (event) {
        var that = this;
        var symbol = event.currentTarget.id;
        if (symbol == "") {
            that.handleError("错误的基金代码");
        }
        wx.navigateTo({
            url: '/pages/transaction-history/index?symbol=' + symbol
        })
    },
    /**
     * handleRefresh
     */
    handleRefresh: function (e) {
        var that = this;
        var symbol = e.currentTarget.id;
        if (!symbol) {
            symbol = that.data.currentSymbol
        }
        that.refreshAssetDaily(symbol)
    },
    /**
     * 更新基金收益数据
     */
    refreshAssetDaily: function (symbol) {
        var that = this;
        var userInfo = app.globalData.userInfo
        common.request({ // 发送请求 获取 jwt
            url: '/v1/funds/' + symbol + '/dailies/refresh',
            header: {
                Authorization: "Bearer " + userInfo.jwt
            },
            method: "PUT",
            success: function (res) {
                if (res.statusCode === 200) {
                    // 得到 asset 数据
                    // console.log(res.data)
                    that.setData({
                        fundAsset: res.data
                    })
                } else {
                    // 提示错误信息
                    that.handleError("刷新错误")
                }
            },
            fail: function (res) {
                // console.log('request token fail');
                that.handleError("网络错误")
            }
        })
    },
    /**
    * 获取基金日收益详情
    */
    getFundsAssetDailies: function (symbol) {
        var that = this;
        var userInfo = app.globalData.userInfo
        // asset_type = asset_type || "fund"
        common.request({ // 发送请求 获取 jwt
            url: '/v1/funds/' + symbol + '/asset_dailies',
            header: {
                Authorization: "Bearer " + userInfo.jwt
            },
            method: "GET",
            success: function (res) {
                if (res.statusCode === 200) {
                    // 得到 fund_info 数据 
                    var dailies = res.data;
                    dailies.reverse();
                    that.setData({
                        fundAssetDailies: dailies
                    })
                } else {
                    // 提示错误信息
                    that.handleError("没有记录")
                }
            },
            fail: function (res) {
                that.handleError("没有记录")
            }
        })
    }
})