const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const currentDay = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(formatNumber).join('-')
}

var formatDate = function (date_str, fmt) {
    // 对Date的扩展，将 Date 转化为指定格式的String   
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
    // 例子：   
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
    //author: meizz
    date = new Date(date_str) 
    var o = {
        "M+" : date.getMonth() + 1, //月份   
        "d+" : date.getDate(), //日   
        "h+" : date.getHours(), //小时   
        "m+" : date.getMinutes(), //分   
        "s+" : date.getSeconds(), //秒   
        "q+" : Math.floor((date.getMonth() + 3) / 3), //季度   
        "S"  : date.getMilliseconds()              //毫秒   

    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const isNumeric = n => {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const round = (f, n) => {
    return parseFloat(Number(f).toFixed(n))
}

var removeArray = function(arr, ax) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

module.exports = {
  formatTime: formatTime,
  isNumeric: isNumeric,
  currentDay: currentDay,
  round: round,
  formatDate: formatDate,
  removeArray: removeArray
}
