module.exports = {
  online: false,
  port: 3001,
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
  users: {
    admin: {
      passwd: ''
    }
  },
  site_root: 'http://pi.lxztx.com',
  //site_root: 'http://192.168.1.105',
  upload_root: '/var/www/html/weexiao/upload',
  //upload_root: '/Users/panwei/dev/workspace/workspace.weexiao/upload',
  salt: 'keyboardcat123',
  weixin: 'keyboardcat123'
};