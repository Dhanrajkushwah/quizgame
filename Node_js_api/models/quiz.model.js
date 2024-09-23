const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }], // Array of options
    correctAnswer: { type: Number, required: true }, // Index of the correct option
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const quizModel = mongoose.model('quiz', quizSchema);
module.exports = quizModel;
