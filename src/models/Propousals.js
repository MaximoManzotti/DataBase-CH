const { Sequelize } = require("sequelize");
const db = require("../db/database");

const Propousals = db.define(
  "Propousals",
  {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    idUser: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    idComments: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    visible: {
      type: Sequelize.BOOLEAN,
      defaultValue: 1,
    },
    idComments: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Propousals;
