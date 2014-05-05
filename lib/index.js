var casual = require('casual');

module.exports = function(Sequelize) {
  'use strict';

  var _ = Sequelize.Utils._,
      DataTypes = Sequelize;

  Sequelize.prototype.fixtures = function () {

  };

  Sequelize.Model.prototype.fixtures = function (options) {
    var define = _.mapValues(this.rawAttributes, function (def) {
      return {
        def: def,
        gen: random(def)
      }
    });

    function generator() {
      return _.mapValues(define, function(fn) {
        return fn.gen(fn.def);
      });
    }
    this.fixtures = generator;
    return generator();
  };

  var types = {
    INTEGER: {
      is: function(def) {
        return (def === DataTypes.INTEGER)
          || (def.type === DataTypes.INTEGER)
          || (def instanceof DataTypes.INTEGER);
      },
      random: function() {
        return casual.integer(1, Math.pow(2, 31) - 1);
      }
    },
    STRING: {
      is: function(def) {
        return (def === DataTypes.STRING)
          || (def.type === DataTypes.STRING)
          || (def instanceof DataTypes.STRING);
      },
      random: function() {
        return casual.string;
      }
    },
    TEXT: {
      is: function(def) {
        return (def === DataTypes.TEXT)
          || (def.type === DataTypes.TEXT);
      },
      random: function() {
        return casual.text;
      }
    },
    BIGINT: {
      is: function(def) {
        return (def === DataTypes.BIGINT)
          || (def.type === DataTypes.BIGINT);
      },
      random: function() {
        return casual.integer(1, Math.pow(2, 31) - 1);
      }
    },
    FLOAT: {
      is: function(def) {
        return (def === DataTypes.FLOAT)
          || (def.type === DataTypes.FLOAT);
      },
      random: function() {
        return casual.double(1, Math.pow(2, 31) - 1);
      }
    },
    BOOLEAN: {
      is: function(def) {
        return (def === DataTypes.BOOLEAN)
          || (def.type === DataTypes.BOOLEAN);
      },
      random: function() {
        return casual.integer() > 0;
      }
    },
    DATE: {
      is: function(def) {
        return (def === DataTypes.DATE)
          || (def.type === DataTypes.DATE)
          || (def.originalType === DataTypes.DATE);
      },
      random: function() {
        return new Date(casual.unix_time);
      }
    }
  };

  function random(def) {
    for (var type in types) {
      var fn = types[type];
      if (fn.is(def)) {
        return fn.random;
      }
    }
  }

};
