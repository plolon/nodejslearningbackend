const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const OrderItem = sequelize.define('order_item', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
});

module.exports = OrderItem;