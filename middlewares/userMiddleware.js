const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function userMiddleware() {
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

module.exports = {
    userMiddleware: userMiddleware
}