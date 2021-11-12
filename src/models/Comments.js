const { Sequelize } = require("sequelize");
const db = require("../db/database");
require("./Users");

const Comments = db.define("Comments",
  {idUser: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
 idPropousal: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
 comments: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Comments;
