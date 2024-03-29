const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer  = require("../middleware/multer-config");
const sauce = require("../models/sauce");

router.post("/", auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.post('/:id/like', auth, sauceCtrl.likesManager);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.get("/", auth, sauceCtrl.getAllSauces);

module.exports = router;