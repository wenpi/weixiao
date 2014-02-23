var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test teacher student path api : ', function(){
        var schoolId = null;
        // 能获得学校数据
        it('success to get a school data for path module with basic token', function(done){
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

        // 能获得班级id
        var studentId;
        it('success to get class data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/student", {token: 'basic-valid'})
                    .then(function(students) {
                        assert.notEqual(0, students.length);
                        studentId = students[0].id;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token无法获得成长记录列表
        it('failed to get the total path of the class without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/path", {token: 'basic-none'})
                    .then(function(paths) {
                        callback(new Error("should not get the path"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 获得成长记录的总数
        var count = sCount = 0;

        it('success to get the total path of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/path", {token: 'basic-valid'})
                    .then(function(paths) {
                        count = paths.length;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the total path of the student with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/student/" + studentId + "/path", {token: 'basic-valid'})
                    .then(function(paths) {
                        sCount = paths.length;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('failed to create path data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/class/" + classId + "/path", 
                        {content: '成长记录', 'photos[0]': photoId, createdBy: teacherId}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not create a path"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能提交一条文字成长记录
        it('success to create text path data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/student/" + studentId + "/path", 
                        {content: '文字成长记录', createdBy: teacherId}, {user: teacherId})
                    .then(function(id) {
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should create a text path"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 获得photoId
        var photoId
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

        // 能提交图文记录
        var pathId;
        it('success to create photo path data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/student/" + studentId + "/path", 
                        {content: '图文成长记录', 'photos[0]': photoId, createdBy: teacherId}, {user: teacherId})
                    .then(function(id) {
                        pathId = id;
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should create a photo path"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 总数加一 且附件数为1
        var attachmentId;
        it('success to get a newer total path of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/path", {token: 'basic-valid'})
                    .then(function(paths) {
                        assert.equal(count + 2, paths.length);
                        var photos = paths[0].photos;
                        assert.equal(1, photos.length);
                        attachmentId = photos[0].id;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get a newer total path of the teacher with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/teacher/" + teacherId + "/path", {token: 'basic-valid'})
                    .then(function(paths) {
                        assert.equal(sCount + 2, paths.length);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 无法删除附件
        it('failed to remove the attachment without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + '/path/' + pathId + '/attachment/' + attachmentId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not remove a attachment"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 删除附件成功
        it('success to remove the path with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + '/path/' + pathId + '/attachment/' + attachmentId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should remove a attachment"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get a newer attachment of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/path", {token: 'basic-valid'})
                    .then(function(paths) {
                        var photos = paths[0].photos;
                        assert.equal(0, photos.length);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 无法删除成长记录
        it('failed to remove the path without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + '/path/' + pathId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not remove a path"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 删除成长记录
        it('success to remove the path with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + '/path/' + pathId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should remove a path"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get a final total path of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/path", {token: 'basic-valid'})
                    .then(function(paths) {
                        assert.equal(count + 1, paths.length);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

    });
}