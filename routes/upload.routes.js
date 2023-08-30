const express = require("express");
const { uploadImages , deleteImages } = require("../Controllers/upload.controller");
const { verifyTokenAndAdmin } = require("../middelware/authMiddelware");
const { uploadPhoto, productImgResize } = require("../middelware/photoMiddelware");
const router = express.Router();

router.post(
  "/",
  verifyTokenAndAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

router.delete("/delete-img/:id", verifyTokenAndAdmin, deleteImages);

module.exports = router;
