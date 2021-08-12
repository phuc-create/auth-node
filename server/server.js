require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./configs/db.config");
connectDB();
const app = express();
app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);

const authRouter = require("./routers/auth.route");
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", authRouter);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    msg: "Page not found!!",
  });
});

const PORT = process.env.PORT || 5100;
app.listen(PORT, (req, res) => {
  console.log(`Server listening at port ${PORT}`);
});
