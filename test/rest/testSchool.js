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
                    base.queryPagingList("/api/school", {token: 'basic-none'})
                    .then(function(err) {
                        callback(err);
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 错误的token无法获得学校信息
        it('failed to get school data with invalid token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryPagingList("/api/school", {token: 'basic-invalid'})
                    .then(function(err) {
                        callback(err);
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 过期的token无法获得学校信息
        it('failed to get school data with expired token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryPagingList("/api/school", {token: 'basic-expired'})
                    .then(function() {
                        callback(new Error("should not get data"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能获得数据
        it('success to get school data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryPagingList("/api/school", {token: 'basic-valid'})
                    .then(function(schools) {
                        assert.equal(true, Array.isArray(schools));
                        assert.notEqual(0, schools.length);
                        var school = schools[0];
                        assert.notEqual(undefined, school.id);
                        assert.notEqual(undefined, school.name);
                        /*
                        assert.notEqual(undefined, school.address);
                        assert.notEqual(undefined, school.phone);
                        assert.notEqual(undefined, school.email);
                        assert.notEqual(undefined, school.logo);*/
                        assert.equal(undefined, school.appid);
                        assert.equal(undefined, school.appsecret);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token不能创建学校，只是为了判断是否使用auth方法，无需完成其他auth验证
        it('failed to create school data without token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.create("/api/school", {name: '测试学校'}, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not create a test school"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有name和createdby不能创建学校
        it('failed to create school data without properties', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.create("/api/school", {name: ''}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not create a test school"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        var schoolId;
        // 能创建学校
        it('success to create school data with properties', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.create("/api/school", {name: '测试学校', createdBy: 'rest tester'}, {token: 'basic-valid'})
                    .then(function(id) {
                        assert.notEqual(undefined, id);
                        schoolId = id;
                        done();
                    }, function(err) {
                        callback(new Error("should create a test school"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token不能获得学校信息
        it('failed to get school data without token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.get("/api/school/" + schoolId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not get the created school"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能获得学校信息
        it('success to get school data with new id', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.get("/api/school/" + schoolId, {token: 'basic-valid'})
                    .then(function(school) {
                        assert.equal(schoolId, school.id);
                        assert.equal("测试学校", school.name);
                        done();
                    }, function(err) {
                        callback(new Error("should get the created school"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token不能激活学校
        it('failed to bind school without token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.update("/api/school/" + schoolId, {openId: 'openId' + schoolId}, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not bind the school"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token不能激活学校
        it('success to bind school with token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.update("/api/school/" + schoolId, {openId: 'openId' + schoolId}, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should bind the school"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 不能激活2次
        it('failed to bind school with same open id again', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.update("/api/school/" + schoolId, {openId: 'openId' + schoolId}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should bind the school for twice"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token不能删除学校
        it('failed to remove school without token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.remove("/api/school/" + schoolId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not bind the school"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 有token能删除学校
        it('success to remove school with token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.remove("/api/school/" + schoolId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should bind the school"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 有token能删除学校
        it('failed to get the removed school with token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.get("/api/school/" + schoolId, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not get the removed school"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
    });
}