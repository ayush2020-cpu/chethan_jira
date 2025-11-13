import Product from '../models/Product.js';

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Create a new product (sample data for testing)
export const createSampleProducts = async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: "Handcrafted Wooden Bowl",
        price: 999,
        salePrice: 799,
        description: "Beautifully handmade wooden bowl, perfect for home décor or serving food. Each piece is unique and made from eco-friendly, sustainably sourced wood.",
        imageUrl: "https://images.unsplash.com/photo-1616627781404-0af6e7ccf6dc?w=800",
        artisanName: "Aarav Crafts",
        artisanId: "655e5f1f0d2b1f1f0d2b1f1f", // This should be a valid user ID
        stock: 8,
        features: [
          "100% eco-friendly materials",
          "Hand-polished smooth finish",
          "Perfect for décor or kitchen use"
        ],
        category: "Home Decor"
      },
      {
        name: "Handwoven Cotton Scarf",
        price: 1499,
        salePrice: null,
        description: "Traditional handwoven cotton scarf with intricate patterns. Made using natural dyes and pure cotton.",
        imageUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800",
        artisanName: "Maya Textiles",
        artisanId: "655e5f1f0d2b1f1f0d2b1f1f", // This should be a valid user ID
        stock: 15,
        features: [
          "100% pure cotton",
          "Natural dyes",
          "Traditional patterns"
        ],
        category: "Accessories"
      }
    ];

    const products = await Product.insertMany(sampleProducts);
    res.status(201).json({ message: 'Sample products created', products });
  } catch (error) {
    console.error('Error creating sample products:', error);
    res.status(500).json({ message: 'Error creating sample products' });
  }
};
