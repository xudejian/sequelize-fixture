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
    });

    it('should not generate pri keys', function () {
      var fixture = Foo.fixtures();
      assert.throws(fixture.id);
    });
  });

});
