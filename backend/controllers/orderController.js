const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const catchAsyncError = require("../middleware/catchAsyncError")
const ErrorHandler = require("../Utils/errorHandler");



//Create New Order
module.exports.createNewOrder = catchAsyncError(async (req, res, next) => {

    const { shippingInfo,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo } = req.body;

    const newOrder = await Order.create({
        user: req.user._id,
        shippingInfo,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now()
    })

    res.status(201).json({ success: true, newOrder });

});


//Get single order for logged In User
module.exports.getSingleOrderDetails = catchAsyncError(async (req, res, next) => {

    const findOrder = await Order.findById(req.params.id).populate("user", "name email");

    if (!findOrder) {
        return next(new ErrorHandler("Order not found with this Id", 404))
    }

    res.status(200).json({ success: true, findOrder });

});


//Get Every Order for Logged In User
module.exports.myOrders = catchAsyncError(async (req, res, next) => {

    const findAllOrders = await Order.find({ user: req.user._id });

    res.status(200).json({ success: true, findAllOrders });

});



//get Every Order for Admin
module.exports.AllOrdersForAdmin = catchAsyncError(async (req, res, next) => {

    const findAllOrders = await Order.find();

    let totalRevenue = 0;
    findAllOrders.forEach((order) => totalRevenue += order.totalPrice)

    res.status(200).json({ success: true, totalRevenue, findAllOrders });

});


//Update Order Status for Admin
module.exports.updateOrderByAdmin = catchAsyncError(async (req, res, next) => {

    const findOrder = await Order.findById(req.params.id);

    if (!findOrder) {
        return next(new ErrorHandler("Order not found with this Id", 404))
    };

    if (findOrder.orderStatus === "Delivered") {
        return next(new ErrorHandler("Order has been delivered", 400))
    }

    findOrder.orderItems.forEach(async (order) => await updateStock(order.product, order.quantity));

    findOrder.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        findOrder.deliveredAt = Date.now();
    };

    await findOrder.save({ validateBeforeSave: false })
    res.status(200).json({ success: true });
});


async function updateStock(productId, qty) {
    const productInfo = await Product.findById(productId);

    productInfo.stock -= qty;

    await productInfo.save({ validateBeforeSave: false });

};


//Delete Order -- Admin
module.exports.deleteOrderByAdmin = catchAsyncError(async (req, res, next) => {

    const findOrder = await Order.findById(req.params.id);

    if (!findOrder) {
        return next(new ErrorHandler("Order not found with this Id", 404))
    };

    await Order.findByIdAndDelete(req.params.id)

    res.status(200).json({ success: true });
});