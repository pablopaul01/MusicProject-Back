const mongoose = require("mongoose");
const Audio = require("../models/audioSchema");

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


// Middleware para eliminar el ID del audio de la lista de audio de los usuarios
userSchema.pre('deleteOne', { document: true, query: false }, function() {
    console.log('Deleting doc!');
  });
// userSchema.pre('findByIdAndDelete', async function (next) {
//     console.log("entro al pre")
//     try {
//         // Buscar y eliminar el ID del audio de la lista de audio de todos los usuarios
//         await this.model('User').updateMany(
//             { audioList: this._id },
//             { $pull: { audioList: this._id } }
//         );
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

const User = mongoose.model("User", userSchema);

module.exports = User;