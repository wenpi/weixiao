/**
 * Usage:
 * - 修改密码功能
 * Author:
 * - hopesfish at 163.com
 */
var conf = require('../../conf');

function send_help(info, next) {
    return next(null, [{
	  title: '关于微信幼儿园',
	  url: conf.site_root + '/webot/wap/help/about',
	  picUrl: conf.site_root + '/webot/wap/images/webanner.png',
	  description: '关于微信幼儿园',
	}, {
	  title: '如何进行身份认证',
	  url: conf.site_root + '/webot/wap/help/register',
	  picUrl: conf.site_root + '/webot/wap/images/index_1.jpg',
	  description: '如何进行身份认证',
	}, {
	  title: '如何发布留言到留言板',
	  url: conf.site_root + '/webot/wap/help/message',
	  picUrl: conf.site_root + '/webot/wap/images/index_2.jpg',
	  description: '如何发布留言到留言板',
	}, {
	  title: '如何发布照片到班级相册',
	  url: conf.site_root + '/webot/wap/help/photo',
	  picUrl: conf.site_root + '/webot/wap/images/index_3.jpg',
	  description: '如何发布照片到班级相册',
	}, {
	  title: '如何添加成长记录',
	  url: conf.site_root + '/webot/wap/help/record',
	  picUrl: conf.site_root + '/webot/wap/images/index_1.jpg',
	  description: '如何添加成长记录',
	}, {
	  title: '如何修改和管理个人信息',
	  url: conf.site_root + '/webot/wap/help/profile',
	  picUrl: conf.site_root + '/webot/wap/images/index_2.jpg',
	  description: '如何修改和管理个人信息',
	}, {
	  title: '如何查看各种相关信息',
	  url: conf.site_root + '/webot/wap/help/other',
	  picUrl: conf.site_root + '/webot/wap/images/index_3.jpg',
	  description: '如何查看各种相关信息',
	}]);
}

module.exports = function(webot) {
	webot.set('weexiao help by text', {
		pattern: /^(帮助|help)/i,
		handler: send_help
	});
	webot.set('weexiao help by event', {
		pattern: function(info) {
			return info.param.eventKey === 'WEEXIAO_HELP';
		},
		handler: send_help
	});
}