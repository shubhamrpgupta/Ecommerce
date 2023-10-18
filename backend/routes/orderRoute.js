const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authentication');
const { createNewOrder,
    getSingleOrderDetails,
    myOrders,
    AllOrdersForAdmin,
    updateOrderByAdmin,
    deleteOrderByAdmin } = require("../controllers/orderController");



router.route("/order/me/new").post(isAuthenticatedUser, createNewOrder);

router.route("/order/me/every").get(isAuthenticatedUser, myOrders);

router.route("/order/me/single/:id").get(isAuthenticatedUser, getSingleOrderDetails);

router.route("/order/admin/every").get(isAuthenticatedUser, authorizeRoles("admin"), AllOrdersForAdmin);

router.route("/order/admin/single/update/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrderByAdmin)

router.route("/order/admin/single/delete/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrderByAdmin)


module.exports = router;