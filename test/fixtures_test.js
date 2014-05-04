/* global describe, it */

var Sequelize = require('sequelize'),
  sequelize = require('./environment'),
  assert = require('assert');

describe('.fixtures', function () {
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

  describe('Sequelize.prototype.fixtures', function () {
    it('should bind fixtures in Sequelize.prototype', function () {
      assert.strictEqual(typeof Sequelize.prototype.fixtures, 'function');
    });

    it('should can access fixtures in sequelize', function () {
      assert.equal(typeof sequelize.fixtures, 'function');
    });
  });

  describe('model.fixtures', function () {
    it('should generate fixture base on define of Model', function () {
      var fixture = Foo.fixtures();
      assert.ok(fixture.title);
    });

    describe('define', function() {
      it('should generate STRING', function () {
        var fixture = Foo.fixtures();
        assert.equal(typeof fixture.string, 'string');
      });

      it('should generate BOOLEAN', function () {
        var fixture = Foo.fixtures();
        assert.equal(typeof fixture.bool, 'boolean');
      });

      it('should generate INTEGER', function () {
        var fixture = Foo.fixtures();
        assert.equal(typeof fixture.num, 'number');
      });

      it('should generate DATE', function () {
        var fixture = Foo.fixtures();
        assert.ok(fixture.date instanceof Date);
      });

      it('should generate TEXT', function () {
        var fixture = Foo.fixtures();
        assert.equal(typeof fixture.text, 'string');
      });

      it('should generate BIGINT', function () {
        var fixture = Foo.fixtures();
        assert.equal(typeof fixture.bignum, 'number');
      });

      it('should generate FLOAT', function () {
        var fixture = Foo.fixtures();
        assert.equal(typeof fixture.float, 'number');
      });

    });
  });

});
