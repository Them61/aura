# Netlify AI Project Context - Aura Microlocs

## Project Overview
**Aura Microlocs** is a professional hair care and styling service website for locs/dreadlocks care. The site handles customer inquiries, services booking, checkout, and order management.

**Repository**: https://github.com/Them61/aura.git  
**Deployment**: Netlify + Supabase  
**Status**: Recently migrated to Netlify Functions from Express backend

---

## Technology Stack

### Frontend
- **React** 19.2.3 with TypeScript
- **Vite** 6.2.0 (build tool)
- **React Router DOM** 7.12.0 (HashRouter for client-side routing)
- **Tailwind CSS** (styling via index.css)
- **Lucide React** (icons)

### Backend (Netlify Functions)
- **Netlify Functions** (serverless backend)
- **Stripe** 14.21.0 (payment processing)
- **Supabase** @2.39.0 (PostgreSQL database)
- **Google Gemini API** (AI chatbot via @google/genai)
- **EmailJS** (customer notifications)

### Development
- **Node.js** 18+ required
- **TypeScript** 5.8.2
- **tsx** (TypeScript executor)

---

## Project Structure

```
├── netlify/
│   └── functions/           # Netlify Functions (backend)
│       ├── create-checkout-session.ts    # Stripe checkout
│       ├── get-session.ts                # Retrieve order details
│       ├── save-order.ts                 # Save to Supabase
│       └── chat.ts                       # Gemini AI chatbot (CRITICAL: keeps API key secret)
├── pages/                   # Page components
│       ├── Home.tsx
│       ├── Services.tsx
│       ├── Checkout.tsx
│       ├── Contact.tsx
│       ├── ThankYou.tsx         # Post-checkout confirmation
│       ├── Profile.tsx
│       └── Auth.tsx
├── components/              # Reusable components
│       ├── Layout.tsx
│       ├── CartDrawer.tsx        # Shopping cart
│       └── Chatbot.tsx           # Chat interface (calls /api/chat)
├── services/                # Service layer
│       ├── geminiService.ts      # IMPORTANT: Now calls backend function
│       ├── emailService.ts
│       └── agentContext.ts
├── api/                     # Legacy API (can be removed)
│       ├── create-checkout-session.ts
│       └── get-session.ts
├── server/                  # Legacy Express server (NOT used in Netlify)
│       └── index.ts
├── App.tsx                  # Main router
├── index.tsx               # Entry point
├── vite-env.d.ts           # TypeScript env declarations
├── netlify.toml            # Netlify configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── .env.local              # Local environment variables (never commit)
```

---

## Key Architecture Decisions

### 1. **Netlify Functions instead of Express**
- **Why**: Simpler deployment, automatic scaling, no server management
- **How**: Each API endpoint is a separate function in `netlify/functions/`
- **Routing**: Configured via `netlify.toml` redirects

### 2. **Gemini API Security Fix**
- **Problem**: GEMINI_API_KEY was being exposed in frontend bundle (Netlify secrets scanning caught this)
- **Solution**: Created `netlify/functions/chat.ts` backend function
  - Frontend Chatbot calls `/api/chat` (redirects to function)
  - Only backend function has access to GEMINI_API_KEY
  - Key is **never** in frontend code

### 3. **Database: Supabase PostgreSQL**
- **Orders table**: Stores customer orders after Stripe payment
- **Row Level Security (RLS)**: Configured with policies
- **Accessed via**: `netlify/functions/save-order.ts`

