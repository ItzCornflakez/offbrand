-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `comment` VARCHAR(191) NOT NULL,
    `dislikes` INTEGER NOT NULL,
    `likes` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
