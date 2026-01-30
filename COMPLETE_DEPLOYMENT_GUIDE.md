# Complete Deployment Guide: Netlify + Supabase

This guide will walk you through deploying your Aura Microlocs website to Netlify with Supabase database integration.

## Prerequisites Checklist

✅ GitHub repository: https://github.com/Them61/aura.git  
✅ Gemini API Key (from Google AI Studio)  
✅ Stripe Publishable Key (from Stripe Dashboard)  
✅ Stripe Secret Key (from Stripe Dashboard)  

---

## Part 1: Set Up Supabase Database (15 minutes)

### Step 1: Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** → Sign up with GitHub (easiest)
3. Authorize Supabase to access your GitHub account

### Step 2: Create New Project
1. Click **"New project"**
2. Fill in:
   - **Organization**: Select or create one
   - **Name**: `aura-microlocs`
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you (e.g., `us-east-1`)
3. Click **"Create new project"**
4. ⏳ Wait 2-3 minutes while your database is provisioned

### Step 3: Create Orders Table
1. In left sidebar, click **"SQL Editor"**
2. Click **"+ New query"**
3. Copy and paste this SQL:

```sql
-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  items JSONB NOT NULL,
  amount_total INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  payment_status TEXT DEFAULT 'paid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_session_id ON orders(session_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow backend to insert orders
CREATE POLICY "Allow service role to insert orders" 
  ON orders 
  FOR INSERT 
  TO service_role 
  WITH CHECK (true);

-- Allow authenticated users to read all orders
CREATE POLICY "Allow authenticated users to read orders" 
  ON orders 
  FOR SELECT 
  TO authenticated 
  USING (true);
```

4. Click **"Run"** (or press Ctrl+Enter)
5. You should see: ✅ **"Success. No rows returned"**

