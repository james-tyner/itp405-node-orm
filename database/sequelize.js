const Sequelize = require("sequelize");

module.exports = new Sequelize("sqlite:chinook.db"); // exporting this to the app.js file
