import Product from "../models/Product.js";


// sort mapping
let sortRule = { createdAt: -1 }; // newest
if (sort === "price_low") sortRule = { price: 1 };
if (sort === "price_high") sortRule = { price: -1 };
if (sort === "rating_high") sortRule = { "reviews.rating": -1 };


const skip = (page - 1) * limit;


const [total, data] = await Promise.all([
Product.countDocuments(filter),
Product.find(filter).sort(sortRule).skip(skip).limit(limit).lean(),
]);


const result = {
page,
limit,
total,
pages: Math.ceil(total / limit),
data,
};


saveToCache(cacheKey, result);
return res.json(result);
} catch (err) {
console.error("listProducts error:", err);
return res.status(500).json({ message: err.message });
}
};


// ========== GET single product =============
export const getProduct = async (req, res) => {
try {
const p = await Product.findById(req.params.id).lean();
if (!p) return res.status(404).json({ message: "Product not found" });
res.json(p);
} catch (err) {
console.error("getProduct error:", err);
res.status(500).json({ message: err.message });
}
};


// ========== CREATE product (invalidates cache) =============
export const createProduct = async (req, res) => {
try {
const p = await Product.create(req.body);
invalidateProductCache();
res.status(201).json(p);
} catch (err) {
console.error("createProduct error:", err);
res.status(500).json({ message: err.message });
}
};


// ========== UPDATE product (invalidates cache) =============
export const updateProduct = async (req, res) => {
try {
const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
invalidateProductCache();
res.json(p);
} catch (err) {
console.error("updateProduct error:", err);
res.status(500).json({ message: err.message });
}
};


// ========== DELETE product (invalidates cache) =============
export const deleteProduct = async (req, res) => {
try {
await Product.findByIdAndDelete(req.params.id);
invalidateProductCache();
res.json({ message: "Product deleted" });
} catch (err) {
console.error("deleteProduct error:", err);
res.status(500).json({ message: err.message });
}
};
