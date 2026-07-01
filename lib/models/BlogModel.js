import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    authorImg:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    emailNotification:{
        status:{
            type:String,
            enum:["pending","sending","sent","failed"],
            default:"pending"
        },
        sentAt:{
            type:Date
        },
        startedAt:{
            type:Date
        },
        lastError:{
            type:String
        },
        recipientCount:{
            type:Number,
            default:0
        }
    }
})

const BlogModel = mongoose.models.blog || mongoose.model('blog',Schema);

export default BlogModel;
