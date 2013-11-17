var fs = require('fs');
var request = require('request');
var conf = require("../conf");

var download = function(uri, filename){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename));
  });
};

download('http://p3.qqgexing.com/touxiang/20120823/1633/5035eac803b4e.jpg', conf.upload_root + '/google.png');