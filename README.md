# Sequelize Fixture

[![Build Status](https://travis-ci.org/xudejian/sequelize-fixture.png)](https://travis-ci.org/xudejian/sequelize-fixture)

## Installation

Install from npm registry:

```
$ npm install sequelize-fixture
```

## Usage

```nodejs
var Sequelize = require('sequelize');

require('sequelize-fixture')(Sequelize);


it('should generate fixture base on define of Model', function () {
    var Foo = sequelize.define('Foo', {
      title: Sequelize.STRING(64),
      string: Sequelize.STRING,
      text: Sequelize.TEXT,
      bool: Sequelize.BOOLEAN,
      num: Sequelize.INTEGER,
      bignum: Sequelize.BIGINT,
      float: Sequelize.FLOAT,
      date: Sequelize.DATE,
      uuid: Sequelize.UUID,
    });

    var fixture = Foo.fixtures();
    assert.ok(fixture.title);
    assert.ok(fixture.string);
    assert.ok(fixture.text);
    assert.equal(typeof fixture.bool, 'boolean');
    assert.ok(fixture.num);
    assert.ok(fixture.bignum);
    assert.ok(fixture.float);
    assert.ok(fixture.date);
    assert.ok(fixture.uuid);
});
```

more usage see my test

[datatypes_test](https://github.com/xudejian/sequelize-fixture/blob/master/test/datatypes_test.js)
[model_test](https://github.com/xudejian/sequelize-fixture/blob/master/test/model_test.js)
[associate_test](https://github.com/xudejian/sequelize-fixture/blob/master/test/associate_test.js)

## Pull Request Welcome

Thank you!
