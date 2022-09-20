const userBookController = require("../controllers/userBookController.js");
const { protect } = require("../middleware/authMiddleware");

const userBookRouter = require("express").Router();

userBookRouter.post("/create", protect, userBookController.addUserBook);
userBookRouter.get("/getAll", protect, userBookController.getAllUserBooks);
userBookRouter.delete("/:id", protect, userBookController.deleteUserBookById);

module.exports = userBookRouter;
