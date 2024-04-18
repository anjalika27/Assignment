import User from "../models/userSchema.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import { generate } from "otp-generator";
import Verify from "../models/userVerification.js";
import { verify } from "crypto";


// generate otp for verification
function generateOtp() {
    return generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    });
}

// send mail 
function sendMailForOtp(email, otp) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    var mailOptions = {
        from: 'anjalika.agarwal@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        text: `Your otp is ${otp}. It is valid for 10mins only`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.json({ error });
        } else {
            console.log('Email sent: ' + info.messageId);
            return res.json({ msge: "mail sent!" });
        }
    });
}

// register otp of the user to Verify database
async function registerOtp(email, otp) {
    try {
        await Verify.create({
            email: email,
            otp: otp,
            created_at: Date().now,
            expired_at: Date.now() + 600000
        })
        return true;
    } catch (error) {
        console.log(error.message)
        return false;
    }
}


// new user register and send mail with otp for verification
async function registerUser(req, res) {
    const { name,email, password } = req.body;
    try {
        await User.create({
            name:name,
            email: email,
            password: password
        });

        console.log("user added");

        const otp = generateOtp();
        console.log("otp generated");

        const isRegistered = registerOtp(email, otp);

        if (isRegistered) {
            console.log("otp registered");
            sendMailForOtp(email, otp);
            console.log("mail sent");
            return res.json({ msge: "mail sent" });
        }
        else {
            console.log("user already verified");
            return res.json("user already verified");
        }

        // return res.send("user added");
    } catch (error) {
        console.log(error.message);
        return res.json({ msg: "user already exists" });
    }
}

// verify user when user enters the otp
async function verifyUserEmailUsingOtp(req, res) {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.json({ msg: "empty values recieved" })
    }
    else {
        const verificationRecord = await Verify.find({ email: email, otp: otp });
        if (verificationRecord.length <= 0) {
            console.log('user verified or not has been registered yet')
            return res.json({ msg: "user verified or not has been registered yet" })
        }
        const { expiry } = verificationRecord[0].expired_at;
        if (expiry < Date.now()) {
            //expired otp
            await Verify.deleteMany({ email });
            console.log("otp expired, request for a new one")
            return res.json({ msg: "otp expired, request for a new one" })
        }
        else {
            await Verify.deleteMany({ email, otp });
            const currUser = await User.find({ email: email });
            const { _id } = currUser[0];
            console.log(currUser[0]);
            await User.findByIdAndUpdate(_id, { verified: true }, { new: true });
            console.log(currUser[0]);

            console.log("user verified successfully")
            return res.json({ msg: "user verified successfully" })
        }
    }

}

// add more details of user
async function addMoreDetails(req, res) {
    const { email, location, age, work_details } = req.body;
    try {
        const currUser = await User.find({ email: email });
        if (currUser.length <= 0) {
            return res.json({ msg: "user not created" })
        }

        
        const {_id,verified} = currUser[0];

        if(verified){
            await User.findByIdAndUpdate(_id, { location: location, age: age, work_details, work_details }, { new: true })
            return res.json({msg:"user added details saved"})
        }
        else{
            return res.json({msg:"user not verified yet, please verify"})
        }

    } catch (error) {
        console.log(error.message);
        return res.json({msg:"cannot add details of user"})
    }
}



export { registerUser, verifyUserEmailUsingOtp, addMoreDetails};