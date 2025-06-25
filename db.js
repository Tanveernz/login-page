// db.js
const mongoose = require("mongoose");

// Schema for User
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true, // prevent duplicate emails
        lowercase: true,
        match: /.+\@.+\..+/ // basic email validation
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    }
});

// Schema for Todo
const todoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 200
    },
    done: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const UserModel = mongoose.model("User", userSchema);
const TodoModel = mongoose.model("Todo", todoSchema);

module.exports = {
    UserModel,
    TodoModel
};
