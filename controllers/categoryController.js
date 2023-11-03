const category = require('../models/categorySchema')

const createCategory = async (req, res) => {
    const { name } = req.body;
    const category = await category.findOne({ name });
    try {
        if (category) {
            return res.status(400).json({
                mensaje: "La categoria ya se encuentra creada",
                status: 400
            })
        }
        const newCategory = new category({
            name
        })
        await newCategory.save();
        return res.status(201).json({
            mensaje: "Categoria creada correctamente",
            status: 201,
            newCategory
        })
        
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
            error: error.message
        })
    }
}

const getAllCategories = async (req, res) => {
    const categories = await category.find()
    try {
        if (!categories) {
            return res.status(404).json({
                mensaje: "No se encontraron las categorias",
                status: 404
            })
        }
        return res.status(201).json({
            mensaje: "Las categorias se encontraron exitosamente",
            status: 201,
            categories
        })
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500
        })
    }
}

module.exports = {
    createCategory,
    getAllCategories
  }