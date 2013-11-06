/**
 * 用途:
 * 1 将微信账号和幼儿园标识绑定起来
 * 2 注册家长微信账号
 */
module.exports = function(webot) {
	webot.loads("place", "parent");
}