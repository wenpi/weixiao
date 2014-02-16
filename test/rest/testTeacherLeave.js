var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test teacher leave api : ', function(){
        var schoolId = null;
        // 能获得学校数据
        it('success to get a school data for leave module with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
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

        // 能获得班级id
        var classId;
        it('success to get class data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class", {token: 'basic-valid'})
                    .then(function(wexclasses) {
                        assert.notEqual(0, wexclasses.length);
                        classId = wexclasses[0].id;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        var mobile = '13' + (new Date()).getTime().toString().substring(4, 13);
        var teacherId;
        // 能创建教师
        it('success to create teacher data with properties', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
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

        // 增加绑定
        it('success to create the reference between class and teacher', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/class/" + classId + "/teacher/" + teacherId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should assgin a teacher to a class"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能获得学生ID
        var studentId;
        it('success to get the student id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/student/", {token: 'basic-valid'})
                    .then(function(students) {
                        assert.notEqual(0, students.length);
                        studentId = students[0].id;
                        done();
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token无法获得请假列表
        it('failed to get the total leave of the class without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/leave", {token: 'basic-none'})
                    .then(function(leaves) {
                        callback(new Error("should not get the leave"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 获得通知的总数
        var count = sCount = 0;

        it('success to get the total leave of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/leave", {token: 'basic-valid'})
                    .then(function(leaves) {
                        count = leaves.length;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the count of the student with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/student/" + studentId + "/leave", {token: 'basic-valid'})
                    .then(function(leaves) {
                        sCount = leaves.length;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token,该教师无法向这个学生提交请假记录
        it('failed to create leave data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + '/student/' + studentId + '/leave', 
                        {startDate: '2014-03-01', days: 2, type: 0, reason: "生病", createdBy: teacherId}, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not create a leave"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 有token,该教师才能提交请假
        var leaveId;
        it('success to create leave data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + '/student/' + studentId + '/leave', 
                        {startDate: '2014-02-15', days: 3, type: 0, reason: "生病", createdBy: teacherId}, {token: 'basic-valid'})
                    .then(function(id) {
                        leaveId = id;
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should create a leave"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 时间不合理的不能创建
        it('failed to create leave data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + '/student/' + studentId + '/leave', 
                        {startDate: '2014-02-15', days: 1, type: 0, reason: "生病", createdBy: teacherId}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not create a leave"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 时间不合理的不能创建
        it('failed to create leave data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + '/student/' + studentId + '/leave', 
                        {startDate: '2014-02-14', days: 2, type: 0, reason: "生病", createdBy: teacherId}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not create a leave"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 时间不合理的不能创建
        it('failed to create leave data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + '/student/' + studentId + '/leave', 
                        {startDate: '2014-02-17', days: 1, type: 0, reason: "生病", createdBy: teacherId}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not create a leave"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get new total leave of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/leave", {token: 'basic-valid'})
                    .then(function(leaves) {
                        assert.equal(count + 1, leaves.length);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get new count of the student with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/student/" + studentId + "/leave", {token: 'basic-valid'})
                    .then(function(leaves) {
                        assert.equal(sCount + 1, leaves.length);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 修改请假
        it('failed to update leave data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/leave/" + leaveId, 
                        {startDate: '2014-02-17', days: 2, type: 0, reason: "生病修改", updatedBy: teacherId}, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not update a leave"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 修改请假
        it('success to update leave data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/leave/" + leaveId, 
                        {startDate: '2014-02-17', days: 2, type: 0, reason: "生病修改", updatedBy: teacherId}, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should update a leave"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 无法删除请假
        it('success to remove the leave with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/leave/" + leaveId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not remove a leave"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 删除请假
        it('success to remove the leave with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/leave/" + leaveId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should remove a leave"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

    });
}