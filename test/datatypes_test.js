/* global describe, it */

var Sequelize = require('sequelize'),
  sequelize = require('./environment'),
  assert = require('assert');

describe('should support sequelize DataTypes', function () {
  'use strict';

  var Foo = sequelize.define('Foo', {
    title: Sequelize.STRING,
    string: Sequelize.STRING,
    text: Sequelize.TEXT,
    bool: Sequelize.BOOLEAN,
    num: Sequelize.INTEGER,
    bignum: Sequelize.BIGINT,
    float: Sequelize.FLOAT,
    date: Sequelize.DATE,
  });

  describe('DataTypes support', function () {
    it('STRING', function () {
      var fixture = Foo.fixtures();
      assert.equal(typeof fixture.string, 'string');
    });

    it('BOOLEAN', function () {
      var fixture = Foo.fixtures();
      assert.equal(typeof fixture.bool, 'boolean');
    });

    it('INTEGER', function () {
      var fixture = Foo.fixtures();
      assert.equal(typeof fixture.num, 'number');
    });

    it('DATE', function () {
      var fixture = Foo.fixtures();
      assert.ok(fixture.date instanceof Date);
    });

    it('TEXT', function () {
      var fixture = Foo.fixtures();
      assert.equal(typeof fixture.text, 'string');
    });

    it('BIGINT', function () {
      var fixture = Foo.fixtures();
      assert.equal(typeof fixture.bignum, 'number');
    });

    it('FLOAT', function () {
      var fixture = Foo.fixtures();
      assert.equal(typeof fixture.float, 'number');
    });
  });

});
