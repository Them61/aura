# Supabase Database Setup for Aura Microlocs

## Step 1: Create Supabase Account and Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up
3. Create a new project:
   - **Project name**: aura-microlocs (or your preferred name)
   - **Database password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your location
   - Wait 2-3 minutes for project to be created

## Step 2: Create Orders Table

1. In your Supabase project dashboard, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the SQL below:

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

-- Create index for faster lookups
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_session_id ON orders(session_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserting orders (from your backend function)
CREATE POLICY "Allow service role to insert orders" 
  ON orders 
  FOR INSERT 
  TO service_role 
  WITH CHECK (true);

-- Create policy to allow reading orders (for admins/authenticated users)
CREATE POLICY "Allow authenticated users to read orders" 
  ON orders 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Optional: Allow customers to view their own orders
CREATE POLICY "Allow customers to view their own orders" 
  ON orders 
  FOR SELECT 
  TO anon 
  USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');
```

4. Click **Run** to execute the SQL
5. You should see "Success. No rows returned" message

## Step 3: Get Your Supabase Credentials

1. Click **Settings** (gear icon) in the left sidebar
2. Click **API** under Configuration
3. You'll need these two values:

   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string starting with eyJ)

4. Save these for the next step!

## Step 4: Test Your Database (Optional)

Run this query to verify the table was created:

```sql
SELECT * FROM orders;
```

You should see an empty result set (no errors).

## Sample Order Record Structure

Here's what an order record looks like:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "session_id": "cs_test_abc123...",
  "customer_email": "customer@example.com",
  "customer_name": "John Doe",
  "items": [
    {
      "name": "Starter Locs",
      "price": 150,
      "quantity": 1,
      "description": "Initial loc formation"
    }
  ],
  "amount_total": 15000,
  "currency": "usd",
  "payment_status": "paid",
  "created_at": "2024-01-15T10:30:00Z"
}
```

## Next Steps

After completing this setup:
1. Add Supabase credentials to Netlify environment variables
2. Deploy your site to Netlify
3. Orders will be automatically saved after each successful payment

## Viewing Orders

To view all orders in Supabase:

1. Go to **Table Editor** in left sidebar
2. Click on **orders** table
3. You'll see all customer orders with their details
