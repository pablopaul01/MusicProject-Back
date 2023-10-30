const router = require("express").Router();
const upload = require("../middlewares/multer")
const {createAudio, getAllAudios} = require("../controllers/audioController.js");


router.post("/", upload.single("audio"), createAudio);

router.get("/", getAllAudios);

module.exports = router; 