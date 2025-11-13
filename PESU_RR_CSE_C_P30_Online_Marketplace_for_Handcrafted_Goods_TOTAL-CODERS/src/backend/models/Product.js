import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema({
user: String,
rating: Number,
comment: String,
createdAt: { type: Date, default: Date.now }
});


const productSchema = new mongoose.Schema(
{
title: { type: String, required: true },
description: { type: String, default: "" },
price: { type: Number, required: true },
images: [{ type: String }],
artisan: { type: String, default: "" },
category: { type: String, default: "" },
stock: { type: Number, default: 0 },
reviews: [reviewSchema]
},
{ timestamps: true }
);


export default mongoose.model("Product", productSchema);
