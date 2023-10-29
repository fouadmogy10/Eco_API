const AsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/users.model");
const Cart = require("../models/cart.model");
const Coupon = require("../models/coubon.model");
const Order = require("../models/order.model");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generateRefreshToken } = require("../config/refreshToken");

const register = AsyncHandler(async (req, res) => {
  /**
   * TODO:Get the email from req.body
   */
  const email = req.body.email;
  /**
   * TODO:With the help of email find the user exists or not
   */
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    const newUser = await User.create(req.body);
    res.status(200).json(newUser);
  } else {   
    res.status(400).json({message:"User Already Exists"})
  }
});

// @desc login user
// @route /api/user/login
//@access public
// Login a user
const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    // const refreshToken = await generateRefreshToken(findUser?._id);
    // const updateuser = await User.findByIdAndUpdate(
    //   findUser.id,
    //   {
    //     refreshToken: refreshToken,
    //   },
    //   { new: true }
    // );
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 72 * 60 * 60 * 1000,
    // });
    res.status(200).json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id, findUser.role),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

// admin login

const loginAdmin = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") {
    res.status(400);
    throw new Error("Not Authorised");
  }
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    // const refreshToken = await generateRefreshToken(findAdmin?._id);
    // const updateuser = await User.findByIdAndUpdate(
    //   findAdmin.id,
    //   {
    //     refreshToken: refreshToken,
    //   },
    //   { new: true }
    // );
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 72 * 60 * 60 * 1000,
    // });
    
    res.status(200).json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      role: findAdmin?.role,
      token: generateToken(findAdmin?._id, findAdmin?.role),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});
// @desc logout user
// @route /api/user/logout
//@access public
const logout = AsyncHandler(async (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("No refresh token in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  console.log(user);
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }

  await User.findByIdAndUpdate(user.id, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});
// @desc get all user
// @route /api/user/login
//@access privte (only admin)
const getAllUsers = AsyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find().populate("wishlist");
    res.status(200).json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// @desc get  user count
// @route /api/users/count
//@access privte (only admin)
const getUsersCount = AsyncHandler(async (req, res, next) => {
  const count = await User.count();
  res.status(200).json(count);
});
// @desc get  user profile
// @route /api/users/profile/:id
//@access public
const getuserProfile = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const user = await User.findById(id).select("-password");
  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }
  res.status(200).json(user);
});

// save user Address

const saveAddress = AsyncHandler(async (req, res, next) => {
  const { id } = req.user;
  validateMongoDbId(id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc get  user profile
// @route /api/user/profile/:id
//@access public
const deleteuserProfile = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const user = await User.findByIdAndDelete(id).select("-password");
  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  if (req.user.id == id) {
    res.status(200).json(user);
  } else {
    res.status(400).json({
      message: " access denied",
    });
  }
});

// refresh token
const handelRfreshToken = AsyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie?.refreshToken) throw new Error("No Refresh Token");
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken);
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh Token present in db");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("there is something wrong");
    } else {
      const accessToken = generateToken(user?._id);
      res.status(200).json({ accessToken });
    }
  });
});
// @desc get  user profile
// @route /api/user/profile/:id
//@access private
const updateuserProfile = AsyncHandler(async (req, res, next) => {
  const { id } = req.user;
  try {
    const UpdatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          mobile: req.body.mobile,
          email: req.body.email,
        },
      },
      { new: true }
    ).select("-password");
    res.status(200).json(UpdatedUser);
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
});
// @desc block  user
// @route /api/user/block-user/:id
//@access private ( only admin )
const blockUser = AsyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const block = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          isBlocked: true,
        },
      },
      { new: true }
    ).select("-password");
    res.status(200).json({
      message: "user blocked successfully",
      block,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});
const UNblockUser = AsyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          isBlocked: false,
        },
      },
      { new: true }
    ).select("-password");
    res.status(200).json({
      message: "user unblocked successfully",
      unblock,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const getWishlist = AsyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const findUser = await User.findById(id)
      .select("-password")
      .select("-refreshToken")
      .select("-email")
      .select("-firstname")
      .select("-lastname")
      .select("-refreshToken")
      .populate("wishlist");
    res.status(200).json(findUser);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});
const userCart = AsyncHandler(async (req, res) => {
  const { productId, color, quantity, price } = req.body;
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    let newCart = await new Cart({
      userId: id,
      productId,
      color,
      price,
      quantity,
    }).save();
    const cart = await Cart.find({ userId: id })
      .populate("productId")
      .populate("color");
    res.status(200).json(cart);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});
const getUserCart = AsyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const cart = await Cart.find({ userId: id })
      .populate("productId")
      .populate("color");
    res.status(200).json(cart);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});
const removeFromCart = AsyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);
  console.log(id, "ssdsdsd");
  const { cartId } = req.params;
  console.log(cartId, "sdsdsdsdfgdf");
  try {
    const removeFromCart = await Cart.deleteOne({ userId: id, _id: cartId });
    const cart = await Cart.find({ userId: id })
      .populate("productId")
      .populate("color");
    res.status(200).json(cart);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});
const updateQTYCart = AsyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);
  const { cartId, newQTY } = req.params;
  try {
    const cartItem = await Cart.findOne({ userId: id, _id: cartId });
    cartItem.quantity = newQTY;
    cartItem.save();
    const cart = await Cart.find({ userId: id })
      .populate("productId")
      .populate("color");
    res.status(200).json(cart);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const emptyCart = AsyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);
    const cart = await Cart.find({ userId: user._id }).deleteMany();
    res.status(200).json(cart);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const applyCoupon = AsyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { id } = req.user;
  validateMongoDbId(id);
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findById({ _id: id });
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products");
  console.log(cartTotal);
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.status(200).json(totalAfterDiscount);
});

const createOrder = AsyncHandler(async (req, res) => {
  const {
    shippingInfo,
    cart,
    totalPrice,
  } = req.body;
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const order = await Order.create({
      shippingInfo,
      cart,
      totalPrice,
      user: id,
    });
    const userorders = await Order.find({ user: id })
    res.status(200).json( userorders );
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const getOrders = AsyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const userorders = await Order.find({ user: id })
    res.status(200).json(userorders).populate("user");
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const getAllOrders = AsyncHandler(async (req, res) => {
  try {
    const alluserorders = await Order.find()
      .populate("products")
      .populate("orderby")
      .exec();
    res.status(200).json(alluserorders);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});
const getOrderByUserId = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const userorders = await Order.findOne({ orderby: id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.status(200).json(userorders);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});
const updateOrderStatus = AsyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.status(200).json(updateOrderStatus);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
module.exports = {
  register,
  login,
  getAllUsers,
  getUsersCount,
  getuserProfile,
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
  getOrderByUserId,
  updateOrderStatus,
  loginAdmin,
  removeFromCart,
  updateQTYCart,
  createOrder,
};
