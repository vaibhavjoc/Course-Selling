const { Router } = require("express");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const { z } = require("zod");

const { AdminModel, CourseModel } = require("../db");
const { adminMiddleware } = require("./middlewares/adminMiddleware");
const course = require("./course");

adminRouter.post("/signup", async function (req, res) {
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

    const hashedPassword = await bcrypt.hash(password, 5);

    await AdminModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName
    })

    res.json({
        message: "You are signed up successfully as Admin"
    })
});

adminRouter.post("/signin", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const admin = await AdminModel.findOne({
        email: email
    });

    if (!admin) {
        return res.json({
            message: "This Admin User does not exist"
        })
    }

    const passwordMatched = await bcrypt.compare(password, admin.password);

    if (passwordMatched) {
        const token = jwt.sign({
            id: admin._id
        }, process.env.JWT_ADMIN_SECRET);

        res.json({
            token
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

adminRouter.post("/course", adminMiddleware, async function (req, res) {
    const adminId = req.userId;

    const { title, description, price, imageUrl } = req.body;

    const course = await CourseModel.create({
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl,
        creatorId: adminId
    });

    res.json({
        message: "Course created",
        courseId: course._id
    })
});

adminRouter.put("/course", adminMiddleware, async function (req, res) {
    const adminId = req.userId;

    const { title, description, price, imageUrl, courseId } = req.body;

    const course = await CourseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    }, {
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl
    });

     res.json({
        message: "Course updated",
        courseId: course._id
    })
})

adminRouter.get("/course/bulk", adminMiddleware, async function (req, res) {
    const adminId = req.userId;

    const courses = await CourseModel.find({
        creatorId: adminId
    });

    res.json({
        courses
    })
})

module.exports = {
    adminRouter: adminRouter
}