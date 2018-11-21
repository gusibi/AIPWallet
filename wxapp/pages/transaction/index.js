// pages/transaction/index.js
const { $Message } = require('../../ui/iview/base/index');
const { $Toast } = require('../../ui/iview/base/index');
const app = getApp()

var common = require('../../common.js');
var config = require('../../config.js');
var utils = require('../../utils/util.js');

const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1990; i <= date.getFullYear(); i++) {
    years.push(i)
}

for (let i = 1; i <= 12; i++) {
    months.push(i)
}

for (let i = 1; i <= 31; i++) {
    days.push(i)
}

Page({
    /**
     * 页面的初始数据
     */
    data: {
        currentSymbol: "",
        currentFundinfo: null,
        currentDay: null,
        date_transaction: '2016-09-01',
        type_transactions_list: ["定投", "购买", "赎回", "现金分红", "红利再投资"],
        type_transaction_index: 0,
        type_transactions: "aip",
        turnover: null,
        turnover_error: null,
        commission: null,
        commission_error: null,
        net_transactions: null,
        net_transactions_error: null,
        share_transactions: null,
        share_transactions_error: null,
        remark: ""
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var symbol = options.symbol;
        if (symbol == "") {
            wx.navigateBack({
                delta: 1
            })
        } else {
            that.setData({
                currentSymbol: symbol
            })
        }
        var now = new Date();
        that.setData({
                currentDay: utils.currentDay(now),
                date_transaction: utils.currentDay(now)
            }),
            that.get_fund_info(symbol);
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
                        currentFundInfo: res.data
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
     * 添加基金交易记录
     */
    add_fund_transaction: function() {
        var that = this;
        var userInfo = app.globalData.userInfo
        var symbol = that.data.currentSymbol;
        common.request({ // 发送请求 收藏基金
            url: '/v1/funds/' + symbol + '/transactions',
            header: {
                Authorization: "Bearer " + userInfo.jwt
            },
            data: {
                date_transaction: that.data.date_transaction,
                type_transactions: that.data.type_transactions,
                turnover: utils.round(that.data.turnover, 2),
                commission: utils.round(that.data.commission, 2),
                net_transactions: utils.round(that.data.net_transactions, 4),
                share_transactions: utils.round(that.data.share_transactions, 4),
                remark: that.data.remark
            },
            method: "POST",
            success: function(res) {
                if (res.statusCode === 201) {
                    // 得到 fund_info 数据 
                    that.setData({
                        fundInfo: res.data
                    })
                    wx.redirectTo({
                        url: '/pages/transaction-history/index?symbol=' + symbol
                    })
                } else {
                    // 提示错误信息
                    that.handleError("基金未找到")
                }
            },
            fail: function(res) {
                that.handleIcon("基金未找到")
            }
        })
    },
    // 验证是否是数字，不是数字抛出错误，不能输入
    validateNumber: function(number) {
        var that = this;
        var is_number = utils.isNumeric(number)
        if (!is_number) {
            that.handleIcon("数字错误！！！")
        }
        return is_number
    },
    bindDateChange: function(e) {
        this.setData({
            date_transaction: e.detail.value
        })
    },
    bindTypeTransactionChange: function(e) {
        var that = this;
        var type_transactions_zh = config.type_transactions_zh;
        var type_transactions_list = that.data.type_transactions_list;
        var type_transactions = type_transactions_list[e.detail.value];
        this.setData({
            type_transaction_index: e.detail.value,
            type_transactions: type_transactions_zh[type_transactions]
        })
    },
    bindTurnoverChange: function(e) {
        var value = e.detail.detail.value;
        var that = this;
        var is_number = that.validateNumber(value);
        if (is_number) {
            that.setData({
                turnover: value
            })
        } else {
            that.setData({
                turnover_error: "error"
            })
        }
    },
    bindCommissionChange: function(e) {
        var value = e.detail.detail.value;
        var that = this;
        var is_number = that.validateNumber(value);
        if (is_number) {
            that.setData({
                commission: value
            })
        } else {
            that.setData({
                commission_error: "error"
            })
        }
    },
    bindNetTransactionsChange: function(e) {
        var value = e.detail.detail.value;
        var that = this;
        var is_number = that.validateNumber(value);
        if (is_number) {
            that.setData({
                net_transactions: value
            })
        } else {
            that.setData({
                net_transactions_error: "error"
            })
        }
    },
    bindShareTransactionsChange: function(e) {
        var value = e.detail.detail.value;
        var that = this;
        var is_number = that.validateNumber(value);
        if (is_number) {
            that.setData({
                share_transactions: value
            })
        } else {
            that.setData({
                share_transactions_error: "error"
            })
        }
    },
    bindRemarkChange: function(e) {
        var value = e.detail.detail.value;
        var that = this;
        that.setData({
            remark: value
        })
    },
    handleSubmit: function(e) {
        var that = this;
        that.add_fund_transaction()
    }
})