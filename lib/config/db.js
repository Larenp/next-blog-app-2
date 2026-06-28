import mongoose from "mongoose";

export const ConnectDB = async () => {
    await mongoose.connect('mongodb+srv://Laren:<larenpinto180105>@cluster0.mtnjtlb.mongodb.net/next-blog-app');
    console.log("DB Connected");
}