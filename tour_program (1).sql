-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Anamakine: localhost:3306
-- Üretim Zamanı: 07 Şub 2025, 05:44:13
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
-- Tablo için tablo yapısı `agencyguide`
--

CREATE TABLE `agencyguide` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `guide_group` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nickname` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `languages` json DEFAULT NULL,
  `other_languages` text COLLATE utf8mb4_unicode_ci,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sifre` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `agencyguide`
--

INSERT INTO `agencyguide` (`id`, `name`, `surname`, `is_active`, `guide_group`, `nickname`, `languages`, `other_languages`, `phone`, `code`, `sifre`, `company_id`, `created_at`, `updated_at`) VALUES
(141, 'Şahin', 'Yücel', 1, 'ŞAHİN', 'Guide', '{\"rusca\": false, \"arapca\": false, \"almanca\": false, \"fransizca\": false, \"ingilizce\": true}', '', '05052325082', '4K72LW1I', '123123', 78, '2025-02-07 05:36:29', '2025-02-07 05:36:29'),
(142, 'Burak', 'Yücel', 1, 'yeniler', 'Guide', '{\"rusca\": true, \"arapca\": false, \"almanca\": false, \"fransizca\": false, \"ingilizce\": false}', '', '05052325082', 'D2AUSFAU', '123123', 78, '2025-02-07 05:36:29', '2025-02-07 05:36:29');

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
(395, 'SK2S1JC0', 'oncu', '505 232 5082', 1, 78),
(396, 'S014XVNI', 'bulent', '505 232 5050', 1, 78),
(397, '2IXGKEFV', 'correct', '505 232 5050', 1, 78),
(398, 'BA19K5JF', 'paco', '505 232 5082', 1, 78);

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
(76, 'admin', 'admin', '$2b$10$BpNYDDKPKyQN3Oa3mAgZDeV1eVuxmigd0EVVxywzuZropo6aYO7B6', 78, '2025-02-07 02:36:25');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `agency_guide_settings`
--

