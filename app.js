// API Base URL
const API_BASE = 'http://localhost:5000/api';

// Global variables
let currentUser = null;
let cart = [];

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const cartCount = document.getElementById('cart-count');
const userBtn = document.getElementById('user-btn');
const userDropdown = document.getElementById('user-dropdown');
const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const profileLink = document.getElementById('profile-link');
const ordersLink = document.getElementById('orders-link');
const logoutBtn = document.getElementById('logout-btn');
const categoriesList = document.getElementById('categories-list');
const heroBanners = document.getElementById('hero-banners');
const featuredProducts = document.getElementById('featured-products');

// Initialize app
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  checkAuthStatus();
  loadCategories();
  loadBanners();
  loadFeaturedProducts();
  setupEventListeners();
}

function setupEventListeners() {
  // Search
  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  // User menu
  userBtn.addEventListener('click', () => {
    userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
  });

  // Logout
  logoutBtn.addEventListener('click', handleLogout);

  // Categories
  categoriesList.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      const categoryId = e.target.dataset.category;
      filterByCategory(categoryId);
    }
  });
}

// Authentication
function checkAuthStatus() {
  const token = localStorage.getItem('token');
  if (token) {
    currentUser = JSON.parse(localStorage.getItem('user'));
    updateUIForLoggedInUser();
  } else {
    updateUIForLoggedOutUser();
  }
}

function updateUIForLoggedInUser() {
  loginLink.style.display = 'none';
  registerLink.style.display = 'none';
  profileLink.style.display = 'block';
  ordersLink.style.display = 'block';
  logoutBtn.style.display = 'block';
  userBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
  loadCart();
}

function updateUIForLoggedOutUser() {
  loginLink.style.display = 'block';
  registerLink.style.display = 'block';
  profileLink.style.display = 'none';
  ordersLink.style.display = 'none';
  logoutBtn.style.display = 'none';
  userBtn.innerHTML = '<i class="fas fa-user"></i> Account';
  cart = [];
  updateCartCount();
}

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  updateUIForLoggedOutUser();
  window.location.reload();
}

// API Calls
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, { ...defaultOptions, ...options });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    alert(error.message);
    throw error;
  }
}

// Load categories
async function loadCategories() {
  try {
    const data = await apiCall('/products/categories');
    categoriesList.innerHTML = data.map(category =>
      `<a href="#" data-category="${category._id}">${category.name}</a>`
    ).join('');
  } catch (error) {
    console.error('Failed to load categories');
  }
}

// Load banners
async function loadBanners() {
  try {
    const data = await apiCall('/products/banners/active');
    heroBanners.innerHTML = data.map(banner =>
      `<img src="${API_BASE.replace('/api', '')}/uploads/${banner.image}" alt="${banner.title}">`
    ).join('');
  } catch (error) {
    console.error('Failed to load banners');
  }
}

// Load featured products
async function loadFeaturedProducts() {
  try {
    const data = await apiCall('/products?limit=8');
    featuredProducts.innerHTML = data.products.map(product => createProductCard(product)).join('');
  } catch (error) {
    console.error('Failed to load products');
  }
}

// Create product card
function createProductCard(product) {
  const imageUrl = product.images && product.images.length > 0
    ? `${API_BASE.replace('/api', '')}/uploads/${product.images[0]}`
    : 'https://via.placeholder.com/250x200?text=No+Image';

  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${imageUrl}" alt="${product.name}">
      </div>
      <div class="product-info">
        <a href="product.html?id=${product._id}" class="product-name">${product.name}</a>
        <div class="product-price">$${product.price}</div>
        <div class="product-rating">
          <div class="stars">${'★'.repeat(Math.floor(product.averageRating))}${'☆'.repeat(5 - Math.floor(product.averageRating))}</div>
          <span>(${product.reviews ? product.reviews.length : 0})</span>
        </div>
        <div class="product-actions">
          <button class="btn btn-primary" onclick="addToCart('${product._id}')">Add to Cart</button>
          <button class="btn btn-secondary" onclick="addToWishlist('${product._id}')">
            <i class="fas fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Cart functions
async function loadCart() {
  if (!currentUser) return;
  try {
    cart = await apiCall('/user/cart');
    updateCartCount();
  } catch (error) {
    console.error('Failed to load cart');
  }
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = count;
}

async function addToCart(productId) {
  if (!currentUser) {
    alert('Please login to add items to cart');
    return;
  }
  try {
    await apiCall('/user/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity: 1 })
    });
    loadCart();
    alert('Added to cart!');
  } catch (error) {
    console.error('Failed to add to cart');
  }
}

async function addToWishlist(productId) {
  if (!currentUser) {
    alert('Please login to add to wishlist');
    return;
  }
  try {
    await apiCall('/user/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
    alert('Added to wishlist!');
  } catch (error) {
    console.error('Failed to add to wishlist');
  }
}

// Search and filter
function handleSearch() {
  const query = searchInput.value.trim();
  if (query) {
    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
  }
}

function filterByCategory(categoryId) {
  window.location.href = `products.html?category=${categoryId}`;
}