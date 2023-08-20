const { Sequelize, INTEGER, STRING } = require("sequelize");

const sequelize = require("../util/database.js");

const User = sequelize.define('user', {
    id: {
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: STRING,
    email: STRING
});

module.exports = User;