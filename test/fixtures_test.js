/* global describe, it */

var Sequelize = require('sequelize'),
  sequelize = require('./environment'),
  assert = require('assert');

describe('.fixtures', function () {
  'use strict';

  var Foo = sequelize.define('Foo', {
    title: Sequelize.STRING
  });

  describe('bind in every model', function () {
    it('should can access fixtures in sequelize models', function () {
      assert.equal(typeof Foo.fixtures, 'function');
    });
  });

  describe('generate random fixtures', function () {
    it('should generate different fixtures everytime', function () {
      var prev = Foo.fixtures(),
        curr = Foo.fixtures();
      assert.notDeepEqual(prev, curr);
    });
  });

  describe('options', function () {
    it('should regard options.define as generate define for item', function () {
      var fixt = Foo.fixtures({
        define: {
          title: function() {
            return 'yo';
          }
        }
      });
      assert.equal(fixt.title, 'yo');
    });

    it('should generate null when user want', function () {
      var fixt = Foo.fixtures({
        define: {
          title: null
        }
      });
      assert.equal(fixt.title, null);
    });
  });

});
