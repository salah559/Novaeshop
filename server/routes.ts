import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { db } from "./db";
import { products } from "@shared/schema";
import { eq } from "drizzle-orm";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
const upload = multer({ 
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // ==================== PRODUCTS ====================
  
  // Get all products or filter by category
  app.get('/api/products', async (req, res) => {
    try {
      const { category } = req.query;
      let productList = await storage.getAllProducts();
      
      if (category && category !== 'all') {
        productList = productList.filter(p => p.category === category);
      }
      
      res.json(productList);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // Get featured products
  app.get('/api/products/featured', async (req, res) => {
    try {
      const featured = await storage.getFeaturedProducts();
      res.json(featured);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch featured products' });
    }
  });

  // Get best sellers
  app.get('/api/products/bestsellers', async (req, res) => {
    try {
      const bestSellers = await storage.getBestSellers();
      res.json(bestSellers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch best sellers' });
    }
  });

  // Get product by ID
  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  // ==================== ORDERS ====================
  
  // Create order with payment image upload
  app.post('/api/orders', upload.single('paymentImage'), async (req, res) => {
    try {
      const { fullName, email, phone, productIds, totalPrice } = req.body;
      const paymentImageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const order = await storage.createOrder({
        userId: 'guest', // TODO: Get from session
        productIds: JSON.parse(productIds),
        totalPrice: parseInt(totalPrice),
        paymentImageUrl,
        fullName,
        email,
        phone: phone || null,
        status: 'pending',
      });

      res.json(order);
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  // ==================== PURCHASES ====================
  
  // Get user purchases (with product details)
  app.get('/api/purchases', async (req, res) => {
    try {
      // TODO: Get userId from session
      const userId = 'guest';
      const userPurchases = await storage.getPurchasesByUserId(userId);
      
      // Fetch product details for each purchase
      const purchasesWithProducts = await Promise.all(
        userPurchases.map(async (purchase) => {
          const product = await storage.getProductById(purchase.productId);
          return {
            ...purchase,
            product,
          };
        })
      );

      res.json(purchasesWithProducts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch purchases' });
    }
  });

  // ==================== MESSAGES ====================
  
  // Create message
  app.post('/api/messages', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      const newMessage = await storage.createMessage({
        name,
        email,
        subject,
        message,
        fileUrl: null, // TODO: Handle file uploads
      });

      res.json(newMessage);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  // ==================== ADMIN ROUTES ====================
  
  // Get all orders (admin)
  app.get('/api/admin/orders', async (req, res) => {
    try {
      const allOrders = await storage.getAllOrders();
      res.json(allOrders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // Confirm order (admin)
  app.post('/api/admin/orders/:id/confirm', async (req, res) => {
    try {
      const order = await storage.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Update order status
      await storage.updateOrderStatus(req.params.id, 'confirmed');

      // Create purchases for each product in the order
      for (const productId of order.productIds) {
        const product = await storage.getProductById(productId);
        if (product) {
          await storage.createPurchase({
            userId: order.userId,
            productId,
            orderId: order.id,
            downloadUrl: product.downloadUrl,
            status: 'active',
          });

          // Update product sold count
          await storage.updateProductSoldCount(productId);
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Order confirmation error:', error);
      res.status(500).json({ error: 'Failed to confirm order' });
    }
  });

  // Reject order (admin)
  app.post('/api/admin/orders/:id/reject', async (req, res) => {
    try {
      await storage.updateOrderStatus(req.params.id, 'rejected');
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to reject order' });
    }
  });

  // Get all products (admin)
  app.get('/api/admin/products', async (req, res) => {
    try {
      const allProducts = await storage.getAllProducts();
      res.json(allProducts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // Create product (admin)
  app.post('/api/admin/products', async (req, res) => {
    try {
      const { name, description, price, category, imageUrl, downloadUrl, isFeatured } = req.body;
      
      const product = await storage.createProduct({
        name,
        description,
        price: parseInt(price),
        category,
        imageUrl,
        downloadUrl,
        isFeatured: isFeatured || 0,
      });

      res.json(product);
    } catch (error) {
      console.error('Product creation error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  // Delete product (admin)
  app.delete('/api/admin/products/:id', async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // Get all messages (admin)
  app.get('/api/admin/messages', async (req, res) => {
    try {
      const allMessages = await storage.getAllMessages();
      res.json(allMessages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
