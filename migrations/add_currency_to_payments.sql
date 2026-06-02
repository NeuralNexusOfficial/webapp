-- ===================================================================
-- SQL Migration: Add Currency Field to Payments Table
-- ===================================================================
-- This migration adds support for multiple currencies (USD, INR) in the payments table
-- Run this in your Supabase SQL Editor

-- Step 1: Add currency column to payments table
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'INR';

-- Step 2: Add constraint to validate currency values
ALTER TABLE payments
DROP CONSTRAINT IF EXISTS payments_currency_check;

ALTER TABLE payments
ADD CONSTRAINT payments_currency_check 
CHECK (currency IN ('USD', 'INR'));

-- Step 3: Update existing records to INR (default fallback if NULL)
UPDATE payments 
SET currency = 'INR' 
WHERE currency IS NULL OR currency = '';

-- Step 4: Make the column NOT NULL after updating existing records
ALTER TABLE payments
ALTER COLUMN currency SET NOT NULL;

-- Step 5: Add index for currency queries (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_payments_currency ON payments(currency);

-- ===================================================================
-- NEXT: Run the backfill endpoint after this migration
-- ===================================================================
-- Once this SQL migration is applied, run the backfill API to fetch
-- actual currencies from Razorpay for existing payments:
--
-- Endpoint: GET /api/admin/backfill-payment-currency
--
-- This will:
-- 1. Find all payments without currency info (or with default INR)
-- 2. Query Razorpay API for the actual order currency
-- 3. Update the database with correct USD/INR values
--
-- ===================================================================
-- Verification
-- ===================================================================
-- After migration, check the updated table structure:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'payments' AND column_name = 'currency';
--
-- Check currency distribution:
-- SELECT currency, COUNT(*) as count FROM payments GROUP BY currency;

