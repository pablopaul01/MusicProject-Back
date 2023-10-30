const mongoose = require("mongoose");

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
    category: {
        type: String,
        trim: true
    }
}, {timestamps : true});

const Audio = mongoose.model("Audio", audioSchema);

module.exports = Audio;