const router = require("express").Router();
const upload = require("../middlewares/multer")
const { register, getAllUsers, getUserById, deleteUser, login, userUpdate, changeToAdmin, userDisabled } = require("../controllers/userController");
const {createAudio, getAllAudios} = require("../controllers/audioController.js");
const {getAllCategories, createCategory, updateCategory} = require("../controllers/categoryController.js");
const authenticateAdmin = require("../middlewares/authAdmin");
const authenticateUser = require("../middlewares/authUser");

router.post("/", upload.single("audio"), createAudio);

router.get("/", getAllAudios);

router.post("/category", createCategory);
router.get("/categories", getAllCategories);
router.put("/category/:id", updateCategory);

//rutas de usuarios
router.get("/usuarios", authenticateAdmin, getAllUsers);
router.get("/usuario/:id", authenticateAdmin, getUserById);
router.delete("/usuario/:id", deleteUser);
router.put("/usuario/:id", authenticateUser, userUpdate);
router.post("/registrar", register);
router.post("/login", login);
router.put("/admin/:id", authenticateAdmin, changeToAdmin);
router.put("/desactivar/usuario/:id", authenticateAdmin, userDisabled);


module.exports = router; 