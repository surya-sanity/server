const userController = require("../controllers/userController.js");
const { protect } = require("../middleware/authMiddleware");

const userRouter = require("express").Router();

userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/current", protect, userController.getCurrentUser);

module.exports = userRouter;
