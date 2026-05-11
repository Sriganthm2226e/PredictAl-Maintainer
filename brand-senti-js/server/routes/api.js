const express = require('express');
const router = express.Router();
+const axios = require('axios');
+require('dotenv').config();

let userData = {
  name: "Sriganth M",
  email: "sriganthm2006@gmail.com",
  role: "Admin",
  plan: "Professional",
  mentionsLeft: 18450,
  totalMentions: 50000,
  avatar: "https://ui-avatars.com/api/?name=Sriganth+M&background=random"
};

// GET /api/user
router.get('/user', (req, res) => {
  res.json(userData);
});

// PUT /api/user/update
router.put('/user/update', (req, res) => {
  const { name, email, password } = req.body;
  if (name) userData.name = name;
  if (email) userData.email = email;
  // password handled conceptually
  if (name) {
    userData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  }
  res.json({ message: "Profile updated successfully", user: userData });
});

// GET /api/brands
router.get('/brands', (req, res) => {
  res.json([
    { id: 'coca-cola', name: 'Coca-Cola', logo: 'https://api.iconify.design/logos:coca-cola.svg' },
    { id: 'pepsi', name: 'Pepsi', logo: 'https://api.iconify.design/logos:pepsi.svg' },
    { id: 'nike', name: 'Nike', logo: 'https://api.iconify.design/simple-icons:nike.svg' },
    { id: 'zara', name: 'Zara', logo: 'https://api.iconify.design/simple-icons:zara.svg' },
    { id: 'hm', name: 'H&M', logo: 'https://api.iconify.design/simple-icons:h-and-m.svg' },
    { id: 'adidas', name: 'Adidas', logo: 'https://api.iconify.design/simple-icons:adidas.svg' },
  ]);
});

// GET /api/trends (mock data as before)
router.get('/trends', (req, res) => {
  const { category, brand } = req.query;
  let products = [
    { id: 1, name: "Summer Floral Dress", category: "Women Clothing", brand: "Zara", price: 59.99, popularity: 98, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80" },
    { id: 2, name: "Classic Street Sneakers", category: "Footwear", brand: "Nike", price: 120.00, popularity: 95, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80" },
    { id: 3, name: "Oversized Graphic Tee", category: "Men Clothing", brand: "H&M", price: 24.99, popularity: 88, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80" },
    { id: 4, name: "Minimalist Leather Watch", category: "Accessories", brand: "Local brands", price: 85.00, popularity: 82, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80" },
    { id: 5, name: "Kids Denim Overalls", category: "Kids Wear", brand: "H&M", price: 34.99, popularity: 75, image: "https://images.unsplash.com/photo-1519238396254-d03b30fa8c8d?auto=format&fit=crop&w=300&q=80" },
    { id: 6, name: "Ultraboost Running Shoes", category: "Footwear", brand: "Adidas", price: 180.00, popularity: 92, image: "https://images.unsplash.com/photo-1587563871167-1c9c3cb16a4e?auto=format&fit=crop&w=300&q=80" },
  ];
  if (category && category !== 'All') products = products.filter(p => p.category === category);
  if (brand && brand !== 'All') products = products.filter(p => p.brand === brand);
  res.json({
    hashtags: ["#SummerStyle", "#StreetWear", "#OOTD", "#SneakerHead", "#SustainableFashion", "#VintageVibes"],
    products
  });
});

// NEW: Real‑time trends fetched from external service using API key
router.get('/real-time/trends', async (req, res) => {
  const apiKey = process.env.TREND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "TREND_API_KEY not configured" });
  }
  try {
    const externalRes = await axios.get('https://api.example.com/trends', {
      params: req.query,
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    res.json(externalRes.data);
  } catch (err) {
    console.error('Real‑time trends error', err);
    res.status(502).json({ error: 'Failed to fetch real‑time trends' });
  }
});

module.exports = router;

let userData = {
  name: "Sriganth M",
  email: "sriganthm2006@gmail.com",
  role: "Admin",
  plan: "Professional",
  mentionsLeft: 18450,
  totalMentions: 50000,
  avatar: "https://ui-avatars.com/api/?name=Sriganth+M&background=random"
};

// GET /api/user
router.get('/user', (req, res) => {
  res.json(userData);
});

// PUT /api/user/update
router.put('/user/update', (req, res) => {
  const { name, email, password } = req.body;
  if (name) userData.name = name;
  if (email) userData.email = email;
  // password handled conceptually
  if (name) {
    userData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  }
  res.json({ message: "Profile updated successfully", user: userData });
});

// GET /api/brands
router.get('/brands', (req, res) => {
  res.json([
    { id: 'coca-cola', name: 'Coca-Cola', logo: 'https://api.iconify.design/logos:coca-cola.svg' },
    { id: 'pepsi', name: 'Pepsi', logo: 'https://api.iconify.design/logos:pepsi.svg' },
    { id: 'nike', name: 'Nike', logo: 'https://api.iconify.design/simple-icons:nike.svg' },
    { id: 'zara', name: 'Zara', logo: 'https://api.iconify.design/simple-icons:zara.svg' },
    { id: 'hm', name: 'H&M', logo: 'https://api.iconify.design/simple-icons:h-and-m.svg' },
    { id: 'adidas', name: 'Adidas', logo: 'https://api.iconify.design/simple-icons:adidas.svg' },
  ]);
});

// GET /api/trends
router.get('/trends', (req, res) => {
  const { category, brand } = req.query;
  
  let products = [
    { id: 1, name: "Summer Floral Dress", category: "Women Clothing", brand: "Zara", price: 59.99, popularity: 98, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80" },
    { id: 2, name: "Classic Street Sneakers", category: "Footwear", brand: "Nike", price: 120.00, popularity: 95, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80" },
    { id: 3, name: "Oversized Graphic Tee", category: "Men Clothing", brand: "H&M", price: 24.99, popularity: 88, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80" },
    { id: 4, name: "Minimalist Leather Watch", category: "Accessories", brand: "Local brands", price: 85.00, popularity: 82, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80" },
    { id: 5, name: "Kids Denim Overalls", category: "Kids Wear", brand: "H&M", price: 34.99, popularity: 75, image: "https://images.unsplash.com/photo-1519238396254-d03b30fa8c8d?auto=format&fit=crop&w=300&q=80" },
    { id: 6, name: "Ultraboost Running Shoes", category: "Footwear", brand: "Adidas", price: 180.00, popularity: 92, image: "https://images.unsplash.com/photo-1587563871167-1c9c3cb16a4e?auto=format&fit=crop&w=300&q=80" },
  ];

  if (category && category !== 'All') {
    products = products.filter(p => p.category === category);
  }
  if (brand && brand !== 'All') {
    products = products.filter(p => p.brand === brand);
  }

  res.json({
    hashtags: ["#SummerStyle", "#StreetWear", "#OOTD", "#SneakerHead", "#SustainableFashion", "#VintageVibes"],
    products: products
  });
});

module.exports = router;