CREATE TABLE `agency_guide_settings` (
  `id` int NOT NULL,
  `guide_id` int NOT NULL,
  `earnings` decimal(10,2) DEFAULT '0.00',
  `promotion_rate` decimal(5,2) DEFAULT '0.00',
  `revenue` decimal(10,2) DEFAULT '0.00',
  `pax_adult` int DEFAULT '0',
  `pax_child` int DEFAULT '0',
  `pax_free` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `agency_guide_settings`
--

INSERT INTO `agency_guide_settings` (`id`, `guide_id`, `earnings`, `promotion_rate`, `revenue`, `pax_adult`, `pax_child`, `pax_free`, `created_at`, `updated_at`) VALUES
(127, 141, 0.00, 0.00, 0.00, 0, 0, 0, '2025-02-07 05:36:29', '2025-02-07 05:36:29'),
(128, 142, 0.00, 0.00, 0.00, 0, 0, 0, '2025-02-07 05:36:29', '2025-02-07 05:36:29');

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
(61, 'SK2S1JC0', 0.00, 0.00, 0.00, 'EUR', 0, 0, 0, '2025-02-07 02:37:11', '2025-02-07 02:37:11'),
(62, 'S014XVNI', 0.00, 0.00, 0.00, 'EUR', 0, 0, 0, '2025-02-07 02:37:11', '2025-02-07 02:37:11'),
(63, '2IXGKEFV', 0.00, 0.00, 0.00, 'EUR', 0, 0, 0, '2025-02-07 02:37:11', '2025-02-07 02:37:11'),
(64, 'BA19K5JF', 0.00, 0.00, 0.00, 'EUR', 0, 0, 0, '2025-02-07 02:37:11', '2025-02-07 02:37:11');

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
(856, 'OKURCALAR', 402, 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(857, 'AVSALLAR', 402, 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(858, 'TITREYENGOL', 402, 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(859, 'KUMKOY', 402, 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(860, 'GUNDOGDU', 402, 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(861, 'EVRENSEKI', 402, 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(862, 'ÇOLAKLI', 402, 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(863, 'OKURCALAR', 403, 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(864, 'AVSALLAR', 403, 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03');

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
(78, 'maxtoria', 'Agency', 'MAX8557', 'maxtoria', '$2b$10$cxfwuKAK7kzdmb8dVmugDeF.oi6rXhnznKrCkEX5nP/ZL9V7.xSWi', '1', '2025-02-07 02:36:00', '6AHIPQ');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `create_areaslist`
--

CREATE TABLE `create_areaslist` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `company_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `create_areaslist`
--

INSERT INTO `create_areaslist` (`id`, `name`, `company_id`, `created_at`, `updated_at`) VALUES
(483, 'ANTALYA', 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(484, 'ALANYA', 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(485, 'SIDE', 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(486, 'MANAVGAT', 76, '2025-02-03 21:26:30', '2025-02-03 21:26:30'),
(499, 'ANTALYA', 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(500, 'ALANYA', 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(501, 'SIDE', 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(502, 'MANAVGAT', 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `guide_regions`
--

CREATE TABLE `guide_regions` (
  `id` int NOT NULL,
  `guide_id` int NOT NULL,
  `region_name` varchar(255) NOT NULL,
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `guide_regions`
--

INSERT INTO `guide_regions` (`id`, `guide_id`, `region_name`, `CREATED_AT`) VALUES
(91, 141, 'ANTALYA', '2025-02-07 05:36:29'),
(92, 141, 'ALANYA', '2025-02-07 05:36:29'),
(93, 142, 'SIDE', '2025-02-07 05:36:29');

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
(402, 'SIDE', 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(403, 'ALANYA', 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(404, 'ANTALYA', 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03');

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
(6766, 78, 'muhasebe', 'dashboard', 1, '2025-02-07 04:50:30', '2025-02-07 04:50:30'),
(6767, 78, 'muhasebe', 'companies', 0, '2025-02-07 04:50:30', '2025-02-07 04:50:30'),
(6768, 78, 'muhasebe', 'guides', 0, '2025-02-07 04:50:30', '2025-02-07 04:50:30'),
(6769, 78, 'muhasebe', 'tours', 0, '2025-02-07 04:50:30', '2025-02-07 04:50:30'),
(6770, 78, 'muhasebe', 'reports', 0, '2025-02-07 04:50:30', '2025-02-07 04:50:30'),
(6771, 78, 'muhasebe', 'safe', 0, '2025-02-07 04:50:30', '2025-02-07 04:50:30'),
(6772, 78, 'muhasebe', 'backup', 0, '2025-02-07 04:50:30', '2025-02-07 04:50:30'),
(6773, 78, 'muhasebe', 'settings', 0, '2025-02-07 04:50:30', '2025-02-07 04:50:30'),
(6774, 78, 'operasyon', 'dashboard', 1, '2025-02-07 04:50:30', '2025-02-07 04:50:30'),
(6775, 78, 'operasyon', 'companies', 0, '2025-02-07 04:50:30', '2025-02-07 04:50:30'),
(6776, 78, 'operasyon', 'guides', 0, '2025-02-07 04:50:30', '2025-02-07 04:50:30'),
(6777, 78, 'operasyon', 'tours', 1, '2025-02-07 04:50:30', '2025-02-07 04:50:30'),
(6778, 78, 'operasyon', 'reports', 0, '2025-02-07 04:50:30', '2025-02-07 04:50:30'),
(6779, 78, 'operasyon', 'safe', 0, '2025-02-07 04:50:30', '2025-02-07 04:50:30'),
(6780, 78, 'operasyon', 'backup', 0, '2025-02-07 04:50:30', '2025-02-07 04:50:30'),
(6781, 78, 'operasyon', 'settings', 0, '2025-02-07 04:50:30', '2025-02-07 04:50:30');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `safe`
--

CREATE TABLE `safe` (
  `id` int NOT NULL,
  `company_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('cash','pos') COLLATE utf8mb4_unicode_ci NOT NULL,
  `pos_commission_rate` decimal(5,2) DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `safe`
--

INSERT INTO `safe` (`id`, `company_id`, `name`, `type`, `pos_commission_rate`, `balance`, `created_at`, `updated_at`) VALUES
(3, 78, 'TL', 'cash', NULL, 0.00, '2025-02-07 02:37:55', '2025-02-07 02:37:55'),
(4, 78, 'EURO', 'cash', NULL, 0.00, '2025-02-07 02:38:00', '2025-02-07 02:38:00'),
(5, 78, 'TL', 'pos', 5.00, 0.00, '2025-02-07 02:38:08', '2025-02-07 02:38:08');

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
(693, 'ANTALYA CITY TOUR', 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(694, 'BUGGY', 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(695, 'QUAD BIKE', 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(696, 'ALANYA CITY TOUR', 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03'),
(697, 'BUGGYDOUBLE', 78, '2025-02-07 03:29:03', '2025-02-07 03:29:03');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `tours`
--

CREATE TABLE `tours` (
  `id` int NOT NULL,
  `company_ref` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tour_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `operator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `operator_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `adult_price` decimal(10,2) DEFAULT '0.00',
  `guide_adult_price` decimal(10,2) DEFAULT '0.00',
  `child_price` decimal(10,2) DEFAULT '0.00',
  `guide_child_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `priority` int DEFAULT '3'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `tours`
--

INSERT INTO `tours` (`id`, `company_ref`, `tour_name`, `operator`, `operator_id`, `adult_price`, `guide_adult_price`, `child_price`, `guide_child_price`, `is_active`, `created_at`, `updated_at`, `priority`) VALUES
(1542, '78', 'ANTALYA CITY TOUR', 'oncu', 'SK2S1JC0', 15.00, 30.00, 7.00, 15.00, 1, '2025-02-07 05:38:27', '2025-02-07 05:38:27', 1),
(1543, '78', 'BUGGYDOUBLE', 'oncu', 'SK2S1JC0', 15.00, 30.00, 7.00, 15.00, 1, '2025-02-07 05:38:27', '2025-02-07 05:38:27', 1),
(1544, '78', 'BUGGY', 'oncu', 'SK2S1JC0', 15.00, 30.00, 7.00, 15.00, 1, '2025-02-07 05:38:27', '2025-02-07 05:38:27', 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `tour_days`
--

CREATE TABLE `tour_days` (
  `id` int NOT NULL,
  `tour_id` int NOT NULL,
  `day_number` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Tablo döküm verisi `tour_days`
--

INSERT INTO `tour_days` (`id`, `tour_id`, `day_number`, `created_at`) VALUES
(10570, 1542, 1, '2025-02-07 05:38:27'),
(10571, 1542, 0, '2025-02-07 05:38:27'),
(10572, 1542, 3, '2025-02-07 05:38:27'),
(10573, 1542, 0, '2025-02-07 05:38:27'),
(10574, 1542, 5, '2025-02-07 05:38:27'),
(10575, 1542, 0, '2025-02-07 05:38:27'),
(10576, 1542, 7, '2025-02-07 05:38:27'),
(10577, 1543, 1, '2025-02-07 05:38:27'),
(10578, 1543, 0, '2025-02-07 05:38:27'),
(10579, 1543, 3, '2025-02-07 05:38:27'),
(10580, 1543, 0, '2025-02-07 05:38:27'),
(10581, 1543, 5, '2025-02-07 05:38:27'),
(10582, 1543, 0, '2025-02-07 05:38:27'),
(10583, 1543, 0, '2025-02-07 05:38:27'),
(10584, 1544, 1, '2025-02-07 05:38:27'),
(10585, 1544, 2, '2025-02-07 05:38:27'),
(10586, 1544, 3, '2025-02-07 05:38:27'),
(10587, 1544, 4, '2025-02-07 05:38:27'),
(10588, 1544, 5, '2025-02-07 05:38:27'),
(10589, 1544, 6, '2025-02-07 05:38:27'),
(10590, 1544, 7, '2025-02-07 05:38:27');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `tour_options`
--

CREATE TABLE `tour_options` (
  `id` int NOT NULL,
  `tour_id` int NOT NULL,
  `option_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `tour_pickup_times`
--

CREATE TABLE `tour_pickup_times` (
  `id` int NOT NULL,
  `tour_id` int NOT NULL,
  `hour` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `minute` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `region` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `period_active` tinyint(1) DEFAULT '0',
  `period` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `tour_pickup_times`
--

INSERT INTO `tour_pickup_times` (`id`, `tour_id`, `hour`, `minute`, `region`, `area`, `period_active`, `period`, `created_at`) VALUES
(5223, 1542, '10', '30', 'SIDE', 'OKURCALAR', 1, '1', '2025-02-07 05:38:27'),
(5224, 1542, '12', '30', 'SIDE', 'OKURCALAR', 1, '2', '2025-02-07 05:38:27'),
(5225, 1542, '16', '00', 'SIDE', 'KUMKOY', 1, '1', '2025-02-07 05:38:27'),
(5226, 1542, '09', '00', 'SIDE', 'EVRENSEKI', 1, '1', '2025-02-07 05:38:27'),
(5227, 1542, '09', '00', 'SIDE', 'OKURCALAR', 0, '3', '2025-02-07 05:38:27'),
(5228, 1542, '09', '00', 'ALANYA', 'AVSALLAR', 1, '1', '2025-02-07 05:38:27'),
(5229, 1543, '10', '30', 'ALANYA', 'OKURCALAR', 1, '1', '2025-02-07 05:38:27'),
(5230, 1543, '12', '30', 'ALANYA', 'OKURCALAR', 1, '2', '2025-02-07 05:38:27'),
(5231, 1543, '16', '00', 'ALANYA', 'OKURCALAR', 1, '3', '2025-02-07 05:38:27'),
(5232, 1543, '00', '00', 'ALANYA', 'AVSALLAR', 1, '1', '2025-02-07 05:38:27'),
(5233, 1544, '10', '00', 'SIDE', 'ÇOLAKLI', 1, '1', '2025-02-07 05:38:27');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `tour_regions`
--

CREATE TABLE `tour_regions` (
  `tour_id` int NOT NULL,
  `region_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `tour_regions`
--

INSERT INTO `tour_regions` (`tour_id`, `region_name`) VALUES
(1542, 'ANTALYA'),
(1543, 'ANTALYA'),
(1543, 'SIDE'),
(1544, 'ALANYA');

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
-- Tablo için indeksler `agencyguide`
--
ALTER TABLE `agencyguide`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_company` (`company_id`);

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
-- Tablo için indeksler `agency_guide_settings`
--
ALTER TABLE `agency_guide_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_guide` (`guide_id`);

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
-- Tablo için indeksler `create_areaslist`
--
ALTER TABLE `create_areaslist`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `guide_regions`
--
ALTER TABLE `guide_regions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guide_id` (`guide_id`);

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
-- Tablo için indeksler `safe`
--
ALTER TABLE `safe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_company` (`company_id`);

--
-- Tablo için indeksler `tourlist`
--
ALTER TABLE `tourlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Tablo için indeksler `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_company_ref` (`company_ref`),
  ADD KEY `idx_operator_id` (`operator_id`);

--
-- Tablo için indeksler `tour_days`
--
ALTER TABLE `tour_days`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tour_id` (`tour_id`);

--
-- Tablo için indeksler `tour_options`
--
ALTER TABLE `tour_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tour_id` (`tour_id`);

--
-- Tablo için indeksler `tour_pickup_times`
--
ALTER TABLE `tour_pickup_times`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tour_id` (`tour_id`);

--
-- Tablo için indeksler `tour_regions`
--
ALTER TABLE `tour_regions`
  ADD PRIMARY KEY (`tour_id`,`region_name`) USING BTREE;

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
-- Tablo için AUTO_INCREMENT değeri `agencyguide`
--
ALTER TABLE `agencyguide`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=143;

--
-- Tablo için AUTO_INCREMENT değeri `agencyprovider`
--
ALTER TABLE `agencyprovider`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=399;

--
-- Tablo için AUTO_INCREMENT değeri `agencyrolemembers`
--
ALTER TABLE `agencyrolemembers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- Tablo için AUTO_INCREMENT değeri `agency_guide_settings`
--
ALTER TABLE `agency_guide_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;

--
-- Tablo için AUTO_INCREMENT değeri `agency_provider_settings`
--
ALTER TABLE `agency_provider_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- Tablo için AUTO_INCREMENT değeri `areaslist`
--
ALTER TABLE `areaslist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=865;

--
-- Tablo için AUTO_INCREMENT değeri `companyusers`
--
ALTER TABLE `companyusers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- Tablo için AUTO_INCREMENT değeri `create_areaslist`
--
ALTER TABLE `create_areaslist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=503;

--
-- Tablo için AUTO_INCREMENT değeri `guide_regions`
--
ALTER TABLE `guide_regions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- Tablo için AUTO_INCREMENT değeri `regionslist`
--
ALTER TABLE `regionslist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=405;

--
-- Tablo için AUTO_INCREMENT değeri `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6782;

--
-- Tablo için AUTO_INCREMENT değeri `safe`
--
ALTER TABLE `safe`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `tourlist`
--
ALTER TABLE `tourlist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=698;

--
-- Tablo için AUTO_INCREMENT değeri `tours`
--
ALTER TABLE `tours`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1545;

--
-- Tablo için AUTO_INCREMENT değeri `tour_days`
--
ALTER TABLE `tour_days`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `tour_options`
--
ALTER TABLE `tour_options`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Tablo için AUTO_INCREMENT değeri `tour_pickup_times`
--
ALTER TABLE `tour_pickup_times`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5234;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `agencyguide`
--
ALTER TABLE `agencyguide`
  ADD CONSTRAINT `agencyguide_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`) ON DELETE CASCADE;

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
-- Tablo kısıtlamaları `agency_guide_settings`
--
ALTER TABLE `agency_guide_settings`
  ADD CONSTRAINT `agency_guide_settings_ibfk_1` FOREIGN KEY (`guide_id`) REFERENCES `agencyguide` (`id`) ON DELETE CASCADE;

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
-- Tablo kısıtlamaları `guide_regions`
--
ALTER TABLE `guide_regions`
  ADD CONSTRAINT `guide_regions_ibfk_1` FOREIGN KEY (`guide_id`) REFERENCES `agencyguide` (`id`) ON DELETE CASCADE;

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
-- Tablo kısıtlamaları `safe`
--
ALTER TABLE `safe`
  ADD CONSTRAINT `safe_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `tourlist`
--
ALTER TABLE `tourlist`
  ADD CONSTRAINT `tourlist_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `tour_days`
--
ALTER TABLE `tour_days`
  ADD CONSTRAINT `tour_days_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `tour_options`
--
ALTER TABLE `tour_options`
  ADD CONSTRAINT `tour_options_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `tour_pickup_times`
--
ALTER TABLE `tour_pickup_times`
  ADD CONSTRAINT `tour_pickup_times_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `tour_regions`
--
ALTER TABLE `tour_regions`
  ADD CONSTRAINT `tour_regions_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
