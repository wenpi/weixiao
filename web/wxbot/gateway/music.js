/**
 * Usage:
 * - 听儿歌功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');

function child_music(info, next) {
    var text = ejs.render(
        '使用方法:\n\nQQ音乐电台\n1，<a href="<%- ur1%>">点击这里立刻收听</a>\n\n百度随心听：\n1，<a href="<%- ur2%>">点击这里</a>\n2，向右滑动界面\n3，选择【儿歌】频道', 
        {
        	url1: 'http://fm.qq.com/#166_1',
            url2: 'http://fm.baidu.com/#/channel/public_tag_%E5%84%BF%E6%AD%8C'
        }
    );
    return next(null, text);
}

module.exports = function(webot) {
	// 修改个人资料提示语
	webot.set('user child music start by text', {
		domain: "gateway",
		pattern: /^(儿歌|(listen )?music)/i,
		handler: child_music
	});

	webot.set('user course view start by event', {
		domain: "gateway",
		pattern: function(info) {
			return info.param.eventKey === 'CHILD_MUSIC';
		},
		handler: child_music
	});
}