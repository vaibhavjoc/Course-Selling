const { Router } = require("express");
const courseRouter = Router();
const { userMiddleware } = require("../middlewares/userMiddleware");
const { PurchaseModel } = require("../db");

courseRouter.post("/purchase", userMiddleware, async function (req, res) {
    const userId = req.userId;
    const courseId = req.body;

    await PurchaseModel.create({
        userId,
        courseId
    });

    res.json({
        message: "You have successfully bought the course"
    })
});

courseRouter.get("/preview", async function (req, res) {

   const courses = await PurchaseModel.find({});

    res.json({
        courses
    })
});

module.exports = {
    courseRouter: courseRouter
};