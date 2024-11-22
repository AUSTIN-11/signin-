const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { transport, sendMail } = require('../middlewares/sendMail')
const { signupSchema, signinSchema } = require("../middlewares/validator"); // Fix typo
const { doHash, doHashValidation, hmacProcess } = require("../utils/hashing");
const User = require('../models/usersModel'); // Import User model

exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate the input
        const { error } = signupSchema.validate({ email, password });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message, // Joi error message
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "A user with this email already exists.",
            });
        }

        // Hash the password
        const hashedPassword = await doHash(password, 12);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        // Save the user in the database
        const result = await newUser.save();

        // Remove the password from the response
        result.password = undefined;

        // Send success response
        res.status(201).json({
            success: true,
            message: "Your account has been created successfully.",
            result,
        });

    } catch (err) {
        console.error(err); // Log the error for debugging

    
        res.status(500).json({
            success: false,
            message: "An error occurred while creating your account. Please try again later.",
        });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate the input
        // const { error } = signinSchema.validate({ email, password });
        // if (error) {
        //     return res.status(400).json({
        //         success: false,
        //         message: error.details[0].message, 
        //     });
        // }

        // Check if the user exists
        const existingUser = await User.findOne({ email },{ password:1 }) 
        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "User does not exist.",
            });
        }

        // Validate the password
        const isPasswordValid = await doHashValidation(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: existingUser._id,
                email: existingUser.email,
                verified: existingUser.verified,
            },
            process.env.TOKEN_SECRET,
            { expiresIn: "1h" } 
        );

        // Set the secure cookie
        res.cookie("Authorization", `Bearer ${token}`, {
            expires: new Date(Date.now() + 8 * 3600000), 
            httpOnly: true,
            sameSite: "Strict",
            secure: process.env.NODE_ENV === "production", 
        });

        // Send success response
        res.status(200).json({
            success: true,
            token,
            message: "Logged in successfully.",
        });
    } catch (error) {
        console.error("Signin Error: ", error); 
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while logging in. Please try again later.",
        });
    }
    
};

exports.signout = async (req, res ) => {
    res
    .clearCookie('Authorization')
    .status(200)
    .json({success: true, message: 'loggeed out succesfully'});
};

exports.sendVerificatinCode = async  (req ,res ) => {
    const {email} = req.body;
    try {
        const existingUser = await User.findOne({email})
        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "User does not exist.",
            });
        }
        if(existingUser.verified){
            return res 
            .status(400)
            .json({ success: false, message: 'You are verified' });
        }
        const codeValue = crypto.randomInt(100000, 1000000).toString();
        let info  = sendMail

        if(info.accepted === existingUser.email){
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE-SECRET)
            existingUser.verificatiCode = hashedCodeValue;
            existingUser.verificatiCodeValidation = Date.now();
            await existingUser.save();
            return res.status(200).json({ success:true, message: 'Code sent' });

        }
        res.status(400).json({ success:false, message:'Code not sent'})
    } catch (error) {
        console.log(error)
    }
}