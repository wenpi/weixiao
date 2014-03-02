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

        // 能创建一个班级
        var classId = null;
        it('success to create class data with properties', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
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
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/parent", 
                        {token: 'basic-valid'})
                    .then(function(parents) {
                        count = parents.length;
                        done();
                    }, function(err) {
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
                action: function(callback){
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
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/class/" + classId + "/parent", 
                        {name: "孩子1", gender: 1, mobile: mobile}, {token: 'basic-none'})
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
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/class/" + classId + "/parent", 
                        {name: "孩子1", mobile: mobile, photo: 'none', createdBy: 'creator'}, {token: 'basic-valid'})
                    .then(function(id) {
                        parentId = id;
                        done();
                    }, function(err) {
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
                action: function(callback){
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
                action: function(callback){
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
                action: function(callback){
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

        // 能获得学生信息
        it('success to get the student info', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/student/" + studentId, 
                        {token: 'basic-valid'})
                    .then(function(student) {
                        assert.equal(studentId, student.id);
                        done();
                    }, function(err) {
                        callback(new Error("should get the student info"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        var secParentId;
        var newMobile = '18' + (new Date()).getTime().toString().substring(4, 13);
        it('success to create the second parent', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/student/" + studentId + "/parent", 
                        {name: '家长2', mobile: newMobile, photo: "none", createdBy: 'creator'}, {token: 'basic-valid'})
                    .then(function(id) {
                        secParentId = id;
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should create the second parent"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the two parent for the student', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/student/" + studentId + "/parent", 
                        {token: 'basic-valid'})
                    .then(function(parents) {
                        assert.equal(2, parents.length);
                        done();
                    }, function(err) {
                        callback(new Error("should get the parent count"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the first parent info', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/parent/" + parentId, 
                        {token: 'basic-valid'})
                    .then(function(parent) {
                        assert.equal(parent.id, parentId);
                        done();
                    }, function(err) {
                        callback(new Error("should get the parent info"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to update the first parent info', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/school/" + schoolId + "/parent/" + parentId, 
                        {name: '孩子家长updated'}, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should update the parent info"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the updated first parent info', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/parent/" + parentId, 
                        {token: 'basic-valid'})
                    .then(function(parent) {
                        assert.equal(parent.name, "孩子家长updated");
                        done();
                    }, function(err) {
                        callback(new Error("should get the parent info"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to update the first parent open id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/school/" + schoolId + "/parent/" + parentId, 
                        {openId: 'openId' + mobile}, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should update the parent open id"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('failed to update the first parent open id again', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/school/" + schoolId + "/parent/" + parentId, 
                        {openId: 'openId' + mobile}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not update the parent open id"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('failed to update the second parent open id with the first parent open id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/school/" + schoolId + "/parent/" + secParentId, 
                        {openId: 'openId' + mobile}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not update the parent open id"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 家长能登录
        it('success to get auth info', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.auth("/api/auth", {username: mobile, password: mobile.substring(7)}, {token: 'basic-none'})
                    .then(function(token) {
                        assert.notEqual(token.wexuser, undefined);
                        assert.equal(token.type, 0);
                        assert.notEqual(token.wexkey, undefined);
                        assert.notEqual(token.wextoken, undefined);
                        done();
                    }, function(err) {
                        callback(new Error("should able to login"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 更新学生信息
        it('success to update the student info', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/school/" + schoolId + "/student/" + studentId, 
                        {name: '孩子updated', gender: 0}, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should update the student info"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the updated student info', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/student/" + studentId, 
                        {token: 'basic-valid'})
                    .then(function(student) {
                        assert.equal(student.name, "孩子updated");
                        assert.equal(student.gender, "0");
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should get the updated parent info"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token不能删除第一位家长
        it('failed to delete the first parent', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + "/parent/" + parentId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not remove the first parent"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能删除第一位家长
        it('success to delete the first parent', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + "/parent/" + parentId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should remove the first parent"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 删除以后，家长总数下降一位
        it('success to get the latest count of parent in this class', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
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

        // 删除以后，学生数量没变,因为第二位家长还在
        it('success to get the latest count of student in this class', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/student", 
                        {token: 'basic-valid'})
                    .then(function(students) {
                        assert.equal(sCount + 1, students.length);
                        done();
                    }, function(err) {
                        callback(new Error("should get the count"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 创建第三位家长,仅仅为了测试删除学生能级联删掉这个家长
        var mobile3 = '15' + (new Date()).getTime().toString().substring(4, 13);
        it('success to create the third parent', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/student/" + studentId + "/parent", 
                        {name: '家长3', mobile: mobile3, photo: "none", createdBy: 'creator'}, {token: 'basic-valid'})
                    .then(function(id) {
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should create the third parent"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能删除学生
        it('success to delete the student', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + "/student/" + studentId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should remove the student"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 删除以后，家长总数恢复原数
        it('success to get the final count of parent in this class', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
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

        // 删除以后，学生数量恢复原数
        it('success to get the final count of student in this class', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
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

        // 家长不能登录
        it('failed to get auth info', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.auth("/api/auth", {username: mobile, password: mobile.substring(7)}, {token: 'basic-none'})
                    .then(function(token) {
                        callback(new Error("should able to login"));
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