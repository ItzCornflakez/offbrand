/*
  Warnings:

  - Added the required column `product_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `product_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `order_id` INTEGER NOT NULL;
