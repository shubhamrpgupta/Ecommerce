const express = require("express");
const app = express();
const productRoutes = require("./routes/productRoute");
const userRoutes = require("./routes/userRoute");
const orderRoutes = require("./routes/orderRoute");
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser")

app.use(express.json());
app.use(cookieParser())

//Routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);

//middleware for error
app.use(errorMiddleware);


module.exports = app