/* global describe, it */

var Sequelize = require('sequelize'),
  sequelize = require('./environment'),
  assert = require('assert');

describe('associate support', function () {
  'use strict';

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

  it('should generate multi data when associate hasMany', function (done) {
    var fixture = Project.fixtures({
      include: [{
        model: Task,
        fixture: {
          num: 10
        }
      }]
    }).success(function(projects) {
      for (var i in projects) {
        assert.equal(projects[i].tasks.length, 10);
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
