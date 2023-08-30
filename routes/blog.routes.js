const express = require("express");
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  liketheBlog,
  disliketheBlog,uploadImages
} = require("../Controllers/blog.controllers");
const {verifyToken,verifyTokenAndAdmin } = require("../middelware/authMiddelware");
const { uploadPhoto, blogImgResize } = require("../middelware/photoMiddelware");

const router = express.Router();

router.route("/").post( verifyTokenAndAdmin, createBlog).get( getAllBlogs);

router.route("/upload/:id")
    .put(verifyTokenAndAdmin
    ,uploadPhoto.array("images",10)
    ,blogImgResize
    ,uploadImages);
    
router.put("/likes", verifyToken, liketheBlog);
router.put("/dislikes", verifyToken, disliketheBlog);
router.route("/:id").get(getBlog).put( verifyTokenAndAdmin, updateBlog).delete( verifyTokenAndAdmin, deleteBlog);

module.exports = router;