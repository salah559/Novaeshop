# DZ Digital Market

## Overview

DZ Digital Market is a Next.js-based digital marketplace application designed for selling and purchasing digital products in Algeria. The platform uses manual payment processing via "بريدي موب" (Baridi Mob) with Firebase as the complete backend infrastructure. Users can browse products, make purchases by uploading payment receipts, and download their purchased digital products after admin confirmation.

## Recent Changes

**November 29, 2025 - Modern Vibrant Design & Animation Overhaul**
- ✅ **Brand-Based Color Scheme**: Updated to neon green (#39ff14) and gold (#ffd700) from logo
  - Stunning glowing effects on all interactive elements
  - Animated text with pulsing gradient backgrounds
  - Floating orbs in background with smooth animations
- ✅ **Enhanced Animations**: Added elaborate motion effects
  - Card hover effects with directional glow
  - Button shine and scale animations
  - Floating and pulsing icon animations
  - Smooth transitions with cubic-bezier timing
- ✅ **Redesigned Components**:
  - Header with glowing logo (neon gradient) and animated menu lines
  - Homepage with animated hero section and stats counter
  - Feature cards with floating animations and glow borders
  - Smooth step indicators with pulsing circles
- ✨ **Visual Impact**: Site now features premium animations that captivate and engage users

**November 29, 2025 - ImgBB Image Upload Integration**
- ✅ **ImgBB Integration**: Replaced Firebase Storage with ImgBB for receipt image uploads
  - Created API endpoint `/api/upload-image.ts` for secure server-side image upload
  - Converts customer receipt images to base64 and uploads to ImgBB
  - Returns permanent URL stored in Firestore orders collection
  - API key secured on server-side (never exposed to client)
- ✅ **Updated Checkout Flow**: Modified `pages/checkout.tsx` to use ImgBB
  - Removed Firebase Storage dependency for receipts
  - Added robust error handling for upload failures
  - Maintains same user experience with improved reliability
- 🔒 **Security**: ImgBB API key stored as environment secret

**October 22, 2025 - Professional Authentication Modal**
- ✅ **AuthModal Component**: Created comprehensive authentication modal (`components/AuthModal.tsx`)
  - Tab-based interface switching between Sign In and Sign Up modes
  - Multi-method authentication support: Email/Password, Phone, and Google
  - Professional design matching the site's green/dark theme with glow effects
  - Phone authentication with country code selector (13+ countries including Algeria +213)
  - SMS verification code input with 6-digit format
  - Password confirmation for sign-up with mismatch validation
  - Loading states and error handling built-in
  - Fully responsive modal with backdrop blur and smooth animations
- ✅ **Header Integration**: Updated Header component to use AuthModal
  - Login button now opens the professional modal instead of direct Google sign-in
  - State management for modal open/close
  - Preserved existing logout functionality
- ✅ **Complete Translations**: Added all authentication strings to `lib/translations.ts`
  - Arabic: signIn, signUp, welcomeBack, createAccount, email, phone, password, etc.
  - English and French equivalents for full multilingual support
  - All form labels, placeholders, buttons, and error messages translated
- ✅ **Documentation**: Created comprehensive `AUTH_SETUP.md` guide
  - Step-by-step Firebase integration instructions
  - Environment variables setup guide
  - Code examples for connecting authentication functions
  - Testing and deployment checklist
- 🔄 **Ready for Firebase**: Interface is production-ready pending Firebase credentials
  - All UI components and forms completed
  - Validation logic in place
  - TODO comments mark Firebase integration points
  - Designed for easy Firebase Auth, Phone, and Google provider connection

**October 19, 2025 - UI/UX Improvements**
- ✅ **Mobile Header Refinement**: Optimized mobile navigation UX in Header component
  - Always-visible login button on mobile (displayed alongside hamburger menu)
  - Fixed mobile menu overlay issue (eliminated blank strip when menu collapsed)
  - Dynamic maxHeight/padding/pointerEvents based on menu state
  - Smooth animations with proper state transitions
  - Improved visual hierarchy: Logo (left) → Language + Login + Hamburger (right, always visible)
- ✅ **Dropdown Language Selector**: Converted three separate language buttons (AR/EN/FR) into a single elegant dropdown menu in Header
  - Space-efficient design with globe icon and current language display
  - Smooth dropdown animation with hover effects
  - Auto-close on language selection
  - Visual checkmark indicator for active language
  - Mobile-responsive with consistent styling
- ✅ **Enhanced Checkout Flow**: Redesigned checkout page with step-by-step visual guide
  - Clear numbered steps (1: Transfer payment, 2: Take photo, 3: Upload receipt)
  - Added Baridi Mob account number display in highlighted box
  - Improved instruction clarity with better visual hierarchy
  - Removed confusing external email instructions
  - Better feedback messaging for signed-in users
  - Streamlined user experience for payment submission

**October 18, 2025 - Mobile Responsive Design Enhancements**
- ✅ **Hamburger Menu Navigation**: Implemented responsive mobile menu in Header component
  - Animated hamburger icon (3-line to X transformation)
  - Slide-down navigation panel on mobile devices
  - Touch-friendly full-width menu items
  - Auto-close on navigation
- ✅ **Responsive Typography**: Added comprehensive media queries in globals.css
  - Fluid text scaling using clamp() for all headings (h1, h2, h3)
  - Responsive button sizing (max-width: 300px on mobile)
  - Adaptive card padding (24px → 12px on small screens)
  - 16px minimum input font size to prevent iOS zoom
- ✅ **Homepage Mobile Optimization**: Enhanced index.tsx for mobile experience
  - Responsive hero section with clamp()-based spacing
  - Stacked CTAs on phones (< 480px)
  - Adaptive feature card grid (auto-fit minmax pattern)
  - Fluid icon sizing and spacing
- ✅ **Products Page Mobile UX**: Improved products/index.tsx responsiveness
  - Stacked search/filter controls on narrow screens (< 600px)
  - Full-width inputs and selects on mobile
  - Single-column product grid on small devices
  - Responsive product card images and text
- 📱 **Mobile-First Improvements**: All UI elements now scale smoothly from 320px to desktop

**October 17, 2025 - Major Feature Enhancements**
- ✅ **Customer Order Tracking**: Added `/orders` page allowing customers to view all their orders (pending/confirmed/rejected) with status indicators and rejection reasons
- ✅ **Enhanced Admin Dashboard**: Upgraded `/admin` with comprehensive statistics dashboard showing:
  - Real-time stats: pending orders, confirmed, rejected, total sales, and today's orders
  - Advanced order filtering by status (All, Pending, Confirmed, Rejected)
  - Order rejection capability with reason field stored in Firestore
  - Improved UI with status badges and color-coded indicators
- ✅ **Product Search & Filter System**: Enhanced `/products` page with:
  - Real-time search by product name
  - Category filtering
  - Price sorting (Low to High / High to Low)
  - Responsive grid layout improvements
- ✅ **How to Buy Guide**: Created comprehensive `/how-to-buy` FAQ page with step-by-step purchase instructions in Arabic
- ✅ **Bug Fixes**:
  - Fixed undefined crash in `pages/admin/products.tsx` with optional chaining for product descriptions
  - Fixed order query logic to merge both userId and email-based results (supports legacy orders)
- 🧹 **Code Cleanup**: Removed temporary test files and outdated documentation

**October 17, 2025 - Initial Migration from Vercel to Replit**
- Updated Next.js development and production scripts to bind to 0.0.0.0:5000 for Replit compatibility
- Added TypeScript path aliases configuration (@/*) in tsconfig.json
- Created styles/globals.css for global styling
- Updated all Link components to Next.js 13 format (removed legacy <a> tag wrapping)
- Configured development workflow for Replit with webview output
- Set up deployment configuration for autoscale deployment
- Fixed TypeScript strict mode warnings in cart.tsx
- All Firebase credentials moved to Replit Secrets for secure environment variable management
- ✅ Successfully connected Firebase Authentication, Firestore Database, and Storage
- ✅ All Firebase environment variables configured and working
- Created firestore.rules and storage.rules for database and storage security configuration

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework: Next.js 13 (Pages Router)**
- **Rationale**: Chosen for server-side rendering capabilities, API routes, and seamless TypeScript integration
- **Routing**: Traditional pages directory structure for straightforward routing
- **State Management**: React hooks with local state, no global state management library
- **Data Fetching**: SWR for client-side data fetching with automatic revalidation

**UI Approach**
- Custom CSS (globals.css) with inline styling and comprehensive media queries
- No UI framework/library - lightweight custom components
- Bilingual interface (Arabic/English) with Arabic as primary language
- **Fully responsive design** using CSS clamp(), auto-fit grids, and mobile-first breakpoints
- Mobile navigation with animated hamburger menu (< 768px)
- Fluid typography and spacing that scales from 320px to 4K displays
- Touch-optimized controls (minimum 44px tap targets on mobile)

### Backend Architecture

**Firebase Integration (Dual Mode)**

1. **Client-Side (Browser)**
   - Firebase SDK v9 modular approach
   - Authentication: Google OAuth and Email/Password
   - Firestore for real-time data operations
   - Storage for file uploads (receipts, product files)

2. **Server-Side (API Routes)**
   - Firebase Admin SDK for privileged operations
   - Service account authentication
   - Secure order confirmation and purchase creation
   - Signed URL generation for protected file downloads

**API Routes Structure**
- `/api/admin/list-orders`: Fetch pending orders for admin review
- `/api/admin/confirm-order`: Process payment confirmation and create purchases

### Data Architecture

**Firestore Collections**

1. **products**
   - Fields: name, description, price, category, imageUrl, filePath/fileUrl
   - Stores digital product catalog

2. **orders**
   - Fields: userId, items[], total, paymentImageUrl, email, status, createdAt
   - Tracks purchase orders with payment receipts
   - Status: 'pending' → 'confirmed'

3. **purchases**
   - Fields: userId, productId, name, downloadUrl, createdAt
   - Created after admin confirms payment
   - Provides download access to purchased products

4. **messages**
   - Fields: name, email, message, fileUrl, createdAt
   - Contact form submissions with optional attachments

**Storage Strategy**
- `/receipts/`: Payment receipt images uploaded by customers
- `/messages/`: Contact form attachments
- Product files: Referenced by filePath, served via signed URLs

### Authentication & Authorization

**Authentication Methods**
- Google OAuth via Firebase Authentication
- Email/Password registration and login
- Session management via Firebase onAuthStateChanged

**Authorization Pattern**
- Client-side: Auth state determines UI visibility
- Server-side: Admin operations use Firebase Admin SDK
- No role-based access control (assumes trusted admin access)

### Payment Flow

**Manual Payment Processing**
1. User adds products to cart (localStorage)
2. User uploads payment receipt image to checkout
3. Order created in Firestore with 'pending' status
4. Admin reviews receipt in admin panel
5. Admin confirms → System creates purchase records with download URLs
6. User accesses downloads in "My Purchases" section

**Design Decision**: Manual payment verification chosen to accommodate local payment methods (Baridi Mob) not supported by standard payment processors

### File Delivery System

**Product Download Mechanism**
- Products store filePath reference in Firestore
- On order confirmation, Firebase Storage generates time-limited signed URLs (24-hour expiry)
- Signed URLs stored in purchases collection for user access
- Alternative: Direct fileUrl if product uses external hosting

## External Dependencies

### Core Services

**Firebase (Primary Backend)**
- **Authentication**: User identity management (Google OAuth, Email/Password)
- **Firestore**: NoSQL document database for all application data
- **Storage**: Object storage for receipts and digital product files
- **Admin SDK**: Server-side privileged operations

**Environment Variables Required**
- Client config: API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID
- Server config: FIREBASE_SERVICE_ACCOUNT (JSON or path)

### Deployment Platform

**Replit (Current Platform)**
- Next.js runs on port 5000 bound to 0.0.0.0 for proxy compatibility
- Environment variables managed via Replit Secrets
- Development server configured with workflow
- Autoscale deployment for production (stateless web app)
- Firebase credentials stored securely in Replit Secrets

### NPM Packages

**Runtime Dependencies**
- `firebase@9.22.1`: Client SDK
- `firebase-admin@11.11.0`: Server SDK  
- `react-hook-form@7.43.9`: Form validation
- `axios@1.4.0`: HTTP client for admin API calls
- `swr@2.2.0`: Client-side data fetching

**Development**
- `typescript@5.6.2`: Type safety
- `@types/react@19.2.2`: React type definitions

### Third-Party Integrations

**Payment System**: Baridi Mob (manual/offline)
- No API integration
- Receipt upload and manual verification workflow