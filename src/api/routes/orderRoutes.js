const {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAuthorization,
} = require("./verifyToken");
const Order = require("../models/Order");
const router = require("express").Router();

// CREATE ORDER
router.post("/add", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});

// UPDATE ORDER
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true },
        );
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});

// DELETE ORDER
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted !");
    } catch (error) {
        res.status(500).json("Error in deleting order !");
    }
});

// GET USER ORDER
router.get("/find/:userId", verifyTokenAuthorization, async (req, res) => {
    try {
        const getOrder = await Order.find({ userId: req.params.userId });
        res.status(200).json(getOrder);
    } catch (error) {
        re.status(500).json(error);
    }
});

// GET ALL ORDERS
router.get("/find", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(
        new Date().setMonth(lastMonth.getMonth() - 1),
    );

    try {
        const income = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: previousMonth },
                },
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
