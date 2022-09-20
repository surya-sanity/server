const db = require(".");

module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define("cartItem", {
    itemId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    noOfDays: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    cartId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return CartItem;
};
