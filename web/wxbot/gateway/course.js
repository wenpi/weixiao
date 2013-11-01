/**
 * Usage:
 * - 课程计划功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');

function course_view(info, next) {
    var text = "抱歉，您不是认证用户，不能查看课程计划！";
    if (info.session.parent) {
        text = ejs.render(
            '<a href="<%- url%>">请点击这里查看课程计划</a>', 
            {
                url: conf.site_root + '/front/course?parentId=' + info.session.parent.id
            }
        )
        return next(null, text);
    } else if (info.session.teacher) {
        if (info.session.teacher.isAdmin === 0) {
            text = ejs.render(
                '<a href="<%- url%>">请点击这里查看课程计划</a>', 
                {
                    url: conf.site_root + '/front/course?teacherId=' + info.session.teacher.id
                }
            );
            return next(null, text);
        } else if (info.session.teacher.isAdmin === 1){
            text = '请点击下列链接查看指定班级的课程计划：\n';
            var links = [], schoolId = info.session.school.id;
            for (var i=0; i<info.session.teacher.wxclasses.length; i++) {
                var wxclass = info.session.teacher.wxclasses[i];
                links.push(ejs.render(
                    '<a href="<%- url%>">' + wxclass.name + '</a>   ', 
                    {
                        url: conf.site_root + '/front/course?classid=' + wxclass.id + '&schoolid=' + schoolId
                    }
                ));
                if (i % 2 == 0 && i !== 0) {
                    links.push("\n\n");
                }
            }
            text += links.join("");
            return next(null, text);
        }
    }
    
}

module.exports = function(webot) {
	// 修改个人资料提示语
	webot.set('user course view start by text', {
		domain: "gateway",
		pattern: /^(课程计划|(view )?course)/i,
		handler: course_view
	});
	webot.set('user course view start by event', {
		domain: "gateway",
		pattern: function(info) {
			return info.param.eventKey === 'COURSE_VIEW';
		},
		handler: course_view
	});
}