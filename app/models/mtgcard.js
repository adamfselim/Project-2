module.exports = function (sequelize, DataTypes) {
    const Mtgcard = sequelize.define("Mtgcard", {
      card_name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      card_uri: {
        type: DataTypes.STRING,
        allowNull: false
      },
      card_cmc: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      card_color_identity: {
        type: DataTypes.STRING
      },
      card_image_url: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
    return Mtgcard;
  };