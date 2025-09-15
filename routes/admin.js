const { Router } = require("express");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { adminModel } = require("../db");

function adminAuth() {
    const token = req.headers.token;

    if(!token) {
       return res.json({
            message: "No token Provided"
        })
    }

    try{
        const decodedData = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

        req.userId = decodedData.id
    } catch (error) {
        res.json({
            message: "Invalid Token Provided"
        })
        console.log(error)
    }
    
}

adminRouter.post("/signup", function (req, res) {
    res.json({
        message: "signup endpoint"
    })
});

adminRouter.post("/signin", function (req, res) {
    res.json({
        message: "chasma endpoint"
    })
});

module.exports = {
    adminRouter: adminRouter
}