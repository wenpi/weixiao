/**
 * 用途:
 * 1 将微信账号和幼儿园标识绑定起来
 * 2 返回幼儿园介绍信息
 */
var utils = require("../utils");

module.exports = function(webot) {

    // 除了bind,其他服务都必须在place域下面
    webot.loads("bind", "intro");

    // 定义place域, 检查幼儿园是否激活
    webot.domain("place", utils.ensure_place_is_bind);
}