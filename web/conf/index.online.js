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
    host: 'localhost',
    port: '3306',
    user: 'weexiao',
    password: 'weexiaoPassw0rd',
    //database: 'weexiao'
    database: 'weexiao'
  },
  users: {
    admin: {
      passwd: 'passw0rd'
    }
  },
  site_root: 'http://weexiao.com',
  upload_root: '/var/www/html/weexiao/upload',
  //upload_root: 'C:/upload/images',
  salt: 'weexiao',
  weixin: 'weexiao'
};
