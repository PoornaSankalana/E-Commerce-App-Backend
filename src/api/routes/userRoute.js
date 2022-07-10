const {
    verifyTokenAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");
const User = require("../models/User");

const router = require("express").Router();

// UPDATE USER DETAILS
router.put("/update/:id", verifyTokenAuthorization, async (req, res) => {
    // taking the newly user entered password and encrypt it (if new password entered)
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SECRET,
        ).toString();
    }

    try {
        // setting the updated details of the specific user and update database
        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true },
        );
        // sending the updated user when it is successfull
        res.status(200).json(updateUser);
        console.log("User Updated Successfully !");
    } catch (error) {
        // if there is any error in updating this will catch it and send
        res.status(500).json(error);
        console.log("User Update Error !");
    }
});

// DELETE USER
router.delete("delete/:id", verifyTokenAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted !");
        console.log("User Deleted Successfully !");
    } catch (error) {
        res.status(500).json(error);
        console.log("User Delete Error !");
    }
});

// GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
        console.log(others);
    } catch (error) {
        res.status(500).json(error);
        console.log("User find Error !");
    }
});

// GET ALL USER
router.get("/find", verifyTokenAndAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
        console.log(users);
    } catch (error) {
        res.status(500).json(error);
        console.log("User find Error !");
    }
});

// GET USER STAT
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: lastYear },
                },
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
