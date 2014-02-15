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

        // 能获得班级id
        var classId;
        it('success to get class data with basic token', function(done){
            assert.notEqual(null, schoolId);
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
        
        // 能创建家长账号信息及孩子信息
        var parentId;
        it('success to create a parent and a student', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/class/" + classId + "/parent", 
                        {name: "孩子1", gender: 1, mobile: mobile, photo: 'none', createdBy: 'creator'}, {token: 'basic-valid'})
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

        var studentId;
        it('success to get the student id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/parent/" + parentId + "/student", {token: 'basic-valid'})
                    .then(function(students) {
                        assert.notEqual(0, students.length);
                        studentId = students[0].id;
                        done();
                    }, function(err) {
                        callback(new Error("should get a student id"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 有token也无法获得班级图片列表
        it('failed to get the total photo of the class without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/photo", {user: parentId})
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
 
        it('failed to get the total photo of the parent without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/parent/" + parentId + "/photo", {token: 'basic-invalid'})
                    .then(function(photos) {
                        callback(new Error("should not get photo without photo"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 获得图片的总数
        var count = sCount = 0;

        it('success to get the total photo of the parent with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/parent/" + parentId + "/photo", {token: 'basic-valid'})
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

        it('success to get the total photo of the student with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/student/" + studentId + "/photo", {token: 'basic-valid'})
                    .then(function(photos) {
                        sCount = photos.length;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token,该家长无法提交图片
        it('failed to create photo data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/class/" + classId + '/student/' + studentId + '/photo', 
                        {path: 'testpic', createdBy: parentId}, {token: 'basic-none'})
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

        // 能提交一条图片
        var photoId;
        it('success to create photo data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/class/" + classId + '/student/' + studentId + '/photo', 
                        {path: 'teacherpic', createdBy: parentId}, {token: 'basic-valid'})
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
        it('success to get a newer total photo of the parent with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/parent/" + parentId + "/photo", {token: 'basic-valid'})
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
        it('success to get a newer count of the photo of the student with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/student/" + studentId + "/photo", {token: 'basic-valid'})
                    .then(function(photos) {
                        assert.equal(sCount + 1, photos.length);
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