# HET Pro2345 E-commerce Platform

A full-stack e-commerce platform for electronics with customer-facing website and admin dashboard.

## Features

### Customer Features
- User registration and login with JWT authentication
- Product browsing with search and filtering
- Shopping cart and wishlist
- Order placement with Stripe payment integration
- Order tracking
- Product reviews and ratings

### Admin Features
- Product management (CRUD operations)
- Category management
- Order management and status updates
- User management
- Homepage banner management
- File upload for images

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, JWT, Stripe
- **Frontend**: HTML, CSS, JavaScript
- **Database**: MongoDB

## Installation

1. **Install MongoDB**:
   - Download and install MongoDB Community Server from https://www.mongodb.com/try/download/community
   - Start MongoDB service (on Windows: `net start MongoDB` or run `mongod` manually)

2. **Clone/Setup the repository**
3. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```
4. **Set up environment variables** in `backend/.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/het-pro2345-ecommerce
   JWT_SECRET=your_super_secret_jwt_key_here
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   PORT=5000
   ```
5. **Seed the database** with sample data:
   ```bash
   npm run seed
   ```
6. **Start the backend server**:
   ```bash
   npm run dev
   ```

## Usage

### Accessing the Application
- **Customer Website**: Open `frontend/index.html` in your browser
- **Admin Dashboard**: Open `admin/index.html` in your browser

### Admin Login
- Email: admin@hetpro2345.com
- Password: admin123

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Products (Public)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories` - Get categories
- `GET /api/products/banners/active` - Get active banners

#### User Actions (Authenticated)
- `GET /api/user/cart` - Get cart
- `POST /api/user/cart` - Add to cart
- `PUT /api/user/cart/:productId` - Update cart item
- `DELETE /api/user/cart/:productId` - Remove from cart
- `GET /api/user/orders` - Get user orders
- `POST /api/user/orders` - Create order
- `GET /api/user/wishlist` - Get wishlist
- `POST /api/user/wishlist/:productId` - Add to wishlist
- `DELETE /api/user/wishlist/:productId` - Remove from wishlist

#### Admin (Admin only)
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/categories` - Get categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/users` - Get all users
- `GET /api/admin/banners` - Get banners
- `POST /api/admin/banners` - Create banner
- `PUT /api/admin/banners/:id` - Update banner
- `DELETE /api/admin/banners/:id` - Delete banner

## Deployment

### Backend
- Deploy to Heroku, Render, or similar
- Set environment variables
- Run `npm run seed` to populate database

### Frontend
- Deploy static files to GitHub Pages, Netlify, or similar
- Update API_BASE URLs in JavaScript files to point to deployed backend

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- CORS enabled
- File upload restrictions

## Future Enhancements

- Email notifications
- Advanced search and filtering
- Product image galleries
- Inventory management
- Analytics dashboard
- Mobile app
- Multi-language support

## License

This project is for educational purposes.