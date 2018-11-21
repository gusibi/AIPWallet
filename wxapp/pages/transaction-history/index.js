// pages/transaction-history/index.js
const { $Toast } = require('../../ui/iview/base/index');
const app = getApp()

var common = require('../../common.js');
var config = require('../../config.js');
var utils = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
      showDelete: false,
      actionDelete: [
          {
              name: '删除',
              color: '#ed3f14'
          }
      ],
      fundAsset: null,
      currentSymbol: "",
      currentFundinfo: null,
      transactionHistories: null,
      transactionId: null
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
  onLoad: function (options) {
      var that = this;
      var symbol = options.symbol;
      that.setData({
          currentSymbol: symbol
      });
      that.getFundInfo(symbol);
      that.getFundsAsset(symbol);
      that.getTransactionHistories(symbol);
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
                that.handleIcon("没有记录")
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
                    // console.log(res.data)
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
    * 根据基金获取基金交易记录
    */
    getTransactionHistories: function (symbol) {
        var that = this;
        var userInfo = app.globalData.userInfo
        common.request({ // 发送请求 获取 jwt
            url: '/v1/funds/' + symbol + '/transactions',
            header: {
                Authorization: "Bearer " + userInfo.jwt
            },
            method: "GET",
            success: function (res) {
                if (res.statusCode === 200) {
                    // 得到 fund_info 数据 
                    that.setData({
                        transactionHistories: res.data
                    })
                } else {
                    // 提示错误信息
                    that.handleError("未收藏任何基金")
                }
            },
            fail: function (res) {
                that.handleIcon("基金未找到")
            }
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
    showAssetDaily: function (e) {
        var symbol = e.currentTarget.id;
        wx.navigateTo({
            url: '/pages/asset-history/index?symbol=' + symbol,
        })
    },
    handleAddTransaction: function(e){
        var that = this;
        var symbol = e.target.dataset.symbol;
        if (symbol == "" || symbol == undefined) {
            that.handleError("错误的基金代码");
        }else{
            wx.navigateTo({
                url: '/pages/transaction/index?symbol=' + symbol
            })
        }
    },
    updateFundTransaction: function(e){
        var that = this;
        var symbol = that.data.currentSymbol;
        var transaction_id = e.target.id;
        if (transaction_id == "" || transaction_id == undefined) {
            that.handleError("错误的基金代码");
        } else {
            wx.navigateTo({
                url: '/pages/transaction-update/update?symbol=' + symbol + '&transaction_id=' + transaction_id
            })
        }
    },
    deleteFundTransactions: function(e){
        var that = this;
        var userInfo = app.globalData.userInfo
        var transaction_id = that.data.transactionId;
        common.request({ // 发送请求 获取 jwt
            url: '/v1/fund_transactions/' + transaction_id,
            header: {
                Authorization: "Bearer " + userInfo.jwt
            },
            method: "DELETE",
            success: function (res) {
                if (res.statusCode === 204) {
                    // 删除完成调用 从transactionHistories 删除
                    that.deleteTransactionById(transaction_id)
                    that.setData({
                        showDelete: false
                    });
                } else {
                    // 提示错误信息
                    that.handleError("没有记录")
                }
            },
            fail: function (res) {
                that.handleError("网络异常")
                this.setData({
                    showDelete: false
                });
            }
        })
    },
    deleteTransactionById(transaction_id) {
        // 从data transactionHistories 删除 transaction
        var that = this;
        var transactions = that.data.transactionHistories;
        for (var i in transactions){
            var transaction = transactions[i];
            if (transaction.id == transaction_id){
                var transactions = utils.removeArray(transactions, transaction)
                this.setData({
                    transactionHistories: transactions
                });
            }
        }
    },
    deleteTransactionTap(e) {
        this.setData({
            showDelete: true,
            transactionId: e.target.id
        });
    },
    handleDeleteCancel(){
        this.setData({
            showDelete: false
        });
    }
})