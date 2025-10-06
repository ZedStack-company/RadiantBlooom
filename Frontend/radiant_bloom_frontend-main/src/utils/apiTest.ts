// Simple API test utility
import { productService } from '@/services/productService';
import { authService } from '@/services/authService';
import { orderService } from '@/services/orderService';

export const testAPI = async () => {
  console.log('🧪 Testing API Integration...');
  
  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test 2: Get products
    console.log('2. Testing products API...');
    const productsResponse = await productService.getProducts();
    console.log('✅ Products loaded:', productsResponse.products.length, 'products');
    
    // Test 3: Get featured products
    console.log('3. Testing featured products...');
    const featuredProducts = await productService.getFeaturedProducts();
    console.log('✅ Featured products:', featuredProducts.length, 'products');
    
    // Test 4: Test authentication (register)
    console.log('4. Testing user registration...');
    try {
      const testUser = {
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      };
      const authResponse = await authService.register(testUser);
      console.log('✅ User registered:', authResponse.user.email);
      
      // Test 5: Test login
      console.log('5. Testing user login...');
      const loginResponse = await authService.login({
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ User logged in:', loginResponse.user.email);
      
      // Test 6: Test order creation (if we have products)
      if (productsResponse.products.length > 0) {
        console.log('6. Testing order creation...');
        const testOrder = {
          items: [{
            product: productsResponse.products[0].id,
            quantity: 1,
            price: productsResponse.products[0].price
          }],
          shippingAddress: {
            firstName: 'Test',
            lastName: 'User',
            street: '123 Test St',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            country: 'USA',
            phone: '123-456-7890'
          },
          paymentMethod: 'credit_card',
          notes: 'Test order'
        };
        
        const orderResponse = await orderService.createOrder(testOrder);
        console.log('✅ Order created:', orderResponse.orderNumber);
      }
      
    } catch (authError) {
      console.log('⚠️ Auth test failed (expected if user already exists):', authError);
    }
    
    console.log('🎉 API Integration Test Complete!');
    
  } catch (error) {
    console.error('❌ API Test Failed:', error);
  }
};

// Export for use in browser console or components
export default testAPI;
