/**
 * Usage:
 * - 留言功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
module.exports = function(webot) {
	// 留言提示语
	webot.set('parent message', {
		domain: "parent",
		pattern: /^(留言|(leave )?message|咨询|PARENT_MESSAGE_INPUT)/i,
		handler: function(info, next) {
			info.wait("parent message input");
			return next(null, "请您在" + conf.timeout.desc + "内留言，只能输入文字：");
		}
	});
	// 等待留言输入
	webot.waitRule('parent message input', function(info, next) {
		if (!info.is("text")) {
			info.rewait("parent message input");
			return next(null, "抱歉，只能输入文字。");
		}
		if (info.session.parent) {
			// 接受提交指令
			if (info.text === '好') {
				if (!info.session.parent.messages || info.session.parent.messages.length == 0) {
					info.rewait("parent message input");
					return next(null, "您还没输入文字，请留言：");
				}
				// TODO 消息入库
				delete info.session.parent.messages;
				return next(null, "留言已提交！点击【我的留言】查看留言最新状态。");
			}
			// 接受取消指令
			if (info.text === '不') {
				delete info.session.parent.messages;
				return next(null, "留言已取消，如需留言请再次点击【我要留言】。");
			}
			// 构造message
			if (!info.session.parent.messages) {
				info.session.parent.messages = [];
			}
			info.session.parent.messages.push(info.text);
			info.wait("parent message input");
			return next(null, "已存成草稿，您可继续输入文字。发送【好】提交留言，发送【不】取消留言");
		}
	});

	// 查看留言状态
	webot.set('parent message check', {
		domain: "parent",
		pattern: /^(查看留言|(check )?message|我的留言|PARENT_MESSAGE_CHECK)/i,
		handler: function(info, next) {
			return next(null,
				ejs.render(
					'您有条<%= count%>未读消息。<a href="<%= url%>">查看</a>', 
					{
						count: 2,
						url: conf.site_root + '/message?schoolOpenId' + info.sp +' &parentopenId' + info.uid
					}
				)
			);
		}
	});
}