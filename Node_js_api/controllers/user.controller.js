const manageUserModel = require("../models/user.model");
const manageContactModel = require("../models/contact.model");
const manageQuizModel = require("../models/quiz.model");
const status = require("../config/status");
const jwt = require('jsonwebtoken');
const path = require('path');
const mongoose = require('mongoose');

// Get all users
exports.list = async (req, res) => {
    try {
        const data = await manageUserModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    } catch (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ success: false, status: status.INTERNAL_SERVER_ERROR, msg: 'Get Notes failed.' });
    }
};

// Register a new user
exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password, birthdate, gender, phoneNumber } = req.body;

    try {
        const userExists = await manageUserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await manageUserModel.create({
            firstName,
            lastName,
            email,
            password,
            birthdate,
            gender,
            phoneNumber,
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            _id: user._id,
            email: user.email,
            token,
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


//Create Contact 
exports.createcontact = async (req, res) => {
    try {
        var obj = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message,
        }
        const newmanageContactModel = new manageContactModel(obj);
        let result = await newmanageContactModel.save();
        res.json({ success: true, status: status.OK, msg: 'Adding Contact is successfully.' });

    }
    catch (err) {
        console.log("err", err)
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Contact failed.' });

    }
}

// Get all Contact
exports.listContact = async (req, res) => {
    try {
        const data = await manageContactModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    } catch (err) {
        console.error('Error fetching Contact:', err);
        return res.status(500).json({ success: false, status: status.INTERNAL_SERVER_ERROR, msg: 'Get Contact failed.' });
    }
};
// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await manageUserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


        res.status(200).json({
            _id: user._id,
            email: user.email,
            token,
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//Admin Login 

exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    // Hardcoded admin credentials for simplicity (replace with your own logic)
    const adminUsername = 'admin@gmail.com';
    const adminPassword = 'Admin@123';

    try {
        if (username !== adminUsername || password !== adminPassword) {
            return res.status(400).json({ message: 'Invalid admin credentials' });
        }

        // Generate a token for admin
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Admin login successful',
            token,
        });
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create quiz question
exports.createQuizQuestion = async (req, res) => {
    console.log('Request Body:', req.body); // Log the request body
    try {
        const { question, options, correctAnswer } = req.body;

        const newQuestion = await manageQuizModel.create({
            question,
            options,
            correctAnswer,
        });

        return res.status(201).json({ success: true, data: newQuestion, status: status.OK });
    } catch (err) {
        console.error('Error creating quiz question:', err);
        return res.status(500).json({ success: false, status: status.INTERNAL_SERVER_ERROR, msg: 'Creating quiz question failed.' });
    }
};

// Get all quiz questions
exports.getQuizQuestions = async (req, res) => {
    try {
        const questions = await manageQuizModel.find({}).lean().exec();
        return res.json({ success: true, data: questions, status: status.OK });
    } catch (err) {
        console.error('Error fetching quiz questions:', err);
        return res.status(500).json({ success: false, status: status.INTERNAL_SERVER_ERROR, msg: 'Get quiz questions failed.' });
    }
};

// Update quiz question
exports.updateQuizQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedQuestion = await manageQuizModel.findByIdAndUpdate(id, updatedData, { new: true });

        return res.status(200).json({ success: true, data: updatedQuestion, status: status.OK });
    } catch (err) {
        console.error('Error updating quiz question:', err);
        return res.status(500).json({ success: false, status: status.INTERNAL_SERVER_ERROR, msg: 'Updating quiz question failed.' });
    }
};

// Delete quiz question
exports.deleteQuizQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        await manageQuizModel.findByIdAndDelete(id);

        return res.status(200).json({ success: true, status: status.OK, msg: 'Quiz question deleted.' });
    } catch (err) {
        console.error('Error deleting quiz question:', err);
        return res.status(500).json({ success: false, status: status.INTERNAL_SERVER_ERROR, msg: 'Deleting quiz question failed.' });
    }
};
