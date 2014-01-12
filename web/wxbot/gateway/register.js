/**
 * Usage:
 * -激活家长/老师
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var UserServices = require("../../services/UserServices");
var utils = require("../utils");

module.exports = function(webot) {
	var failed = '认证失败，如未录入您的手机号，请联系幼儿园IT管理员。';
	var registered = '您已经是本园认证用户, 手机号为: <%- mobile%>，无需再次认证。';

    // 认证用户
	webot.set('user register start by text', {
		pattern: /^1(3|4|5|8)\d{9}$/i,
		handler: function(info, next) {
			var mobile = info.text;

			if (info.session.parent || info.session.teacher) {
				var mobile;
				if (info.session.parent) { mobile = info.session.parent.mobile; }
				if (info.session.teacher) { mobile = info.session.teacher.mobile; }
				var text = ejs.render(
					registered,
					{mobile: mobile}
				);
				return next(null, text);
			}

	        // 用手机号去用户表查询,如果获得结果,再用openId查询是否认证
		    UserServices.queryByMobile(mobile).then(function(user) {
		    	if (user) {
		    		var usertype = user.type + '';
		    		var prompt = "请上传孩子照片作为头像图片：";
		    		if (usertype === '1') {
		    			prompt = '请上传一张您的个人照片作为头像：';
		    		}
		    		// 如果查到相关信息,则是已经认证,否则需要继续认证流程
		    		UserServices.queryByOpenId({
		    			schoolId: info.session.school.id,
		    			openId: info.uid
		    		}).then(function(user) {
		    			var text = ejs.render(
							registered,
							{mobile: user.mobile}
						);
		    			return next(null, text);
		    		}, function(err) {
		    			info.session.mobile = mobile;
			    		info.wait("user register profile image");
			    		return next(null, prompt);
		    		});
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
			utils.operation_is_failed(info, next);
			info.rewait("user register profile image");
			return next(null, "抱歉，只能上传图片。");
		}else {
			var mobile = info.session.mobile;
		    UserServices.queryByMobile(mobile).then(function(user) {
		    	if (user) {
		    		// 如果查到相关信息,则是已经认证,否则需要保存头像并返回激活链接
		    		UserServices.queryByOpenId({
		    			schoolId: info.session.school.id,
		    			openId: info.uid
		    		}).then(function(user) {
		    			var text = ejs.render(
							registered,
							{mobile: user.mobile}
						);
		    			return next(null, text);
		    		}, function(err) {
		    			var filename = 'user/' + mobile + '/profile/' + (new Date()).getTime();
		    			utils.download_image(info.param.picUrl, filename, function() {
			    			delete info.session.mobile;
			    			var text = ejs.render(
								'请点击<a href="<%- url%>">认证链接</a>完成用户认证操作。', 
								{url: conf.site_root + '/user/mobileRegister?mobile=' + mobile + '&openId=' + info.uid + '&profileImage=' + filename}
							);
				    		return next(null, text);
		    			});
		    		});
		    	} else {
		    		return next(null, failed);
		    	}
		    }, function() {
		        return next(null, failed);
		    });
		}
	});
}