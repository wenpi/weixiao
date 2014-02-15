var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test teacher photo api : ', function(){
        var schoolId = null;
        // 能获得学校数据
        it('success to get a school data for photo module with basic token', function(done){
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

        // 能获得教师ID
        var teacherId = 0;
        it('success to get teacher data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/teacher", {token: 'basic-valid'})
                    .then(function(teahcers) {
                        assert.notEqual(0, teahcers.length);
                        teacherId = teahcers[0].id;
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

        // 删除关系，无论成功与否
        it('success to delete the reference between class and teacher', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + "/class/" + classId + "/teacher/" + teacherId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token,该教师无法向这个班级提交图片
        it('failed to create photo data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/class/" + classId + '/teacher/' + teacherId + '/photo', 
                        {path: 'testpic', createdBy: teacherId}, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not create a photo"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 即使有token,该教师依然无法向这个班级提交图片
        it('failed to create photo data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/class/" + classId + '/teacher/' + teacherId + '/photo', 
                        {content: '测试图片', createdBy: teacherId}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not create a photo"));
                    }, function(err) {
                        done();
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

        // 没有token无法获得图片列表
        it('failed to get the total photo of the class without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/photo", {token: 'basic-none'})
                    .then(function(photos) {
                        callback(new Error("should not get the photo"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 获得通知的总数
        var count = tCount = 0;

        it('success to get the total photo of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/photo", {token: 'basic-valid'})
                    .then(function(photos) {
                        count = photos.length;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the total photo of the teacher with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/teacher/" + teacherId + "/photo", {token: 'basic-valid'})
                    .then(function(photos) {
                        tCount = photos.length;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能提交一条图片
        var photoId;
        it('success to create photo data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/class/" + classId + '/teacher/' + teacherId + '/photo', 
                        {path: 'teacherpic', createdBy: teacherId}, {token: 'basic-valid'})
                    .then(function(id) {
                        photoId = id;
                        done();
                    }, function(err) {
                        callback(new Error("should create a photo"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 总数加一
        it('success to get a newer total photo of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/photo", {token: 'basic-valid'})
                    .then(function(photos) {
                        assert.equal(count + 1, photos.length);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 总数加一
        it('success to get a newer count of the photo of the teacher with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/teacher/" + teacherId + "/photo", {token: 'basic-valid'})
                    .then(function(photos) {
                        assert.equal(tCount + 1, photos.length);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 无法删除图片
        it('success to remove the photo with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + '/photo/' + photoId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not remove a photo"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 删除图片
        it('success to remove the photo with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + '/photo/' + photoId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should remove a photo"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });


    });
}