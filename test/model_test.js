/* global describe, it */

var Sequelize = require('sequelize'),
  sequelize = require('./environment'),
  assert = require('assert');

describe('Models', function () {
  'use strict';

  describe('.fixtures', function () {
    it('should generate fixture base on define of Model', function () {
      var Foo = sequelize.define('Foo', {
        title: Sequelize.STRING(64),
        string: Sequelize.STRING,
        text: Sequelize.TEXT,
        bool: Sequelize.BOOLEAN,
        num: Sequelize.INTEGER,
        bignum: Sequelize.BIGINT,
        float: Sequelize.FLOAT,
        date: Sequelize.DATE,
        uuid: Sequelize.UUID,
      });

      var fixture = Foo.fixtures();
      assert.ok(fixture.title);
      assert.ok(fixture.string);
      assert.ok(fixture.text);
      assert.equal(typeof fixture.bool, 'boolean');
      assert.ok(fixture.num);
      assert.ok(fixture.bignum);
      assert.ok(fixture.float);
      assert.ok(fixture.date);
      assert.ok(fixture.uuid);
    });

    it('should not generate autoIncrement keys', function () {
      var Foo = sequelize.define('Foo', {});
      var fixture = Foo.fixtures();
      assert.equal(fixture.id, null);
    });

    it('should generate autoIncrement keys when user want', function () {
      var Foo = sequelize.define('Foo', {});
      var fixture = Foo.fixtures({gen_auto_increment: true});
      assert.ok(fixture.id);
    });

    it('should generate url when user defined it in sequelize', function () {
      var Foo = sequelize.define('Foo', {
        url: {
          type: Sequelize.STRING,
          validate: {
            isUrl: true
          }
        }
      });
      var fixture = Foo.fixtures();
      assert.equal(fixture.url.substr(0,4).toLowerCase(), 'http');
    });

    it('should generate email when user defined it in sequelize', function () {
      var Foo = sequelize.define('Foo', {
        email: {
          type: Sequelize.STRING,
          validate: {
            isEmail: true
          }
        }
      });
      var fixture = Foo.fixtures();
      assert.ok(fixture.email.indexOf('@') > 0);
    });
  });

  describe('multi data generate', function () {
    it('should generate multi datas when user want', function () {
      var Foo = sequelize.define('Foo', { });
      var fixture = Foo.fixtures({num: 10});
      assert.ok(fixture instanceof Array);
      assert.equal(fixture.length, 10);
    });

    it('should work when optons is a num', function () {
      var Foo = sequelize.define('Foo', { });
      var fixture = Foo.fixtures(10);
      assert.ok(fixture instanceof Array);
      assert.equal(fixture.length, 10);
    });
  });

  describe('associate support', function() {
    var User, Project, Task;
    before(function(done) {
      User = sequelize.define('User', { });
      Project = sequelize.define('Project', { });
      Task = sequelize.define('Task', { });
      User.hasOne(Project);
      Project.hasMany(Task);
      Task.belongsTo(User);
      User.hasMany(Task);

      sequelize.sync({force:true}).success(function() {
        done();
      });
    });

    it('should support hasMany', function (done) {
      var fixture = Project.fixtures({
        include: [{
          model: Task
        }]
      }).success(function(projects) {
        for (var i in projects) {
          var project = projects[i];
          assert.ok(project.tasks);
          for (var j in project.tasks) {
            assert.equal(project.tasks[j].ProjectId, project.id);
          }
        }
        done();
      });
    });

    it('should support hasOne', function (done) {
      var fixture = User.fixtures({
        include: [{
          model: Project
        }]
      }).success(function(users) {
        for (var i in users) {
          var user = users[i];
          assert.ok(user.project);
          assert.equal(user.project.UserId, user.id);
        }
        done();
      });
    });

    it('should support belongsTo', function (done) {
      var fixture = Task.fixtures({
        include: [{
          model: User
        }]
      }).success(function(tasks) {
        for (var i in tasks) {
          var task = tasks[i];
          assert.ok(task.user);
          assert.equal(task.UserId, task.user.id);
        }
        done();
      });
    });

    it('should support nested associate', function (done) {
      var fixture = User.fixtures({
        include: [{
          model: Project,
          include: [{
            model: Task
          }]
        }]
      }).success(function(users) {
        for (var i in users) {
          var user = users[i];
          assert.ok(user.project.tasks);
        }
        done();
      });
    });
  });
});
