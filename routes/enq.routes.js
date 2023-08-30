const express = require("express");
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
} = require("../Controllers/enq.controller");
const { verifyTokenAndAdmin} = require("../middelware/authMiddelware");
const router = express.Router();



router.route("/").post(createEnquiry).get(getallEnquiry)
router.route("/:id").get( getEnquiry).put( verifyTokenAndAdmin, updateEnquiry).delete( verifyTokenAndAdmin, deleteEnquiry)

module.exports = router;