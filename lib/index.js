var casual = require('casual');

module.exports = function(Sequelize) {
  'use strict';

  var _ = Sequelize.Utils._,
      DataTypes = Sequelize;

  Sequelize.prototype.fixtures = function () {

  };

  Sequelize.Model.prototype.fixtures = function (options) {
    if (!this.__fixture_define_name) {
      this.__fixture_define_name = for_define(this.name);
    }
    var name = this.__fixture_define_name;

    if (!casual.hasOwnProperty(name)) {
      var def = {};
      _.each(this.rawAttributes, function (definition, name) {
        def[name] = random(definition);
      });

      casual.define(name, function() {
        return def;
      });
    }
    return casual[name];
  };

  function for_define(name) {
    return 'Fixture' + name + Date.now();
  }

  var types = {
    INTEGER: {
      is: function(def) {
        return (def === DataTypes.INTEGER)
          || (def.type === DataTypes.INTEGER)
          || (def instanceof DataTypes.INTEGER);
      },
      random: function() {
        return casual.integer();
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
        return fn.random();
      }
    }
  }

};
