const sequelize = require('./../database/sequelize');
const Sequelize = require('sequelize');

module.exports = sequelize.define("artist", {
  id: {
    field:"ArtistId",
    type:Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    field:"Name",
    type:Sequelize.STRING,
    validate: {
      notEmpty: {
        args: true,
        msg: "Name is required"
      },
      isAlpha: {
        args: true,
        msg: "Name must contain only letters"
      },
      len: {
        args: [2, 10], //between 2 and 10 characters
        msg: "Name must contain between 2 and 10 characters"
      }
    }
  },
}, {
  timestamps: false
});
