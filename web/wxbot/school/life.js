var conf = require('../../conf');

module.exports = function(webot) {

    webot.set('music start by text', {
        domain: "school",
        pattern: /儿歌|歌|音乐|music/i,
        handler: function(info, next) {
            return next(null, {
                title: '在线儿歌',
                url: 'http://fm.baidu.com/#/channel/public_tag_%E5%84%BF%E6%AD%8C',
                picUrl: conf.site_root + '/webot/wap/images/webot/music.png',
                description: '点击进入【百度随心听】后，向右滑动界面，在频道列表中选择【儿歌】频道',
            });
        }
    });

    webot.set('weather start by text', {
        domain: "school",
        pattern: /天气|天气预报|温度|weather/i,
        handler: function(info, next) {
            return next(null, {
                title: '天气预报',
                url: 'http://weather1.sina.cn/?vt=4',
                picUrl: conf.site_root + '/webot/wap/images/webot/weather.png',
                description: '天气情况早知道，孩子健康最重要',
            });
        }
    });

    webot.set('traffic start by text', {
        domain: "school",
        pattern: /交通|路况|路况信息|traffic/i,
        handler: function(info, next) {
            return next(null, {
                title: '交通路况',
                url: 'http://dp.sina.cn/dpool/tools/citytraffic/index.php?vt=4',
                picUrl: conf.site_root + '/webot/wap/images/webot/traffic.png',
                description: '最新交通路况信息',
            });
        }
    });
}