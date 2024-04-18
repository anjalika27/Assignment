import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    },
    location:{
        type:String
    },
    age:{
        type:Number
    },
    work_details:{
        type:String
    }
},{timestamps:true})


const User=mongoose.model("User",userSchema);

export default User;