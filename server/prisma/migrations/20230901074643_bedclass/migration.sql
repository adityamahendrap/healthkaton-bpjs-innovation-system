/*
  Warnings:

  - You are about to drop the column `class` on the `beds` table. All the data in the column will be lost.
  - Added the required column `bedclass_id` to the `beds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `beds` DROP COLUMN `class`,
    ADD COLUMN `bedclass_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `bedclass` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `beds` ADD CONSTRAINT `beds_bedclass_id_fkey` FOREIGN KEY (`bedclass_id`) REFERENCES `bedclass`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
