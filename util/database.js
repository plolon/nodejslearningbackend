const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-backend', 'postgres', 'admin', {
  dialect: 'postgres',
  host: 'localhost'
});

module.exports = sequelize;