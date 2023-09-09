/*
  Warnings:

  - You are about to drop the `bedclass` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `beds` DROP FOREIGN KEY `beds_bedclass_id_fkey`;

-- DropTable
DROP TABLE `bedclass`;

-- CreateTable
CREATE TABLE `bedclasses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `beds` ADD CONSTRAINT `beds_bedclass_id_fkey` FOREIGN KEY (`bedclass_id`) REFERENCES `bedclasses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
