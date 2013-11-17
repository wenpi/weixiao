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
		    		if (username !== mobile) {
			    		info.wait("user register profile image");
			    		return next(null, "请上传您的头像图片：");
		    		} else {
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

	webot.waitRule('user register profile image', function(info, next) {
		if (!info.is("image")) {
			info.rewait("user register profile image");
			return next(null, "抱歉，只能上传图片。");
		}else {
		    UserServices.queryByMobile(mobile).then(function(user) {
		    	if (user) {
		    		var username = user.username + '';
		    		if (username !== mobile) {
			    		return next(null, ejs.render(
							'请点击<a href="<%= url%>">认证链接</a>完成用户认证操作。', 
							{url: conf.site_root + '/register?mobile=' + mobile + '&userOpenId=' + info.uid + '&profileImage=' + info.param.picUrl}
						));
		    		} else {
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