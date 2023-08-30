const express = require("express");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrand,
} = require("../Controllers/Brand.controller");
const { verifyTokenAndAdmin } = require("../middelware/authMiddelware");
const router = express.Router();

router.route("/").get( getallBrand).post( verifyTokenAndAdmin, createBrand);
router.route("/:id").put( verifyTokenAndAdmin, updateBrand).delete( verifyTokenAndAdmin, deleteBrand).get( getBrand);

module.exports = router;