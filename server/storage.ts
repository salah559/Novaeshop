import { db } from './firestore';
import { 
  type User, type Product, type Order, type Purchase, type Message,
  type InsertUser, type InsertProduct, type InsertOrder, type InsertPurchase, type InsertMessage
} from '@shared/schema';
import { FieldValue } from 'firebase-admin/firestore';

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getBestSellers(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  updateProductSoldCount(id: string): Promise<void>;
  
  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<void>;
  
  // Purchases
  getPurchasesByUserId(userId: string): Promise<Purchase[]>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  
  // Messages
  getAllMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class FirestoreStorage implements IStorage {
  // =============== USERS ===============
  
  async getUser(id: string): Promise<User | undefined> {
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data(), createdAt: doc.data()?.createdAt?.toDate() } as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate() } as User;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const snapshot = await db.collection('users').where('firebaseUid', '==', firebaseUid).limit(1).get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate() } as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const docRef = await db.collection('users').add({
      ...insertUser,
      createdAt: FieldValue.serverTimestamp(),
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data(), createdAt: doc.data()?.createdAt?.toDate() } as User;
  }

  // =============== PRODUCTS ===============

  async getAllProducts(): Promise<Product[]> {
    const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as Product[];
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const doc = await db.collection('products').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data(), createdAt: doc.data()?.createdAt?.toDate() } as Product;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const snapshot = await db.collection('products')
      .where('isFeatured', '==', 1)
      .orderBy('createdAt', 'desc')
      .limit(3)
      .get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as Product[];
  }

  async getBestSellers(): Promise<Product[]> {
    const snapshot = await db.collection('products')
      .orderBy('soldCount', 'desc')
      .limit(6)
      .get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as Product[];
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const docRef = await db.collection('products').add({
      ...insertProduct,
      soldCount: 0,
      createdAt: FieldValue.serverTimestamp(),
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data(), createdAt: doc.data()?.createdAt?.toDate() } as Product;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.collection('products').doc(id).delete();
  }

  async updateProductSoldCount(id: string): Promise<void> {
    await db.collection('products').doc(id).update({
      soldCount: FieldValue.increment(1)
    });
  }

  // =============== ORDERS ===============

  async getAllOrders(): Promise<Order[]> {
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as Order[];
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const doc = await db.collection('orders').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data(), createdAt: doc.data()?.createdAt?.toDate() } as Order;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const docRef = await db.collection('orders').add({
      ...insertOrder,
      createdAt: FieldValue.serverTimestamp(),
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data(), createdAt: doc.data()?.createdAt?.toDate() } as Order;
  }

  async updateOrderStatus(id: string, status: string): Promise<void> {
    await db.collection('orders').doc(id).update({ status });
  }

  // =============== PURCHASES ===============

  async getPurchasesByUserId(userId: string): Promise<Purchase[]> {
    const snapshot = await db.collection('purchases')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as Purchase[];
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const docRef = await db.collection('purchases').add({
      ...insertPurchase,
      createdAt: FieldValue.serverTimestamp(),
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data(), createdAt: doc.data()?.createdAt?.toDate() } as Purchase;
  }

  // =============== MESSAGES ===============

  async getAllMessages(): Promise<Message[]> {
    const snapshot = await db.collection('messages').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as Message[];
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const docRef = await db.collection('messages').add({
      ...insertMessage,
      createdAt: FieldValue.serverTimestamp(),
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data(), createdAt: doc.data()?.createdAt?.toDate() } as Message;
  }
}

export const storage = new FirestoreStorage();
