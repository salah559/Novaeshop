# DZ Digital Market

## Overview

DZ Digital Market is a Next.js digital marketplace for selling and purchasing digital products in Algeria. It features manual payment processing via "بريدي موب" (Baridi Mob) and uses Firebase as a complete backend solution. Users can browse products, make purchases by uploading payment receipts, and download products after admin confirmation. The platform aims to provide a robust and user-friendly experience for digital transactions tailored to the Algerian market.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Performance & UX Enhancements (November 29, 2025)

### Navigation Performance
- ✅ **Route Transition Indicator**: Added progress bar at top of page during navigation (neon green gradient)
- ✅ **Automatic Prefetching**: Next.js 13+ prefetches routes automatically on viewport intersection
- ✅ **Loading State Management**: Tracks route changes with immediate visual feedback

### Rendering Optimizations
- ✅ **useMemo**: Products filtering, sorting, and categories memoized
- ✅ **useCallback**: Handler functions memoized to prevent re-renders
- ✅ **ProductCard Component**: Separated into memo'd component to prevent re-renders of all cards when one updates
- ✅ **Lazy Loading**: Images load on-demand with `loading="lazy"`

### Data Caching
- ✅ **Cache System** (`lib/cache.ts`): 10-minute TTL cache for product data (5-min for user data)
- ✅ **Reduced Firebase Calls**: Products and user data cached after first fetch

### Removed Loading Animation
- ✅ Removed 3D loading screens for faster perceived performance
- ✅ Pages load content immediately (caching ensures fast loads)

## System Architecture

### Frontend Architecture

**Framework**: Next.js 13 (Pages Router) for server-side rendering, API routes, and TypeScript integration.
**UI Approach**: Custom CSS with inline styling and comprehensive media queries, no UI framework. The design is fully responsive, bilingual (Arabic/English with Arabic primary), and optimized for mobile-first interaction with fluid typography and touch-optimized controls.
**State Management**: Primarily React hooks with local state.
**Data Fetching**: SWR for client-side data fetching.

### Backend Architecture

**Firebase Integration (Dual Mode)**:
- **Client-Side**: Firebase SDK v9 for authentication (Google OAuth, Email/Password), Firestore for real-time data, and Storage for file uploads.
- **Server-Side**: Firebase Admin SDK via API routes for privileged operations like secure order confirmation, purchase creation, and signed URL generation for protected downloads.

**API Routes Structure**: Includes endpoints for admin order management (listing, confirming) and image uploads.

### Data Architecture

**Firestore Collections**:
- `products`: Digital product catalog (name, description, price, category, imageUrl, filePath/fileUrl).
- `orders`: Tracks purchase orders with payment receipts (userId, items[], total, paymentImageUrl, email, status, createdAt). Status: 'pending' -> 'confirmed'.
- `purchases`: Records confirmed purchases (userId, productId, name, downloadUrl, createdAt) for download access.
- `messages`: Stores contact form submissions.

**Storage Strategy**: Firebase Storage for `/receipts/` (customer payment receipts) and `/messages/` (contact form attachments). Product files are referenced by `filePath` and served via signed URLs.

### Authentication & Authorization

**Authentication Methods**: Google OAuth and Email/Password via Firebase Authentication.
**Authorization Pattern**: Client-side UI visibility based on auth state; server-side admin operations use Firebase Admin SDK.

### Payment Flow

**Manual Payment Processing**: Users add products to cart, upload a payment receipt image (e.g., from Baridi Mob), and an order is created with 'pending' status. An admin reviews the receipt, confirms the payment, and the system creates purchase records with download URLs for the user.

### File Delivery System

**Product Download Mechanism**: Product files are referenced in Firestore. Upon order confirmation, Firebase Storage generates time-limited (24-hour) signed URLs, which are stored in the `purchases` collection for user download access.

## External Dependencies

### Core Services

**Firebase (Primary Backend)**:
- **Authentication**: User identity management.
- **Firestore**: NoSQL document database.
- **Storage**: Object storage for receipts and digital product files.
- **Admin SDK**: Server-side privileged operations.

### Deployment Platform

**Replit**: Used for hosting, with Next.js running on port 5000. Environment variables are managed via Replit Secrets.

### NPM Packages

**Runtime**:
- `firebase`: Client SDK.
- `firebase-admin`: Server SDK.
- `react-hook-form`: Form validation.
- `axios`: HTTP client.
- `swr`: Client-side data fetching.

**Development**:
- `typescript`: Type safety.
- `@types/react`: React type definitions.

### Third-Party Integrations

**Payment System**: Baridi Mob (manual/offline). No direct API integration; relies on receipt upload and manual verification.
**Image Upload**: ImgBB for receipt and product image uploads via secure server-side API endpoint (`/api/upload-image`).

## Admin Panel Updates (November 29, 2025)

### Product Management
- ✅ **Image Upload**: Admin can now upload product images directly via ImgBB (same API as receipt uploads)
- ✅ **Success Message**: Replaced "Download Link" with "Success Message" field - text shown to user after purchase
- ✅ **Edit & Delete Buttons**: Functional admin buttons for product management
- ✅ **Form Validation**: Required fields for all product inputs
- ✅ **Image Preview**: Shows uploaded image thumbnail in form

### Data Structure
**Products Collection Fields**:
- `name`: Product name
- `description`: Product description
- `price`: Price in DZA
- `category`: Product category
- `imageUrl`: ImgBB image URL (uploaded via file input)
- `successMessage`: Message displayed to customer after purchase confirmation