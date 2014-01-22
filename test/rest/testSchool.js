var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test school api : ', function(){
        // 没有token无法获得学校信息
        it('failed to get school data without basic token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryPagingList(SERVER + "/api/school", {token: 'basic-none'})
                    .then(function() {
                        throw new Error("should not get data");
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                throw err;
            });
        });

        // 错误的token无法获得学校信息
        it('failed to get school data with invalid token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryPagingList(SERVER + "/api/school", {token: 'basic-invalid'})
                    .then(function() {
                        throw new Error("should not get data");
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                throw err;
            });
        });

        // 过期的token无法获得学校信息
        it('failed to get school data with expired token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryPagingList(SERVER + "/api/school", {token: 'basic-expired'})
                    .then(function() {
                        throw new Error("should not get data");
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                throw err;
            });
        });

        // 能获得数据
        it('success to get school data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryPagingList(SERVER + "/api/school", {token: 'basic-valid'})
                    .then(function(schools) {
                        assert.equal(true, Array.isArray(schools));
                        done();
                    }, function(err) {
                        throw err;
                    });
                }
            }, function(err, results) {
                throw err;
            });
        });
    });
}