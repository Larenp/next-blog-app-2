import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "/author_img.png"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const UserModel = mongoose.models.user || mongoose.model('user', Schema);

export default UserModel;
