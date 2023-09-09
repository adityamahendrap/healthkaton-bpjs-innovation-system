-- CreateTable
CREATE TABLE `infos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('Pendaftaran', 'Hak & Kewajiban', 'Sanksi', 'Fasilitas & Manfaat', 'Info Cara Pembayaran', 'FAQ') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
