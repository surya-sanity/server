const userBookController = require("../controllers/userBookController.js");
const { protect, adminProtect } = require("../middleware/authMiddleware");

const userBookRouter = require("express").Router();

userBookRouter.post("/create", protect, userBookController.addUserBook);
userBookRouter.get("/getAll", protect, userBookController.getAllUserBooks);
userBookRouter.get(
  "/admin/all",
  adminProtect,
  userBookController.getAllUserBooksAdmin
);
userBookRouter.delete(
  "/deleteOne/:id",
  protect,
  userBookController.deleteUserBookById
);
userBookRouter.delete(
  "/deleteAll",
  adminProtect,
  userBookController.deleteAllUserBooks
);

module.exports = userBookRouter;
