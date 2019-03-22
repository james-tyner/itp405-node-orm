const sequelize = require('./../database/sequelize');
const Sequelize = require('sequelize');

module.exports = sequelize.define("media_type", {
  id: {
    field:"MediaTypeId",
    type:Sequelize.INTEGER,
    primaryKey: true
  },
  name: {
    field:"Name",
    type:Sequelize.STRING
  },
}, {
  timestamps: false
});
