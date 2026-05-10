# 📚 Smart Library Management System (SLMS)

A complete, production-ready **Smart Library Management System** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). This is a **BCA Final Year Major Project** featuring user authentication with email OTP verification, full book management with Cloudinary image uploads, an automated borrowing & return system with fine calculation, AI-powered book recommendations, QR code-based issue/return, community reviews & ratings, a waitlist system with auto-notifications, personal reading analytics with charts & heatmaps, and scheduled background tasks via cron jobs.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Authentication Flow](#-authentication-flow)
- [Role-Based Access Control](#-role-based-access-control)
- [AI Recommendation Engine](#-ai-recommendation-engine)
- [Fine Calculation Logic](#-fine-calculation-logic)
- [Background Cron Jobs](#-background-cron-jobs)
- [Folder Structure](#-folder-structure)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [API Endpoints](#-api-endpoints)
- [Frontend Pages & Routes](#-frontend-pages--routes)
- [Security Measures](#-security-measures)
- [Screenshots](#-screenshots)
- [Team Members](#-team-members)
- [License](#-license)

---

## 🧾 Project Overview

**Problem Statement:** Traditional library systems rely on manual book tracking, paper registers, and lack real-time features like automated fine calculation, overdue reminders, and digital book discovery. This leads to inefficiency, lost records, and poor user experience.

**Our Solution:** SLMS is a web-based library management system that digitizes the complete library workflow — from book cataloging to issuing, returning, fine management, and analytics. It also introduces smart features like AI-powered book recommendations, QR code scanning, automated waitlists, and reading analytics dashboards.

**Key Highlights:**
- 🔐 Secure authentication with email OTP verification and JWT tokens
- 📚 Complete book lifecycle management (add → borrow → return → review)
- 🤖 AI-powered hybrid recommendation engine (content-based + collaborative filtering)
- 📱 QR code generation for every book + camera-based QR scanning for instant returns
- ⭐ Community-driven review and rating system
- 🔔 Automated waitlist with 24-hour claim window and email notifications
- 📊 Rich reading analytics with heatmaps, charts, streaks, and stat dashboards
- ⏰ Background cron jobs for overdue reminders, unverified account cleanup, and waitlist processing
- 🛡️ Enterprise-grade security: CSRF protection, rate limiting, HTTP-only cookies, password hashing

---

## ✨ Features

### 🔐 1. Authentication & Authorization
- User registration with **6-digit email OTP verification** (10-minute expiry)
- **JWT-based** login with HTTP-only cookies (`SameSite=strict`)
- Forgot password → email reset link with **15-minute expiry** (SHA-256 hashed token)
- Role-based access control: **Admin** and **Member**
- Automatic deletion of unverified accounts after 24 hours (cron job)
- Session persistence via `GET /api/auth/me` on app load

### 📚 2. Book Management (Admin)
- Add books with **cover image upload via Cloudinary**
- Edit and delete book records
- **QR code auto-generated** for every book on creation (stored as base64 data URL)
- Regenerate QR codes on demand
- Search books by **title, author, or category** (case-insensitive regex)
- Server-side **pagination** with configurable page size
- Track book availability status (auto-updated on borrow/return)

### 📖 3. Borrowing & Return System
- Issue books to members with a **14-day lending period**
- Return books with **automatic fine calculation** (₹5 per overdue day)
- **QR code-based returns** — scan the book's QR code with your camera for instant return
- Prevent duplicate borrows (can't borrow the same book twice simultaneously)
- **Email confirmations** sent on both borrow and return
- Admin can view **all borrow records** across the system
- Members can view their **personal borrow history**
- Admin can view **overdue records** with current fine amounts

### 👥 4. User Management (Admin)
- View all registered users with details
- **Promote** a member to admin or **demote** admin to member
- Delete user accounts
- View individual user profiles

### 📧 5. Email Notifications (6 Types)
| Email | Trigger |
|-------|---------|
| OTP Verification | User registers a new account |
| Password Reset Link | User requests "Forgot Password" |
| Borrow Confirmation | Book is successfully issued to a member |
| Return Confirmation | Book is returned (includes fine details if any) |
| Overdue Reminder | Daily cron at 9 AM for all overdue books |
| Waitlist Notification | A waitlisted book becomes available |

All emails use **branded HTML templates** with styled layouts.

### 🤖 6. AI-Powered Book Recommendations
- **Hybrid recommendation engine** combining content-based and collaborative filtering
- Scoring formula with weighted factors:
  - **Category match: 40%** — books in the member's favourite categories
  - **Popularity: 30%** — based on average rating
  - **Recency: 15%** — recently added books get a boost
  - **Author match: 15%** — books by authors the member has read before
  - **Collaborative bonus: +15%** — books borrowed by users with similar reading patterns
- Falls back to **popular books globally** for new users with no borrow history
- Returns **top 10 personalized recommendations**
- Displayed as a "Recommended For You" carousel on the Member Dashboard

### ⭐ 7. Book Reviews & Community Ratings
- Members can leave a **1–5 star rating** with an optional text comment (max 500 chars)
- **One review per user per book** (enforced with a unique database index)
- **Review gating**: only users who have borrowed AND returned a book can review it
- Average rating and review count are **denormalized on the Book document** for fast reads
- Star ratings displayed on **every BookCard** in the catalog and on the **Book Detail** page
- `can-review` API endpoint lets the frontend check eligibility before showing the review form

### 🔔 8. Book Waitlist & Auto-Assignment
- Members can **join a position-tracked queue** for unavailable books
- Joining is blocked when the book is already available (direct borrow instead)
- Duplicate waitlist entries prevented (unique index on `book + user`)
- When a book is returned, the **next person in line is automatically notified via email**
- Notified member gets a **24-hour claim window** to borrow the book
- If the window expires, the slot **auto-advances to the next person** (hourly cron job)
- Members can **leave the waitlist** at any time (positions auto-reorder)
- View queue position from the Book Detail page or My Books page

### 📊 9. Reading Analytics Dashboard
- **Total stats**: books borrowed, returned, currently active, total fines paid
- **On-time return rate** (percentage)
- **Reading streak** — consecutive months with at least one book returned
- **Monthly bar chart** — books read per month over the last 12 months (Recharts)
- **Category pie chart** — distribution of books by genre/category
- **365-day reading heatmap** — GitHub-style calendar showing daily borrow counts
- **Top authors** — most-read authors list
- **Recent activity timeline** — last 5 borrow/return events

### 🖥️ 10. Admin Dashboard & Reports
- **Admin summary**: total books, available books, total borrows, active borrows, overdue count
- **Average rating** across all books in the system
- **Top 5 most borrowed books** with borrow counts
- Total reviews count
- Manage Books, Manage Users, Borrow Records, and Reports pages

---

## 🏗️ System Architecture

```
┌─────────────────────┐        HTTP (REST API)        ┌───────────────────────┐
│                     │  ◄──────────────────────────►  │                       │
│   React Frontend    │     JWT Cookie Auth            │   Express Backend     │
│   (Vite + Tailwind) │     Axios with credentials     │   (Node.js)           │
│                     │                                │                       │
│  • Redux Toolkit    │                                │  • Controllers        │
│  • React Router v6  │                                │  • Mongoose Models    │
│  • Recharts         │                                │  • Middlewares         │
│  • Framer Motion    │                                │  • Cron Jobs          │
│  • html5-qrcode     │                                │  • Email Service      │
│                     │                                │                       │
└─────────────────────┘                                └───────────┬───────────┘
                                                                   │
                                                    ┌──────────────┼──────────────┐
                                                    │              │              │
                                                    ▼              ▼              ▼
                                              ┌──────────┐  ┌──────────┐  ┌──────────┐
                                              │ MongoDB  │  │Cloudinary│  │  Gmail   │
                                              │ Atlas    │  │  (CDN)   │  │  SMTP    │
                                              │          │  │          │  │          │
                                              │ Users    │  │ Book     │  │ OTP      │
                                              │ Books    │  │ Cover    │  │ Reminders│
                                              │ Borrows  │  │ Images   │  │ Receipts │
                                              │ Reviews  │  │          │  │ Waitlist │
                                              │ Waitlist │  │          │  │          │
                                              └──────────┘  └──────────┘  └──────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| **express** | ^4.19.2 | Web server framework — handles routing, middleware, and HTTP requests |
| **mongoose** | ^8.4.1 | MongoDB ODM — defines schemas, models, and database queries |
| **jsonwebtoken** | ^9.0.2 | Generates and verifies JWT tokens for authentication |
| **bcryptjs** | ^2.4.3 | Hashes passwords with salt rounds before storing in database |
| **nodemailer** | ^6.9.14 | Sends transactional emails (OTP, reminders, confirmations) via Gmail SMTP |
| **cloudinary** | ^1.41.3 | Cloud image hosting service for book cover images |
| **express-fileupload** | ^1.5.1 | Parses multipart file uploads (book cover images) |
| **qrcode** | ^1.5.4 | Generates QR code images (Data URLs) encoding book IDs |
| **node-cron** | ^3.0.3 | Schedules recurring background tasks (overdue reminders, cleanup) |
| **express-rate-limit** | ^8.3.0 | Rate-limits API requests to prevent abuse (100 req/15min general, 20 req/15min auth) |
| **cookie-parser** | ^1.4.6 | Parses cookies from incoming requests (JWT token extraction) |
| **cors** | ^2.8.5 | Enables cross-origin requests from frontend with credentials |
| **csrf-csrf** | ^4.0.3 | CSRF protection via Origin header validation |
| **validator** | ^13.12.0 | Validates email format and input sanitization |
| **dotenv** | ^16.4.5 | Loads environment variables from `.env` file |

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| **react** | ^18.3.1 | UI component library — builds the entire user interface |
| **react-dom** | ^18.3.1 | React DOM renderer for browser |
| **react-router-dom** | ^6.24.0 | Client-side routing — handles page navigation without full reload |
| **@reduxjs/toolkit** | ^2.2.6 | State management — manages global app state (auth, books, borrows, etc.) |
| **react-redux** | ^9.1.2 | Connects React components to the Redux store |
| **axios** | ^1.7.2 | HTTP client — makes API calls to the backend with cookie support |
| **tailwindcss** | (dev) | Utility-first CSS framework — styles the entire UI |
| **framer-motion** | ^12.38.0 | Animation library — smooth page transitions and component animations |
| **recharts** | ^3.8.1 | Charting library — renders bar charts, pie charts in analytics |
| **html5-qrcode** | ^2.3.8 | Camera-based QR code scanner — scans book QR codes for returns |
| **qrcode.react** | ^4.2.0 | Renders QR codes as React SVG components |
| **react-hot-toast** | ^2.4.1 | Toast notification popups for success/error messages |
| **lucide-react** | ^1.7.0 | Modern icon library (primary icons) |
| **react-icons** | ^5.2.1 | Additional icon set for UI elements |
| **vite** | (dev) | Build tool — fast dev server with HMR and optimized production builds |

---

## 🗄️ Database Schema

### User Model (`users` collection)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `name` | String | Required, max 50 chars | User's full name |
| `email` | String | Required, unique, validated | User's email address |
| `password` | String | Required, min 6 chars, hashed | Bcrypt-hashed password (10 salt rounds) |
| `role` | String | Enum: `admin`, `member` | Default: `member` |
| `verified` | Boolean | Default: `false` | Set to `true` after OTP verification |
| `otp` | Number | Transient | 6-digit OTP for email verification |
| `otpExpiry` | Date | 10 min from generation | OTP expiration timestamp |
| `resetPasswordToken` | String | SHA-256 hashed | Password reset token (hashed) |
| `resetPasswordExpiry` | Date | 15 min from generation | Reset token expiration |
| `avatar` | String | Default: `""` | Profile picture URL |
| `createdAt` | Date | Default: `Date.now` | Account creation timestamp |

### Book Model (`books` collection)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `title` | String | Required | Book title |
| `author` | String | Required | Author name |
| `category` | String | Required | Genre/category (e.g., Fiction, Science) |
| `ISBN` | String | Required, unique | International Standard Book Number |
| `availability` | Boolean | Default: `true` | Whether the book can be borrowed |
| `coverImage` | String | Cloudinary URL | Book cover image URL |
| `description` | String | Default: `""` | Book description/summary |
| `qrCode` | String | Auto-generated | QR code as base64 data URL |
| `averageRating` | Number | 0–5, default: 0 | Denormalized average star rating |
| `totalReviews` | Number | Default: 0 | Denormalized review count |
| `createdAt` | Date | Default: `Date.now` | Book creation timestamp |

### Borrow Model (`borrows` collection)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `user` | ObjectId | Ref → User, required | Who borrowed the book |
| `book` | ObjectId | Ref → Book, required | Which book was borrowed |
| `issueDate` | Date | Default: `Date.now` | When the book was issued |
| `returnDate` | Date | Required (issueDate + 14 days) | Due date for return |
| `actualReturnDate` | Date | Null until returned | Actual date the book was returned |
| `fine` | Number | Default: 0 | Fine amount in ₹ (₹5/day overdue) |
| `status` | String | Enum: `borrowed`, `returned` | Current borrow status |

### Review Model (`reviews` collection)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `book` | ObjectId | Ref → Book, required | Book being reviewed |
| `user` | ObjectId | Ref → User, required | User who wrote the review |
| `rating` | Number | Required, 1–5 | Star rating |
| `comment` | String | Max 500 chars | Optional review text |
| `createdAt` | Date | Default: `Date.now` | Review timestamp |
| *Index* | Unique | `{ book: 1, user: 1 }` | One review per user per book |

### Waitlist Model (`waitlists` collection)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `book` | ObjectId | Ref → Book, required | Book being waited for |
| `user` | ObjectId | Ref → User, required | User in the queue |
| `position` | Number | Required | Queue position (1 = first in line) |
| `status` | String | Enum: `waiting`, `notified`, `fulfilled`, `expired`, `cancelled` | Entry status |
| `expiresAt` | Date | Set on notification | 24-hour claim window deadline |
| `createdAt` | Date | Default: `Date.now` | When user joined the queue |
| *Index* | Unique | `{ book: 1, user: 1 }` | One entry per user per book |

---

## 🔐 Authentication Flow

### Registration & Verification
```
User fills form ──► POST /api/auth/register ──► Password hashed (bcrypt, 10 rounds)
                                               ──► User created (verified: false)
                                               ──► 6-digit OTP generated
                                               ──► OTP saved to DB (10-min expiry)
                                               ──► OTP sent via email (Nodemailer)
                                               ──► Redirect to OTP page

User enters OTP ──► POST /api/auth/verify-otp ──► OTP matched & not expired?
                                                ──► verified = true, clear OTP
                                                ──► Generate JWT (7-day expiry)
                                                ──► Set HTTP-only cookie (SameSite=strict)
                                                ──► Redirect to Dashboard
```

### Login
```
User enters credentials ──► POST /api/auth/login ──► Find user by email
                                                   ──► Compare password hash (bcrypt)
                                                   ──► Check verified = true
                                                   ──► Generate JWT → Set cookie
                                                   ──► Return user object
```

### Password Reset
```
User requests reset ──► POST /api/auth/forgot-password ──► Generate 20-byte crypto token
                                                         ──► SHA-256 hash stored in DB (15-min expiry)
                                                         ──► Raw token sent via email in reset URL

User clicks link ──► PUT /api/auth/reset-password/:token ──► Hash token from URL
                                                          ──► Find matching user (not expired)
                                                          ──► Update password, clear reset fields
```

### Session Persistence
```
App loads ──► GET /api/auth/me ──► JWT extracted from cookie
                                ──► Token verified
                                ──► User object returned
                                ──► Redux store updated (isAuthenticated: true)
```

---

## 👤 Role-Based Access Control

### Admin Can:
- ✅ Manage entire book catalog (CRUD operations)
- ✅ Upload and manage book cover images
- ✅ View and manage all registered users
- ✅ Promote members to admin / demote admins to member
- ✅ Delete user accounts
- ✅ View ALL borrow records across the system
- ✅ View overdue records with fine amounts
- ✅ Access admin dashboard with system-wide analytics
- ✅ Regenerate QR codes for books
- ✅ Access reports page

### Member Can:
- ✅ Browse and search the book catalog
- ✅ Borrow available books (1 copy at a time per book)
- ✅ Return borrowed books (manual or QR scan)
- ✅ View personal borrow history
- ✅ Leave reviews on books they've returned
- ✅ Join/leave waitlists for unavailable books
- ✅ Claim waitlist slots within the 24-hour window
- ✅ View personalized AI book recommendations
- ✅ Access personal reading analytics dashboard
- ✅ View and update their profile

### Public (Not Logged In):
- ✅ View home page and about/contact pages
- ✅ Browse the book catalog (read-only)
- ✅ View book details and reviews
- ❌ Cannot borrow, review, or join waitlists

---

## 🤖 AI Recommendation Engine

The system uses a **hybrid recommendation algorithm** that combines:

1. **Content-Based Filtering** — analyzes the member's borrow history to find their favourite categories and authors
2. **Collaborative Filtering** — finds users with similar reading patterns and recommends what they've read

### Scoring Formula
```
Score = (CategoryBonus × 0.40) + (PopularityScore × 0.30) + (RecencyScore × 0.15) + (AuthorBonus × 0.15) + (CollaborativeBonus × 0.15)
```

| Factor | Weight | Logic |
|--------|--------|-------|
| **Category Match** | 40% | Book's category matches user's most-read categories |
| **Popularity** | 30% | Based on the book's average star rating (0–5 normalized) |
| **Recency** | 15% | Recently added books get a time-decay boost |
| **Author Match** | 15% | Book's author matches authors the user has read before |
| **Collaborative** | +15% | Books borrowed by users who share ≥2 common books |

**New User Fallback:** If a user has no borrow history, the engine returns the top-rated, most-reviewed books globally.

---

## 💰 Fine Calculation Logic

```
Overdue Days = ceil((Actual Return Date − Due Date) / 86,400,000 ms)
Fine = max(0, Overdue Days) × ₹5
```

- **Rate**: ₹5 per day overdue
- **Rounding**: Days are rounded **up** (Math.ceil) — even 1 hour late = 1 day fine
- **Trigger**: Fine is calculated at the moment of return
- **Display**: Fine amount is shown on the return confirmation screen and included in the return email
- **No fine**: If returned on or before the due date, fine = ₹0

---

## ⏰ Background Cron Jobs

Three automated background tasks run on schedules:

| Cron Job | Schedule | What It Does |
|----------|----------|--------------|
| **Overdue Reminders** | Daily at 9:00 AM | Finds all currently borrowed books past their due date, calculates the current fine for each, and sends an email reminder to the borrower |
| **Unverified Account Cleanup** | Daily at 12:00 AM (midnight) | Deletes user accounts that remain `verified: false` for more than 24 hours, preventing database clutter from abandoned registrations |
| **Waitlist Processor** | Every hour at :00 | Checks for waitlist entries in `notified` status whose 24-hour claim window has expired, marks them as `expired`, reorders remaining positions, and notifies the next person in line |

---

## 📁 Folder Structure

```
smart-library-management-system/
│
├── backend/                          # Express.js REST API server
│   ├── config/
│   │   └── db.js                     # MongoDB connection using Mongoose
│   ├── controllers/
│   │   ├── authController.js         # Register, login, OTP, password reset
│   │   ├── bookController.js         # CRUD + QR code generation + search/pagination
│   │   ├── borrowController.js       # Issue, return, QR return, overdue tracking
│   │   ├── userController.js         # Admin user management (list, delete, role update)
│   │   ├── reviewController.js       # Add review, get reviews, check eligibility
│   │   ├── waitlistController.js     # Join/leave/claim waitlist, position tracking
│   │   ├── recommendationController.js  # Hybrid AI recommendation engine
│   │   └── analyticsController.js    # Stats, monthly data, heatmap, top authors, admin summary
│   ├── models/
│   │   ├── userModel.js              # User schema with OTP, password reset, roles
│   │   ├── bookModel.js              # Book schema with QR code, ratings, availability
│   │   ├── borrowModel.js            # Borrow schema with fine calculation, status tracking
│   │   ├── reviewModel.js            # Review schema with unique user-book constraint
│   │   └── waitlistModel.js          # Waitlist schema with position, status, expiry
│   ├── routes/
│   │   ├── authRoutes.js             # /api/auth/*
│   │   ├── bookRoutes.js             # /api/books/*
│   │   ├── borrowRoutes.js           # /api/borrow/*
│   │   ├── userRoutes.js             # /api/users/*
│   │   ├── reviewRoutes.js           # /api/reviews/*
│   │   ├── waitlistRoutes.js         # /api/waitlist/*
│   │   ├── recommendationRoutes.js   # /api/recommendations/*
│   │   └── analyticsRoutes.js        # /api/analytics/*
│   ├── middlewares/
│   │   ├── authMiddleware.js         # JWT verification + role-based authorization
│   │   ├── errorMiddleware.js        # Centralized error handler
│   │   ├── catchAsyncErrors.js       # Async/await error wrapper (try-catch replacement)
│   │   └── csrfMiddleware.js         # CSRF protection via Origin header validation
│   ├── services/
│   │   ├── notifyUsers.js            # Cron: daily overdue email reminders (9 AM)
│   │   ├── removeUnverifiedAccounts.js  # Cron: delete unverified users (midnight)
│   │   └── waitlistProcessor.js      # Cron: process expired waitlist claims (hourly)
│   ├── utils/
│   │   ├── sendEmail.js              # Nodemailer SMTP email sender
│   │   ├── sendToken.js              # JWT generation + cookie setting helper
│   │   ├── sendVerificationCode.js   # OTP generation + email sending
│   │   ├── fineCalculator.js         # Overdue fine calculation (₹5/day)
│   │   └── emailTemplates.js         # Branded HTML email templates
│   ├── app.js                        # Express app config (middleware, routes, CORS, rate limiting)
│   ├── server.js                     # Server entry point (DB connect, Cloudinary config, cron start)
│   └── package.json
│
├── client/                           # React.js SPA (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx        # Top navigation bar with auth state
│   │   │   │   ├── Sidebar.jsx       # Admin sidebar navigation
│   │   │   │   └── Footer.jsx        # Page footer
│   │   │   ├── common/
│   │   │   │   ├── ProtectedRoute.jsx  # Route guard (auth + role check)
│   │   │   │   ├── Loader.jsx        # Loading spinner component
│   │   │   │   └── DashboardCard.jsx # Stat card for dashboards
│   │   │   ├── books/
│   │   │   │   ├── BookCard.jsx      # Book card with cover, rating, availability
│   │   │   │   ├── BookList.jsx      # Grid layout of BookCards
│   │   │   │   ├── BookForm.jsx      # Add/edit book form (admin)
│   │   │   │   ├── BookReviews.jsx   # Review form + reviews list
│   │   │   │   ├── RecommendedBooks.jsx  # AI recommendation carousel
│   │   │   │   ├── WaitlistButton.jsx    # Join/leave/claim waitlist
│   │   │   │   └── QRScanner.jsx     # Camera-based QR code scanner
│   │   │   ├── borrow/
│   │   │   │   ├── BorrowCard.jsx    # Individual borrow record card
│   │   │   │   └── BorrowTable.jsx   # Borrow records table
│   │   │   └── analytics/
│   │   │       ├── ReadingHeatmap.jsx # 365-day GitHub-style heatmap
│   │   │       └── StatCard.jsx      # Analytics stat card
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Landing page with hero section
│   │   │   ├── Login.jsx             # Login form page
│   │   │   ├── Register.jsx          # Registration form page
│   │   │   ├── VerifyOTP.jsx         # OTP entry page
│   │   │   ├── ForgotPassword.jsx    # Reset request page
│   │   │   ├── ResetPassword.jsx     # New password form
│   │   │   ├── Catalog.jsx           # Public book catalog with search
│   │   │   ├── BookDetail.jsx        # Full book detail + reviews
│   │   │   ├── About.jsx             # About page
│   │   │   ├── Contact.jsx           # Contact page
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx   # Admin stats overview
│   │   │   │   ├── ManageBooks.jsx      # Book CRUD interface
│   │   │   │   ├── ManageUsers.jsx      # User management interface
│   │   │   │   ├── BorrowRecords.jsx    # All borrow records
│   │   │   │   └── Reports.jsx          # Reports & analytics
│   │   │   └── member/
│   │   │       ├── MemberDashboard.jsx  # Member overview + recommendations
│   │   │       ├── MyBooks.jsx          # Personal borrows + waitlist
│   │   │       ├── Profile.jsx          # Profile page
│   │   │       └── ReadingAnalytics.jsx # Charts, heatmap, stats
│   │   ├── redux/
│   │   │   ├── store.js               # Redux store configuration
│   │   │   └── slices/
│   │   │       ├── authSlice.js       # Authentication state & async thunks
│   │   │       ├── bookSlice.js       # Books state (CRUD, search, pagination)
│   │   │       ├── borrowSlice.js     # Borrow records state
│   │   │       ├── userSlice.js       # User management state (admin)
│   │   │       ├── reviewSlice.js     # Reviews state
│   │   │       ├── waitlistSlice.js   # Waitlist state
│   │   │       ├── recommendationSlice.js  # Recommendations state
│   │   │       └── analyticsSlice.js  # Analytics data state
│   │   ├── utils/
│   │   │   └── api.js                 # Axios instance (baseURL + withCredentials)
│   │   ├── App.jsx                    # Root component with routing
│   │   ├── main.jsx                   # Entry point (Redux Provider, BrowserRouter)
│   │   ├── App.css                    # Custom styles
│   │   └── index.css                  # Tailwind base imports
│   ├── index.html                     # HTML entry point
│   ├── vite.config.js                 # Vite configuration
│   ├── tailwind.config.js             # Tailwind CSS configuration
│   ├── postcss.config.js              # PostCSS configuration
│   └── package.json
│
└── README.md                          # This file
```

---

## 🚀 Setup & Installation

### Prerequisites

Before running this project, make sure you have:

| Requirement | How to Get It |
|------------|---------------|
| **Node.js v18+** | Download from [nodejs.org](https://nodejs.org/) |
| **npm** (comes with Node.js) | Installed automatically with Node.js |
| **MongoDB Atlas account** | Free at [mongodb.com/atlas](https://www.mongodb.com/atlas) |
| **Gmail account with App Password** | See Gmail App Password Setup below |
| **Cloudinary account** | Free at [cloudinary.com](https://cloudinary.com/) |

### Step 1 — Clone the Repository

```bash
git clone https://github.com/KunalDev69/smart-library-management-system.git
cd smart-library-management-system
```

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

This installs all 14 backend dependencies listed in `package.json`.

### Step 3 — Create Backend Environment File

Create a file at `backend/config/config.env` and fill in your credentials:

```env
# Server
PORT=4000

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/slms

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Gmail SMTP (for sending emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SERVICE=gmail
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password

# Cloudinary (for book cover image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Step 4 — Frontend Setup

```bash
cd ../client
npm install
```

This installs all 12 frontend dependencies.

The frontend is pre-configured to call the backend at `http://localhost:4000/api` via the Axios instance in `src/utils/api.js`.

### Step 5 — Setting Up External Services

#### MongoDB Atlas (Database)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create a free cluster
2. Create a database user with a username and password
3. Whitelist your IP address (or use `0.0.0.0/0` for development)
4. Click "Connect" → "Connect your application" → Copy the connection string
5. Replace `<username>`, `<password>`, and `<cluster>` in `MONGO_URI`

#### Gmail App Password (Email)
1. Go to [myaccount.google.com](https://myaccount.google.com/) → Security
2. Enable **2-Step Verification** (required)
3. Go to **App passwords** (search for it in Google Account settings)
4. Select app: "Mail", device: "Other" → Name it "SLMS"
5. Copy the 16-character password → Use as `SMTP_PASSWORD`

#### Cloudinary (Image Upload)
1. Go to [cloudinary.com](https://cloudinary.com/) → Sign up (free)
2. From the Dashboard, copy:
   - Cloud Name → `CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`

---

## ▶️ Running the Project

### Start Backend Server
```bash
cd backend
npm run dev
```
✅ Backend starts at: **http://localhost:4000**
You should see:
```
Server is running on port 4000
MongoDB Connected: <cluster-name>
```

### Start Frontend Dev Server
Open a **new terminal** and run:
```bash
cd client
npm run dev
```
✅ Frontend starts at: **http://localhost:5173**

### Access the Application
Open your browser and go to: **http://localhost:5173**

### Creating an Admin Account
1. Register a new account through the app (you'll receive an OTP email)
2. Verify the OTP
3. Go to **MongoDB Atlas** → Browse Collections → `users` collection
4. Find your user document and change `"role": "member"` to `"role": "admin"`
5. Refresh the app — you'll now see the Admin Dashboard

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Backend server port (default: 4000) |
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing (use a long random string) |
| `JWT_EXPIRE` | Yes | JWT token expiry (e.g., `7d` for 7 days) |
| `COOKIE_EXPIRE` | Yes | Cookie expiry in days (e.g., `7`) |
| `SMTP_HOST` | Yes | Email server host (`smtp.gmail.com`) |
| `SMTP_PORT` | Yes | Email server port (`465` for SSL) |
| `SMTP_SERVICE` | Yes | Email service name (`gmail`) |
| `SMTP_MAIL` | Yes | Your Gmail address |
| `SMTP_PASSWORD` | Yes | Gmail App Password (16-char code, NOT your regular password) |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `FRONTEND_URL` | Yes | Frontend URL for CORS (`http://localhost:5173`) |

---

## 📡 API Endpoints

### Authentication — `/api/auth`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user (sends OTP email) | Public |
| POST | `/api/auth/verify-otp` | Verify email with 6-digit OTP | Public |
| POST | `/api/auth/resend-otp` | Resend OTP if expired or not received | Public |
| POST | `/api/auth/login` | Login with email + password | Public |
| GET | `/api/auth/logout` | Clear JWT cookie and logout | Authenticated |
| POST | `/api/auth/forgot-password` | Send password reset email with token | Public |
| PUT | `/api/auth/reset-password/:token` | Reset password using email token | Public |
| GET | `/api/auth/me` | Get currently logged-in user profile | Authenticated |

### Books — `/api/books`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/books` | Get all books (supports `?keyword=` and `?page=`) | Public |
| GET | `/api/books/:id` | Get single book by ID | Public |
| POST | `/api/books` | Add new book with cover image + auto QR | Admin |
| PUT | `/api/books/:id` | Update book details | Admin |
| DELETE | `/api/books/:id` | Delete book and its Cloudinary image | Admin |
| PUT | `/api/books/:id/regenerate-qr` | Regenerate QR code for a book | Admin |

### Borrowing — `/api/borrow`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/borrow/issue` | Issue/borrow a book (14-day period) | Authenticated |
| PUT | `/api/borrow/return/:id` | Return a borrowed book (calculates fine) | Authenticated |
| PUT | `/api/borrow/return-by-qr` | Return book by scanning its QR code | Authenticated |
| GET | `/api/borrow/records` | Get all borrow records (system-wide) | Admin |
| GET | `/api/borrow/my-records` | Get current user's borrow history | Authenticated |
| GET | `/api/borrow/overdue` | Get all overdue borrow records | Admin |

### Users — `/api/users` (Admin Only)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all registered users | Admin |
| GET | `/api/users/:id` | Get specific user by ID | Admin |
| PUT | `/api/users/:id/role` | Change user role (admin ↔ member) | Admin |
| DELETE | `/api/users/:id` | Delete a user account | Admin |

### Reviews — `/api/reviews`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/reviews/:bookId` | Submit review (1–5 stars + comment) | Authenticated |
| GET | `/api/reviews/:bookId` | Get all reviews for a book | Public |
| GET | `/api/reviews/:bookId/can-review` | Check if user is eligible to review | Authenticated |

### Waitlist — `/api/waitlist`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/waitlist/:bookId` | Join waitlist for an unavailable book | Authenticated |
| DELETE | `/api/waitlist/:bookId` | Leave the waitlist | Authenticated |
| GET | `/api/waitlist/:bookId/position` | Get your current position in queue | Authenticated |
| GET | `/api/waitlist/my-waitlist` | Get all books you're waitlisted for | Authenticated |
| POST | `/api/waitlist/:bookId/claim` | Claim a notified waitlist slot | Authenticated |

### Recommendations — `/api/recommendations`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/recommendations` | Get top 10 personalized book recommendations | Authenticated |

### Analytics — `/api/analytics`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/analytics/my-stats` | Get personal reading summary (all stats) | Authenticated |
| GET | `/api/analytics/monthly` | Get 12-month books-per-month data | Authenticated |
| GET | `/api/analytics/categories` | Get category distribution breakdown | Authenticated |
| GET | `/api/analytics/streak-calendar` | Get 365-day heatmap data (daily counts) | Authenticated |
| GET | `/api/analytics/top-authors` | Get top 10 most-read authors | Authenticated |
| GET | `/api/analytics/admin-summary` | Get system-wide admin dashboard stats | Admin |

**Total: 35 API endpoints across 8 route groups**

---

## 🗺️ Frontend Pages & Routes

| Route | Page | Auth Required | Role | Description |
|-------|------|:---:|------|-------------|
| `/` | Home | No | Any | Landing page with hero section, feature highlights |
| `/login` | Login | No | — | Email + password login form |
| `/register` | Register | No | — | Name + email + password registration form |
| `/verify-otp` | VerifyOTP | No | — | 6-digit OTP input after registration |
| `/forgot-password` | ForgotPassword | No | — | Enter email to receive reset link |
| `/reset-password/:token` | ResetPassword | No | — | Enter new password via email link |
| `/catalog` | Catalog | No | Any | Book grid with search, ratings, availability |
| `/books/:id` | BookDetail | No | Any | Full book info, reviews, waitlist button |
| `/about` | About | No | Any | About the project page |
| `/contact` | Contact | No | Any | Contact information page |
| `/admin/dashboard` | AdminDashboard | ✅ | Admin | System stats, top books, overdue count |
| `/admin/books` | ManageBooks | ✅ | Admin | Add/edit/delete books, view QR codes |
| `/admin/users` | ManageUsers | ✅ | Admin | View/delete users, change roles |
| `/admin/borrow-records` | BorrowRecords | ✅ | Admin | All borrow/return records table |
| `/admin/reports` | Reports | ✅ | Admin | Analytics reports and charts |
| `/member/dashboard` | MemberDashboard | ✅ | Member | Overview + "Recommended For You" |
| `/member/my-books` | MyBooks | ✅ | Member | Currently borrowed + waitlisted books |
| `/member/profile` | Profile | ✅ | Any | User profile information |
| `/member/analytics` | ReadingAnalytics | ✅ | Member | Charts, heatmap, streak, stats |

---

## 🛡️ Security Measures

| Security Feature | Implementation |
|-----------------|----------------|
| **Password Hashing** | bcryptjs with 10 salt rounds — passwords are never stored in plain text |
| **JWT Authentication** | Tokens stored in HTTP-only cookies (not accessible via JavaScript) |
| **Cookie Security** | `SameSite=strict`, `httpOnly=true` — prevents XSS and CSRF cookie theft |
| **CSRF Protection** | Origin header validation via `csrf-csrf` middleware |
| **Rate Limiting** | 100 requests/15 min (general), 20 requests/15 min (auth routes) |
| **Input Validation** | Email validation via `validator`, password minimum length, field limits |
| **NoSQL Injection Prevention** | QR code return uses string type check to prevent object injection |
| **Token Expiry** | JWT: 7 days, OTP: 10 minutes, Password reset: 15 minutes |
| **Unverified Cleanup** | Auto-delete unverified accounts after 24 hours |
| **CORS** | Restricted to frontend URL only, credentials required |
| **Environment Variables** | All secrets stored in `.env` file, never committed to git |

---

## 📸 Screenshots

> *Add screenshots of the running application here to showcase the UI*

| Page | Description |
|------|-------------|
| **Home Page** | Hero section with animated feature highlights |
| **Book Catalog** | Grid view with search bar, star ratings, availability badges |
| **Book Detail** | Full book info, cover image, QR code, reviews section |
| **Admin Dashboard** | System-wide stats cards, top borrowed books |
| **Manage Books** | Table with add/edit/delete actions, QR code display |
| **Manage Users** | User list with role badges, promote/delete actions |
| **Borrow Records** | Filterable table of all borrow/return transactions |
| **Member Dashboard** | Personal stats + "Recommended For You" carousel |
| **My Books** | Currently borrowed books with due dates + waitlist entries |
| **Reading Analytics** | Bar chart, pie chart, 365-day heatmap, streak counter |
| **QR Scanner** | Camera-based QR scanning modal for book returns |
| **Login / Register** | Clean forms with validation messages |
| **OTP Verification** | 6-digit OTP input with resend button |

---

## 👥 Team Members

| Name | Enrollment Number |
|------|-------------------|
| **Aditya Pal** | 230302010307 |
| **Kunal Panchal** | 230302010367 |

**BCA Final Year Major Project — Smart Library Management System**

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🤝 Contributing

This is an academic project. Feel free to fork it and build upon it for your own learning!















































































# Smart Library Management System

A comprehensive, full-stack Smart Library Management System designed to streamline library operations, enhance user experience, and automate administrative tasks. This platform serves both library administrators and members, offering robust book tracking, an integrated QR scanning system for rapid checkout, and detailed reading analytics.

## 📖 Overview

The Smart Library Management System digitizes the traditional library experience. It provides a secure, role-based environment where administrators can seamlessly manage the catalog, oversee users, and process book issuances. Members can browse the catalog, request books, track their reading habits, and join waitlists for currently unavailable titles. 

Built with a modern tech stack (MERN), the system prioritizes security (HTTP-only cookies, CSRF protection, rate limiting) and user experience (responsive design, dark mode, smooth animations).

## ✨ Key Features

### 🔐 Authentication & Security
* **JWT & HTTP-Only Cookies:** Secure, stateful authentication without exposing tokens to local storage.
* **OTP Verification:** Email-based OTP verification for account registration and password resets.
* **Role-Based Access Control (RBAC):** Strict separation of privileges between `Admin` and `Member` accounts.
* **API Security:** Implemented Helmet, express-mongo-sanitize, CSRF protection, and rate limiting.

### 📚 Book & Catalog Management
* **Full CRUD Operations:** Admins can add, edit, delete, and view books.
* **Cloudinary Integration:** Direct upload and secure hosting for book cover images.
* **Waitlist System:** Members can join a queue for borrowed books and receive notifications when they become available.
* **Dynamic Catalog:** Advanced search and filtering by category, author, and availability.

### 🔄 Borrowing & Fine System
* **Automated Borrow Lifecycle:** Track issue dates, due dates, and return dates.
* **Fine Calculation:** Automated calculation of overdue fines (default: ₹5 per day).
* **Automated Emails:** Notifications for successful borrowing, returns, and overdue alerts via Nodemailer/Resend.

### 📷 Integrated QR Code Scanner
* **Rapid Issue/Return:** Admins and members can use device cameras (mobile or laptop) to instantly scan a book's QR code to issue or return it.
* **QR Generation:** Auto-generation of SVG QR codes for every book in the database.
* **Export Options:** Admins can download individual QR codes as PNGs or print them in an A4 grid format for physical book labeling.

### 📊 Dashboards & Analytics
* **Admin Dashboard:** High-level metrics on total books, active users, current borrows, and system alerts. Includes detailed tabular reports.
* **Member Dashboard:** Overview of currently held books, waitlist status, and recent activity.
* **Reading Analytics (Member):** Visual charts (via Recharts) showing monthly borrowing trends, category breakdown, reading streaks, and favorite authors.

### 🎨 Modern UI/UX
* **Fully Responsive:** Optimized for desktop, tablet, and mobile viewing.
* **Theming:** Full Dark/Light mode support with persistent state.
* **Animations:** Fluid page transitions and micro-interactions powered by Framer Motion.

---

## 🛠 Tech Stack

### Frontend
* **Core:** React 18, Vite
* **State Management:** Redux Toolkit, React-Redux
* **Routing:** React Router DOM (v6)
* **Styling:** Tailwind CSS, PostCSS, Autoprefixer
* **UI/UX:** Framer Motion (animations), Lucide React (icons), React Hot Toast (notifications)
* **Data Visualization:** Recharts
* **Hardware Integration:** html5-qrcode, qrcode.react

### Backend
* **Core:** Node.js, Express.js
* **Database:** MongoDB, Mongoose ORM
* **Authentication:** jsonwebtoken, bcryptjs, cookie-parser
* **Security:** helmet, cors, csrf-csrf, express-mongo-sanitize, express-rate-limit
* **File Uploads:** express-fileupload, Cloudinary
* **Email Services:** Nodemailer, Resend
* **Logging:** Pino, pino-http
* **Scheduling:** node-cron (for overdue checks)

---

## ⚙️ Architecture Overview

The application follows a standard Client-Server architecture utilizing the MERN stack:

1. **Client (React/Vite):** A Single Page Application (SPA) that manages UI state via Redux Toolkit. It communicates with the backend exclusively through RESTful API endpoints. Routes are lazy-loaded for performance optimization.
2. **Server (Express/Node):** A RESTful API that handles business logic, security middleware, and database connections. 
3. **Database (MongoDB):** Stores collections for `Users`, `Books`, `Borrows`, `Waitlists`, and `Reviews`.
4. **External Services:** 
   * **Cloudinary:** Used for storing book cover assets.
   * **Resend/SMTP:** Used for dispatching transactional emails (OTP, overdue notices).

---

## 🚀 Installation & Setup

### Environment Requirements
* Node.js (v18+ recommended)
* MongoDB (Local instance or MongoDB Atlas)
* Cloudinary Account (for image uploads)
* SMTP Server or Resend API Key (for emails)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smart-library-management-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory based on `.env.example`:
```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASS=your_email_password
EMAIL_FROM=noreply@smartlibrary.com
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 🏃 Running the Project

Open two terminal windows.

**Terminal 1: Start Backend Server**
```bash
cd backend
npm run dev
```

**Terminal 2: Start Frontend Development Server**
```bash
cd client
npm run dev
```

> **Note on Mobile QR Testing:** To test the QR scanner on a physical mobile device, the browser requires a secure context (HTTPS). You must expose your local frontend server via a tunnel (e.g., `npx localtunnel --port 5173`) and access the `https://*.loca.lt` URL on your phone.

---

## 🔌 API Overview

### Authentication (`/api/auth`)
* `POST /register` - Register a new user (sends OTP)
* `POST /verify-otp` - Verify email and activate account
* `POST /login` - Authenticate user and set HTTP-only cookie
* `POST /logout` - Clear authentication cookie
* `GET /me` - Get current logged-in user profile

### Books (`/api/books`)
* `GET /` - Get all books (with filtering/pagination)
* `GET /:id` - Get single book details
* `POST /` - Add a new book (Admin only)
* `PUT /:id` - Update book details (Admin only)
* `DELETE /:id` - Delete a book (Admin only)

### Borrowing (`/api/borrows`)
* `POST /issue` - Issue a book (via ID or QR)
* `POST /return` - Return a book (via ID or QR)
* `GET /my-borrows` - Get current user's borrowing history
* `GET /all` - Get all borrow records (Admin only)

### Analytics (`/api/analytics`)
* `GET /my-stats` - Get user reading statistics
* `GET /admin-summary` - Get system-wide metrics (Admin only)

---

## 📁 Folder Structure

```text
smart-library-management-system/
├── backend/
│   ├── config/          # Database and external service configurations
│   ├── controllers/     # Route request handlers
│   ├── middlewares/     # Auth, CSRF, error, and rate-limiting middlewares
│   ├── models/          # Mongoose schemas (User, Book, Borrow, etc.)
│   ├── routes/          # Express API route definitions
│   ├── services/        # Email and file upload business logic
│   ├── utils/           # Helper functions
│   └── server.js        # Main application entry point
│
└── client/
    ├── src/
    │   ├── components/  # Reusable UI components (Books, Common, Layout, UI)
    │   ├── layouts/     # Route shell layouts (Admin, Member, Public)
    │   ├── pages/       # Route-level components
    │   ├── redux/       # Redux Toolkit store and slices
    │   ├── App.jsx      # Main React component and router configuration
    │   └── main.jsx     # DOM entry point
    ├── index.html
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🧑‍💻 Usage Guide

### Member Flow
1. **Sign Up:** Register an account and verify via OTP.
2. **Browse Catalog:** Search for books by title, author, or category.
3. **Borrow Books:** If available, click "Borrow" to request a book. If unavailable, click "Join Waitlist".
4. **QR Scanner:** Use the floating action button to scan a physical book's QR code for instant borrowing.
5. **Analytics:** View reading habits, favorite categories, and streaks in the Analytics dashboard.

### Admin Flow
1. **Login:** Access the system with Admin credentials.
2. **Dashboard:** Monitor total books, active borrows, and overdue alerts.
3. **Manage Books:** Add new books (with cover uploads), edit details, or delete records. Print QR codes for physical labeling.
4. **Manage Users:** View user activity and manage roles/permissions.
5. **Process Returns:** Scan a returning book's QR code to instantly check it back into the system and calculate any applicable fines.

---

## ⚠️ Known Limitations
* **Local Network Camera Access:** The QR scanner utilizes `html5-qrcode` which relies on `navigator.mediaDevices`. Browsers strictly block this API on non-secure origins (HTTP) except for `localhost`. Testing on mobile devices within a local network requires an HTTPS tunnel.
* **File Uploads:** Book covers are currently uploaded synchronously during the book creation process. Large files on slow networks may cause the request to timeout.

---

## 🔮 Future Improvements
* **Payment Gateway Integration:** Implement Stripe or Razorpay to allow users to pay overdue fines directly through the portal.
* **E-Book Support:** Add the ability to upload and serve PDF/EPUB files for digital borrowing with DRM.
* **Automated Recommendations:** Build a collaborative filtering recommendation engine based on user borrow history and reviews.
* **Advanced Reporting:** Export admin reports to CSV/Excel formats for library audits.