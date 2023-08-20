const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    host: 'localhost',
    database: 'node-complete',
    username: 'root',
    password: process.env.DB_PW,
    dialect: 'mysql'
});

module.exports = sequelize;