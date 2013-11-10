/**
 * Usage:
 * - 通过新闻功能返回含幼儿园标示和家长openId的连接，跳转到相关界面
 * Author:
 * - hopesfish at 163.com
 */
module.exports = function(webot) {
	// 返回注册连接
	webot.set('parent register', {
		pattern: /^(家长认证|register|PARENT_REGISTER)/i,
		handler: function(info, next) {
			if (info.session.parent) {
				return next(null, "您已经是本园认证家长，无需再次认证。");
			}
			console.info("reg....");
			// TODO 使用幼儿园openId和家长openId搜素认证记录
			return next(null, "认证连接");
			/*
			return [{
				title: '家长认证',
				url: 'http://weexiao.com?openId=' + openId,
				picUrl: 'http://weexiao.com',
				description: '家长认证',
			}];*/
		}
	});
}