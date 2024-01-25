const router = require("express").Router();
const upload = require("../middlewares/multer")
const { register, getAllUsers, getUserById, deleteUser, login, userUpdate, changeToAdmin, userDisabled, addAudios, deleteAudio } = require("../controllers/userController");
const {createAudio, getAllAudios, delAudio, updateAudio} = require("../controllers/audioController.js");
const {getAllCategories, createCategory, updateCategory} = require("../controllers/categoryController.js");
const authenticateAdmin = require("../middlewares/authAdmin");
const authenticateUser = require("../middlewares/authUser");

router.post("/", upload.single("audio"), createAudio);
router.delete("/:id", delAudio);
router.get("/", getAllAudios);
router.put("/:id",upload.none(), updateAudio);

router.post("/category",upload.none(), createCategory);
router.get("/categories", getAllCategories);
router.put("/category/:id", updateCategory);

//rutas de usuarios
router.get("/usuarios", getAllUsers);
router.get("/usuario/:id", getUserById);
router.delete("/usuario/:id", deleteUser);
router.put("/usuario/:id", authenticateUser, userUpdate);
router.post("/registrar", register);
router.post("/login", login);
router.put("/admin/:id", authenticateAdmin, changeToAdmin);
router.put("/desactivar/usuario/:id", authenticateAdmin, userDisabled);

router.post("/usuario/audios/:id",addAudios);
router.put("/usuario/audios/:id",deleteAudio);


module.exports = router; 