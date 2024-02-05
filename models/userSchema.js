const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    lastname: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    whatsapp: {
        type: String
    },
    audioList: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Audio"
        }],
    state: {
        type: Boolean,
        default: true,
    }
}, {timestamps : true});


// Middleware pre que se ejecutará antes de que un documento de Audio sea eliminado
userSchema.pre("remove", async function (next) {
    const audioId = this._id;

    try {
        // Actualizar todos los usuarios que tengan este audioId en su audioList
        await this.model("User").updateMany(
            { audioList: audioId },
            { $pull: { audioList: audioId } }
        );
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;