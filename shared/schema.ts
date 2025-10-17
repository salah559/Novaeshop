import { z } from "zod";

// User schema
export const insertUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  firebaseUid: z.string(), // Firebase Auth UID
  role: z.enum(["user", "admin"]).default("user"),
});

export const userSchema = insertUserSchema.extend({
  id: z.string(),
  createdAt: z.date(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof userSchema>;

// Product schema
export const insertProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().int().positive(), // Price in DZD
  category: z.enum(["courses", "videos", "books", "wordpress", "chatgpt", "packs"]),
  imageUrl: z.string().url(),
  downloadUrl: z.string().url(), // Direct download link
  isFeatured: z.number().int().min(0).max(1).default(0), // 1 for featured, 0 for normal
});

export const productSchema = insertProductSchema.extend({
  id: z.string(),
  soldCount: z.number().int().default(0), // Track sales
  createdAt: z.date(),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = z.infer<typeof productSchema>;

// Order schema
export const insertOrderSchema = z.object({
  userId: z.string(),
  productIds: z.array(z.string()).min(1), // Array of product IDs
  totalPrice: z.number().int().positive(),
  paymentImageUrl: z.string().optional(), // URL to uploaded payment receipt
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  status: z.enum(["pending", "confirmed", "rejected"]).default("pending"),
});

export const orderSchema = insertOrderSchema.extend({
  id: z.string(),
  createdAt: z.date(),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = z.infer<typeof orderSchema>;

// Purchase schema (after order confirmation)
export const insertPurchaseSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  orderId: z.string(),
  downloadUrl: z.string().url(),
  status: z.enum(["active"]).default("active"),
});

export const purchaseSchema = insertPurchaseSchema.extend({
  id: z.string(),
  createdAt: z.date(),
});

export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = z.infer<typeof purchaseSchema>;

// Message schema (contact form)
export const insertMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
  fileUrl: z.string().optional(), // Optional attachment
});

export const messageSchema = insertMessageSchema.extend({
  id: z.string(),
  createdAt: z.date(),
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = z.infer<typeof messageSchema>;

// Category options
export const categories = [
  { value: "courses", label: "كورسات تعليمية", labelEn: "Courses" },
  { value: "videos", label: "فيديوهات 4K", labelEn: "Videos 4K" },
  { value: "books", label: "كتب إلكترونية", labelEn: "E-Books" },
  { value: "wordpress", label: "قوالب WordPress", labelEn: "WordPress Templates" },
  { value: "chatgpt", label: "أدوات ChatGPT", labelEn: "ChatGPT Tools" },
  { value: "packs", label: "Packs كاملة", labelEn: "Complete Packs" },
] as const;
