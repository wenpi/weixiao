var utils = require("./utils");
var conf = require('../conf');
var BaseServices = require("../services/BaseServices");

module.exports = function(webot) {
	webot.loads("weexiao", "gateway", "school", "parent", "teacher");

    // 默认欢迎词
    webot.set('houtai test', {
        pattern: /^test/i,
        handler: function(info, next) {
            var schoolId = 'd28eefe9-db3b-4db5-a469-424ac5d187d8';
            var userurl = conf.site_root + '/webot/wap/index.html?' + BaseServices.getAuthoriedParams(schoolId, '3d6a1441-b4f5-445c-a27f-02a8667ad293');
            var teacherurl = conf.site_root + '/webot/wap/index.html?' + BaseServices.getAuthoriedParams(schoolId, '64edb1cc-54e1-4671-b2cb-cebe479a40d3');
            var adminurl = conf.site_root + '/webot/wap/index.html?' + BaseServices.getAuthoriedParams(schoolId, 'dcc7e4d2-7124-445a-9145-e2254eccc435');

            /*
            console.info(userurl);
            console.info(teacherurl);
            console.info(adminurl);*/
            var prompt = [
                '<a href="' + userurl + '">家长</a>',
                '<a href="' + teacherurl + '">老师</a>',
                '<a href="' + adminurl + '">园长</a>'
            ];
            next(null, prompt.join("\n\n"));
        }
    });

	webot.set('houtai my test', {
        pattern: /^mytest/i,
        domain: "gateway",
        handler: function(info, next) {
            var schoolId = info.session.school.id;
            var user = info.session.teacher || info.session.parent;
            console.info(user);
            var userurl = conf.site_root + '/webot/wap/index.html?' + BaseServices.getAuthoriedParams(schoolId, user.id);

            console.info(userurl);
            var prompt = [
                '<a href="' + userurl + '">当前认证用户</a>'
            ];
            console.info('here.');
            next(null, prompt.join("\n\n"));
        }
    });

	// 默认欢迎词
	webot.set('greeting', {
		pattern: function() {
			return true;
		},
		handler: function(info, next) {
			if (info.session.school) {
				var nouser = '\n\n菜单中的高级服务，只对本园教师及家长开放，使用前需要进行身份认证。如果您是本园成员，请点击左下角键盘图标后，直接回复您的手机号进行认证，例如13812345678';
				if (info.session.parent || info.session.teacher) {
					nouser = '';
				}
				var prompt = [
					"感谢您关注" + info.session.school.name + '\n',
					'<a href="' + conf.site_root + "/front/" + info.session.school.id + '">点击这里了解本园概况</a>',
					nouser
				];
				next(prompt.join(""));
			} else {
				next("欢迎使用本幼儿园微信服务。");
			}
		}
	});

    // 定义school域, 检查幼儿园是否激活
    webot.beforeReply(utils.ensure_school_is_bind);
}