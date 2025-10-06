# Admin Access Guide

## How to Become an Admin

### Method 1: Using the Script (Recommended)

1. **First, register a user account** through the frontend:
   - Go to `http://localhost:8080/login`
   - Click "Sign Up" tab
   - Register with your email and password

2. **Make the user an admin** using the script:
   ```bash
   cd Backend
   npm run make-admin your-email@example.com
   ```

3. **Login with that account** - you'll now have admin access!

### Method 2: Direct Database Update

If you have MongoDB access:

```javascript
// In MongoDB shell or MongoDB Compass
use radiant_bloom
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Admin Features Available

Once you're an admin, you can:

### 🛍️ **Product Management**
- **Add Products**: Create new beauty products
- **Edit Products**: Update product information
- **Delete Products**: Remove products from catalog
- **Upload Images**: Add product images via Cloudinary

### 📦 **Order Management**
- **View All Orders**: See orders from all customers
- **Update Order Status**: Change order status (pending → shipped → delivered)
- **Order Details**: View detailed order information

### 👥 **Customer Management**
- **View Customers**: See all registered users
- **Customer Details**: View customer information and order history

### 📊 **Analytics**
- **Sales Data**: View sales statistics
- **Product Analytics**: See which products are popular
- **Revenue Tracking**: Monitor store performance

## How to Access Admin Features

### 1. **Login as Admin**
- Go to `http://localhost:8080/login`
- Login with your admin account

### 2. **Navigate to Admin Dashboard**
- Go to `http://localhost:8080/admin`
- You'll see the admin dashboard with all management options

### 3. **Add a New Product**
- Click on "Products" tab in admin dashboard
- Click "Add Product" button
- Fill in product details:
  - Name, Brand, Description
  - Price, Category
  - Images (upload to Cloudinary)
  - Features, Specifications
- Click "Save Product"

## Admin API Endpoints

### Products (Admin Only)
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders (Admin Only)
- `GET /api/orders/admin` - Get all orders
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/payment` - Update payment status

### Analytics (Admin Only)
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/sales` - Sales data
- `GET /api/analytics/products` - Product analytics

## Troubleshooting

### "Access Denied" Error
- Make sure you're logged in with an admin account
- Check that the user role is set to 'admin' in database
- Clear browser cache and try again

### Can't See Admin Dashboard
- Ensure you're logged in
- Check browser console for errors
- Verify the user has admin role

### Product Upload Issues
- Check Cloudinary configuration in .env file
- Ensure images are in supported formats (JPG, PNG, WebP, GIF)
- Check file size limits (max 5MB)

## Quick Test

1. **Register**: `admin@test.com` / `password123`
2. **Make Admin**: `npm run make-admin admin@test.com`
3. **Login**: Use the same credentials
4. **Access**: Go to `/admin` to see admin features

Happy managing! 🎉
