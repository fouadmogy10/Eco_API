const {
  register,
  login,
  getAllUsers,
  getuserProfile,
  getUsersCount,
  updateuserProfile,
  deleteuserProfile,
  blockUser,
  UNblockUser,
  handelRfreshToken,
  logout,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus,
  loginAdmin,
  removeFromCart,
  updateQTYCart,
} = require("../Controllers/users.controller");
const {
  protect,
  verifyTokenAndAdmin,
  verifyToken,
} = require("../middelware/authMiddelware");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/admin-login", loginAdmin);
router.get("/all_users", verifyTokenAndAdmin, getAllUsers);
router.get("/count", getUsersCount);
router.get("/refresh", handelRfreshToken);
router.get("/logout", logout);
router.get("/wishlist", verifyToken, getWishlist);
router
  .route("/cart")
  .get(verifyToken, getUserCart)
  .post(verifyToken, userCart)
  router.get("/empty-cart", verifyToken, emptyCart);
  // router.post("/cart/applycoupon", verifyToken, applyCoupon);
  router.post("/cart/create-order", verifyToken, createOrder);
  router.route("/cart/:cartId")
  .delete(verifyToken, removeFromCart)
  router.route("/updateCart/:cartId/:newQTY")
  .put(verifyToken,updateQTYCart);
  
// router.get("/create-orders", verifyToken, createOrder);
router.get("/get-orders", verifyToken, getOrders);
router.get("/getallorders", verifyTokenAndAdmin, getAllOrders);
router.put("/order/update-order/:id", verifyTokenAndAdmin, updateOrderStatus);
router.put("/save-address", verifyToken, saveAddress);
router
  .route("/edit")
  .get(verifyTokenAndAdmin, getuserProfile)
  .put(verifyToken, updateuserProfile)
  .delete(protect, deleteuserProfile);
router.put("/block-user/:id", verifyTokenAndAdmin, blockUser);
router.put("/unblock-user/:id", verifyTokenAndAdmin, UNblockUser);
// cart

module.exports = router;
