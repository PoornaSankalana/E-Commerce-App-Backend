const JWT = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // taking the token into authHeader variable
    const authHeader = req.header("authToken");

    // if auth header is availabe
    if (authHeader) {
        // verifying the token
        JWT.verify(authHeader, process.env.JWT_SECRET, (err, user) => {
            // if the token is not valid
            if (err) {
                res.status(403).json("Token is not valid !");
            } else {
                // if the token is valid taking it as a valid user
                req.user = user;
                next();
            }
        });
        // if authHeader is not availabe
    } else {
        // returning user is not authenticated
        return res.status(401).json("You are not Authenticated");
    }
};

const verifyTokenAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that !");
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that !");
        }
    });
};

module.exports = {
    verifyToken,
    verifyTokenAuthorization,
    verifyTokenAndAdmin,
};
