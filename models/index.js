const dbConfig = require("../config/dbConfig.js");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,

  dialect: dbConfig.dialext,

  operatorAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("my sql connected");
  })
  .catch((err) => {
    console.log("my sql error -->", err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.books = require("./bookModel.js")(sequelize, DataTypes);
db.users = require("./userModel.js")(sequelize, DataTypes);
db.carts = require("./cartModel.js")(sequelize, DataTypes);
db.cartItems = require("./cartItemModel.js")(sequelize, DataTypes);
db.wallets = require("./walletModel.js")(sequelize, DataTypes);
db.userBooks = require("./userBookModel.js")(sequelize, DataTypes);
db.transactions = require("./transactionModel.js")(sequelize, DataTypes);

db.carts.hasMany(db.cartItems, { as: "items" });
db.cartItems.belongsTo(db.carts, {
  foreignKey: "cartId",
  as: "cart",
});

db.sequelize.sync({ force: false }).then(() => {
  console.log("mysql resync done !!");
});

module.exports = db;
