const {
    verifyToken,
    verifyTokenAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();
const Cart = require("../models/Cart");

// CREATE CART
router.post("/add", verifyToken, async (req, res) => {
    const cart = new Cart(req.body);
    try {
        const savedCart = await cart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }
});

// UPDATE CART
router.put("/update/:id", verifyTokenAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true },
        );
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json(error);
    }
});

// DELETE CART
router.delete(
    "/delete/:id",
    verifyTokenAuthorization,
    async (req, res) => {
        try {
            await Cart.findByIdAndDelete(re.params.id);
            res.status(200).json("Cart has been deleted !");
        } catch (error) {
            res.status(500).json("Error in Cart deletion !");
        }
    },
);

// GET USER CART
router.get("/find/:userId", verifyTokenAuthorization, async (req, res) => {
    try {
        const cart = await Cart.find({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET ALL CARTS
router.get("/find", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
