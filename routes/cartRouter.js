const cartController = require("../controllers/cartController.js");
const { protect } = require("../middleware/authMiddleware");

const cartRouter = require("express").Router();

cartRouter.post("/create", protect, cartController.createCart);
cartRouter.put("/:id", protect, cartController.addItemToCart);
cartRouter.delete("/:id", protect, cartController.removeItemFromCart);
cartRouter.post("/clear", protect, cartController.clearCart);
cartRouter.get("/getCart", protect, cartController.getCart);

module.exports = cartRouter;
