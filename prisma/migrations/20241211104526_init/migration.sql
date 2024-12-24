-- AlterTable
ALTER TABLE "bc_streaming_package" ALTER COLUMN "monthly_price_cents" DROP NOT NULL,
ALTER COLUMN "monthly_price_yearly_subscription_in_cents" DROP NOT NULL;
