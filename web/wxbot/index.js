var utils = require("./utils");
var conf = require('../conf');

module.exports = function(webot) {
	webot.loads("weexiao", "gateway", "school", "parent", "teacher");

    // 默认欢迎词
    webot.set('houtai test', {
        pattern: /^houtai/i,
        handler: function(info, next) {
            var prompt = [
                '<a href="http://wvovo.com/mangular">NGCSS3</a>',
                '<a href="http://purecss.io/forms/">PureCSS</a>',
                '<a href="' + conf.site_root + '/webot/wap/index.html">后台测试</a>'
            ];
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