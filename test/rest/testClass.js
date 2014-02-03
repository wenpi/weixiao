var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test class api : ', function(){
        var schoolId = null;
        // 能获得数据
        it('success to get a school data for class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryPagingList("/api/school", {token: 'basic-valid'})
                    .then(function(schools) {
                        assert.notEqual(0, schools.length);
                        schoolId = schools[0].id;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        // 没有token无法获得班级信息
        it('failed to get class data without basic token', function(done){
            assert.notEqual(null, schoolId);
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class", {token: 'basic-none'})
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

        // 错误的token无法获得班级信息
        it('failed to get class data with invalid token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryAll("/api/school/" + schoolId + "class", {token: 'basic-invalid'})
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

        // 过期的token无法获得班级信息
        it('failed to get class data with expired token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class", {token: 'basic-expired'})
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
        var count = 0;
        it('success to get class data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class", {token: 'basic-valid'})
                    .then(function(wexclasses) {
                        count = wexclasses.length;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        
        // 没有token不能创建班级，只是为了判断是否使用auth方法，无需完成其他auth验证
        it('failed to create class data without token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.create("/api/school/" + schoolId + "/class", {name: '测试班级', code: "classcode", createdBy: "rest tester"}, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not create a test class"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有name和createdby不能创建班级
        it('failed to create class data without properties', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.create("/api/school/" + schoolId + "/class", {name: ''}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not create a test class"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        var classId;
        // 能创建班级
        it('success to create class data with properties', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.create("/api/school/" + schoolId + "/class", 
                        {name: '测试班级', code: "classcode", createdBy: 'rest tester'}, {token: 'basic-valid'})
                    .then(function(id) {
                        assert.notEqual(undefined, id);
                        classId = id;
                        done();
                    }, function(err) {
                        callback(new Error("should create a test class"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the new class data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class", {token: 'basic-valid'})
                    .then(function(wexclasses) {
                        assert.equal(count + 1, wexclasses.length);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token不能获得班级信息
        it('failed to get class data without token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.get("/api/school/" + schoolId + "/class/" + classId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not get the created class"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能获得班级信息
        it('success to get class data with new id', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.get("/api/school/" + schoolId + "/class/" + classId, {token: 'basic-valid'})
                    .then(function(wexclass) {
                        assert.equal(classId, wexclass.id);
                        assert.equal("测试班级", wexclass.name);
                        done();
                    }, function(err) {
                        callback(new Error("should get the created class"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token不能更新
        it('failed to update class without token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.update("/api/school/" + schoolId + "/class/" + classId, {code: 'code' + classId}, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not update the class"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token不能激活班级
        it('success to update class with token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.update("/api/school/" + schoolId + "/class/" + classId, 
                        {name: 'updated class name', code: 'codeupdated', updatedBy: 'rest tester'}, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should update the class"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the updated data with id', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.get("/api/school/" + schoolId + "/class/" + classId, {token: 'basic-valid'})
                    .then(function(wexclass) {
                        assert.equal(classId, wexclass.id);
                        assert.equal("updated class name", wexclass.name);
                        assert.equal("codeupdated", wexclass.code);
                        done();
                    }, function(err) {
                        callback(new Error("should get the updated class"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token不能删除班级
        it('failed to remove class without token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.remove("/api/school/" + schoolId + "/class/" + classId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not remove the class"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 有token能删除班级
        it('success to remove class with token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.remove("/api/school/" + schoolId + "/class/" + classId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should remove the class"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 有token能删除班级
        it('failed to get the removed class with token', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.get("/api/school/" + schoolId + "/" + classId, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not get the reremoved class"));
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