const mongoose = require("mongoose");
const Category = require("../models/categorySchema");


const audioSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    artist: {
        type: String,
        trim: true,
    },
    url: {
        type: String,
        trim: true,
    },
    duration: {
        type: Number,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        trim: true
    }
}, {timestamps : true});

const Audio = mongoose.model("Audio", audioSchema);

module.exports = Audio;