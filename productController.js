
const mongoose = require("mongoose");
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');


// Get products - /api/v1/products
// Get products - /api/v1/products
exports.getProducts = (async (req, res,next) => {
    const resPerPage = 3;
    
    let buildQuery = () =>{
        return  new APIFeatures(Product.find(), req.query).search().filter()
    }

    const filteredProductsCount = await buildQuery().query.countDocuments({})
    const totalProductsCount = await Product.countDocuments({});
    let productsCount = totalProductsCount;

    if (filteredProductsCount !== totalProductsCount) {
        productsCount = filteredProductsCount;
    }


    const products = await buildQuery().paginate(resPerPage).query;

    res.status(200).json({
        success: true,
        count: totalProductsCount,
        resPerPage,
        products
    })
})
exports.getProducts = async (req, res, next) => {
    try {
        const resPerPage = 3;

        // Initialize the APIFeatures instance
        const apiFeatures = new APIFeatures(Product.find(), req.query)
            .search()
            .filter();

        // Clone the query for countDocuments
        const filteredProductsCount = await apiFeatures.query.clone().countDocuments();
        const totalProductsCount = await Product.countDocuments();

        // Use the original query for fetching products
        const products = await apiFeatures.paginate(resPerPage).query;

        res.status(200).json({
            success: true,
            count: filteredProductsCount,
            resPerPage,
            products,
        });
    } catch (error) {
        console.error("Error in getProducts:", error);
        next(error);
    }
};


/////neww

exports.getProducts = async (req, res, next) => {
    try {
        const resPerPage = 3;

        // Helper function to initialize APIFeatures
        const buildQuery = () => {
            return new APIFeatures(Product.find(), req.query).search().filter();
        };

        // Clone the query for countDocuments
        const filteredProductsCount = await buildQuery().query.clone().countDocuments();
        const totalProductsCount = await Product.countDocuments();

        // Use the original query for fetching products
        const products = await buildQuery().paginate(resPerPage).query;

        res.status(200).json({
            success: true,
            count: filteredProductsCount,
            resPerPage,
            products,
        });
    } catch (error) {
        console.error("Error in getProducts:", error);
        next(error);
    }
};





//Create Product - /api/v1/product/new
exports.newProduct = catchAsyncError (async (req, res, )=>{
    let images = []
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    
    if(req.files.length > 0) {
        req.files.forEach( file => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })
    }

    req.body.images = images;

    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    req.body.user = req.user.id;
    res.status(201).json({
        success: true,
        product
    })
});

//Get single product - api/v1/product/exports.
exports.getSingleProduct = async (req, res, next) => {
    try {
        // Validate product ID
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        // Find product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Success response
        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        next(error); // Pass error to middleware
    }
};



//Update Product - api/v1/product/:id
exports.updateProduct = async (req, res, ) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    } 
    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true

    })

    res.status(200).json({
        success: true,
        product
    })
    
}

//Delete Product - api/v1/product/:id
exports.deleteProduct = async (req, res, ) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
        
    }
    await product.deleteOne();
    //await product.remove();

    res.status(200).json({
        succes: true,
        message: "product deleted"
    })
}

//Create Review - api/v1/review
exports.createReview = catchAsyncError(async(req,res,next)=>{
    const {productId, rating, comment} = req.body;

    const review = {
        user: req.user.id,
        rating,comment
    }
    const product = await Product.findById(productId);
      //finding user review exists
    const isReviewed = product.reviews.find(review => {
        return review.user.toString() == req.user.id.toString()
    })
    if (isReviewed) {
        //updating the  review
        product.reviews.forEach(review =>{
            if (review.user.toString() == req.user.id.toString()) {
                review.comment = comment
                review.rating = rating
            }
        })
    }else{
        //creating the review
        product.reviews.push(review);
        product.numOfReviews= product.reviews.length;
    }

    //find the average of the product reviews
    product.ratings = product.reviews.reduce((acc ,review )=>{
        return review.rating + acc;
    },0)/product.reviews.length;
    product.ratings = isNaN(product.ratings)?0:product.ratings;

    
    await product.save({validateBeforeSave: false});
    res.status(200).json({
        success: true
    })


})

//Get Reviews - api/v1/reviews?id={productId}
exports.getReviews = catchAsyncError(async (req, res, next) =>{
    const product = await Product.findById(req.query.id).populate('reviews.user','name email');

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})


//Delete Review - api/v1/review
exports.deleteReview = catchAsyncError(async (req, res, next) =>{
    const product = await Product.findById(req.query.productId);

    //filtering the reviews which does match the deleting review id
    const reviews = product.reviews.filter(review => {
        return review._id.toString() !== req.query.id.toString()
     });
     //number of reviews 
     const numOfReviews = reviews.length;
 
     //finding the average with the filtered reviews
     let ratings = reviews.reduce((acc, review) => {
         return review.rating + acc;
     }, 0) / reviews.length;
     ratings = isNaN(ratings)?0:ratings;
 
     //save the product document
     await Product.findByIdAndUpdate(req.query.productId, {
         reviews,
         numOfReviews,
         ratings
     })
     res.status(200).json({
         success: true
     })
});


// get admin products  - api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) =>{
    const products = await Product.find();
    res.status(200).send({
        success: true,
        products
    })
});