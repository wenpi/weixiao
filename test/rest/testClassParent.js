var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test parent api : ', function(){
        var schoolId = null;
        // 能获得学校数据
        it('success to get a school data for class and parent with basic token', function(done){
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
        var classId = null;
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

        // 获得某班家长总数
        var count = 0;
        it('success to get the current count of parent in this class', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/parent", 
                        {token: 'basic-valid'})
                    .then(function(parents) {
                        count = parents.length;
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should get the count of the parents."));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        var sCount = 0;
        it('success to get the current count of student in this class', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/student", 
                        {token: 'basic-valid'})
                    .then(function(students) {
                        sCount = students.length;
                        done();
                    }, function(err) {
                        callback(new Error("should get the count of the students."));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        
        var mobile = '13' + (new Date()).getTime().toString().substring(4, 13);
        // 没有token不能创建家长账号信息及孩子信息
        it('failed to create a parent and a student', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.create("/api/school/" + schoolId + "/class/" + classId + "/parent", 
                        {name: "孩子1", gender: 1, mobile: mobile, photo: 'none'}, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not create a parent and a student"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        
        // 能创建家长账号信息及孩子信息
        var parentId;
        it('success to create a parent and a student', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.create("/api/school/" + schoolId + "/class/" + classId + "/parent", 
                        {name: "孩子1", gender: 1, mobile: mobile, photo: 'none', createdBy: 'creator'}, {token: 'basic-valid'})
                    .then(function(id) {
                        parentId = id;
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should create a parent and a student"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 家长总数上升
        it('success to get the new count of parent in this class', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/parent", 
                        {token: 'basic-valid'})
                    .then(function(parents) {
                        assert.equal(count + 1, parents.length);
                        done();
                    }, function(err) {
                        callback(new Error("should get the count"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 通过该家长得到学生列表及学生标示
        var studentId;
        it('success to get the current count of student for the parent', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/parent/" + parentId + "/student", 
                        {token: 'basic-valid'})
                    .then(function(students) {
                        assert.equal(1, students.length);
                        assert.equal(1, students[0].gender);
                        studentId = students[0].id;
                        done();
                    }, function(err) {
                        callback(new Error("should get the student count"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the current count of parent for the student', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/student/" + studentId + "/parent", 
                        {token: 'basic-valid'})
                    .then(function(parents) {
                        assert.equal(1, parents.length);
                        assert.equal(parentId, parents[0].id);
                        assert.equal(mobile, parents[0].mobile);
                        done();
                    }, function(err) {
                        callback(new Error("should get the parent count"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        //TODO: 添加第二位家长和相关检测
        return;

        // 没有token不能删除关系
        it('failed to delete the parent and student', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.remove("/api/school/" + schoolId + "/class/" + classId + "/parent/" + parentId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not remove the parent"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能删除关系
        it('success to delete the parent and student', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.remove("/api/school/" + schoolId + "/class/" + classId + "/parent/" + parentId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should remove the parent"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 删除以后，家长总数下降
        it('success to get the final count of parent in this class', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/parent", 
                        {token: 'basic-valid'})
                    .then(function(parents) {
                        assert.equal(count, parents.length);
                        done();
                    }, function(err) {
                        callback(new Error("should get the count"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        // 删除以后，学生总数下降
        it('success to get the final count of student in this class', function(done){
            // an example using an object instead of an array
            async.series({
                query: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/student", 
                        {token: 'basic-valid'})
                    .then(function(students) {
                        assert.equal(sCount, students.length);
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