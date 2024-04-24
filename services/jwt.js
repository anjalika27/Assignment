import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const key = process.env.SECRETKEY;


// create token for user
function createToken(id) {
    return jwt.sign({ id }, key, { expiresIn: 300 }); //5min
}

// verify token
async function jwtAuthMiddleware(req, res, next) {
    const authorization = req.headers.authorization
    if(!authorization) return res.json({msg:"token not found"});

    const token = authorization.split(' ')[1];
    if (!token) return res.json({ msg: "token not found" });

    try {
        const decoded = jwt.verify(token, key);
        req.jwtpayload = decoded;
        next();
    } catch (error) {
        return res.json({ msge: error })
    }
}

export { jwtAuthMiddleware, createToken };