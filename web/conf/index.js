module.exports = {
  port: 3000,
  hostname: '127.0.0.1',
  timeout: {
    desc: '十分钟',
    val: 1000 * 60 * 10
  },
  mongo: {
    host: '127.0.0.1',
    port: '27017',
    dbname: 'weexiaodb',
  },
  mysql: {
    host: '127.0.0.1',
    port: '3306',
    user: 'weexiao',
    password: 'weexiao',
    database: 'weexiao'
  },
  users: {
    admin: {
      passwd: 'passw0rd'
    }
  },
  site_root: 'http://127.0.0.1:3000',
  salt: 'weexiao',
  weixin: 'weexiao'
};

var environ = process.env.NODE_ENV || 'development';

try {
  var localConf = require('./' + environ);
  for (var i in localConf) {
    module.exports[i] = localConf[i];
  }
} catch (e) {}
