const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,
} = require("../Controllers/Bcategory.controller");
const {  verifyTokenAndAdmin } = require("../middelware/authMiddelware");
const router = express.Router();

router.route("/").get(getallCategory).post( verifyTokenAndAdmin, createCategory);
router.route("/:id").get( getCategory).put( verifyTokenAndAdmin, updateCategory).delete( verifyTokenAndAdmin, deleteCategory);


module.exports = router;