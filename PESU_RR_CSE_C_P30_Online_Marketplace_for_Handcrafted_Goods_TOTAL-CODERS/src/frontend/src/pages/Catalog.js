import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [seller, setSeller] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');

  const limit = 12;

  // =====================
  // Fetch Products
  // =====================
  const fetchProducts = async (p = 1, append = false) => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        params: {
          page: p,
          limit,
          search: query,
          category,
          seller,
          minPrice,
          maxPrice,
          sort,
        },
      });

      if (append) setProducts((prev) => [...prev, ...res.data.data]);
      else setProducts(res.data.data);

      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, false);
  }, [query, category, seller, minPrice, maxPrice, sort]);

  // =====================
  // Infinite Scroll
  // =====================
  const loader = useRef();

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && page < pages && !loading) {
        fetchProducts(page + 1, true);
      }
    },
    [page, pages, loading]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);

    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Catalog</h1>

      {/* ===================== */}
      {/* Filters */}
      {/* ===================== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 10,
          marginBottom: 12,
        }}
      >
        {/* Search */}
        <input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Jewellery">Jewellery</option>
          <option value="Wood">Wood</option>
          <option value="Cloth">Cloth</option>
          <option value="Metal">Metal</option>
        </select>

        {/* Seller / Artisan */}
        <input
          placeholder="Seller / Artisan"
          value={seller}
          onChange={(e) => setSeller(e.target.value)}
        />

        {/* Sort Dropdown */}
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price_low">Lowest Price</option>
          <option value="price_high">Highest Price</option>
          <option value="rating_high">Highest Rated</option>
        </select>
      </div>

      {/* Price Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button
          onClick={() => {
            setQuery("");
            setCategory("");
            setSeller("");
            setMinPrice("");
            setMaxPrice("");
            setSort("newest");
          }}
        >
          Reset
        </button>
      </div>

      {/* ===================== */}
      {/* PRODUCT GRID */}
      {/* ===================== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {loading && (
        <p style={{ textAlign: "center", marginTop: 12 }}>Loading...</p>
      )}

      <div ref={loader} style={{ height: 40 }} />

      {/* ===================== */}
      {/* Manual Pagination (Optional) */}
      {/* ===================== */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginTop: 20,
        }}
      >
        <button
          onClick={() => fetchProducts(Math.max(1, page - 1), false)}
          disabled={page <= 1}
        >
          Prev
        </button>

        <span>
          Page {page} of {pages}
        </span>

        <button
          onClick={() => fetchProducts(Math.min(pages, page + 1), false)}
          disabled={page >= pages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
