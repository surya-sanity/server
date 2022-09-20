module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define("wallet", {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    walletBalance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
  });

  return Wallet;
};
