module.exports = function (sequelize, DataTypes) {
  const Usercard = sequelize.define("Usercard", {
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    card_qnty: {
      type: DataTypes.INTEGER
    }
  });

  Usercard.associate = function (models) {
    Usercard.belongsTo(models.Userdeck, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Usercard;
};
