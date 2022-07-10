const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");

// register a user to the system
router.post("/register", async (req, res) => {
    // create a user model object and attaching data
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SECRET,
        ).toString(),
    });

    try {
        // saving the user object to the database take the details to a variable
        const savedUser = await newUser.save();
        // sending the saved status
        res.status(201).json(savedUser);
        // printing the saved user in the console
        console.log(savedUser);
    } catch (err) {
        res.status(400).json(err);
    }
});

// user login to the system
router.post("/login", async (req, res) => {
    try {
        // taking the user data from the database for the relavant username
        const user = await User.findOne({ username: req.body.username });
        // printing the data in the user variable to the console
        console.log(user);

        // checking whether the user is found or not
        !user && res.status(401).json("Wrong Credentials !");

        // decrypting the password
        const hashPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SECRET,
        );

        // attaching the the decrypted password to another varable and make it a string
        const pword = hashPassword.toString(CryptoJS.enc.Utf8);

        // checking whether the password we entered is correct or not
        pword !== req.body.password &&
            res.status(401).json("Wrong Credentials !");

        // generating the web token to the specified customer
        const accessToken = JWT.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: "3d" },
        );

        // taking the data except password and put them into others variable
        const { password, ...others } = user._doc;

        // if the user exist : show data in the user variable
        res.status(200).json({ ...others, accessToken });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
