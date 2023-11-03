const router = require("express").Router();
const upload = require("../middlewares/multer")
const {createAudio, getAllAudios} = require("../controllers/audioController.js");
const {getAllCategories, createCategory} = require("../controllers/categoryController.js");

router.post("/", upload.single("audio"), createAudio);

router.get("/", getAllAudios);

router.post("/category", createCategory);
router.get("/category/", getAllCategories);

module.exports = router; 