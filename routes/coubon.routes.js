const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
} = require("../Controllers/coubon.controller");
const {  verifyTokenAndAdmin} = require("../middelware/authMiddelware");
const router = express.Router();

router.route("/").get(verifyTokenAndAdmin, getAllCoupons).post(verifyTokenAndAdmin, createCoupon);
router.route("/:id").get( verifyTokenAndAdmin, getCoupon).put( verifyTokenAndAdmin, updateCoupon).delete( verifyTokenAndAdmin, deleteCoupon);

module.exports = router;