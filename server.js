const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const helmet = require("helmet");

const { errorHandler } = require("./middleware/errorMiddleware");

const bookRouter = require("./routes/bookRouter.js");
const userRouter = require("./routes/userRouter.js");
const cartRouter = require("./routes/cartRouter.js");
const walletRouter = require("./routes/walletRouter");
const userBookRouter = require("./routes/userBookRouter");
const transactionRouter = require("./routes/transactionRouter");

const app = express();

//middlewares
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

//testing api
app.get("/api", (req, res) => {
  res.send("🔥 Server 🔥");
});

//routers
app.use("/api/books", bookRouter);
app.use("/api/users", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/userBook", userBookRouter);
app.use("/api/transactions", transactionRouter);

const PORT = process.env.PORT || 8080;

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running on Port ${PORT}`);
});
