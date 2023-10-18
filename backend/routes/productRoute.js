const express = require('express');
const { allProducts,
    createNewProduct,
    updateProduct,
    deleteProduct,
    getSingleProductDetail,
    createProductReview,
    getProductAllReviews,
    deleteReview } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authentication');
const router = express.Router();

router.route("/product/every").get(allProducts)

router.route("/product/admin/new").post(isAuthenticatedUser, authorizeRoles("admin"), createNewProduct)

router.route("/product/admin/control/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)

router.route("/product/info/:id").get(getSingleProductDetail)

router.route("/review/create/new").put(isAuthenticatedUser, createProductReview)

router.route("/review/every").get(getProductAllReviews)

router.route("/review/user/delete").delete(isAuthenticatedUser, deleteReview)



module.exports = router;