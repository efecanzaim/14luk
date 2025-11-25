# 14'lük - E-commerce Web Application

## 📋 Project Overview

14luk is a modern e-commerce web application developed for the promotion and sales of 585 karat gold products guaranteed by Altın Anne Users can explore 14luk products in square, round, heart, and clover forms, perform product verification, and submit dealer request forms.

## 🚀 Live Demo

**Website:** [https://14luk.com/](https://14luk.com/)

## 🛠️ Technologies Used

### Frontend Framework & Libraries
- **React 19.1.1** - Modern UI development
- **TypeScript 4.9.5** - Type safety and code quality
- **React Router DOM 7.8.2** - SPA routing management
- **React Icons 5.5.0** - Icon library
- **Lucide React 0.542.0** - Modern icon set

### Animation & Visual Effects
- **GSAP 3.13.0** - Professional animations
- **Motion 12.23.12** - Smooth transitions
- **Three.js 0.179.1** - 3D graphics
- **React Three Fiber 9.3.0** - React-Three.js integration
- **Swiper 12.0.1** - Touch slider components

### Styling & UI
- **CSS3** - Custom styling and responsive design
- **CSS Grid & Flexbox** - Modern layout systems
- **CSS Animations** - Keyframe animations
- **Media Queries** - Responsive design

### Backend & Data Management
- **PHP 7.4+** - Server-side processing with PDO
- **MySQL Database** - Relational database with optimized indexing
- **RESTful API** - JSON-based API architecture
- **Multi-User Authentication** - Role-based access control (RBAC)
- **Password Hashing** - bcrypt encryption (password_hash)
- **Session Management** - Secure session-based authentication
- **Prepared Statements** - SQL injection prevention
- **CORS Protection** - Origin-based access control
- **Rate Limiting** - Request throttling for spam prevention
- **Audit Logging** - Complete activity tracking system
- **Google Apps Script** - Form submission handling

### SEO & Analytics
- **React Helmet Async 2.0.5** - Dynamic meta tags for each page
- **React-Snap 1.23.0** - Pre-rendering for better SEO
- **Google Analytics** - User tracking and analytics
- **Sitemap.xml** - Search engine indexing
- **Robots.txt** - Search engine directives

### Real-time Data & APIs
- **Socket.IO Client 4.8.1** - Real-time gold price updates
- **Haremin API Integration** - Live gold market data
- **Custom Price Collector Service** - Automated price fetching
- **Chart.js Integration** - Price history visualization

### Development & Deployment
- **Create React App** - Project scaffolding
- **GitHub Pages** - Automatic deployment
- **ESLint** - Code quality control
- **TypeScript** - Static type checking

## 🎯 Features

### 🏠 Homepage
- **Real-time Gold Prices** - Live price updates via Socket.IO
- **14'lük Price Calculator** - Automatic 14 karat gold pricing (Buy: × 0.580, Sell: × 0.635)
- **Price History Charts** - Interactive price visualization
- **Hero Section** - Impressive entrance animation with Silk effect
- **Product Showcase** - Animated card components with GSAP
- **Responsive Design** - Mobile-first approach

### 📦 Products Page
- 4 different product categories (Square, Round, Heart, Clover)
- Dynamic product cards
- "Coming Soon" status management
- Mobile-optimized grid layout

### 🔍 Certificate Verification System
- **MySQL-Powered Backend** - Production-ready certificate verification
- **RESTful API Architecture** - Secure PHP backend with JSON responses
- **Real-time Database Queries** - Instant certificate validation
- **Multi-User Admin Panel** - Role-based access with audit logging
- **Security Features:**
  - SQL Injection prevention (Prepared Statements)
  - CORS protection with origin whitelisting
  - Rate limiting (10 requests/minute)
  - Password hashing with bcrypt
  - Session-based authentication
  - First-login password change enforcement
- **Activity Logging** - Complete audit trail with user tracking
- **Admin Dashboard** - Modern UI for certificate management
- **CSV Bulk Import** - Efficient mass certificate upload
- **Dynamic Product Display** - Certificate-based product image rendering
- **Animated UI Feedback** - Loading states, success/error animations

### 📝 Request Form
- Google Sheets integration
- Form validation
- Loading states
- Success/error messages
- Responsive form design

### 📰 Press Coverage
- News cards
- External link management
- Image optimization
- Responsive layout

### ❓ FAQ & About
- Accordion-style FAQ
- Detailed information pages
- SEO-optimized content

## 🏗️ Project Structure

```
14luk/
├── src/                    # Frontend (React)
│   ├── components/         # Reusable components
│   │   ├── CardSwap.tsx   # Animated card component with GSAP
│   │   ├── ChartModal.tsx # Price history chart modal
│   │   ├── FixedNavbar.tsx# Fixed navigation with scroll effects
│   │   ├── Footer.tsx     # Footer component
│   │   └── Silk.tsx       # 3D silk effect background (Three.js)
│   ├── pages/             # Page components (SEO optimized)
│   │   ├── Home.tsx       # Homepage with real-time prices
│   │   ├── Products.tsx   # Products page
│   │   ├── Dogrulama.tsx  # Verification page (API consumer)
│   │   ├── TalepFormu.tsx # Dealer request form
│   │   ├── About.tsx      # About us
│   │   ├── FAQ.tsx        # FAQ with accordion
│   │   ├── Press.tsx      # Press coverage
│   │   └── Trust.tsx      # Trust and quality
│   ├── services/          # Business logic
│   │   └── priceCollector.ts # Price fetching service
│   ├── App.tsx            # Main application component with Helmet Provider
│   └── index.tsx          # Application entry point with hydration
│
├── backend/               # Backend (PHP + MySQL)
│   ├── config/
│   │   ├── db.php        # Database connection (PDO)
│   │   ├── rate_limit.php# Rate limiting system
│   │   └── csrf.php      # CSRF protection
│   ├── api/
│   │   ├── verify.php    # Certificate verification API
│   │   ├── save_prices.php # Price saving API
│   │   ├── get_price_history.php # Price history API
│   │   └── .htaccess     # API security rules
│   ├── admin/
│   │   ├── import.php    # Admin panel & CSV import
│   │   └── .htaccess     # Admin security rules
│   ├── cron/
│   │   ├── collect_prices_direct.php # Price collection script
│   │   └── fetch-prices.js # Socket.IO price fetcher
│   ├── database.sql      # MySQL schema & initial data
│   └── excel_template.csv# CSV import template
│
└── public/               # Static assets
    ├── .htaccess         # URL rewriting for React Router
    ├── sitemap.xml       # SEO sitemap
    ├── robots.txt        # Search engine directives
    └── [images]          # Product images
```

## 🎨 Design Features

### Responsive Design
- **Mobile First** approach
- **Breakpoints:** 480px, 768px, 1024px
- **Flexible Grid System**
- **Touch-friendly** interface

### Animations
- **GSAP** for professional animations
- **CSS Keyframes** for micro-interactions
- **Loading states** and **transition effects**
- **Hover effects** and **scroll animations**

### UI/UX
- **Modern and clean** design
- **Accessibility** standards
- **Performance** optimization
- **Cross-browser** compatibility

## 🔧 Installation and Setup

### Requirements
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/efecanzaim/14luk.git

# Navigate to project directory
cd 14luk

# Install dependencies
npm install

# Start development server
npm start
```

### Build and Deploy
```bash
# Production build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📊 Performance Metrics

- **Lighthouse Score:** 90+ (Performance, Accessibility, Best Practices)
- **Bundle Size:** Optimized (with code splitting)
- **Loading Time:** < 3 seconds
- **Mobile Performance:** Optimized

## 🔒 Security Features

### Backend Security (Certificate Verification System)
- **Multi-Layer Authentication**
  - Role-based access control (Admin/Editor)
  - Bcrypt password hashing (PASSWORD_DEFAULT)
  - Session-based authentication with secure cookies
  - Mandatory password change on first login
  
- **SQL Injection Prevention**
  - PDO prepared statements for all database queries
  - Input validation and sanitization
  - Parameterized queries exclusively

- **API Security**
  - CORS protection with domain whitelisting
  - Rate limiting (10 requests/60 seconds)
  - Origin verification
  - Request method validation (POST-only endpoints)
  
- **Activity Monitoring**
  - Complete audit trail system
  - User action logging (create, update, delete, import)
  - IP address tracking
  - Timestamp recording for all operations

- **Data Protection**
  - Encrypted password storage
  - Server-side validation
  - Hidden database credentials
  - No sensitive data exposure in frontend

### Frontend Security
- **Form Validation** - Client-side and server-side
- **XSS Protection** - React's built-in security features
- **HTTPS** - Secure connection
- **Input Sanitization** - Comprehensive validation

## 🌐 SEO Optimization

### Page-Specific SEO
- **React Helmet Async** - Dynamic meta tags for each page
- **Unique Title Tags** - Custom titles for all 8 pages
- **Unique Descriptions** - Optimized meta descriptions
- **Canonical URLs** - Proper canonical link tags
- **Keywords Optimization** - Targeted keywords for each page

### Technical SEO
- **Sitemap.xml** - Complete sitemap with all pages
- **Robots.txt** - Optimized for search engines
- **Pre-rendering** - React-snap for static HTML generation
- **Google Analytics** - Tracking ID: G-QPRNH2J9ED
- **Google Search Console** - Verified and indexed

### Social Media SEO
- **Open Graph Tags** - Facebook sharing optimization
- **Twitter Cards** - Twitter sharing optimization
- **Social Media Images** - Optimized OG images

### Content SEO
- **Semantic HTML** - SEO-friendly markup structure
- **H1-H6 Hierarchy** - Proper heading structure
- **Alt Text** - Image descriptions for accessibility
- **Internal Linking** - Strategic link structure

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🚀 Deployment

The project is automatically deployed on **GitHub Pages**. Every push to the `master` branch triggers automatic build and deployment.

## 🗄️ Database Schema

### Tables Overview

**admin_users** - Multi-user authentication system
- Role-based access control (admin/editor)
- Bcrypt password encryption
- First-login password enforcement
- Last login tracking

**certificates** - Product certificate registry
- Unique serial numbers
- Product categorization (Kare, Yuvarlak, Kalp, Yonca)
- Production date tracking
- Weight specifications
- Status management (active/cancelled/pending)
- User attribution (created_by, updated_by)

**certificate_logs** - Audit trail system
- Action type tracking (create, update, delete, import)
- User activity logging
- IP address recording
- JSON-based detail storage

**verification_logs** - Public verification tracking
- Customer verification attempts
- Success/failure statistics
- IP-based analytics
- Spam detection support

**price_history** - Gold price tracking
- Symbol-based storage (ONS, ALTIN, 14LUK)
- Buy/Sell/Close price recording
- Price direction tracking
- Automated data collection via cron jobs
- Historical data for chart visualization

## 📈 Recent Updates & Enhancements

### ✅ Completed (2024-2025)
- [x] **Real-time Gold Prices** - Socket.IO integration with Haremin API
- [x] **14'lük Price Calculator** - Automatic pricing (Buy: ×0.580, Sell: ×0.635)
- [x] **Price History Charts** - Interactive visualization with Chart.js
- [x] **SEO Optimization** - React Helmet Async + Pre-rendering
- [x] **Google Analytics** - Complete tracking implementation
- [x] **Admin Panel** - Multi-user support with RBAC
- [x] **Certificate Verification** - Production-ready MySQL system
- [x] **Rate Limiting** - API protection and spam prevention
- [x] **Audit Logging** - Complete activity tracking

### 🚀 Future Enhancements
- [ ] PWA (Progressive Web App) support
- [ ] Multi-language support (TR/EN)
- [ ] Advanced filtering and search
- [ ] Email notifications for certificate operations
- [ ] Export functionality (PDF/Excel reports)
- [ ] Image optimization (WebP format + Lazy loading)
- [ ] Advanced caching strategies

## 👨‍💻 Developer

**Efecan Zaim**
- GitHub: [@efecanzaim](https://github.com/efecanzaim)
- LinkedIn: [Efecan Zaim](https://linkedin.com/in/efecanzaim)

## 📄 License

This is a private project developed for commercial use.

---

*This project is a performance-focused, user experience-prioritized e-commerce application developed using modern web technologies.*
