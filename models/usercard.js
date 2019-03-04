module.exports = function (sequelize, DataTypes) {
  const Userdeck = sequelize.define("Userdeck", {
    deck_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deck_user: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deck_list: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT
    }
  });
  return Userdeck;
};
