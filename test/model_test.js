/* global describe, it */

var Sequelize = require('sequelize'),
  sequelize = require('./environment'),
  assert = require('assert');

describe('Models', function () {
  'use strict';

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

  describe('.fixtures', function () {
    it('should generate fixture base on define of Model', function () {
      var fixture = Foo.fixtures();
      assert.ok(fixture.title);
      assert.ok(fixture.string);
      assert.ok(fixture.text);
      assert.ok(fixture.hasOwnProperty('bool'));
      assert.ok(fixture.num);
      assert.ok(fixture.bignum);
      assert.ok(fixture.float);
      assert.ok(fixture.date);
      assert.ok(fixture.uuid);
    });

    it('should not generate autoIncrement keys', function () {
      var fixture = Foo.fixtures();
      assert.equal(fixture.id, null);
    });

    it('should generate autoIncrement keys when user want', function () {
      var fixture = Foo.fixtures({gen_auto_increment: true});
      assert.ok(fixture.id);
    });
  });

});
