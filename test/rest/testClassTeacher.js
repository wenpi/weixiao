var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test teacher api : ', function(){
        var schoolId = null;
        // 能获得学校数据
        it('success to get a school data for class and teacher with basic token', function(done){
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
        // 能创建一个班级
        var classId;
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
        var mobile = '138' + (new Date()).getTime().toString().substring(3, 11);
        // 能创建一个教师
        it('success to create teacher data with properties', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.create("/api/school/" + schoolId + "/teacher", 
                        {name: '测试教师', gender: 1, mobile: mobile, isAdmin: 0, createdBy: 'rest tester'}, {token: 'basic-valid'})
                    .then(function(id) {
                        assert.notEqual(undefined, id);
                        teacherId = id;
                        done();
                    }, function(err) {
                        callback(new Error("should create a test teacher"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        // 获得原来教师总数
        var count = 0;
        it('success to get the current count of teacher in this class', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/teacher", 
                        {token: 'basic-valid'})
                    .then(function(teachers) {
                        count = teachers.length;
                        done();
                    }, function(err) {
                        callback(new Error("should get the count."));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能创建关系
        it('success to create a reference between class and teacher', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.create("/api/school/" + schoolId + "/class/" + classId + "/teacher/" + teacherId, 
                        {}, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should create a reference"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 教师总数上升
        it('success to get the new count of teacher in this class', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/teacher", 
                        {token: 'basic-valid'})
                    .then(function(teachers) {
                        assert.equal(count + 1, teachers.length);
                        done();
                    }, function(err) {
                        callback(new Error("should get the count"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能删除关系
        it('success to delete the reference between class and teacher', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.remove("/api/school/" + schoolId + "/class/" + classId + "/teacher/" + teacherId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should remove a reference"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 删除以后，教师总数下降
        it('success to get the final count of teacher in this class', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/teacher", 
                        {token: 'basic-valid'})
                    .then(function(teachers) {
                        assert.equal(count, teachers.length);
                        done();
                    }, function(err) {
                        callback(new Error("should get the count"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
    });
}