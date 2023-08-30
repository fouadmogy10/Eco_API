const {  createProduct, getAllProduct, getSingleProduct, deleteproduct, updateproduct, getproductCount, addToWishlist, rating, uploadImages, deleteImages} = require("../Controllers/product.controller");
const { verifyTokenAndAdmin, verifyToken } = require("../middelware/authMiddelware");
const { uploadPhoto, productImgResize } = require("../middelware/photoMiddelware");


const router=require("express").Router();

router.route("/").post(verifyTokenAndAdmin,createProduct).get(getAllProduct)

router.route("/upload/:id")
    .put(verifyTokenAndAdmin
    ,uploadPhoto.array("images",10)
    ,productImgResize
    ,uploadImages);
    router.delete("/delete-img/:id",verifyTokenAndAdmin, deleteImages);

router.route("/count").get(getproductCount)
router.put("/wishlist", verifyToken, addToWishlist);
router.put("/rating", verifyToken, rating);
router.route("/:id").get(getSingleProduct).delete(verifyTokenAndAdmin,deleteproduct).put(verifyTokenAndAdmin,updateproduct)

module.exports =router