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
      };
    });

    function generator(options) {
      options = options || {};
      return _.mapValues(define, function(fn) {
        return fn.gen(options, fn.def);
      });
    }
    this.fixtures = generator;
    return generator(options);
  };

  var random_fn = {
    INTEGER: function() {
      return casual.integer(1, Math.pow(2, 31) - 1);
    },
    STRING: function() {
      return casual.string;
    },
    TEXT: function() {
      return casual.text;
    },
    BIGINT: function() {
      return casual.integer(1, Math.pow(2, 31) - 1);
    },
    FLOAT: function() {
      return casual.double(1, Math.pow(2, 31) - 1);
    },
    BOOLEAN: function() {
      return casual.integer() > 0;
    },
    DATE: function() {
      return new Date(casual.unix_time);
    },
    NOW: function() {
      return new Date();
    },
    BLOB: function() {
      return casual.text;
    },
    DECIMAL: function() {
      return casual.double(1, Math.pow(2, 31) - 1);
    },
    UUIDV1: function() {
      return casual.numerify('########-####-1###-####-############');
    },
    UUIDV4: function() {
      return casual.numerify('########-####-4###-####-############');
    }
  };
  random_fn.UUID = random_fn.UUIDV1;

  function auto_increment(options) {
    if (options.gen_auto_increment) {
      return _.uniqueId();
    }
    return null;
  }

  function unsupport(options) {
    if (!options.hasOwnProperty('default')) {
      return casual.numerify('###@unknow dataType');
    }
    if (_.isFunction(options.default)) {
      return options.default();
    }
    return options.default;
  }

  function random(def) {
    if (def && def.autoIncrement) {
      return auto_increment;
    }

    for (var type in random_fn) {
      var data_type = DataTypes[type];
      if (def === data_type || def.type === data_type || def.originalType === data_type) {
        return random_fn[type];
      }

      if (typeof data_type !== 'string' && def instanceof data_type) {
        return random_fn[type];
      }
    }

    return unsupport;
  }

};
