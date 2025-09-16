const { Router } = require("express");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const JWT_SECRET = "rajgganniijanahaiThuje";
const bcrypt = require("bcrypt");
const {z} = require("zod");
const dotenv = require("dotenv");
dotenv.config();

const { userMiddleware } = require("./middlewares/userMiddleware")

userRouter.post("/signup", async function (req, res) {
    const requiredBody = z.object({
            email: z.string().min(3).max(100).email(),
            password: z.string()
                .min(8, { message: "Password should have minimum length of 8" })
                .max(15, "Password is too long")
                .regex(/^(?=.*[A-Z]).{8,}$/, {
                    message:
                        "Should Contain at least one uppercase letter and have a minimum length of 8 characters.",
                }),
            firstName: z.string().min(3).max(100),
            lastName: z.string().min(3).max(100)
        });
    
        const parsedWithSuccess = requiredBody.safeParse(req.body);
    
        if (!parsedWithSuccess.success) {
            return res.json({
                message: "Invalid Format"
            });
        }

    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

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

    const user = await UserModel.findOne({
        email: email,
    });

    if (!user) {
        return res.status(403).json({
            message: "No User Found"
        })
    }

    const passwordMatched = bcrypt.compare(password, user.password)

    if (passwordMatched) {
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET);

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