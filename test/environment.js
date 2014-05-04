var Sequelize = require('sequelize');
require('../')(Sequelize);

module.exports = new Sequelize('db', 'user', 'pass', { dialect: 'sqlite'});
