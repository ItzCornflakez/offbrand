/*
  Warnings:

  - You are about to drop the column `inventory_id` on the `product` table. All the data in the column will be lost.
  - Made the column `name` on table `discount` required. This step will fail if there are existing NULL values in that column.
  - Made the column `desc` on table `discount` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `productId` to the `product_inventory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `product_inventory_id_fkey`;

-- AlterTable
ALTER TABLE `discount` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `desc` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `inventory_id`;

-- AlterTable
ALTER TABLE `product_inventory` ADD COLUMN `productId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `product_inventory` ADD CONSTRAINT `product_inventory_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
