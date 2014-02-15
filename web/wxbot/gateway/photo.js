/**
 * Usage:
 * - 我的图库
 */
var ejs = require('ejs');
var conf = require('../../conf');
var utils = require("../utils");
var BaseServices = require("../../services/BaseServices");
var PhotoServices = require("../../services/PhotoServices");

module.exports = function(webot) {
	webot.set('user add photo by type', {
		domain: "gateway",
		pattern: function(info) {
			return info.type == 'image';
		},
		handler: function(info, next) {
            var schoolId = info.session.school.id;
            var user = info.session.teacher || info.session.parent;

            var filename = 'school/' + schoolId + '/user/' + user.id + '/photo/' + (new Date()).getTime();
            utils.download_image(info.param.picUrl, filename, function() {
                var path = '#/school/' + schoolId;
                var data = {schoolId: schoolId};
                if (info.session.teacher && info.session.teacher.wxclasses && info.session.teacher.wxclasses.length > 0) {
                    data.teacherId = user.id;
                    data.classId = user.wxclasses[0].id;
                    path += '/teacher/' + user.id + '/photo';
                } else if (info.session.parent && info.session.parent.students && info.session.parent.students.length > 0) {
                    data.studentId = user.students[0].id;
                    data.classId = user.students[0].classId;
                    path += '/parent/' + user.id + '/photo';
                } else {
                    return next(null, "您的角色异常！");
                }

                data.path = filename;
                data.createdBy = user.id;

                PhotoServices.create(data).then(function() {
                    var text = ejs.render(
                        '您可以继续上传图片，或者点击<a href="<%- url%>">我的图库</a>进行后续操作', 
                        {url: conf.site_root + '/webot/wap/index.html?' + BaseServices.getAuthoriedParams(schoolId, user.id) + path}
                    );
                    return next(null, text);
                }, function() {
                    return next(null, "保存到数据库时失败。");
                });
            });
        }
	});
}