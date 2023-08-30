const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,
} = require("../Controllers/Category.controller");
const { verifyTokenAndAdmin } = require("../middelware/authMiddelware");
const router = express.Router();

router.route("/").get( getallCategory).post( verifyTokenAndAdmin, createCategory);
router.route("/:id").put( verifyTokenAndAdmin, updateCategory).delete( verifyTokenAndAdmin, deleteCategory).get( getCategory);

module.exports = router;