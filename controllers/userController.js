const mongoose = require("mongoose");
const User = require("../models/userSchema.js");
const { encryptPassword, comparePassword } = require("../utils/passwordHandler.js");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {

    const users = await User.find()

    try {
        if (!users) {
            return res.status(404).json({
                mensaje: "No se encontraron los usuarios",
                status: 404
            })
        }
        return res.status(201).json({
            mensaje: "Los usuarios se encontraron exitosamente",
            status: 201,
            users
        })
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500
        })
    }
}

const getUserById = async (req, res) => {

    const { id } = req.params;

    const user = await User.findById(id);

    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                mensaje: "Id del usuario no válido",
                status: 400
            })
        }
        if (!user) {
            return res.status(400).json({
                mensaje: "Usuario no encontrado",
                status: 400
            })
        }
        return res.status(201).json({
            mensaje: "Usuario encontrado",
            status: 201,
            user
        })

    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500
        })
    }
}

const register = async (req, res) => {

    const { name, lastname, password, email, role, state } = req.body;

    const user = await User.findOne({ email });

    try {
        if (user) {
            return res.status(400).json({
                mensaje: "El usuario ya se encuentra registrado",
                status: 400
            })
        }
        const newUser = new User({
            name,
            lastname,
            password: encryptPassword(password),
            email,
            role,
            state
        })
        await newUser.save();
        return res.status(201).json({
            mensaje: "Usuario creado correctamente",
            status: 201,
            newUser
        })
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde. entro por aqui",
            status: 500,
            error
        })
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                mensaje: "Id del usuario no válido",
                status: 400
            })
        }
        if (!user) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado",
                status: 404
            })
        }
        return res.status(200).json({
            mensaje: "Usuario eliminado correctamente",
            status: 200,
            user
        })

    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
        })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const secret = process.env.JWT_SECRET;

    try {
        if (!user) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado",
                status: 404
            })
        }
        if (user.state === false) {
            return res.status(404).json({
                mensaje: "El usuario tiene la cuenta suspendida",
                status: 404
            })
        }
        if (!comparePassword(password, user.password)) {
            return res.status(400).json({
                mensaje: "La contraseña es incorrecta",
                status: 400
            })
        }
        const payload = {
            sub: user._id,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            role: user.role,
            state: user.state
        }
        const token = jwt.sign(payload, secret, { algorithm: process.env.ALGORITHM });
        return res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            status: 200,
            token
        })
    } catch (error) {
       
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500
        })
    }
}

const userDisabled = async (req, res) => {
    const { id } = req.params;
    const { state } = await User.findById(id)

    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                mensaje: "ID de usuario no válido o no encontrado",
                status: 400
            });
        }

        const user = await User.findByIdAndUpdate(id, {
            state: !state
        }, { new: true });


        if (!user) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado",
                status: 404
            });
        }

        return res.status(200).json({
            mensaje: "Estado del usuario actualizado exitosamente",
            status: 200,
            user
        });

    } catch (error) {
       
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
        })
    }
};

const userUpdate = async (req, res) => {
    const { id } = req.params;
    const { name, lastname, password, state } = req.body
    const secret = process.env.JWT_SECRET;

    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                mensaje: "Id del usuario no válido",
                status: 400
            })
        }

        if (req.body.password) {
            const user = await User.findByIdAndUpdate(id, {
                ...req.body,
                name,
                lastname,
                state,
                password: encryptPassword(password)
            }, { new: true });

            if (!user) {
                return res.status(404).json({
                    mensaje: "Usuario no encontrado",
                    status: 404
                })
            }
            const payload = {
                sub: user._id,
                email: user.email,
                name: user.name,
                lastname: user.lastname,
                role: user.role,
                state: user.state
            }

            const token = jwt.sign(payload, secret, { algorithm: process.env.ALGORITHM });

            return res.status(200).json({
                mensaje: "Usuario modificado correctamente",
                status: 200,
                token
            })
        }

        const user = await User.findByIdAndUpdate(id, {
            ...req.body,
            name,
            lastname
        }, { new: true });

        const payload = {
            sub: user._id,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            role: user.role,
            state: user.state
        }

        const token = jwt.sign(payload, secret, { algorithm: process.env.ALGORITHM });

        return res.status(200).json({
            mensaje: "Usuario modificado correctamente",
            status: 200,
            token
        })


    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
        })
    }
}

const changeToAdmin = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    try {
        if (!user) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado",
                status: 404
            })
        }
        user.role = "admin";
        await user.save();
        return res.status(200).json({
            mensaje: "El usuario ahora es admin",
            status: 200,
            user
        })

    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
        })
    }
}




module.exports = {
    register,
    getAllUsers,
    getUserById,
    deleteUser,
    login,
    userUpdate,
    changeToAdmin,
    userDisabled
}