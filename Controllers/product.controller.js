const AsyncHandler = require("express-async-handler");
const Product = require("../models/product.model");
const User = require("../models/users.model");

const path = require("path");
const validateMongoDbId = require("../utils/validateMongoDbId");
const slugify = require("slugify");
const { match } = require("assert");
const { json } = require("express");
const { cloudinaryUploadImg ,cloudinaryDeleteImg} = require("../utils/cloudnary");
/*
*  @desc create post
*  @route /api/posts/
*  @access private (only login user)

*/
const createProduct = AsyncHandler(async (req, res, next) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    return res.status(400).json(error)
  }
});

/*
 *  @desc get all  product
 *  @route /api/products/
 *  @access private (only login user)
 */

const getAllProduct = AsyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr)).populate("color");

    // Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exists");
    }
    const product = await query;
    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json(error)
  }
});
/*
 *  @desc get Single  product
 *  @route /api/products/:id
 *  @access private (only login user)
 */

const getSingleProduct = AsyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    validateMongoDbId(id);
    const product = await Product.findById(id).populate("color").populate({
      path:"ratings",populate:{
        path:"postedby",
        select:"firstname , lastname , createdAt ",
      }
    })

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json(error)
  }
});
/*
 *  @desc delete Single  product
 *  @route /api/products/:id
 *  @access private (only owner product or admin)
 */

const deleteproduct = AsyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    validateMongoDbId(id);
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      message: "product deleted successfuly",
    });
  } catch (error) {
    return res.status(400).json(error)
  }
});
/*
 *  @desc get  product count
 *  @route /api/products/count
 *  @access public
 */

const getproductCount = AsyncHandler(async (req, res, next) => {
  const count = await Product.count();
  return res.status(200).json(count);
});

/*
*  @desc update product
*  @route /api/products/
*  @access private (only login user)

*/
const updateproduct = AsyncHandler(async (req, res, next) => {
  // get the product from db

  try {
    const id = req.params.id;
    validateMongoDbId(id);
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        message: "product not found",
      });
    }
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateproduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // send response to client
    return res.status(200).json(updateproduct);
  } catch (error) {
    return res.status(400).json(error)
  }
});
/*
 *  @desc wishlist
 *  @route /api/products/wishlist
 *  @access public ()
 */
const addToWishlist = AsyncHandler(async (req, res) => {
  const { id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      const findUser = await User.findById(id).select("-password").select("-refreshToken")
    .select("-email").select("-firstname").select("-lastname").select("-refreshToken")
    .populate("wishlist");
    return res.status(200).json(findUser);
    } else {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      const findUser = await User.findById(id).select("-password").select("-refreshToken")
    .select("-email").select("-firstname").select("-lastname").select("-refreshToken")
    .populate("wishlist");
    return res.status(200).json(findUser);
    }
  } catch (error) {
    return res.status(400).json(error)
  }
});

const rating = AsyncHandler(async (req, res) => {
  const { id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId)
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
  
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
      console.log(totalRating);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    ).populate("color").populate({
      path:"ratings",populate:{
        path:"postedby",
        select:"firstname , lastname , createdAt ",
      }
    })
    res.json(finalproduct);
  } catch (error) {
    return res.status(400).json(error)
  }
});
const uploadImages = AsyncHandler(async (req, res) => {
  const id = req.params.id;
    validateMongoDbId(id);
  try {
      const uploader=(path)=>cloudinaryUploadImg(path,"images");
      const urls=[];
      const files=req.files;
      for (const file  of files) {
        const{path}=file
        const newPath=await uploader(path)
        urls.push(newPath)
      }
      const findProduct = await Product.findByIdAndUpdate(
        id,
        {
          images:urls.map((file)=>{
            return file
          })
        },{
          new:true
        }
      )
      res.json(findProduct)
  } catch (error) {
    return res.status(400).json(error)
  }
});
const deleteImages = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    return res.status(400).json(error)
  }
});
module.exports = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  deleteproduct,
  getproductCount,
  updateproduct,
  addToWishlist,
  rating,uploadImages,deleteImages
}; 
 