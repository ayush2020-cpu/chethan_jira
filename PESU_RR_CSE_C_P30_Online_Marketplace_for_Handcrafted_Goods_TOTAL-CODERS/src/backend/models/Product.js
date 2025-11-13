import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
title: { type: String, required: true },
description: { type: String },
price: { type: Number, required: true },
images: [{ type: String }], // array of image URLs
artisan: { type: String },
category: { type: String },
stock: { type: Number, default: 0 },
reviews: [
{
user: String,
rating: Number,
comment: String,
createdAt: { type: Date, default: Date.now }
}
]
}, { timestamps: true });


export default mongoose.model('Product', productSchema);
