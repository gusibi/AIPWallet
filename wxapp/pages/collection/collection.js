// pages/collection/collection.js
const { $Message } = require('../../ui/iview/base/index');
const { $Toast } = require('../../ui/iview/base/index');
const app = getApp()

var common = require('../../common.js');
var config = require('../../config.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        current: 'collection',
        showCancel: false,
        showError: false,
        searchValue: "",
        fundInfo: null,
        followingFunds: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 先加载关注的数据，有交易记录的默认关注
        var that = this;
        app.checkLogin(that.get_funds_following)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    handleError(message) {
        $Message({
            content: message,
            type: 'error'
        });
    },
    handleIcon(message) {
        $Toast({
            content: message,
            icon: 'flashlight'
        });
    },

    /**
     * 关注基金
     */
    follow_fund: function (event) {
        var that = this;
        var userInfo = app.globalData.userInfo
        var symbol = event.target.id;
        common.request({ // 发送请求 收藏基金
            url: '/v1/funds/' + symbol + '/follow',
            header: {
                Authorization: "Bearer " + userInfo.jwt
            },
            method: "POST",
            success: function (res) {
                if (res.statusCode === 201) {
                    // 得到 fund_info 数据 
                    // TODO 将基金加入到下方列表
                } else if (res.statusCode === 404) {
                    // 提示错误信息
                    that.handleError("基金未找到")
                }
            },
            fail: function (res) {
                that.handleIcon("基金未找到")
            }
        })
    },
    /**
     * 取消关注基金
     */
    unfollow_fund: function (event) {
        var that = this;
        var userInfo = app.globalData.userInfo
        var symbol = event.target.id;
        common.request({ // 发送请求 收藏基金
            url: '/v1/funds/' + symbol + '/follow',
            header: {
                Authorization: "Bearer " + userInfo.jwt
            },
            method: "DELETE",
            success: function (res) {
                if (res.statusCode === 204) {
                    // 得到 fund_info 数据 
                    // TODO 将基金从下方列表删除
                    that.setData({
                        fundInfo: res.data
                    })
                } else {
                    // 提示错误信息
                    that.handleError("基金未找到")
                }
            },
            fail: function (res) {
                that.handleIcon("基金未找到")
            }
        })
    },
    /**
     * 点击添加按钮，跳转到添加页面
     */
    add_fund_transaction: function (event) {
        var that = this;
        var symbol = event.target.id;
        if (symbol == "") {
            that.handleError("错误的基金代码");
        }
        wx.navigateTo({
            url: '/pages/transaction/index?symbol=' + symbol
        })
    },
    /**
     * 点击历史记录按钮，跳转到历史页面
     */
    getFundTransactions: function (event) {
        var that = this;
        var symbol = event.target.id;
        if (symbol == "") {
            that.handleError("错误的基金代码");
        }
        wx.navigateTo({
            url: '/pages/transaction-history/index?symbol=' + symbol
        })
    },
    /**
     * 获取当前登录用户的关注列表
     */
    get_funds_following: function () {
        var that = this;
        var userInfo = app.globalData.userInfo
        common.request({ // 发送请求 获取关注列表
            url: '/v1/funds/following',
            header: {
                Authorization: "Bearer " + userInfo.jwt
            },
            method: "GET",
            success: function (res) {
                if (res.statusCode === 200) {
                    // 得到 fund_info 数据 
                    that.setData({
                        followingFunds: res.data
                    })
                } else {
                    // 提示错误信息
                    that.handleError("基金未找到")
                }
            },
            fail: function (res) {
                that.handleIcon("基金未找到")
            }
        })
    },
    /**
     * 根据基金获取基金详情
     */
    get_fund_info: function(symbol) {
        var that = this;
        var userInfo = app.globalData.userInfo
        // asset_type = asset_type || "fund"
        common.request({ // 发送请求 获取 jwt
            url: '/v1/funds/' + symbol,
            header: {
                Authorization: "Bearer " + userInfo.jwt
            },
            method: "GET",
            success: function(res) {
                if (res.statusCode === 200) {
                    // 得到 fund_info 数据 
                    that.setData({
                        fundInfo: res.data
                    })
                } else {
                    // 提示错误信息
                    that.handleError("未收藏任何基金")
                }
            },
            fail: function(res) {
                that.handleIcon("基金未找到")
            }
        })
    },
    /**
     * 用户在搜索框输入数据时
     */
    onChange: function(event) {
        var sv;
        sv = event.detail.detail.value
        if (sv != "" && sv < 6) {
            this.setData({
                showCancel: true,
                searchValue: sv
            })
        } else {
            this.setData({
                showCancel: false,
                searchValue: sv
            })
        }
    },
    /**
     * 当用户点击搜索框按钮，调用搜索接口获取基金数据
     */
    onSearch: function(event) {
        var symbol = this.data.searchValue;
        if (symbol.length < 6) {
            this.handleError("请输入6位基金代码")
        } else {
            // 调用 API 获取数据
            this.get_fund_info(symbol)
        }
    },
    /**
     * 当用户点击搜索框按钮
     */
    onFocus: function(event) {
        if (event.detail != "") {
            this.setData({
                showCancel: true
            })
        } else {
            this.setData({
                showCancel: false
            })
        }
    },
    /**
     * 当输入框失焦时
     */
    onBlur: function(event) {
        if (event.detail != "") {
            this.setData({
                showCancel: true
            })
        } else {
            this.setData({
                showCancel: false
            })
        }
    },
    handleChange: function({ detail }) {
        common.navChange(detail);
    }
})