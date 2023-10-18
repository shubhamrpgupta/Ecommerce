const Product = require("../models/productModel");
const catchAsyncError = require("../middleware/catchAsyncError")
const ErrorHandler = require("../Utils/errorHandler");
const ApiFeatures = require("../Utils/apiFeatures");


//view All products
module.exports.allProducts = catchAsyncError(async (req, res, next) => {

    const resultPerPage = 15;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter().pagination(resultPerPage)
    const AllProducts = await apiFeature.query;
    res.status(200).json({
        success: true,
        AllProducts,
        productsCount
    })
})


//create Product
module.exports.createNewProduct = catchAsyncError(async (req, res, next) => {

    req.body.user = req.user.id;

    const newProduct = await Product.create(req.body);
    res.json({
        success: true,
        newProduct
    })
})


//get single product details
module.exports.getSingleProductDetail = catchAsyncError(async (req, res, next) => {
    const isProduct = await Product.findById(req.params.id)

    if (!isProduct) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    res.status(200).json({
        success: true,
        isProduct
    })
})


//update Product for Admin only
module.exports.updateProduct = catchAsyncError(async (req, res, next) => {
    const isProduct = await Product.findById(req.params.id)

    if (!isProduct) {
        return next(new ErrorHandler("Product Not Found", 404))
    }


    const findAndUpdateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        findAndUpdateProduct
    })
})


//Delete Product for Admin only
module.exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const isProduct = await Product.findById(req.params.id)

    if (!isProduct) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    findProductToDelete = await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    })
})


//Create or update Review
module.exports.createProductReview = catchAsyncError(async (req, res, next) => {

    const { rating, comment, productId } = req.body;
    const givenReview = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };

    const productToReview = await Product.findById(productId);

    const isReviewed = productToReview.reviews.find(
        existReview => existReview.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        productToReview.reviews.forEach(existReview => {
            if (existReview => existReview.user.toString() === req.user._id.toString())
                (existReview.rating = rating), (existReview.comment = comment)
        })
    } else {
        productToReview.reviews.push(givenReview);
        productToReview.numOfReviews = productToReview.reviews.length;
    }

    let avg = 0;
    productToReview.reviews.forEach(rev => avg += rev.rating);

    productToReview.overallRatings = avg / productToReview.reviews.length;

    await productToReview.save({ validateBeforeSave: false })

    res.status(200).json({ success: true })
})


//Get All Review of single product
module.exports.getProductAllReviews = catchAsyncError(async (req, res, next) => {

    const isProduct = await Product.findById(req.query.productId);

    if (!isProduct) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({ success: true, reviews: isProduct.reviews });

});


//Delete Review of Single Product
module.exports.deleteReview = catchAsyncError(async (req, res, next) => {

    const isProduct = await Product.findById(req.query.productId);

    if (!isProduct) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    const updatedReviews = isProduct.reviews.filter(
        (existingReview) => existingReview._id.toString() !== req.query.reviewIdToDelete.toString()
    );

    let avg = 0;
    updatedReviews.forEach(rev => avg += rev.rating);

    const updatedNumOfReviews = updatedReviews.length;

    const updatedOverallRatings = avg / updatedNumOfReviews;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews: updatedReviews, overallRatings: updatedOverallRatings, numOfReviews: updatedNumOfReviews
    }, { new: true, runValidators: true, useFindAndModify: false });

    res.status(200).json({
        success: true,
    })

});
