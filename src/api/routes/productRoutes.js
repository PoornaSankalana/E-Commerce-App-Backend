const router = require("express").Router();
const Product = require("../models/Products");
const { verifyTokenAndAdmin } = require("./verifyToken");

// CREATE PRODUCT
router.post("/add", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
        console.log(savedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});

// UPDATE PRODUCT
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true },
        );
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});

// DETELE PRODUCT
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been Deleted !");
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET PRODUCT
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET ALL PRODUCT
router.get("/find", verifyTokenAndAdmin, async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;

        if (qNew) {
            products = await Product.find()
                .sort({ createdAt: -1 })
                .limit(5);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find();
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
