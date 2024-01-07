/*
  Warnings:

  - You are about to drop the column `order_id` on the `users` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `order_id`,
    ADD COLUMN `user_id` INTEGER NOT NULL;
