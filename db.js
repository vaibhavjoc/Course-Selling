const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const UserSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String
});

const AdminSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String
});

const CourseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
});

const PurchaseSchema = new Schema({
    courseId: ObjectId,
    userId: ObjectId
});

const UserModel = mongoose.model('users', UserSchema);
const AdminModel = mongoose.model('admins', AdminSchema);
const CourseModel = mongoose.model('courses', CourseSchema);
const PurchaseModel = mongoose.model('purchases', PurchaseSchema);

module.exports = {
    UserModel,
    AdminModel,
    CourseModel,
    PurchaseModel
}