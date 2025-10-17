# Design Guidelines: DZ Digital Market

## Design Approach
**Custom Reference-Based Design** - The design is inspired by the concept of "clean money and quiet ambition" with a distinct Algerian digital marketplace identity. This is NOT following a standard design system but a unique, carefully crafted aesthetic.

## Core Design Elements

### A. Color Palette

**Primary Colors:**
- Background: Light green gradient transitioning to transparent black
- Base green: `145 60% 45%` (medium-light green)
- Gradient end: `145 20% 8%` (near-black with green tint)
- Text primary: `0 0% 95%` (off-white)
- Text secondary: `0 0% 70%` (light gray)

**Accent Colors:**
- Button primary: `145 70% 50%` (vibrant green with glow effect on hover)
- Success states: `145 65% 55%`
- Pending/waiting: `40 10% 50%` (neutral gray)
- Error/reject: `0 65% 50%`

**Dark Mode:** Site operates primarily in dark mode aesthetic with the green-to-black gradient as foundation.

### B. Typography

**Font Families:**
- Primary: 'Tajawal' (preferred) or 'Cairo' (fallback)
- Import from Google Fonts
- Character set: Arabic and Latin

**Type Scale:**
- Hero headlines: text-5xl to text-6xl, font-bold
- Section headers: text-3xl to text-4xl, font-semibold  
- Product titles: text-xl, font-medium
- Body text: text-base to text-lg
- Small text: text-sm

**Right-to-Left (RTL) Support:**
- All layouts must support dir="rtl" for Arabic content
- Text alignment: right for Arabic, appropriate spacing adjustments

### C. Layout System

**Spacing Primitives:**
Use Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24 primarily
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-20
- Grid gaps: gap-4, gap-6, gap-8
- Container max-width: max-w-7xl with px-4 horizontal padding

**Grid System:**
- Product cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Feature sections: grid-cols-1 md:grid-cols-3
- Responsive breakpoints: sm:640px, md:768px, lg:1024px, xl:1280px

### D. Component Library

**Navigation Header:**
- Fixed at top with backdrop-blur
- Logo on right (RTL), navigation links centered, login/cart on left
- Links: Home, Products, Purchases, Contact, Login
- Shopping cart icon with badge showing item count

**Hero Banner:**
- Animated gradient background (subtle movement)
- Large headline text with green glow effect
- Compelling CTA: "اكتشف المنتجات" (Discover Products)
- Height: min-h-[70vh] to min-h-[80vh]

**Product Cards:**
- Rounded corners: rounded-xl
- Semi-transparent background with border
- Product thumbnail image at top
- Title, price (DZD), category
- Two buttons: "Add to Cart" and "View Details"
- Hover effect: subtle scale and glow

**Buttons:**
- Primary: Vibrant green background with glow effect on hover
- Border radius: rounded-lg
- Padding: px-6 py-3 for standard, px-8 py-4 for CTA
- Hover: transform scale-105 and enhanced glow/shadow
- Disabled: opacity-50 with no interaction

**Forms:**
- Input fields: Dark background with light border
- Focus state: Green border glow
- Labels: Above inputs, text-sm
- File upload: Drag-and-drop with preview
- Validation: Inline error messages in red

**Cards/Containers:**
- Background: Semi-transparent dark with backdrop-blur-sm
- Border: 1px solid rgba(255,255,255,0.1)
- Shadow: Subtle green-tinted shadow
- Border radius: rounded-lg to rounded-xl

**Status Badges:**
- "Pending Review": Gray background, text-sm, rounded-full
- "Confirmed": Green background with check icon
- "Rejected": Red background with X icon

**Admin Dashboard:**
- Sidebar navigation with icons
- Data tables with alternating row colors
- Action buttons: Confirm (green), Reject (red), Edit (blue)
- Order cards showing payment proof image, user details, products

**Footer:**
- Dark background with green accent elements
- Three columns: Quick Links, Contact Info, Social Media
- Payment methods display (Baridi Mob, CCP icons)
- Copyright notice

### E. Animations & Interactions

**Use Sparingly:**
- Hero banner: Subtle gradient animation (slow, continuous)
- Product cards: Gentle hover scale (scale-105) and shadow increase
- Buttons: Smooth glow effect on hover (transition-all duration-300)
- Page transitions: Fade in elements on scroll (intersection observer)
- NO autoplay carousels, NO distracting animations

**Loading States:**
- Skeleton screens for product grids
- Spinner for form submissions (green color)
- Progress indicator for file uploads

## Page-Specific Guidelines

### Home Page:
- Full-width hero with animated gradient
- Featured packs section: 3-column grid
- "Most Sold" products: 4-column grid with real data from Supabase
- "Current Offers": Highlighted with discount badges
- All sections properly spaced with py-16 to py-20

### Products Page:
- Category filter tabs at top
- Product grid with consistent card heights
- Pagination or infinite scroll
- Filter sidebar (optional): Price range, category

### Cart Page:
- Product list with thumbnail, name, price, remove button
- Total calculation prominently displayed
- "Continue Shopping" and "Proceed to Payment" buttons

### Payment Page:
- Display Baridi Mob account number clearly
- Step-by-step payment instructions
- Upload payment receipt with image preview
- Confirmation form: Name, Email, Phone (optional)
- Submit button disabled until receipt uploaded

### My Purchases:
- List/grid of purchased products
- Status indicators with colors
- Download buttons for confirmed products
- Empty state with encouraging message

### Admin Dashboard:
- Orders table with sortable columns
- Payment proof images displayed inline or modal
- Quick action buttons on each order
- Product management: Add/Edit/Delete
- User management section

## Images

**Hero Section:**
- Large hero background image showing digital products, money, or success imagery
- Should be overlaid with gradient to maintain text readability
- Dimensions: Minimum 1920x1080, optimized for web

**Product Thumbnails:**
- Consistent aspect ratio: 4:3 or 1:1
- Size: 300x300px minimum
- Placeholder images for products without custom images

**Icons:**
- Use Font Awesome or Heroicons via CDN
- Consistent icon size within components
- Green color for primary icons, white/gray for secondary

**Payment Proof:**
- Display uploaded receipt images in admin dashboard
- Thumbnail view with click to enlarge
- Support common formats: JPG, PNG, PDF

## Accessibility & Localization

- Full RTL support for Arabic language
- High contrast between text and background
- Keyboard navigation support
- ARIA labels for interactive elements
- Screen reader-friendly status messages
- Alternative language toggle (Arabic/French) consideration