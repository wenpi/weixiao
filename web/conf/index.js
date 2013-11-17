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
    //host: '127.0.0.1',
    host: '42.96.191.235',
    port: '3306',
    user: 'panwei',
    password: 'pw@2013',
    //database: 'weexiao'
    database: 'kindergarten'
  },
  users: {
    admin: {
      passwd: 'passw0rd'
    }
  },
  site_root: 'http://kid.weexiao.com',
  //upload_root: '/var/www/html/kindergarten/upload',
  upload_root: 'C:/upload/images',
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
