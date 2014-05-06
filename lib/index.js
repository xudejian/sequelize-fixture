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
        from_validate: from_validate(def),
        gen: random(def)
      };
    });

    function generator(options) {
      options = options || {};
      if (typeof options === 'number') {
        options = {num: options};
      }

      var num = options.num || 1;
      num = Math.max(num, 1);

      function gen_one() {
        return _.mapValues(define, function(fn) {
          var val = fn.from_validate(options, fn.def);
          return _.isUndefined(val) ? fn.gen(options, fn.def) : val;
        });
      }

      var data = [];
      for (var i = 0; i < num; i++) {
        data.push(gen_one());
      }

      return (num===1) ? data[0] : data;
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

  var validate = {
    isUrl: function() {
      return casual.url
    },
    isEmail: function() {
      return casual.email;
    },
    isIP: function() {
      return casual.ip;
    },
    isIPv4: function() {
      return casual.ip;
    }
  };

  function noop() {}

  function from_validate(def) {
    if (!def.validate) {
      return noop;
    }

    for (var type in validate) {
      if (def.validate[type]) {
        return validate[type];
      }
    }
    return noop;
  }

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
    if (def.autoIncrement) {
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
