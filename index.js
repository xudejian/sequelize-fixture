module.exports = process.env.COV
  ? require('./lib-cov')
  : require('./lib');
