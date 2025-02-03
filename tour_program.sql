-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Anamakine: localhost:3306
-- Üretim Zamanı: 03 Şub 2025, 22:59:26
-- Sunucu sürümü: 8.0.41-0ubuntu0.24.04.1
-- PHP Sürümü: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `tour_program`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `agencyprovider`
--

CREATE TABLE `agencyprovider` (
  `id` int NOT NULL,
  `companyRef` varchar(50) NOT NULL,
  `company_name` varchar(50) NOT NULL,
  `phone_number` varchar(100) NOT NULL,
  `status` int NOT NULL,
  `company_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `agencyprovider`
--

INSERT INTO `agencyprovider` (`id`, `companyRef`, `company_name`, `phone_number`, `status`, `company_id`) VALUES
(359, 'MJ20MWNZ', 'oncu', '505 232 5082', 1, 76),
(360, 'MXYXKTMU', 'ilksirket', '505 232 5041', 1, 76);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `agencyrolemembers`
--

CREATE TABLE `agencyrolemembers` (
  `id` int NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `agencyrolemembers`
--

INSERT INTO `agencyrolemembers` (`id`, `username`, `position`, `password`, `company_id`, `created_at`) VALUES
(73, 'admin', 'admin', '$2b$10$TFre8ZUtzZHCmhs3rC2OLeFdsDZJclQDg.bsUBPYKccqD0yC1JDXm', 76, '2025-02-01 17:33:11'),
(74, 'yusuf', 'operasyon', '$2b$10$VxANN/tEHeE1cpz0D.HRh.yOmBa8KHP4ZvtFRqdpRb6Z/up8xBsXe', 76, '2025-02-02 00:08:26'),
(75, 'admin', 'admin', '$2b$10$rqcCbAn2z2likbQcjYdVjut4DyeeHTXkSH9x2sBCLd8pu1QItYCqi', 77, '2025-02-02 00:21:27');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `agency_provider_settings`
--

CREATE TABLE `agency_provider_settings` (
  `id` int NOT NULL,
  `provider_id` varchar(255) NOT NULL,
  `earnings` decimal(10,2) DEFAULT '0.00',
  `promotion_rate` decimal(5,2) DEFAULT '0.00',
  `revenue` decimal(10,2) DEFAULT '0.00',
  `currency` varchar(3) DEFAULT 'EUR',
  `pax_adult` int DEFAULT '0',
  `pax_child` int DEFAULT '0',
  `pax_free` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `agency_provider_settings`
--

INSERT INTO `agency_provider_settings` (`id`, `provider_id`, `earnings`, `promotion_rate`, `revenue`, `currency`, `pax_adult`, `pax_child`, `pax_free`, `created_at`, `updated_at`) VALUES
(25, 'MJ20MWNZ', 100.00, 40.00, 1000.00, 'EUR', 10, 5, 0, '2025-02-03 22:34:30', '2025-02-03 22:34:30'),
(26, 'MXYXKTMU', 1200.00, 40.00, 3000.00, 'EUR', 300, 200, 0, '2025-02-03 22:34:30', '2025-02-03 22:34:30');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `areaslist`
--

CREATE TABLE `areaslist` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `region_id` int NOT NULL,
  `company_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `areaslist`
--

INSERT INTO `areaslist` (`id`, `name`, `region_id`, `company_id`, `created_at`, `updated_at`) VALUES
(811, 'SIDE', 394, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(812, 'COLAKLI', 394, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(813, 'GUNDOGDU', 394, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(814, 'EVRENSEKI', 394, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(815, 'KIZILOT', 394, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(816, 'KIZILAGAC', 394, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(817, 'TITREYENGOL', 394, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(818, 'KUMKOY', 394, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(819, 'ALANYA', 395, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(820, 'TURKLER', 395, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(821, 'PAYALLAR', 395, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(822, 'OKURCALAR', 395, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(823, 'MAHMUTLAR', 395, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(824, 'OBA', 395, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(825, 'ALANYA', 395, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(826, 'KONAKLI', 395, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(827, 'TURKLER', 395, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(828, 'AVSALLAR', 395, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(829, 'OKURCALAR', 395, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(830, 'CENGER', 395, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(831, 'KIZILOT', 395, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(832, 'KIZILAGAC', 395, 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `companyusers`
--

CREATE TABLE `companyusers` (
  `id` int NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `position` varchar(50) NOT NULL,
  `ref_code` varchar(50) NOT NULL,
  `company_user` varchar(100) NOT NULL,
  `company_pass` varchar(100) NOT NULL,
  `duration_use` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `verification` varchar(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `companyusers`
--

INSERT INTO `companyusers` (`id`, `company_name`, `position`, `ref_code`, `company_user`, `company_pass`, `duration_use`, `created_at`, `verification`) VALUES
(76, 'maxtoria', 'Agency', 'MAX2810', 'maxtoria', '$2b$10$kZ3Ar/Lw1/UyAVqiFc0PBOFOHgyDFqQ2.468smQ6VF.C8qHA1/BOq', '1', '2025-02-01 17:32:03', 'OOD1PO'),
(77, 'w2meet', 'Agency', 'W2M2628', 'w2meet', '$2b$10$6wbY2bxy/f1jE1ZIbtdStupbv9Gbc8GulvqqBVR8mlntk.LX8Y8NO', '1', '2025-02-02 00:20:28', 'GKFI2Y');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `regionslist`
--

CREATE TABLE `regionslist` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `company_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `regionslist`
--

INSERT INTO `regionslist` (`id`, `name`, `company_id`, `created_at`, `updated_at`) VALUES
(394, 'SIDE', 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(395, 'ALANYA', 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` int NOT NULL,
  `company_id` int NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `page_id` varchar(50) NOT NULL,
  `has_permission` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `company_id`, `role_name`, `page_id`, `has_permission`, `created_at`, `updated_at`) VALUES
(6590, 76, 'muhasebe', 'dashboard', 1, '2025-02-03 01:23:52', '2025-02-03 01:23:52'),
(6591, 76, 'muhasebe', 'companies', 0, '2025-02-03 01:23:52', '2025-02-03 01:23:52'),
(6592, 76, 'muhasebe', 'guides', 0, '2025-02-03 01:23:52', '2025-02-03 01:23:52'),
(6593, 76, 'muhasebe', 'tours', 0, '2025-02-03 01:23:52', '2025-02-03 01:23:52'),
(6594, 76, 'muhasebe', 'reports', 0, '2025-02-03 01:23:52', '2025-02-03 01:23:52'),
(6595, 76, 'muhasebe', 'safe', 0, '2025-02-03 01:23:52', '2025-02-03 01:23:52'),
(6596, 76, 'muhasebe', 'backup', 0, '2025-02-03 01:23:52', '2025-02-03 01:23:52'),
(6597, 76, 'muhasebe', 'settings', 0, '2025-02-03 01:23:52', '2025-02-03 01:23:52'),
(6598, 76, 'operasyon', 'dashboard', 1, '2025-02-03 01:23:52', '2025-02-03 01:23:52'),
(6599, 76, 'operasyon', 'companies', 0, '2025-02-03 01:23:52', '2025-02-03 01:23:52'),
(6600, 76, 'operasyon', 'guides', 0, '2025-02-03 01:23:52', '2025-02-03 01:23:52'),
(6601, 76, 'operasyon', 'tours', 0, '2025-02-03 01:23:52', '2025-02-03 01:23:52'),
(6602, 76, 'operasyon', 'reports', 0, '2025-02-03 01:23:52', '2025-02-03 01:23:52'),
(6603, 76, 'operasyon', 'safe', 0, '2025-02-03 01:23:52', '2025-02-03 01:23:52'),
(6604, 76, 'operasyon', 'backup', 0, '2025-02-03 01:23:52', '2025-02-03 01:23:52'),
(6605, 76, 'operasyon', 'settings', 0, '2025-02-03 01:23:52', '2025-02-03 01:23:52');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `tourlist`
--

CREATE TABLE `tourlist` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `company_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `tourlist`
--

INSERT INTO `tourlist` (`id`, `name`, `company_id`, `created_at`, `updated_at`) VALUES
(673, 'ANTALYA CITY TOUR', 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(674, 'BUGGY', 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(675, 'QUAD BIKE', 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(676, 'ALANYA CITY TOUR', 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(677, 'BUGGYDOUBLE', 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(34, 'sahin', 'sahinyucel@yandex.com', '$2b$10$HxPEFsFq.6VPFSkBZ3dNXu2Z45R1BLtqLT.UNN5bfO4StdQFD78om');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `agencyprovider`
--
ALTER TABLE `agencyprovider`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `idx_companyRef` (`companyRef`);

--
-- Tablo için indeksler `agencyrolemembers`
--
ALTER TABLE `agencyrolemembers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Tablo için indeksler `agency_provider_settings`
--
ALTER TABLE `agency_provider_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_provider` (`provider_id`);

--
-- Tablo için indeksler `areaslist`
--
ALTER TABLE `areaslist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `region_id` (`region_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Tablo için indeksler `companyusers`
--
ALTER TABLE `companyusers`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `regionslist`
--
ALTER TABLE `regionslist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Tablo için indeksler `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_permission` (`company_id`,`role_name`,`page_id`);

--
-- Tablo için indeksler `tourlist`
--
ALTER TABLE `tourlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `agencyprovider`
--
ALTER TABLE `agencyprovider`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=361;

--
-- Tablo için AUTO_INCREMENT değeri `agencyrolemembers`
--
ALTER TABLE `agencyrolemembers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- Tablo için AUTO_INCREMENT değeri `agency_provider_settings`
--
ALTER TABLE `agency_provider_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Tablo için AUTO_INCREMENT değeri `areaslist`
--
ALTER TABLE `areaslist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=833;

--
-- Tablo için AUTO_INCREMENT değeri `companyusers`
--
ALTER TABLE `companyusers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- Tablo için AUTO_INCREMENT değeri `regionslist`
--
ALTER TABLE `regionslist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=396;

--
-- Tablo için AUTO_INCREMENT değeri `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6606;

--
-- Tablo için AUTO_INCREMENT değeri `tourlist`
--
ALTER TABLE `tourlist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=678;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `agencyprovider`
--
ALTER TABLE `agencyprovider`
  ADD CONSTRAINT `agencyprovidertour` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `agencyrolemembers`
--
ALTER TABLE `agencyrolemembers`
  ADD CONSTRAINT `agencyrolemembers_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`);

--
-- Tablo kısıtlamaları `agency_provider_settings`
--
ALTER TABLE `agency_provider_settings`
  ADD CONSTRAINT `agencyprovider_setting_1` FOREIGN KEY (`provider_id`) REFERENCES `agencyprovider` (`companyRef`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Tablo kısıtlamaları `areaslist`
--
ALTER TABLE `areaslist`
  ADD CONSTRAINT `areaslist_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regionslist` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `areaslist_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `regionslist`
--
ALTER TABLE `regionslist`
  ADD CONSTRAINT `regionslist_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`);

--
-- Tablo kısıtlamaları `tourlist`
--
ALTER TABLE `tourlist`
  ADD CONSTRAINT `tourlist_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
