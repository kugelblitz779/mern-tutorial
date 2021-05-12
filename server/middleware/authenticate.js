const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');

const Authenticate = async (req, res, next) => {

    try {

        const token = req.cookies.userlogin;
        const verifytoken = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await User.findOne({_id:verifytoken._id , "tokens.token":token});

        if(!rootUser){
            throw new Error("User not found");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();
        
    } catch (error) {
        res.status(401).send("Unauthorised : No token provided");
        console.log(error);
    }

}

module.exports = Authenticate;