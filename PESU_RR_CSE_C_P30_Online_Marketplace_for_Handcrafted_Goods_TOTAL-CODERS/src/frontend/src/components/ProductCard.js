import React, { useState } from 'react';
import PropTypes from 'prop-types';
import placeholder from '../assets/Royals_Logo.jpeg';
import assets from '../data/assetsIndex';

const ProductCard = ({ product, onAddToCart }) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (typeof onAddToCart !== 'function') return;
    try {
      setLoading(true);
      await onAddToCart(product);
    } finally {
      setLoading(false);
    }
  };

  // ===============================================
  // IMAGE RESOLUTION LOGIC (Improved + Clean)
  // ===============================================
  const resolveImage = () => {
    let candidate = null;

    // 1. From MongoDB Model → product.images[0]
    if (product.images && product.images.length > 0) {
      candidate = product.images[0];
    }

    // 2. If imageName refers to local assets
    if (!candidate && product.imageName && assets[product.imageName]) {
      candidate = assets[product.imageName];
    }

    // 3. Heuristic: match product title first word to assets
    if (!candidate && product.title) {
      const key = Object.keys(assets).find(k =>
        k.toLowerCase().includes(product.title.split(' ')[0].toLowerCase())
      );
      if (key) candidate = assets[key];
    }

    // Debug
    console.log(`ProductCard: _id=${product._id} resolved image src:`, candidate);

    return candidate || placeholder;
  };

  const finalSrc = resolveImage();

  return (
    <div className="product-card">
      {/* PRODUCT IMAGE */}
      <img
        src={finalSrc}
        alt={product.title}
        className="product-image"
        onError={(e) => {
          if (e.target.src !== placeholder) e.target.src = placeholder;
        }}
      />

      {/* PRODUCT INFO */}
      <div className="product-info">
        <h3>{product.title}</h3>
        <p className="product-description">{product.description}</p>

        {/* Price + Old Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {product.oldPrice && (
            <span className="old-price">
              ₹{product.oldPrice.toLocaleString()}
            </span>
          )}

          <div className="product-price">
            <span className="price-amount">
              ₹{product.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ARTISAN NAME */}
        <div className="product-artisan">
          By: {product.artisan || "Unknown Artisan"}
        </div>

        {/* ADD TO CART BUTTON */}
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="add-to-cart-btn"
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    oldPrice: PropTypes.number,
    images: PropTypes.array,
    imageName: PropTypes.string,
    artisan: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func,
};

export default ProductCard;
