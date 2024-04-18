import mongoose from "mongoose";

const verificationSchema = mongoose.Schema({
    email: {
        type: String,
        required:true
    },
    otp:{
        type:Number,
        required:true
    },
    created_at:{
        type:Date
    },
    expired_at:{
        type:Date
    }
}, { timestamps: true })


const Verify = mongoose.model("Verify", verificationSchema);

export default Verify;