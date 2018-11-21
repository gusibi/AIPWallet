var config = require('./local_config.js')

var host = config.host || 'https://metis-apis.gusibi.mobi';
var basic_token = config.basic_token || 'Basic token=';

var type_transactions = {
    "purchase": "购买",
    "aip": "定投",
    "redeem": "赎回",
    "dividend": "现金分红",
    "reinvestment": "红利再投资"
};

var type_transactions_zh = {
    "购买": "purchase",
    "定投": "aip",
    "赎回": "redeem",
    "现金分红": "dividend",
    "红利再投资": "reinvestment"
};

module.exports = {
    host: host,
    basic_token: basic_token,
    type_transactions: type_transactions,
    type_transactions_zh: type_transactions_zh,
}