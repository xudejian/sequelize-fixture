var casual = require('casual');

module.exports = function(Sequelize) {
  'use strict';

  var _ = Sequelize.Utils._,
      DataTypes = Sequelize;

  Sequelize.prototype.fixtures = function () {

  };

  Sequelize.Model.prototype.fixtures = function (options) {
    options = to_options(options);
    var define = _.mapValues(this.rawAttributes, function (def, item) {
      return {
        def: def,
        custom_gen: options.define[item] || null,
        from_validate: from_validate(def),
        gen: random(def)
      };
    });

    function generator(options) {
      var self = this;
      options = to_options(options);

      function gen_associate(model) {
        return new Sequelize.Utils.CustomEventEmitter(function(emitter) {
          var count = 0;
          _.chain(options.include)
          .filter(function(associate) {
            return self.getAssociation(associate.model, associate.as);
          })
          .each(function(associate) {
            var option = _.extend({}, associate.fixture);
            if (associate.hasOwnProperty('include')) {
              option.include = associate.include;
            }
            associate = self.getAssociation(associate.model, associate.as);

            option = _.extend(option, {
              create: true,
              instance: model,
              accessors: associate.accessors
            });
            count++;

            associate.target.fixtures(option)
            .proxy(emitter, { events: ['error'] })
            .success(function() {
              count--;
              if (count === 0) {
                emitter.emit('success');
              }
            });
          });

          if (count === 0) {
            emitter.emit('success');
          }

        }).run();
      }

      function build() {
        var data = _.mapValues(define, function(fn, item) {
          var custom_gen = options.define[item] || fn.custom_gen || undefined;
          if (_.isFunction(custom_gen)) {
            return custom_gen();
          }
          if (!_.isUndefined(custom_gen)) {
            return custom_gen;
          }
          return (fn.from_validate || fn.gen)(options, fn.def);
        });

        return self.build(data);
      }

      function build_datasets() {
        if (options.num < 2) {
          return build();
        }

        var data = [];
        for (var i = 0, num = options.num; i < num; i++) {
          data.push(build());
        }
        return data;
      }

      function create_datasets() {
        return new Sequelize.Utils.CustomEventEmitter(function(emitter) {
          var i, num,
               chainer = new Sequelize.Utils.QueryChainer();
          if (options.instance && options.accessors && options.accessors.create) {
            for (i = 0, num = options.num; i < num; i++) {
              chainer.add(options.instance[options.accessors.create](build().values));
            }
          } else {
            for (i = 0, num = options.num; i < num; i++) {
              chainer.add(build().save());
            }
          }

          chainer.run()
          .proxy(emitter, { events: ['error'] })
          .success(function(models) {
            var find = {
              where: {id:[]},
              include: options.include
            };

            var chainer = new Sequelize.Utils.QueryChainer();
            _.each(models, function(model) {
              find.where.id.push(model.id);
              chainer.add(gen_associate(model));
            });

            chainer.run()
            .proxy(emitter, { events: ['error'] })
            .success(function() {
              self.findAll(find)
              .proxy(emitter, { events: ['error'] })
              .success(function(rows) {
                emitter.emit('success', rows);
              });
            });
          });
        }).run();
      }

      if (!options.create) {
        return build_datasets();
      }
      return create_datasets();
    }

    this.fixtures = generator;
    return this.fixtures(options);
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
      return casual.url;
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

  function from_validate(def) {
    if (!def.validate) {
      return;
    }

    for (var type in validate) {
      if (def.validate[type]) {
        return validate[type];
      }
    }
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

  function to_options(options) {
    if (typeof options === 'number') {
      options = {num: options};
    }
    options = _.extend({define:{}}, options);

    options.num = Math.max(options.num, 1) || 1;

    if (options.hasOwnProperty('include')) {
      if (!options.include instanceof Array) {
        if (options.include.model) {
          options.include = [options.include];
        } else {
          options.include = undefined;
        }
      }

      if (!options.hasOwnProperty('create')) {
        options.create = !!options.include;
      }
    }

    return options;
  }

};
