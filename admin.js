// API Base URL
const API_BASE = 'http://localhost:5000/api';

// Global variables
let currentPage = 'dashboard';

// DOM Elements
const pageTitle = document.getElementById('page-title');
const adminContent = document.getElementById('admin-content');
const logoutBtn = document.getElementById('logout-btn');

// Initialize admin
document.addEventListener('DOMContentLoaded', initAdmin);

function initAdmin() {
  checkAdminAuth();
  setupEventListeners();
  loadPage('dashboard');
}

function checkAdminAuth() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || user.role !== 'admin') {
    window.location.href = '../frontend/login.html';
  }

  document.getElementById('admin-name').textContent = user.name;
}

function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.currentTarget.dataset.page;
      if (page) {
        loadPage(page);
      }
    });
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../frontend/login.html';
  });
}

// Load page content
function loadPage(page) {
  currentPage = page;

  // Update navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-page="${page}"]`).classList.add('active');

  // Update title
  pageTitle.textContent = page.charAt(0).toUpperCase() + page.slice(1);

  // Load content
  switch (page) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'products':
      loadProducts();
      break;
    case 'categories':
      loadCategories();
      break;
    case 'orders':
      loadOrders();
      break;
    case 'users':
      loadUsers();
      break;
    case 'banners':
      loadBanners();
      break;
  }
}

// API call helper
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
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

// Dashboard
async function loadDashboard() {
  try {
    const [products, orders, users] = await Promise.all([
      apiCall('/admin/products'),
      apiCall('/admin/orders'),
      apiCall('/admin/users')
    ]);

    adminContent.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <h3>${products.length}</h3>
          <p>Total Products</p>
        </div>
        <div class="stat-card">
          <h3>${orders.length}</h3>
          <p>Total Orders</p>
        </div>
        <div class="stat-card">
          <h3>${users.length}</h3>
          <p>Total Users</p>
        </div>
        <div class="stat-card">
          <h3>${orders.filter(o => o.orderStatus === 'pending').length}</h3>
          <p>Pending Orders</p>
        </div>
      </div>
      <h2>Recent Orders</h2>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${orders.slice(0, 5).map(order => `
            <tr>
              <td>${order._id.slice(-8)}</td>
              <td>${order.user.name}</td>
              <td>$${order.totalAmount}</td>
              <td>${order.orderStatus}</td>
              <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    adminContent.innerHTML = '<p>Failed to load dashboard</p>';
  }
}

// Products management
async function loadProducts() {
  try {
    const products = await apiCall('/admin/products');

    adminContent.innerHTML = `
      <div class="admin-form">
        <h2>Add New Product</h2>
        <form id="product-form">
          <div class="form-row">
            <div class="form-group">
              <label>Name</label>
              <input type="text" name="name" required>
            </div>
            <div class="form-group">
              <label>Price</label>
              <input type="number" name="price" step="0.01" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <select name="category" required>
                <option value="">Select Category</option>
              </select>
            </div>
            <div class="form-group">
              <label>Stock</label>
              <input type="number" name="stock" required>
            </div>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea name="description" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Add Product</button>
        </form>
      </div>

      <h2>All Products</h2>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(product => `
            <tr>
              <td>${product.name}</td>
              <td>$${product.price}</td>
              <td>${product.stock}</td>
              <td class="admin-actions">
                <button class="btn btn-small btn-secondary" onclick="editProduct('${product._id}')">Edit</button>
                <button class="btn btn-small btn-danger" onclick="deleteProduct('${product._id}')">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Load categories for form
    loadCategoriesForForm();
    setupProductForm();
  } catch (error) {
    adminContent.innerHTML = '<p>Failed to load products</p>';
  }
}

// Helper functions (simplified)
async function loadCategoriesForForm() {
  // Implementation for loading categories
}

function setupProductForm() {
  // Implementation for form submission
}

// Similar functions for other pages...
async function loadCategories() {
  adminContent.innerHTML = '<p>Categories management coming soon...</p>';
}

async function loadOrders() {
  adminContent.innerHTML = '<p>Orders management coming soon...</p>';
}

async function loadUsers() {
  adminContent.innerHTML = '<p>Users management coming soon...</p>';
}

async function loadBanners() {
  adminContent.innerHTML = '<p>Banners management coming soon...</p>';
}