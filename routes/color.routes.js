const express = require("express");
const {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getallColor,
} = require("../Controllers/color.controller");
const { verifyTokenAndAdmin } = require("../middelware/authMiddelware");
const router = express.Router();

router.route("/").get(getallColor).post( verifyTokenAndAdmin, createColor);
router.route("/:id").put( verifyTokenAndAdmin, updateColor).delete( verifyTokenAndAdmin, deleteColor).get( getColor);

module.exports = router;