### 4. **Client-side Routing**
- Using **HashRouter** (#/) instead of BrowserRouter
- Why: Works seamlessly with Netlify without special redirects for SPA routes
- Fallback redirect in netlify.toml for catch-all routes

---

## Environment Variables

### **PRIVATE (Server-only, never expose in frontend)**
```
GEMINI_API_KEY              # Google Gemini API access (used in netlify/functions/chat.ts)
STRIPE_SECRET_KEY           # Stripe secret for backend (used in checkout functions)
SUPABASE_ANON_KEY          # Database client access (used in save-order function)
```

### **PUBLIC (Safe in frontend)**
```
VITE_STRIPE_PUBLISHABLE_KEY # Stripe public key (for client-side Stripe.js)
VITE_STRIPE_API_ENDPOINT    # Backend API endpoint (/api/create-checkout-session)
SUPABASE_URL                # Database URL (public, no secrets)
VITE_DEV_SERVER_URL         # Site URL (auto-set by Netlify via URL variable)
```

---

## Critical Integration Points

### 1. **Stripe Checkout Flow**
```
User adds service → Cart (CartDrawer.tsx)
    ↓
Click "Proceed to Checkout" → Checkout.tsx
    ↓
Enter email → Click "Pay with Stripe"
    ↓
Call /api/create-checkout-session (netlify/functions/create-checkout-session.ts)
    ↓
Stripe returns session.url
    ↓
Redirect to Stripe Hosted Checkout
    ↓
User completes payment
    ↓
Stripe redirects to /checkout/success?session_id=...
    ↓
ThankYou.tsx component:
  - Fetches session via /api/get-session
  - Calls /api/save-order to store in Supabase
  - Clears cart
```

### 2. **Chatbot Flow**
```
User types message in Chatbot.tsx
    ↓
Calls streamChatResponse() from geminiService.ts
    ↓
geminiService.ts calls POST /api/chat with message + history
    ↓
netlify/functions/chat.ts:
  - Receives request with message
  - Uses GEMINI_API_KEY (server-side, secret)
  - Calls Gemini API
  - Returns response to frontend
    ↓
Chatbot displays response in UI
```

### 3. **Contact Form Flow**
```
User fills contact form (Contact.tsx)
    ↓
Calls emailService.sendEmail()
    ↓
EmailJS API (pre-configured with templates)
    ↓
Email sent to customer
    ↓
Notification email sent to admin
```

---

## Recent Changes & Fixes

### ✅ Security Fix (Latest)
- Moved Gemini API key from frontend to `netlify/functions/chat.ts`
- Prevents secrets scanning failures on Netlify
- Chatbot now uses backend proxy instead of direct API access

### ✅ Supabase Integration
- Created `orders` table schema
- Implemented `netlify/functions/save-order.ts`
- ThankYou.tsx saves orders after payment

### ✅ Thank You Page
- Created post-checkout confirmation page
- Shows order details, customer info, next steps
- Clears cart on mount

### ✅ GitHub Repository
- Clean repository with no secrets
- All API keys in `.env.local` (in .gitignore)
- Documentation updated

---

## Known Issues & Solutions

### Issue: "GEMINI_API_KEY exposed in frontend bundle"
**Status**: ✅ FIXED
**Solution**: Created backend chat function, removed from frontend

### Issue: Port conflicts during local dev
**Status**: ✅ FIXED
**Solution**: Frontend on 3000, backend on 3003

### Issue: TypeScript strict mode errors
**Status**: ✅ FIXED  
**Solution**: Disabled strict mode, added vite-env.d.ts for type declarations

---

## Local Development Setup

```bash
# Install dependencies
npm install

# Run frontend + backend concurrently
npm run dev:all

# Frontend: http://localhost:3000
# Backend: http://localhost:3003

# Or run separately:
npm run dev           # Frontend only (port 3000)
npm run dev:server    # Backend only (port 3003)
```

### Important Notes
- `server/index.ts` is the old Express server (NOT used in Netlify production)
- Local backend uses same endpoints as Netlify Functions for consistency
- Environment variables loaded from `.env.local`

---

## Netlify Deployment Configuration

### Build Settings (from netlify.toml)
```toml
[build]
  base = "."
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"  # Route API calls to functions
  
[[redirects]]
  from = "/*"
  to = "/index.html"  # SPA fallback for HashRouter
```

### Required Environment Variables in Netlify UI
1. `GEMINI_API_KEY` - 🔒 Private
2. `STRIPE_SECRET_KEY` - 🔒 Private  
3. `SUPABASE_ANON_KEY` - 🔒 Private
4. `VITE_STRIPE_PUBLISHABLE_KEY` - Public
5. `VITE_STRIPE_API_ENDPOINT` - Public
6. `SUPABASE_URL` - Public

---

## Database Schema (Supabase)

### orders table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  items JSONB NOT NULL,
  amount_total INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  payment_status TEXT DEFAULT 'paid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Testing Checklist

- [ ] Frontend builds without secrets in output
- [ ] Chatbot responds (calls `/api/chat` successfully)
- [ ] Stripe checkout creates session
- [ ] Thank you page displays order details
- [ ] Orders appear in Supabase dashboard
- [ ] Contact form sends emails
- [ ] All pages load on Netlify URL
- [ ] No console errors related to missing env vars

---

## Common Initialization Issues & Solutions

### Issue: "Cannot find module @google/genai"
**Solution**: Run `npm install @google/genai` - package should be in package.json

### Issue: "GEMINI_API_KEY is undefined in Netlify Function"
**Solution**: 
1. Verify `GEMINI_API_KEY` is added in Netlify UI environment variables
2. Check function logs in Netlify Dashboard → Functions
3. Ensure function has access to environment variables

### Issue: Chatbot returns 404 (function not found)
**Solution**:
1. Verify `netlify/functions/chat.ts` exists
2. Check `netlify.toml` has API redirect configured
3. Verify build output includes `functions` directory

### Issue: Database orders not saving
**Solution**:
1. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
2. Check Supabase table exists and has RLS policies configured
3. Review Netlify Function logs for save-order errors

---

## Code Quality & Standards

- **TypeScript**: Strict typing where possible (non-strict mode for pragmatism)
- **Error Handling**: Try-catch blocks in all async functions
- **CORS**: All Netlify Functions include CORS headers
- **API Patterns**: RESTful endpoints with status codes
- **Environment**: `.env.local` for local dev, Netlify UI for production

---

## Support & Debugging

### Check Netlify Logs
1. Dashboard → Deploys → Click deploy → View logs
2. Look for build errors or function errors

### Check Function Logs
1. Dashboard → Functions → Click function name
2. View real-time logs from function executions

### Check Browser Console
1. F12 → Console tab
2. Look for fetch errors, CORS issues, or API failures

### Local Testing First
1. Run `npm run dev:all` locally
2. Test all flows before pushing to GitHub
3. Netlify will auto-deploy on push to main

---

## Contacts & Important Info

- **Repository**: https://github.com/Them61/aura.git
- **Netlify Project**: (Your site URL from Netlify dashboard)
- **Supabase Project**: (Your Supabase URL)
- **Business Phone**: 438-933-6195 (used in fallback messages)
- **Services Location**: Montreal, Canada
