const { Router } = require("express");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const JWT_SECRET = "rajgganniijanahaiThuje";
const bcrypt = require("bcrypt");

function userAuth() {
    const token = req.headers.token;

    if (!token) {
        return res.json({
            message: "No token Provided"
        })
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decodedData.id
    } catch (error) {
        res.json({
            message: "Invalid Token Provided"
        })
        console.log(error)
    }

}

userRouter.post("/signup", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    if (!email || !password) {
        return res.json({
            message: "Email and Password can't be empty"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 5)

    await UserModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName
    });

    res.json({
        message: "You are Signed Up Successfully"
    })
});

userRouter.post("/signin", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email) {
        return res.json({
            message: "Email can't be empty"
        })
    }

    const response = await UserModel.findOne({
        email: email,
    });

    if (!response) {
        return res.status(403).json({
            message: "No User Found"
        })
    }

    const passwordMatched = bcrypt.compare(password, response.password)

    if (passwordMatched) {
        const token = jwt.sign({
            id: response._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Invalid Credentials"
        })
    }

    res.json({
        message: "You are Logged In successfully"
    })
});

userRouter.get("/purchases", function (req, res) {

});

module.exports = {
    userRouter: userRouter
};