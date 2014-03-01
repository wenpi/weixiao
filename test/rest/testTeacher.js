var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test teacher api : ', function(){
        var schoolId = null;
        // 能获得数据
        it('success to get a school data for teacher with basic token', function(done){
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
        // 没有token无法获得教师信息
        it('failed to get teacher data without basic token', function(done){
            assert.notEqual(null, schoolId);
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/teacher", {token: 'basic-none'})
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

        // 错误的token无法获得教师信息
        it('failed to get teacher data with invalid token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "teacher", {token: 'basic-invalid'})
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

        // 能获得数据
        var count = 0;
        it('success to get teacher data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/teacher", {token: 'basic-valid'})
                    .then(function(teahcers) {
                        count = teahcers.length;
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
        // 没有token不能创建教师，只是为了判断是否使用auth方法，无需完成其他auth验证
        it('failed to create teacher data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/teacher",
                        {name: '测试教师', gender: 1, mobile: mobile, isAdmin: 0, createdBy: "rest tester"}, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not create a test teacher"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有name和createdby不能创建教师
        it('failed to create teacher data without properties', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/teacher", {name: ''}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not create a test teacher"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

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
                        console.info(err);
                        callback(new Error("should create a test teacher"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 不能再次创建教师
        it('failed to create teacher data with properties again', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/teacher", 
                        {name: '测试教师', gender: 1, mobile: mobile, isAdmin: 0, createdBy: 'rest tester'}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should create a test teacher"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the new teacher data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/teacher", {token: 'basic-valid'})
                    .then(function(teahcers) {
                        assert.equal(count + 1, teahcers.length);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the new teacher data with a specific id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/teacher?userid=" + teacherId, {token: 'basic-valid'})
                    .then(function(teahcers) {
                        assert.equal(1, teahcers.length);
                        assert.equal(teacherId, teahcers[0].id);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token不能获得教师信息
        it('failed to get teacher data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/school/" + schoolId + "/teacher/" + teacherId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not get the created teacher"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能获得教师信息
        it('success to get teacher data with new id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/school/" + schoolId + "/teacher/" + teacherId, {token: 'basic-valid'})
                    .then(function(teacher) {
                        assert.equal(teacherId, teacher.id);
                        assert.equal("测试教师", teacher.name);
                        done();
                    }, function(err) {
                        callback(new Error("should get the created teacher"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token不能更新
        it('failed to update teacher without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/school/" + schoolId + "/teacher/" + teacherId, 
                        {name: '测试教师updated', gender: 0, mobile: mobile, isAdmin: 1, updatedBy: 'rest updated'}, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not update the teacher"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 可以更新教师信息
        it('success to update teacher with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/school/" + schoolId + "/teacher/" + teacherId, 
                        {name: '测试教师updated', gender: 0, mobile: mobile, isAdmin: 1, updatedBy: 'rest updated'}, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should update the teacher"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the updated data with id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/school/" + schoolId + "/teacher/" + teacherId, {token: 'basic-valid'})
                    .then(function(teacher) {
                        assert.equal(teacherId, teacher.id);
                        assert.equal("测试教师updated", teacher.name);
                        assert.equal('0', teacher.gender);
                        assert.equal('1', teacher.isAdmin);
                        done();
                    }, function(err) {
                        callback(new Error("should get the updated teacher"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        var newMobile = '12' + (new Date()).getTime().toString().substring(4, 13);
        var secTeacherId;
        // 能创建一个教师
        it('success to create teacher data with properties', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/teacher", 
                        {name: '测试教师2', gender: 1, mobile: newMobile, isAdmin: 0, createdBy: 'rest tester'}, {token: 'basic-valid'})
                    .then(function(id) {
                        assert.notEqual(undefined, id);
                        secTeacherId = id;
                        done();
                    }, function(err) {
                        callback(new Error("should create a test teacher"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 教师能登录
        it('success to get auth info', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.auth("/api/auth", {username: mobile, password: mobile.substring(7)}, {token: 'basic-none'})
                    .then(function(token) {
                        assert.notEqual(token.wexuser, undefined);
                        assert.equal(token.type, 1);
                        assert.notEqual(token.wexkey, undefined);
                        assert.notEqual(token.wextoken, undefined);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should able to login"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 教师能更新姓名
        it('success to update user profile', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/user/" + teacherId, {name: '教师newName'}, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should able to update profile"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 教师能修改密码
        it('success to update user password', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/user/" + teacherId, {oldPassword: mobile.substring(7), password: 'passw0rd'}, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should able to update password"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 教师没有密码不能能更新openId
        it('failed to update user open id wo/ password', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/school/" + schoolId + "/user/" + teacherId, 
                            {openId: 'openId' + teacherId, photo: 'photo' + teacherId}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not able to register user from weixin without password"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 教师密码不对不能能更新openId
        it('failed to update user open id w/ wrong password', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/school/" + schoolId + "/user/" + teacherId, 
                            {openId: 'openId' + teacherId, photo: 'photo' + teacherId, password: 'password'}, {token: 'basic-valid'})
                        .then(function() {
                            callback(new Error("should not able to register user from weixin without password"));
                        }, function(err) {
                            done();
                        });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 教师密码正确才能更新openId
        it('success to update user open id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/school/" + schoolId + "/user/" + teacherId, 
                            {openId: 'openId' + teacherId, photo: 'photo' + teacherId, password: 'passw0rd'}, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should able to register user from weixin"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        
        // openId不能重复
        it('success to update user open id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/school/" + schoolId + "/user/" + secTeacherId, 
                            {openId: 'openId' + teacherId, photo: 'photo' + teacherId, password: newMobile.substring(7)}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not able to register another user w/ a same open id"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 不能重复更新openId
        it('failed to update user open id again', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/school/" + schoolId + "/user/" + teacherId, 
                            {openId: 'openId' + teacherId, photo: 'photo' + teacherId, password: 'passw0rd'}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not able to register user from weixin for twice"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 有新密码以后,教师能登录
        it('success to get auth info again', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.auth("/api/auth", {username: mobile, password: 'passw0rd'}, {token: 'basic-none'})
                    .then(function(token) {
                        assert.notEqual(token.wexuser, undefined);
                        assert.equal(token.type, 1);
                        assert.notEqual(token.wexkey, undefined);
                        assert.notEqual(token.wextoken, undefined);
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should able to login"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token不能删除教师
        it('failed to remove teacher without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + "/teacher/" + teacherId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not remove the teacher"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 有token能删除教师
        it('success to remove teacher with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + "/teacher/" + teacherId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should remove the teacher"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 有token能删除教师
        it('failed to get the removed teacher with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.get("/api/school/" + schoolId + "/" + teacherId, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not get the remvoed teacher"));
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