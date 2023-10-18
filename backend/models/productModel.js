const mongoose = require("mongoose")

const productSechma = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        maxlength: [8, "Price cannot exceed 8 characters"]
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please Enter Product Category"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        maxlength: [3, "Stock cannot exceed 3 characters"],
        default: 1
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId, ref: "User", required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    numOfReviews: {
        type: Number,
        default: 0
    },
    overallRatings: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.ObjectId, ref: "User", required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


module.exports = mongoose.model("Product", productSechma)