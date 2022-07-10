const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./api/routes/userRoute");
const authRouter = require("./api/routes/auth");
const productRoutes = require("./api/routes/productRoutes");
const cartRoutes = require("./api/routes/cartRoutes");
const orderRoutes = require("./api/routes/orderRoutes");

const app = express();
app.use(express.json());
dotenv.config();

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("DB Connection Successfull !"))
    .catch((err) => {
        console.log(err);
    });

app.listen(process.env.PORT || 5000, () => {
    console.log(`Backend server is running !`);
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
