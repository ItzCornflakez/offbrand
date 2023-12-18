-- AlterTable
ALTER TABLE `category` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW();

-- AlterTable
ALTER TABLE `inventory` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW();

-- AlterTable
ALTER TABLE `product` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW();
