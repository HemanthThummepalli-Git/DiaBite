const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');
const User = require('../models/User');

const UserApp = express.Router();

// Registration Route
UserApp.post('/signup', expressAsyncHandler(async (req, res) => {
    try {
        const {
            name, email, password, age, gender, diabetesType,
            fastingSugarLevel, preMealSugarLevel, postMealSugarLevel,
            dietaryPreference, dailyCaloricIntake, foodAllergies, 
            mealTypePreference, activityLevel, weight, height
        } = req.body;

        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Calculate BMI (Body Mass Index)
        const BMI = weight / ((height / 100) ** 2);  // height in cm

        // Create new user
        const newUser = new User({
            name, email, password: hashedPassword, age, gender, diabetesType,
            fastingSugarLevel, preMealSugarLevel, postMealSugarLevel,
            dietaryPreference, dailyCaloricIntake, foodAllergies, 
            mealTypePreference, activityLevel, weight, height, BMI
        });

        // Save user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));

// **User Login**
UserApp.post('/login', expressAsyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists by email
        const dbUser = await User.findOne({ email });

        if (!dbUser) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare hashed password with the provided password
        const isMatch = await bcrypt.compare(password, dbUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Create a JWT token (authentication)
        const token = jwt.sign({ id: dbUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send back response with the token
        res.json({
            message: "Login successful",
            token,
            payload: dbUser // You can optionally send back the user data excluding password
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));

module.exports = UserApp;
