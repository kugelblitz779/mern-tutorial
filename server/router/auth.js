const express = require('express');
const User = require('../model/userSchema');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/', (req, res) => {
    res.send("hello from server (router) !");
});

//store info in database (using async wait)
router.post('/register', async (req, res) => {  

    const {name, email, phone, work, password, cpassword} = req.body;

    if(!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error:"Fields cannot be empty !"});
    }


    try {

        const userExist = await User.findOne({email:email});

        if(userExist){
            return res.status(422).json({error: "The email is already registered !"});
            
        }else if(password != cpassword){
            return res.status(422).json({error: "Passwords do not match !"});
        }else{
            const user = new User({name, email, phone, work, password, cpassword});
            await user.save();

            res.status(201).json({message: "Registered Successfully !"});
        }

        

    } catch (error) {
        console.log(error);
    }

});

router.post('/login', async (req, res) => {

    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({error: "Fields cannot be empty !"});
    }

    try {
        
        const userExist = await User.findOne({email:email});

        const token = await userExist.generateAuthToken();

        res.cookie("userlogin", token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly:true
        });

        if(userExist){

            const isMatch = await bcrypt.compare(password, userExist.password); 

            if(!isMatch){
                return res.status(400).json({error: "Invalid Credentials (password) !"});
            }

            res.status(201).json({message: "Login Success !"});
        }else{
            return res.status(400).json({error: "Invalid Credentials (email) !"});
        }

        

    } catch (error) {
        console.log(error);
    }

})


//about us page routing
router.get('/about', authenticate, (req, res) => {
    console.log("Getting data for About.");
    res.send(req.rootUser);
})

//get data for contact and home page
router.get("/getData", authenticate, (req, res) => {
    console.log("Getting data for Contact and Home.");
    res.send(req.rootUser);
})


router.get('/logout', (req, res) => {
    res.clearCookie('userlogin', {path: "/"});
    res.status(200).send("User Logout");
})

module.exports = router;