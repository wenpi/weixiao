/**
 * Usage:
 * -激活家长/老师
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var UserServices = require("../../services/UserServices");

module.exports = function(webot) {
	var failed = '认证失败，如未录入您的手机号，请联系幼儿园IT管理员。';
	var registered = '您已经是本园认证用户，无需再次认证。';

    // 认证用户
	webot.set('user register start by text', {
		pattern: /^认证1\d{10}$/i,
		handler: function(info, next) {
			var mobile = info.text.substring('认证'.length);

			if (info.session.parent || info.session.teacher) {
				return next(null, registered);
			}

	        // 用手机号去用户表查询,如果获得结果就返回相应激活页面链接
		    UserServices.queryByMobile(mobile).then(function(user) {
		    	if (user) {
		    		var username = user.username + '';
		    		if (username != mobile) {
			    		return next(null, ejs.render(
							'请点击<a href="<%= url%>">认证链接</a>完成用户认证操作。', 
							{url: conf.site_root + '/register?mobile=' + mobile + '&userOpenId=' + info.uid}
						));
		    		} else if (enabled === mobile) {
		    			return next(null, registered);
		    		}
		    	} else {
		    		return next(null, failed);
		    	}
		    }, function() {
		        return next(null, failed);
		    });
		}
	});
}