### Step 4: Get Supabase Credentials
1. Click **⚙️ Settings** in left sidebar
2. Click **"API"** under Project Settings
3. Copy these values (you'll need them for Netlify):

   📋 **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`  
   📋 **service_role key**: `eyJhbGc...` (long secret string)

4. Keep this tab open for later!

---

## Part 2: Deploy to Netlify (10 minutes)

### Step 1: Create Netlify Account
1. Go to [https://netlify.com](https://netlify.com)
2. Click **"Sign up"** → Choose **"GitHub"** (easiest)
3. Authorize Netlify to access your GitHub

### Step 2: Import Your Project
1. Click **"Add new site"** → **"Import an existing project"**
2. Click **"Deploy with GitHub"**
3. Search for `aura` and select your `Them61/aura` repository
4. Click on it to configure

### Step 3: Configure Build Settings
1. You should see:
   - **Branch to deploy**: `main` ✅
   - **Build command**: `npm run build` ✅
   - **Publish directory**: `dist` ✅
   
   (These are auto-detected from your `netlify.toml`)

2. Click **"Show advanced"** → **"New variable"**

### Step 4: Add Environment Variables
Add these **7 environment variables** one by one:

| Variable Name | Value | Type |
|--------------|--------|------|
| `GEMINI_API_KEY` | Your Gemini API key | 🔒 **PRIVATE** |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` (from Stripe) | 🌐 Public |
| `STRIPE_SECRET_KEY` | `sk_test_...` (from Stripe) | 🔒 **PRIVATE** |
| `VITE_STRIPE_API_ENDPOINT` | `/api/create-checkout-session` | 🌐 Public |
| `SUPABASE_URL` | *(Your Supabase Project URL)* | 🌐 Public |
| `SUPABASE_ANON_KEY` | *(Your Supabase service_role key)* | 🔒 **PRIVATE** |
| `VITE_DEV_SERVER_URL` | `https://your-site.netlify.app` | 🌐 Public |

> ⚠️ **CRITICAL**: For `VITE_STRIPE_API_ENDPOINT`, do **NOT** put a Stripe key here. It MUST be the text: `/api/create-checkout-session`

**🔒 Private (Secret) Variables** - Only on server/Netlify backend:
- `GEMINI_API_KEY` - API access to Google's Gemini service
- `STRIPE_SECRET_KEY` - Full access to Stripe payments (NEVER expose!)
- `SUPABASE_ANON_KEY` - Database access credentials

> **Note**: 
> - `URL` is **automatically set by Netlify** with your deployed site URL - don't add it manually!
> - For `VITE_DEV_SERVER_URL`, you can add it after deployment. Netlify will automatically provide it via the `URL` variable.

### Step 5: Deploy!
1. Click **"Deploy aura"**
2. ⏳ Wait 2-3 minutes for the build to complete
3. You'll see: **"Site is live"** 🎉

### Step 6: Update URL Variables
1. Copy your new site URL (e.g., `https://clever-fox-123456.netlify.app`)
2. Go to **Site configuration** → **Environment variables**
3. Add/Update these two:
   - `VITE_DEV_SERVER_URL`: Your Netlify URL
   - `URL`: Your Netlify URL
4. Click **"Deploys"** → **"Trigger deploy"** → **"Deploy site"**

---

## Part 3: Install Dependencies & Push Updates (5 minutes)

### Step 1: Install Supabase Package
Open your terminal in the project directory:

```bash
npm install @supabase/supabase-js@^2.39.0
```

### Step 2: Commit and Push Changes
```bash
git add .
git commit -m "feat: Add Supabase integration and Netlify Functions"
git push origin main
```

Netlify will automatically detect the push and redeploy your site! ⚡

---

## Part 4: Test Your Deployment (5 minutes)

### Test Checklist

1. **✅ Homepage loads**
   - Visit your Netlify URL
   - Check that all pages load (Home, Services, Contact)

2. **✅ Chatbot works**
   - Click the chat icon in bottom-right
   - Send a test message
   - Verify Gemini API responds

3. **✅ Contact form works**
   - Fill out the contact form
   - Submit it
   - Check your email for the confirmation

4. **✅ Checkout works**
   - Add a service to cart
   - Click "Proceed to Checkout"
   - Click "Pay with Stripe"
   - Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/25`)
   - CVC: Any 3 digits (e.g., `123`)
   - Click "Pay"

5. **✅ Thank you page appears**
   - After payment, you should be redirected
   - See order confirmation
   - Order details displayed

6. **✅ Order saved to database**
   - Go back to Supabase dashboard
   - Click **"Table Editor"** in left sidebar
   - Click **"orders"** table
   - You should see your test order! 🎉

---

## Part 5: View Customer Orders in Supabase

### Quick View
1. Go to Supabase dashboard
2. Click **"Table Editor"**
3. Click **"orders"** table
4. You'll see all customer orders with:
   - Customer email
   - Items purchased
   - Amount paid
   - Date/time

### Run Custom Queries
In **SQL Editor**, try these:

```sql
-- View all orders
SELECT * FROM orders ORDER BY created_at DESC;

-- View orders by email
SELECT * FROM orders WHERE customer_email = 'customer@example.com';

-- Count total orders
SELECT COUNT(*) as total_orders FROM orders;

-- Calculate total revenue
SELECT SUM(amount_total) / 100.0 as total_revenue FROM orders;
```

---

## Troubleshooting

### Build Fails on Netlify
- Check the **Deploys** tab for error logs
- Common issue: Missing environment variables
- Solution: Verify all 8 variables are set correctly

### Checkout Not Working
- Open browser console (F12)
- Look for errors related to Stripe
- Check that `STRIPE_SECRET_KEY` is set in Netlify
- Verify API endpoint is `/api/create-checkout-session`

### Stripe Webhook Failures (Email from Stripe)
If you received an email about webhook failures at a Supabase URL:
1. This is because Stripe is still trying to talk to an old Supabase project.
2. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks).
3. **Delete** the old webhook URL (`...supabase.co/functions/...`).
4. **Add a new endpoint**:
   - **URL**: `https://your-site-name.netlify.app/api/stripe-webhook`
   - **Events**: `checkout.session.completed`
5. Get the **Webhook Secret** (starts with `whsec_`) and add it to Netlify Environment Variables as `STRIPE_WEBHOOK_SECRET`.

### Orders Not Saving to Database
- Check Netlify Function logs: **Functions** tab
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Test the table manually in Supabase SQL Editor:
  ```sql
  INSERT INTO orders (session_id, customer_email, items, amount_total)
  VALUES ('test123', 'test@example.com', '[]'::jsonb, 5000);
  ```

### Chatbot Not Responding
- Check that `GEMINI_API_KEY` is set in Netlify environment variables
- Open browser console and look for API errors
- Verify the key has no extra spaces

---

## Next Steps

### Custom Domain (Optional)
1. In Netlify, go to **Domain management**
2. Click **"Add custom domain"**
3. Follow instructions to connect your domain
4. SSL certificate is automatic! 🔒

### Switch to Production Stripe Keys
When ready to accept real payments:
1. Get production keys from Stripe dashboard
2. In Netlify, update environment variables:
   - Replace `pk_test_...` with `pk_live_...`
   - Replace `sk_test_...` with `sk_live_...`
3. Trigger a new deploy

### Email Notifications for New Orders
Consider setting up email alerts when orders come in:
1. Use Supabase Database Webhooks
2. Or add a Netlify Function to send emails via EmailJS

---

## Support

If you encounter any issues:
1. Check Netlify deploy logs
2. Check browser console for errors
3. Review Supabase Function logs
4. Test locally first with `npm run dev:all`

**Your site is now live! 🚀**

Test it thoroughly, and when ready, share your Netlify URL with customers!
