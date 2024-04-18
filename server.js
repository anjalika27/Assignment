import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/userSchema.js";
dotenv.config();

const app=express();
app.use(express.json());


mongoose.connect(process.env.URI).then(() => {
    console.log("connected db successfully");
    // if db connected then only run server
    app.listen(process.env.PORT || 4000, (req, res) => {
        console.log("server running on 3000");
    });
}).catch((err) => {
    console.log(err.message);
});


app.post('/register',async (req,res)=>{
    const {email,password}=req.body;
    try {
        await User.create({
            email:email,
            password:password
        });
        console.log("user added");
        return res.send("user added");
    } catch (error) {
        console.log(error.message);
    }
});
