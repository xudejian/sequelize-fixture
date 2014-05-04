/* global describe, it */

var Sequelize = require('sequelize'),
  sequelize = require('./environment'),
  assert = require('assert');

describe('.fixtures', function () {
  'use strict';

  var Foo = sequelize.define('Foo', { });

  describe('Sequelize.prototype.fixtures', function () {
    it('should can access fixtures in sequelize models', function () {
      assert.equal(typeof Foo.fixtures, 'function');
    });
  });

});
