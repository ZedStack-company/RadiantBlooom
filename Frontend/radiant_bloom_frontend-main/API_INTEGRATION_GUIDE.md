# API Integration Guide

This guide explains how to run the integrated Radiant Bloom frontend and backend system.

## Prerequisites

- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- Cloudinary account (for image storage)

## Backend Setup

1. **Navigate to Backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/radiant_bloom
   JWT_SECRET=your_super_secret_jwt_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will be available at `http://localhost:5000`

## Frontend Setup

1. **Navigate to Frontend directory:**
   ```bash
   cd Frontend/radiant_bloom_frontend-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## Testing the Integration

1. **Open the frontend** in your browser at `http://localhost:3000`

2. **Test API integration** by opening browser console and running:
   ```javascript
   import testAPI from './src/utils/apiTest.ts';
   testAPI();
   ```

3. **Test user registration and login:**
   - Go to `/login` page
   - Register a new user or login with existing credentials
   - Verify authentication works

4. **Test product browsing:**
   - Browse products on the home page
   - Check product details page
   - Verify products load from backend API

5. **Test shopping cart and checkout:**
   - Add products to cart
   - Go to checkout page
   - Fill out shipping information
   - Place an order
   - Verify order is created in backend

6. **Test order management:**
   - Go to `/orders` page
   - View your orders
   - Check order details

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `DELETE /api/orders/:id` - Cancel order

### Health Check
- `GET /api/health` - API health status

## Troubleshooting

### Backend Issues
- Ensure MongoDB is running
- Check environment variables are set correctly
- Verify Cloudinary credentials
- Check console for error messages

### Frontend Issues
- Ensure backend is running on port 5000
- Check browser console for API errors
- Verify CORS settings in backend
- Clear browser cache and localStorage

### Common Issues
1. **CORS errors**: Make sure `CORS_ORIGIN` in backend `.env` matches frontend URL
2. **Authentication errors**: Check JWT_SECRET is set in backend
3. **Database errors**: Ensure MongoDB is running and accessible
4. **Image upload errors**: Verify Cloudinary credentials are correct

## Development Notes

- The frontend now uses real API calls instead of mock data
- Authentication is handled via JWT tokens stored in localStorage
- Order processing includes inventory management
- All CRUD operations for products and orders are connected to backend
- Error handling is implemented throughout the application

## Next Steps

1. Add more comprehensive error handling
2. Implement real-time updates for order status
3. Add email notifications for order updates
4. Implement payment gateway integration
5. Add more admin features and analytics
6. Implement product image upload functionality
7. Add comprehensive testing suite
