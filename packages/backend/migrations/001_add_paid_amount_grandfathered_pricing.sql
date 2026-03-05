-- Migration: Add grandfathered pricing support
-- This adds the paidAmount column to track what users originally paid,
-- enabling them to keep their rate even if prices are raised.
--
-- DEPLOYMENT ORDER:
-- 1. Run this migration (adds column + backfills current prices)
-- 2. Deploy the new code
-- 3. Raise prices in the Blinkord dashboard
--
-- If you run this AFTER raising prices, the backfill will use the NEW prices
-- and existing subscribers won't get grandfathered rates. Run it FIRST.

-- Step 1: Add the paidAmount column
ALTER TABLE role_purchase ADD COLUMN IF NOT EXISTS "paidAmount" decimal(9,5);

-- Step 2: Backfill existing records with current role prices
-- This captures the price each user paid BEFORE any price changes
UPDATE role_purchase rp
SET "paidAmount" = r.amount
FROM role r
WHERE rp."roleId" = r.id
  AND rp."paidAmount" IS NULL;
