var Q = require("q");
var utils = require("./utils");
var conf = require('../conf');
var BaseServices = require("../services/BaseServices");
var ParentServices = require("../services/ParentServices");
var TeacherServices = require("../services/TeacherServices");

module.exports = function(webot) {
    webot.loads("weexiao", "school", "gateway");

    // 默认欢迎词
    webot.set('weexiao demo', {
        pattern: /^demo/i,
        handler: function(info, next) {
            if (conf.online) { next(); }

            var schoolId = info.session.school.id;
            Q.all([
               ParentServices.query(schoolId, {}),
               TeacherServices.query(schoolId, {isAdmin: 0}),
               TeacherServices.query(schoolId, {isAdmin: 1}),
            ]).then(function(results) {
                var prompts = [], names = ['家长', '老师', '园长'];
                for (var i=0; i<results.length; i++) {
                    var users = results[i];
                    if (users.length > 0) {
                        var url = conf.site_root + '/webot/wap/index.html?' + BaseServices.getAuthoriedParams(schoolId, users[0].id);
                        prompts.push('<a href="' + url + '">' + names[i] + '</a>');
                    }
                }
                next(null, prompts.join("\n\n"));
            });
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