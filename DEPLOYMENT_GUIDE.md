# Complete Deployment & Setup Checklist

## 1. ✅ ALREADY CONFIGURED
- [x] Frontend (React + TypeScript + Vite)
- [x] Backend (Express server for Stripe)
- [x] Thank You Page (Order confirmation)
- [x] Stripe Integration (Payments)
- [x] EmailJS Setup (Email notifications)
- [x] Gemini AI Chatbot (API ready)
- [x] TypeScript Configuration

## 2. 🔧 NEED TO CONFIGURE BEFORE DEPLOYMENT

### A. **Email Service (EmailJS)** - CRITICAL
**Status**: Already in code, needs verification
- [ ] Verify EmailJS Public Key: `ieVFxq_2dKb6KsOOO`
- [ ] Verify Service ID: `service_13jnj44`
- [ ] Verify Templates are active:
  - [ ] TO_OWNER: `template_w6pm6jm`
  - [ ] TO_CLIENT: `template_58yo7aw`
- [ ] Test email sending in development
- [ ] Update owner email if needed: `aterne9@gmail.com`

### B. **Stripe Configuration** - CRITICAL
- [ ] Get Stripe Test API Keys from https://dashboard.stripe.com
- [ ] Replace in `.env.local`:
  - [ ] `VITE_STRIPE_PUBLISHABLE_KEY` (pk_test_...)
  - [ ] `STRIPE_SECRET_KEY` (sk_test_...)
- [ ] Test full checkout flow with test card: 4242 4242 4242 4242
- [ ] When ready for production, get Live Keys and switch

### C. **Gemini AI** - IMPORTANT
- [ ] Get Gemini API Key from https://makersuite.google.com/app/apikey
- [ ] Add to `.env.local`: `GEMINI_API_KEY=your_key_here`
- [ ] Test chatbot functionality

### D. **Environment Variables Setup** - CRITICAL
When deploying, configure these in your hosting platform:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_API_ENDPOINT=https://your-domain.com/api/create-checkout-session
GEMINI_API_KEY=your_gemini_key
```

## 3. 🗄️ DATABASE QUESTION - DO YOU NEED IT?

**Short Answer**: No, not strictly required, but recommended for production.

**What you can do WITHOUT a database:**
- ✅ Accept payments via Stripe
- ✅ Send confirmation emails via EmailJS
- ✅ Display thank you page with order details
- ✅ Store order history in Stripe dashboard

**What you SHOULD add WITH a database (Optional but Recommended):**
- [ ] Store customer orders locally
- [ ] View order history for customers
- [ ] Track service completion status
- [ ] Manage customer profiles
- [ ] Analytics and reporting

**Recommended Database Options:**
1. **Supabase** (Best for Netlify/Vercel)
   - Free tier: 500MB database
   - Easy integration with Stripe webhooks
   - Built-in PostgreSQL

2. **MongoDB Atlas** (Cloud NoSQL)
   - Free tier: 512MB storage
   - Good for flexible data structure
   - Easy REST API

3. **Firebase** (Google's solution)
   - Real-time database
   - Integrates well with APIs
   - Free tier available

## 4. 🚀 DEPLOYMENT CHECKLIST

### Choose Your Platform (Pick One):

#### **Option A: Netlify** (Recommended for beginners)
- [ ] Create account at https://app.netlify.com
- [ ] Connect your GitHub repo
- [ ] Set environment variables in Netlify UI
- [ ] Deploy (automatic on each push)
- [ ] Backend: Use Netlify Functions or keep external

#### **Option B: Vercel** (Also great)
- [ ] Create account at https://vercel.com
- [ ] Connect your GitHub repo
- [ ] Set environment variables
- [ ] Deploy (automatic)
- [ ] API routes work automatically

#### **Option C: Keep Backend Separate**
- [ ] Deploy frontend to Netlify/Vercel
- [ ] Deploy backend to Render.com or Railway.app
- [ ] Update `VITE_STRIPE_API_ENDPOINT` to backend URL

## 5. 🧪 TESTING CHECKLIST (Before Deployment)

- [ ] **Checkout Flow**:
  - [ ] Add item to cart
  - [ ] Go to checkout
  - [ ] Test payment with 4242 4242 4242 4242
  - [ ] See thank you page
  - [ ] Cart is cleared

- [ ] **Emails**:
  - [ ] Check inbox for order confirmation
  - [ ] Check spelling and formatting
  - [ ] Verify all customer info is correct

- [ ] **Chatbot**:
  - [ ] Test Gemini AI responses
  - [ ] Check conversation flow

- [ ] **Responsive Design**:
  - [ ] Test on mobile
  - [ ] Test on tablet
  - [ ] Test on desktop

## 6. 📋 MINIMAL SETUP (To get live TODAY)

If you just want to go live quickly without database:

1. **Add your keys to `.env.local`**:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
   STRIPE_SECRET_KEY=sk_test_YOUR_KEY
   GEMINI_API_KEY=YOUR_KEY
   ```

2. **Deploy frontend to Netlify**:
   - Connect GitHub repo
   - Add env vars in Netlify UI
   - Deploy

3. **Deploy backend to Railway/Render**:
   - Connect GitHub repo
   - Add env vars
   - Get backend URL

4. **Update frontend**:
   - Set `VITE_STRIPE_API_ENDPOINT` to your backend URL
   - Commit and push
   - Netlify auto-deploys

## 7. 💡 RECOMMENDED SETUP (For Production Quality)

1. **Deploy to Netlify** + **Supabase Database**
2. **Set up Stripe Webhooks** to track payments
3. **Add order history endpoint** to save to Supabase
4. **Email confirmations** via EmailJS (already done!)
5. **Monitor with** Sentry or similar error tracking

## 8. ⚠️ IMPORTANT SECURITY REMINDERS

- ⚠️ NEVER commit `.env.local` to GitHub
- ⚠️ NEVER expose `STRIPE_SECRET_KEY` on frontend
- ⚠️ ALWAYS use HTTPS in production
- ⚠️ Keep API keys in hosting platform environment variables
- ⚠️ Rotate keys periodically

---

## What to do FIRST:

1. **Get your API keys ready**:
   - Stripe: https://dashboard.stripe.com/apikeys
   - Gemini: https://makersuite.google.com/app/apikey
   - EmailJS: (already configured)

2. **Test locally**:
   - Run `npm install` and `npm run dev:all`
   - Complete a test purchase
   - Check email

3. **Deploy**:
   - Choose Netlify or Vercel
   - Push to GitHub
   - Set environment variables
   - Go live!

Would you like me to help with any specific step?
