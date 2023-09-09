/*
  Warnings:

  - The values [Info Cara Pembayaran] on the enum `infos_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `infos` MODIFY `type` ENUM('Pendaftaran', 'Hak & Kewajiban', 'Sanksi', 'Fasilitas & Manfaat', 'Cara Pembayaran', 'FAQ') NOT NULL,
    MODIFY `content` LONGTEXT NOT NULL;
