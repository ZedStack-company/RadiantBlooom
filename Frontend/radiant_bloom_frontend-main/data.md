# Radiant Bloom Frontend - Complete Codebase Documentation

## Project Overview
**Radiant Bloom** is a modern e-commerce beauty store frontend built with React, TypeScript, and Vite. The application features a comprehensive beauty product catalog, shopping cart, user authentication, admin dashboard, and order management system.

## Technology Stack

### Core Technologies
- **React 18.3.1** - Frontend framework
- **TypeScript 5.8.3** - Type safety and development experience
- **Vite 5.4.19** - Build tool and development server
- **React Router DOM 6.30.1** - Client-side routing

### State Management
- **Redux Toolkit 2.9.0** - State management
- **React Redux 9.2.0** - React bindings for Redux
- **React Query (TanStack) 5.83.0** - Server state management

### UI Framework & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Headless UI components (comprehensive set)
- **Lucide React 0.462.0** - Icon library
- **Shadcn/ui** - Pre-built component library

### Additional Libraries
- **React Hook Form 7.61.1** - Form handling
- **Zod 3.25.76** - Schema validation
- **Axios 1.11.0** - HTTP client
- **Recharts 2.15.4** - Data visualization
- **Sonner 1.7.4** - Toast notifications

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── admin/           # Admin-specific components
│   ├── layout/          # Layout components (Header, Footer)
│   ├── products/        # Product-related components
│   ├── reviews/         # Review system components
│   ├── sections/        # Page sections (Hero, CategoryShowcase)
│   └── ui/              # Base UI components (Shadcn/ui)
├── context/             # React Context providers
├── data/                # Mock data and constants
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── pages/               # Page components
│   └── admin/           # Admin dashboard pages
├── services/            # API service functions
├── store/               # Redux store configuration
│   └── slices/          # Redux slices
├── types.ts             # TypeScript type definitions
└── utils/               # Utility functions
```

## Core Features

### 1. Product Management
- **Product Catalog**: Display products with filtering, sorting, and search
- **Product Details**: Detailed product view with images, reviews, and specifications
- **Categories**: Organized product categories (Skincare, Makeup, Hair Care, Fragrance, Tools)
- **Product Cards**: Interactive product cards with hover effects and quick actions

### 2. Shopping Experience
- **Shopping Cart**: Add/remove items, quantity management, price calculations
- **Wishlist/Favorites**: Save products for later
- **Search Functionality**: Real-time product search with suggestions
- **Product Reviews**: User-generated reviews and ratings system

### 3. User Authentication
- **Login/Signup**: User registration and authentication
- **User Context**: Global user state management
- **Cart Persistence**: Cart data persists across sessions
- **Guest Checkout**: Checkout without account creation

### 4. Order Management
- **Checkout Process**: Multi-step checkout with form validation
- **Order History**: View past orders and order details
- **Order Status**: Track order status (pending, paid, shipped, delivered)

### 5. Admin Dashboard
- **Analytics**: Sales data, top products, revenue tracking
- **Product Management**: Add, edit, delete products
- **Order Management**: View and manage customer orders
- **Customer Management**: Customer data and insights

## Detailed Component Analysis

### Pages

#### 1. Index.tsx (Home Page)
- **Purpose**: Main landing page
- **Features**: Hero section, category showcase, product grid, reviews
- **Components Used**: Header, Footer, HeroSection, CategoryShowcase, ProductGrid, ReviewSection

#### 2. Products.tsx (Product Listing)
- **Purpose**: Display filtered product listings
- **Features**: Category filtering, search, sorting, pagination
- **URL Parameters**: `/category/:category` for category-based filtering

#### 3. ProductDetail.tsx
- **Purpose**: Individual product detail page
- **Features**: 
  - Product image gallery with thumbnails
  - Product information and specifications
  - Add to cart and wishlist functionality
  - Product reviews and rating system
  - Related products section
  - Tabs for reviews, details, and shipping info

#### 4. Cart.tsx
- **Purpose**: Shopping cart management
- **Features**:
  - Cart item display with images and details
  - Quantity adjustment controls
  - Remove items functionality
  - Save for later (move to wishlist)
  - Promo code application
  - Order summary with pricing breakdown
  - Proceed to checkout

#### 5. Checkout.tsx
- **Purpose**: Order completion process
- **Features**:
  - Customer information form
  - Shipping address collection
  - Payment method selection
  - Order summary
  - Form data persistence
  - Order creation and confirmation

#### 6. Login.tsx
- **Purpose**: User authentication
- **Features**:
  - Login and signup forms in tabs
  - Form validation
  - Password visibility toggle
  - Remember me functionality
  - Terms and conditions agreement

#### 7. Favorites.tsx
- **Purpose**: User's saved products
- **Features**:
  - Display wishlisted products
  - Remove from favorites
  - Clear all favorites
  - Recommended products section

#### 8. Products.tsx
- **Purpose**: Main product listing page (duplicate of CategoryProducts.tsx)
- **Features**: Same as CategoryProducts.tsx - displays filtered product listings
- **Note**: This appears to be a duplicate component with identical functionality

#### 9. NotFound.tsx
- **Purpose**: 404 error page
- **Features**:
  - Error logging for debugging
  - User-friendly 404 message
  - Link back to home page
  - Simple centered layout

#### 10. OrderDetail.tsx
- **Purpose**: Individual order detail view
- **Features**:
  - Order information display (ID, date, customer details)
  - Itemized order breakdown with images and quantities
  - Customer and shipping information
  - Order status display
  - User authentication check (only shows orders for current user)
  - Back navigation to orders list

#### 11. Orders.tsx
- **Purpose**: User's order history page
- **Features**:
  - List of user's orders with summary information
  - Order filtering by current user email
  - Order count and total amount display
  - Links to individual order details
  - Empty state with call-to-action
  - Persistent order data from localStorage

#### 12. Analytics.tsx
- **Purpose**: Public analytics page
- **Features**:
  - Sales overview with line chart (last 12 days)
  - Top-selling products list with sales data
  - Bar chart for product sales comparison
  - Pie chart for sales breakdown by product
  - Responsive chart containers
  - Loading and error states
  - Data visualization using Recharts

#### 13. AdminDashboard.tsx
- **Purpose**: Administrative interface
- **Features**:
  - Dashboard statistics (users, products, orders, revenue)
  - Tabbed interface for different management areas
  - Integration with admin tables and analytics
  - CSS injection to hide slider elements
  - Real-time data loading and display

### Admin Pages

#### 1. AdminDashboard.tsx
- **Purpose**: Main admin dashboard
- **Features**: Statistics cards, tabbed interface, data loading
- **Components Used**: AdminHeader, OrdersTable, ProductsTable, CustomersTable, Analytics

#### 2. Analytics.tsx (Admin)
- **Purpose**: Admin analytics dashboard
- **Features**:
  - Sales overview line chart with responsive design
  - Top products list with sales data
  - Mobile-responsive chart sizing
  - Loading skeletons and error states
  - Retry functionality for failed requests
  - Chart data formatting and display

#### 3. CustomersTable.tsx
- **Purpose**: Customer management interface
- **Features**:
  - Customer data table with search functionality
  - View/Edit customer details in side drawer
  - Customer status management (active/inactive)
  - Order count and spending tracking
  - Customer deletion functionality
  - Form validation and error handling
  - Toast notifications for actions

#### 4. DashboardStats.tsx
- **Purpose**: Reusable statistics cards component
- **Features**:
  - Total users, products, orders, and revenue display
  - Trend indicators with percentage changes
  - Icon-based visual representation
  - Responsive grid layout
  - Color-coded statistics

#### 5. OrdersTable.tsx
- **Purpose**: Order management interface
- **Features**:
  - Order listing with status badges
  - Order detail view/edit in side drawer
  - Status management (pending, paid, shipped, delivered, cancelled)
  - Customer information display
  - Order item breakdown
  - Bulk status update actions
  - Order deletion functionality
  - CSS injection to hide slider elements

#### 6. ProductsTable.tsx
- **Purpose**: Product management interface
- **Features**:
  - Product listing with search and category filtering
  - Add/Edit product form with image upload
  - Product view dialog with details
  - Multiple image upload with preview
  - Product status management (in stock, bestseller, new)
  - Product deletion with confirmation
  - Form validation and error handling
  - Toast notifications for actions
  - Data URL conversion for image persistence

### Layout Components

#### 1. Header.tsx
- **Purpose**: Main navigation and site header
- **Features**:
  - Logo and brand name
  - Navigation menu (desktop and mobile)
  - Search bar with suggestions
  - Cart and wishlist counters
  - User account dropdown
  - Mobile responsive design

#### 2. Footer.tsx
- **Purpose**: Site footer with additional information
- **Features**:
  - Contact information and addresses
  - Customer service links
  - Newsletter subscription
  - Trust badges (shipping, returns, support)
  - Social links and company information

### Product Components

#### 1. ProductCard.tsx
- **Purpose**: Individual product display card
- **Features**:
  - Product image with hover effects
  - Product information (name, brand, price)
  - Rating and review count
  - Add to cart and wishlist buttons
  - Badge system (new, bestseller, discount)
  - Quick view functionality
  - Stock status indication

#### 2. ProductGrid.tsx
- **Purpose**: Grid layout for multiple products
- **Features**: Responsive grid layout, product filtering, loading states

### Section Components

#### 1. HeroSection.tsx
- **Purpose**: Main banner/hero area
- **Features**:
  - Image carousel with auto-play
  - Navigation controls (prev/next)
  - Play/pause functionality
  - Slide indicators
  - Call-to-action buttons
  - Responsive design

#### 2. CategoryShowcase.tsx
- **Purpose**: Display product categories
- **Features**: Category cards with images and links

#### 3. CategoryGrid.tsx
- **Purpose**: Grid layout for categories
- **Features**: Responsive category display

### Review Components

#### 1. ReviewSection.tsx
- **Purpose**: Product reviews display and management
- **Features**:
  - Review form for new reviews
  - Star rating system
  - Review display with user information
  - Review verification badges
  - Pagination for large review sets

## State Management (Redux)

### Store Configuration
- **Store**: Configured with Redux Toolkit
- **Persistence**: localStorage integration for cart, wishlist, and user data
- **Middleware**: Redux DevTools integration

### Redux Slices

#### 1. productSlice.ts
- **State**: Products array, loading status, error handling
- **Actions**: fetchProducts, createProduct, updateProduct, deleteProduct, clearProducts
- **Selectors**: selectAllProducts, selectProductById, selectProductsByCategory

#### 2. cartSlice.ts
- **State**: Cart items, wishlist items
- **Actions**: addToCart, removeFromCart, updateQuantity, clearCart, toggleWishlist
- **Features**: Cart merging, quantity management, wishlist management

#### 3. ordersSlice.ts
- **State**: Orders array, loading status
- **Actions**: fetchOrders, createOrder, patchOrderStatus, deleteOrder
- **Features**: Order creation, status updates, order history

#### 4. customersSlice.ts
- **State**: Customer data array
- **Actions**: fetchCustomers, createCustomer, updateCustomer, deleteCustomer
- **Features**: Customer management for admin

#### 5. analyticsSlice.ts
- **State**: Sales data, top products
- **Actions**: fetchAnalytics
- **Features**: Dashboard analytics and reporting

## Context Providers

### 1. AuthContext.tsx
- **Purpose**: User authentication state management
- **Features**:
  - Login/logout functionality
  - User registration
  - Cart merging on login
  - Persistent authentication state

### 2. CartContext.tsx
- **Purpose**: Shopping cart state (legacy, mostly replaced by Redux)
- **Features**: Cart operations, wishlist management

## Services

### 1. productService.ts
- **Purpose**: API communication for products
- **Methods**: getProducts, getProduct, createProduct, updateProduct, deleteProduct
- **Base URL**: http://localhost:5000/api (configurable)

## Utilities

### 1. localStorage.ts
- **Purpose**: Safe localStorage operations
- **Features**: Type-safe storage, error handling, storage keys management

### 2. utils.ts
- **Purpose**: General utility functions
- **Features**: Class name merging (cn function), Tailwind utilities

## Custom Hooks

### 1. ScrollToTop.tsx
- **Purpose**: Scroll to top on route changes
- **Features**: Smooth scrolling behavior

### 2. use-mobile.tsx
- **Purpose**: Mobile device detection
- **Features**: Responsive breakpoint detection

### 3. use-toast.ts
- **Purpose**: Toast notification system
- **Features**: Success, error, and info notifications

## Type Definitions

### Core Types (types.ts)
```typescript
interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  image: string[];
  features: string[];
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  items: OrderItem[];
}
```

## Styling System

### Design System
- **Color Palette**: Orange (#f97316) and Navy Blue (#1e3a8a) theme
- **Typography**: Inter font family
- **Spacing**: Consistent spacing scale
- **Border Radius**: Rounded corners throughout
- **Shadows**: Soft shadows for depth

### CSS Architecture
- **Tailwind CSS**: Utility-first approach
- **Custom CSS**: Brand-specific styles in index.css
- **Component Styles**: Scoped component styling
- **Responsive Design**: Mobile-first approach

### Key CSS Classes
- `.btn-hero`: Primary action button
- `.btn-navy`: Secondary action button
- `.card-elegant`: Elegant card styling
- `.card-product`: Product card styling
- `.text-gradient-orange`: Orange gradient text
- `.text-gradient-navy`: Navy gradient text

## Data Management

### Mock Data (data/mockData.ts)
- **Products**: 6 sample beauty products
- **Categories**: 5 product categories with subcategories
- **Reviews**: Sample product reviews
- **Hero Slides**: 3 banner slides for homepage

### Data Persistence
- **localStorage**: Cart, wishlist, user data, form data
- **Session Storage**: Temporary user sessions
- **Redux Persistence**: Automatic state persistence

## Routing Structure

### Public Routes
- `/` - Home page (Index.tsx)
- `/products` - Product listing (Products.tsx - duplicate of CategoryProducts)
- `/category/:category` - Category products (CategoryProducts.tsx)
- `/product/:id` - Product detail (ProductDetail.tsx)
- `/cart` - Shopping cart (Cart.tsx)
- `/favorites` - User favorites (Favorites.tsx)
- `/login` - Authentication (Login.tsx)
- `/checkout` - Checkout process (Checkout.tsx)
- `/orders` - Order history (Orders.tsx)
- `/orders/:id` - Order detail (OrderDetail.tsx)
- `/analytics` - Public analytics page (Analytics.tsx)
- `*` - 404 Not Found page (NotFound.tsx)

### Admin Routes
- `/admin` - Admin dashboard (AdminDashboard.tsx)
  - Contains tabs for: Orders, Products, Customers, Analytics
  - Uses admin-specific components for each tab

## Performance Optimizations

### Code Splitting
- Route-based code splitting with React.lazy
- Component-level lazy loading

### State Management
- Redux selectors for efficient re-renders
- Memoized components where appropriate

### Image Optimization
- Lazy loading for product images
- Fallback images for broken links
- Responsive image sizing

## Development Features

### Development Tools
- **Vite**: Fast development server
- **TypeScript**: Type checking and IntelliSense
- **ESLint**: Code linting and formatting
- **Hot Module Replacement**: Instant updates during development

### Build Configuration
- **Vite Config**: Optimized build settings
- **TypeScript Config**: Strict type checking
- **Tailwind Config**: Custom design system
- **PostCSS**: CSS processing

## Security Considerations

### Client-Side Security
- Input validation and sanitization
- XSS prevention through proper escaping
- CSRF protection considerations

### Data Handling
- Secure localStorage usage
- Sensitive data protection
- API key management

## Browser Support

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Features
- Modern JavaScript (ES2020+)
- CSS Grid and Flexbox
- Web APIs (localStorage, fetch)

## Deployment Considerations

### Build Output
- Static files for CDN deployment
- Optimized bundle sizes
- Asset optimization

### Environment Configuration
- API endpoint configuration
- Environment-specific settings
- Build mode options

## Future Enhancements

### Planned Features
- Backend API integration
- Payment gateway integration
- Advanced search and filtering
- User profile management
- Social media integration
- Multi-language support

### Technical Improvements
- Performance monitoring
- Error tracking
- Analytics integration
- PWA features
- Offline functionality

## File Dependencies

### Critical Files
- `main.tsx` - Application entry point
- `App.tsx` - Main application component with routing
- `store/store.ts` - Redux store configuration
- `types.ts` - TypeScript definitions

### Page Files
- `pages/Index.tsx` - Home page
- `pages/Products.tsx` - Product listing (duplicate)
- `pages/CategoryProducts.tsx` - Category-based product listing
- `pages/ProductDetail.tsx` - Individual product page
- `pages/Cart.tsx` - Shopping cart
- `pages/Favorites.tsx` - User favorites
- `pages/Login.tsx` - Authentication
- `pages/Checkout.tsx` - Checkout process
- `pages/Orders.tsx` - Order history
- `pages/OrderDetail.tsx` - Order details
- `pages/Analytics.tsx` - Public analytics
- `pages/NotFound.tsx` - 404 error page
- `pages/admin/AdminDashboard.tsx` - Admin dashboard
- `pages/admin/Analytics.tsx` - Admin analytics
- `pages/admin/CustomersTable.tsx` - Customer management
- `pages/admin/DashboardStats.tsx` - Statistics cards
- `pages/admin/OrdersTable.tsx` - Order management
- `pages/admin/ProductsTable.tsx` - Product management

### Configuration Files
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Build configuration
- `tailwind.config.ts` - Styling configuration
- `tsconfig.json` - TypeScript configuration

## Backend Architecture

### Technology Stack
- **Node.js 18+** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MongoDB 8.0.3** - NoSQL database
- **Mongoose 8.0.3** - ODM for MongoDB
- **Cloudinary 1.41.0** - Image storage and management
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

### Backend Project Structure
```
Backend/
├── config/
│   ├── cloudinary.js          # Cloudinary configuration
│   └── database.js            # Database connection
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── userController.js      # User management
│   ├── productController.js   # Product CRUD operations
│   ├── categoryController.js  # Category management
│   ├── orderController.js     # Order processing
│   ├── reviewController.js    # Review system
│   └── analyticsController.js # Analytics and reporting
├── middleware/
│   ├── auth.js               # JWT authentication
│   ├── errorHandler.js       # Global error handling
│   ├── notFound.js          # 404 handler
│   ├── upload.js            # File upload handling
│   ├── validation.js        # Input validation
│   └── rateLimiter.js       # Rate limiting
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Category.js          # Category schema
│   ├── Order.js             # Order schema
│   ├── Review.js            # Review schema
│   └── index.js             # Model exports
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── userRoutes.js        # User management routes
│   ├── productRoutes.js     # Product CRUD routes
│   ├── categoryRoutes.js    # Category routes
│   ├── orderRoutes.js       # Order processing routes
│   ├── reviewRoutes.js      # Review system routes
│   └── analyticsRoutes.js   # Analytics routes
├── utils/
│   ├── asyncHandler.js      # Async error handling
│   ├── responseHandler.js   # Standardized responses
│   ├── emailService.js      # Email functionality
│   └── helpers.js           # Utility functions
├── scripts/
│   └── seedDatabase.js      # Database seeding
├── tests/
│   ├── auth.test.js         # Authentication tests
│   ├── product.test.js      # Product tests
│   └── order.test.js        # Order tests
├── server.js                # Main server file
├── package.json             # Dependencies
└── env.example              # Environment variables
```

### Database Models

#### 1. User Model
```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String,
  avatar: String (Cloudinary URL),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isActive: Boolean (default: true),
  emailVerified: Boolean (default: false),
  addresses: [{
    type: String (enum: ['home', 'work', 'other']),
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean
  }],
  preferences: {
    newsletter: Boolean (default: false),
    notifications: Boolean (default: true)
  },
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Product Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  brand: String (required),
  description: String (required),
  price: Number (required, min: 0),
  originalPrice: Number (min: 0),
  category: ObjectId (ref: 'Category'),
  subcategory: String,
  images: [String] (Cloudinary URLs),
  features: [String],
  specifications: {
    weight: String,
    dimensions: String,
    ingredients: [String],
    skinType: [String],
    ageRange: String
  },
  inventory: {
    quantity: Number (default: 0),
    lowStockThreshold: Number (default: 10),
    trackInventory: Boolean (default: true)
  },
  status: String (enum: ['active', 'inactive', 'draft'], default: 'active'),
  tags: [String],
  isBestseller: Boolean (default: false),
  isNew: Boolean (default: false),
  isFeatured: Boolean (default: false),
  rating: Number (min: 0, max: 5, default: 0),
  reviewCount: Number (default: 0),
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Category Model
```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  slug: String (required, unique),
  description: String,
  image: String (Cloudinary URL),
  parentCategory: ObjectId (ref: 'Category'),
  subcategories: [ObjectId] (ref: 'Category'),
  isActive: Boolean (default: true),
  sortOrder: Number (default: 0),
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. Order Model
```javascript
{
  _id: ObjectId,
  orderNumber: String (required, unique),
  user: ObjectId (ref: 'User'),
  items: [{
    product: ObjectId (ref: 'Product'),
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    brand: String
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  pricing: {
    subtotal: Number,
    tax: Number,
    shipping: Number,
    discount: Number,
    total: Number
  },
  status: String (enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'], default: 'pending'),
  paymentStatus: String (enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending'),
  paymentMethod: String,
  trackingNumber: String,
  notes: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. Review Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  product: ObjectId (ref: 'Product'),
  order: ObjectId (ref: 'Order'),
  rating: Number (required, min: 1, max: 5),
  title: String,
  comment: String,
  images: [String] (Cloudinary URLs),
  isVerified: Boolean (default: false),
  isApproved: Boolean (default: true),
  helpful: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

#### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset
- `POST /verify-email` - Email verification
- `GET /me` - Get current user profile

#### User Routes (`/api/users`)
- `GET /` - Get all users (admin only)
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user profile
- `DELETE /:id` - Delete user (admin only)
- `PUT /:id/avatar` - Update user avatar
- `GET /:id/orders` - Get user orders
- `PUT /:id/address` - Update user address

#### Product Routes (`/api/products`)
- `GET /` - Get all products with filtering
- `GET /:id` - Get product by ID
- `POST /` - Create product (admin only)
- `PUT /:id` - Update product (admin only)
- `DELETE /:id` - Delete product (admin only)
- `POST /:id/images` - Upload product images
- `DELETE /:id/images/:imageId` - Delete product image
- `GET /search` - Search products
- `GET /featured` - Get featured products
- `GET /bestsellers` - Get bestseller products

#### Category Routes (`/api/categories`)
- `GET /` - Get all categories
- `GET /:id` - Get category by ID
- `POST /` - Create category (admin only)
- `PUT /:id` - Update category (admin only)
- `DELETE /:id` - Delete category (admin only)
- `GET /:id/products` - Get products by category

#### Order Routes (`/api/orders`)
- `GET /` - Get all orders (admin) or user orders
- `GET /:id` - Get order by ID
- `POST /` - Create new order
- `PUT /:id` - Update order status (admin only)
- `DELETE /:id` - Cancel order
- `GET /:id/invoice` - Generate order invoice

#### Review Routes (`/api/reviews`)
- `GET /` - Get all reviews
- `GET /product/:productId` - Get reviews for product
- `POST /` - Create review
- `PUT /:id` - Update review
- `DELETE /:id` - Delete review
- `POST /:id/helpful` - Mark review as helpful

#### Analytics Routes (`/api/analytics`)
- `GET /dashboard` - Get dashboard analytics (admin only)
- `GET /sales` - Get sales analytics
- `GET /products` - Get product analytics
- `GET /customers` - Get customer analytics

### Security Features

#### Authentication & Authorization
- JWT-based authentication
- Role-based access control (User/Admin)
- Password hashing with bcryptjs
- Email verification system
- Password reset functionality

#### Security Middleware
- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Request sanitization (NoSQL injection prevention)
- XSS protection
- Parameter pollution prevention
- File upload validation

#### Data Validation
- Input validation with express-validator
- File type validation (images only)
- File size limits (5MB max)
- MongoDB injection prevention
- XSS attack prevention

### Cloudinary Integration

#### Image Management
- Automatic image optimization
- Multiple format support (JPEG, PNG, WebP, GIF)
- Responsive image generation
- Image transformation and effects
- Secure upload with API keys
- Automatic cleanup of unused images

#### Image Upload Process
1. Client uploads image to Cloudinary
2. Cloudinary returns secure URL
3. URL stored in MongoDB
4. Images served via Cloudinary CDN
5. Automatic optimization and caching

### Error Handling

#### Error Types
- **ValidationError**: Input validation failures
- **CastError**: Invalid data type conversions
- **DuplicateKeyError**: Unique constraint violations
- **AuthenticationError**: Invalid credentials
- **AuthorizationError**: Insufficient permissions
- **NotFoundError**: Resource not found
- **ServerError**: Internal server errors

#### Error Response Format
```javascript
{
  success: false,
  error: {
    message: "Error description",
    code: "ERROR_CODE",
    details: {}, // Additional error details
    timestamp: "2024-01-01T00:00:00.000Z"
  }
}
```

### Order Processing Flow

#### 1. Order Creation
```javascript
// When user clicks "Place Order"
POST /api/orders
{
  items: [
    {
      product: "product_id",
      quantity: 2,
      price: 29.99
    }
  ],
  shippingAddress: {
    firstName: "John",
    lastName: "Doe",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    phone: "+1234567890"
  },
  paymentMethod: "credit_card"
}
```

#### 2. Order Processing Steps
1. **Validation**: Validate order data and inventory
2. **Inventory Check**: Verify product availability
3. **Pricing Calculation**: Calculate totals, tax, shipping
4. **Order Creation**: Create order with pending status
5. **Inventory Update**: Reduce product quantities
6. **Confirmation**: Send order confirmation email
7. **Status Updates**: Track order through fulfillment

#### 3. Order Status Flow
```
pending → confirmed → processing → shipped → delivered
    ↓
cancelled (if cancelled before processing)
```

### Database Indexing

#### Performance Indexes
- **Users**: email (unique), role, createdAt
- **Products**: category, status, isBestseller, isNew, price
- **Orders**: user, status, createdAt, orderNumber (unique)
- **Reviews**: product, user, rating, createdAt
- **Categories**: slug (unique), isActive

### API Response Format

#### Success Response
```javascript
{
  success: true,
  data: {}, // Response data
  message: "Success message",
  meta: {
    pagination: {
      page: 1,
      limit: 10,
      total: 100,
      pages: 10
    }
  }
}
```

#### Pagination
- Default limit: 10 items per page
- Maximum limit: 100 items per page
- Page-based pagination
- Total count and page information included

### Environment Configuration

#### Required Environment Variables
- `NODE_ENV`: Environment (development/production/test)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `CORS_ORIGIN`: Frontend URL for CORS

### Testing Strategy

#### Test Types
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Complete workflow testing
- **Load Tests**: Performance testing

#### Test Coverage
- Authentication flows
- CRUD operations
- Error handling
- Security validations
- File upload functionality

### Deployment Considerations

#### Production Requirements
- MongoDB Atlas for database
- Cloudinary for image storage
- Environment variable management
- SSL certificate configuration
- CORS policy setup
- Rate limiting configuration

#### Monitoring
- Error logging and tracking
- Performance monitoring
- Database query optimization
- API response time tracking
- Security incident monitoring

## API Integration Status

### ✅ **Completed Integration**
- **Authentication System**: JWT-based auth with backend API
- **Product Management**: Full CRUD operations connected to backend
- **Order Processing**: Complete order lifecycle with backend API
- **User Management**: Registration, login, logout with backend
- **Error Handling**: Comprehensive error handling for API calls
- **Data Persistence**: Backend database with MongoDB

### 🔄 **API Service Layer**
- **productService.ts**: Handles all product-related API calls
- **authService.ts**: Manages authentication and user operations
- **orderService.ts**: Handles order creation and management
- **Error Handling**: Centralized error handling for all API calls
- **Token Management**: Automatic JWT token handling

### 🛠️ **Updated Components**
- **Redux Slices**: All slices now use real API endpoints
- **AuthContext**: Updated to use backend authentication
- **Checkout Page**: Order creation now uses backend API
- **Orders Page**: Displays orders from backend database
- **OrderDetail Page**: Shows detailed order information from API
- **Product Pages**: All product data now comes from backend

### 📡 **API Endpoints Connected**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/products` - Product listing with filtering
- `GET /api/products/:id` - Product details
- `POST /api/orders` - Order creation
- `GET /api/orders` - User orders
- `GET /api/orders/:id` - Order details

### 🚀 **How to Run the Integrated System**

1. **Start Backend:**
   ```bash
   cd Backend
   npm install
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd Frontend/radiant_bloom_frontend-main
   npm install
   npm run dev
   ```

3. **Test Integration:**
   - Open browser console
   - Run: `import testAPI from './src/utils/apiTest.ts'; testAPI();`

### 🔧 **Configuration Required**
- MongoDB database connection
- Cloudinary account for image storage
- JWT secret key for authentication
- CORS configuration for frontend-backend communication

## Recent UI/UX Improvements (Latest Update)

### 1. Admin Authentication & Navigation
- **Admin Login Flow**: When admin logs in, redirect directly to dashboard instead of showing text with avatar
- **Admin Avatar Dropdown**: Show avatar for admin users with dropdown menu containing:
  - View Orders
  - Edit Profile  
  - Logout
- **Admin Dashboard Access**: Only show admin dashboard link when admin is logged in
- **Conditional Visibility**: Admin-specific UI elements only visible to admin users

### 2. Currency System Update
- **Currency Symbol**: Changed from `$` to `Rs:` throughout the application
- **Price Display**: All price displays now show `Rs:` prefix
- **Admin Dashboard**: Revenue card shows `Rs:` instead of `$`
- **Product Cards**: Price display updated to `Rs:` format
- **Checkout Page**: Payment button shows `Rs:` instead of `$`
- **Cart Summary**: All price calculations display with `Rs:` currency

### 3. Guest Checkout Flow
- **Guest Shopping**: Users can browse and add items to cart without login
- **Checkout Process**: After adding items and entering shipping details
- **Login Prompt**: When user clicks "Place Order", show "Please login or register first"
- **Order Persistence**: Remember cart data during login process
- **Seamless Transition**: After login, redirect back to checkout with preserved data

### 4. Payment System Simplification
- **Manual Payment**: Removed payment gateway integration
- **No Payment Buttons**: Removed "Add to Card" and "Pay" buttons
- **Place Order Only**: Only show "Place Order" button for logged-in users
- **Order Management**: Orders go directly to admin dashboard for manual processing
- **Admin Order View**: Admin can view all orders in "View Orders" section

### 5. Admin Dashboard Enhancements
- **Beautiful Gradients**: Added gradient backgrounds to dashboard cards
- **App Color Scheme**: Used consistent orange/beauty theme colors
- **Revenue Card**: Updated with gradient and `Rs:` currency
- **Visual Appeal**: Enhanced card designs with proper color schemes

### 6. Product Form Improvements
- **Price Input Fields**: Removed increment/decrement spinner icons
- **Manual Input**: Admin can type prices directly without arrow controls
- **Placeholder Text**: Added appropriate placeholders for price fields
- **Clean Interface**: Simplified price input for better admin experience

### 7. Image Display Issues
- **Image Loading**: Fixed image display issues in product cards
- **Fallback Handling**: Proper handling when images fail to load
- **Product Details**: Show all product information even when images don't load
- **Admin Table**: Images display correctly in admin product management

### Implementation Details
- **Header Component**: Updated admin detection and dropdown menu
- **AuthContext**: Enhanced admin role handling
- **Checkout Flow**: Modified guest checkout with login requirement
- **Currency Utils**: Created utility functions for consistent currency formatting
- **Admin Forms**: Updated product form with manual price inputs
- **Dashboard Cards**: Enhanced with gradient backgrounds and proper styling

This documentation provides a comprehensive overview of the Radiant Bloom full-stack application, covering all major components, features, and technical aspects of both frontend and backend systems.
