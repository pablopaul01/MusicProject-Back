const Audio = require("../models/audioSchema")
const cloudinary = require("cloudinary").v2

const createAudio = async (req, res) => {
    const { title, artist, category } = req.body;
    const {path} = req.file;
    const audio = await Audio.findOne({ title });
    console.log("path: ", path)
    const audioCloud= await cloudinary.uploader.upload(path,{resource_type: 'auto'});
    try {
        if (audio) {
            return res.status(400).json({
                mensaje: "El audio ya se encuentra creado",
                status: 400
            })
        }

        const newAudio = new Audio({
            title,
            artist,
            url: audioCloud.secure_url,
            category
        })
        await newAudio.save();
        return res.status(201).json({
            mensaje: "Audio creado correctamente",
            status: 201,
            newAudio
        })
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
            error: error.message
        })
    }
}


const getAllAudios = async (req, res) => {

    const audios = await Audio.find().populate("category")

    try {
        if (!audios) {
            return res.status(404).json({
                mensaje: "No se encontraron los usuarios",
                status: 404
            })
        }
        return res.status(201).json({
            mensaje: "Los usuarios se encontraron exitosamente",
            status: 201,
            audios
        })
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500
        })
    }
}

module.exports = {
    createAudio,
    getAllAudios
  }