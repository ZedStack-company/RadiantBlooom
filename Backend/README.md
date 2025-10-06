# Radiant Bloom Backend API

A professional Node.js, Express, and MongoDB backend for the Radiant Bloom beauty store e-commerce platform.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Product Management**: Full CRUD operations for beauty products
- **Order Processing**: Complete order lifecycle management
- **Image Storage**: Cloudinary integration for product images
- **Security**: Comprehensive security middleware and validation
- **Error Handling**: Professional error handling and logging
- **API Documentation**: Well-documented RESTful API endpoints

## Technology Stack

- **Node.js 18+** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MongoDB 8.0.3** - NoSQL database
- **Mongoose 8.0.3** - ODM for MongoDB
- **Cloudinary 1.41.0** - Image storage and management
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing

## Installation

1. Clone the repository
2. Navigate to the Backend directory
3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file based on `env.example`:
   ```bash
   cp env.example .env
   ```

5. Configure your environment variables in `.env`

6. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/radiant_bloom

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

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

## Order Processing Flow

When a user places an order, the following process occurs:

1. **Validation**: Order data and inventory are validated
2. **Inventory Check**: Product availability is verified
3. **Pricing Calculation**: Totals, tax, and shipping are calculated
4. **Order Creation**: Order is created with pending status
5. **Inventory Update**: Product quantities are reduced
6. **Confirmation**: Order confirmation is logged (email in production)

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Request sanitization
- XSS protection
- File upload validation

## Error Handling

The API uses a consistent error response format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## Development

- **Development Server**: `npm run dev`
- **Production Start**: `npm start`
- **Database Seeding**: `npm run seed`

## Testing

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
