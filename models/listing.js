const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    img: {
        type: String,
        default: " https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWUCWXqUWWKS0qcMg5t92ZJqCACbSUosZtjg&s",
        set: (v) => v === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMl0gFj8hN0b0aXLkzv_MyVu-NTG6kosYw_w&s" : v
    },
    price: {
        type: Number
    },
    coupon: {
        type: String
    },
    offer: {
        type: String
    },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

