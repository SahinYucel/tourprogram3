-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: tour_program
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `agency_guide_accounts`
--

DROP TABLE IF EXISTS `agency_guide_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agency_guide_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `guide_id` int NOT NULL,
  `earnings` decimal(10,2) DEFAULT '0.00',
  `promotion_rate` decimal(5,2) DEFAULT '0.00',
  `revenue` decimal(10,2) DEFAULT '0.00',
  `pax_adult` int DEFAULT '0',
  `pax_child` int DEFAULT '0',
  `pax_free` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guide` (`guide_id`),
  CONSTRAINT `agency_guide_accounts_ibfk_1` FOREIGN KEY (`guide_id`) REFERENCES `agencyguide` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=247 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agency_guide_accounts`
--

LOCK TABLES `agency_guide_accounts` WRITE;
/*!40000 ALTER TABLE `agency_guide_accounts` DISABLE KEYS */;
INSERT INTO `agency_guide_accounts` VALUES (246,265,0.00,45.00,0.00,0,0,0,'2025-02-11 14:20:37','2025-02-11 14:20:37');
/*!40000 ALTER TABLE `agency_guide_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agency_provider_account`
--

DROP TABLE IF EXISTS `agency_provider_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agency_provider_account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider_id` varchar(255) NOT NULL,
  `earnings` decimal(10,2) DEFAULT '0.00',
  `promotion_rate` decimal(5,2) DEFAULT '0.00',
  `revenue` decimal(10,2) DEFAULT '0.00',
  `currency` varchar(3) DEFAULT 'EUR',
  `pax_adult` int DEFAULT '0',
  `pax_child` int DEFAULT '0',
  `pax_free` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_provider` (`provider_id`),
  CONSTRAINT `agencyprovider_setting_1` FOREIGN KEY (`provider_id`) REFERENCES `agencyprovider` (`companyRef`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agency_provider_account`
--

LOCK TABLES `agency_provider_account` WRITE;
/*!40000 ALTER TABLE `agency_provider_account` DISABLE KEYS */;
/*!40000 ALTER TABLE `agency_provider_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agencyguide`
--

DROP TABLE IF EXISTS `agencyguide`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agencyguide` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_login` tinyint(1) NOT NULL,
  `guide_group` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nickname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `languages` json DEFAULT NULL,
  `other_languages` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sifre` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_company` (`company_id`),
  CONSTRAINT `agencyguide_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=266 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agencyguide`
--

LOCK TABLES `agencyguide` WRITE;
/*!40000 ALTER TABLE `agencyguide` DISABLE KEYS */;
INSERT INTO `agencyguide` VALUES (265,'Şahin','Yücel',1,1,'yeniler','Guide','{\"rusca\": false, \"arapca\": false, \"almanca\": false, \"fransizca\": false, \"ingilizce\": true}','','05052325082','NCLU0G7V','123123',80,'2025-02-11 14:20:37','2025-02-11 14:20:37');
/*!40000 ALTER TABLE `agencyguide` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agencyprovider`
--

DROP TABLE IF EXISTS `agencyprovider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agencyprovider` (
  `id` int NOT NULL AUTO_INCREMENT,
  `companyRef` varchar(50) NOT NULL,
  `company_name` varchar(50) NOT NULL,
  `phone_number` varchar(100) NOT NULL,
  `status` int NOT NULL,
  `company_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  KEY `idx_companyRef` (`companyRef`),
  CONSTRAINT `agencyprovidertour` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=416 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agencyprovider`
--

LOCK TABLES `agencyprovider` WRITE;
/*!40000 ALTER TABLE `agencyprovider` DISABLE KEYS */;
INSERT INTO `agencyprovider` VALUES (412,'OFGGNCJO','oncu','505 232 5082',0,80),(413,'UF765QIW','paco','505 232 5082',0,80),(414,'N966Q1SL','bulent','505 232 5041',0,80),(415,'F6N7UYK8','correct','505 232 5041',0,80);
/*!40000 ALTER TABLE `agencyprovider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agencyrolemembers`
--

DROP TABLE IF EXISTS `agencyrolemembers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agencyrolemembers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `agencyrolemembers_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agencyrolemembers`
--

LOCK TABLES `agencyrolemembers` WRITE;
/*!40000 ALTER TABLE `agencyrolemembers` DISABLE KEYS */;
INSERT INTO `agencyrolemembers` VALUES (78,'admin','admin','$2b$10$goq.jIU38OABMLjLB6FvPugGnkh5U9Trn6VFcIHKRmWb56PrsSrTO',80,'2025-02-11 13:55:09');
/*!40000 ALTER TABLE `agencyrolemembers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `areaslist`
--

DROP TABLE IF EXISTS `areaslist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `areaslist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `region_id` int NOT NULL,
  `company_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `region_id` (`region_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `areaslist_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regionslist` (`id`) ON DELETE CASCADE,
  CONSTRAINT `areaslist_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1365 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `areaslist`
--

LOCK TABLES `areaslist` WRITE;
/*!40000 ALTER TABLE `areaslist` DISABLE KEYS */;
INSERT INTO `areaslist` VALUES (1360,'COLAKLI',562,80,'2025-02-11 14:27:36','2025-02-11 14:27:36'),(1361,'EVRENSEKI',562,80,'2025-02-11 14:27:36','2025-02-11 14:27:36'),(1362,'KUMKOY',562,80,'2025-02-11 14:27:36','2025-02-11 14:27:36'),(1363,'OKURCALAR',563,80,'2025-02-11 14:27:36','2025-02-11 14:27:36'),(1364,'PAYALLAR',563,80,'2025-02-11 14:27:36','2025-02-11 14:27:36');
/*!40000 ALTER TABLE `areaslist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companyusers`
--

DROP TABLE IF EXISTS `companyusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companyusers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) NOT NULL,
  `position` varchar(50) NOT NULL,
  `ref_code` varchar(50) NOT NULL,
  `company_user` varchar(100) NOT NULL,
  `company_pass` varchar(100) NOT NULL,
  `duration_use` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `verification` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companyusers`
--

LOCK TABLES `companyusers` WRITE;
/*!40000 ALTER TABLE `companyusers` DISABLE KEYS */;
INSERT INTO `companyusers` VALUES (80,'maxtoria','Agency','MAX3795','maxtoria','$2b$10$8JzBpCqeEpUgJIy188wUW.uzg9uU6Kmo9IfBUQUd0BbcD5mdMhxPi','1','2025-02-11 13:54:35','NDM8L7');
/*!40000 ALTER TABLE `companyusers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `create_areaslist`
--

DROP TABLE IF EXISTS `create_areaslist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `create_areaslist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `company_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=809 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `create_areaslist`
--

LOCK TABLES `create_areaslist` WRITE;
/*!40000 ALTER TABLE `create_areaslist` DISABLE KEYS */;
INSERT INTO `create_areaslist` VALUES (805,'ANTALYA',80,'2025-02-11 14:27:36','2025-02-11 14:27:36'),(806,'MANAVGAT',80,'2025-02-11 14:27:36','2025-02-11 14:27:36'),(807,'SIDE',80,'2025-02-11 14:27:36','2025-02-11 14:27:36'),(808,'ALANYA',80,'2025-02-11 14:27:36','2025-02-11 14:27:36');
/*!40000 ALTER TABLE `create_areaslist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guide_regions`
--

DROP TABLE IF EXISTS `guide_regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guide_regions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `guide_id` int NOT NULL,
  `region_name` varchar(255) NOT NULL,
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `guide_id` (`guide_id`),
  CONSTRAINT `guide_regions_ibfk_1` FOREIGN KEY (`guide_id`) REFERENCES `agencyguide` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=300 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guide_regions`
--

LOCK TABLES `guide_regions` WRITE;
/*!40000 ALTER TABLE `guide_regions` DISABLE KEYS */;
INSERT INTO `guide_regions` VALUES (298,265,'ANTALYA','2025-02-11 14:20:37'),(299,265,'MANAVGAT','2025-02-11 14:20:37');
/*!40000 ALTER TABLE `guide_regions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `main_tours`
--

DROP TABLE IF EXISTS `main_tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `main_tours` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_ref` int NOT NULL,
  `tour_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_company_tour` (`company_ref`,`tour_name`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `main_tours`
--

LOCK TABLES `main_tours` WRITE;
/*!40000 ALTER TABLE `main_tours` DISABLE KEYS */;
INSERT INTO `main_tours` VALUES (61,80,'ALANYA-ONC'),(60,80,'ANTALYA-ONC'),(62,80,'ANTALYA-PC');
/*!40000 ALTER TABLE `main_tours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regionslist`
--

DROP TABLE IF EXISTS `regionslist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regionslist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `company_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `regionslist_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=564 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regionslist`
--

LOCK TABLES `regionslist` WRITE;
/*!40000 ALTER TABLE `regionslist` DISABLE KEYS */;
INSERT INTO `regionslist` VALUES (562,'SIDE',80,'2025-02-11 14:27:36','2025-02-11 14:27:36'),(563,'ALANYA',80,'2025-02-11 14:27:36','2025-02-11 14:27:36');
/*!40000 ALTER TABLE `regionslist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `page_id` varchar(50) NOT NULL,
  `has_permission` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_permission` (`company_id`,`role_name`,`page_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7183 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (7167,80,'muhasebe','dashboard',1,'2025-02-11 16:58:14','2025-02-11 16:58:14'),(7168,80,'muhasebe','definitions',0,'2025-02-11 16:58:14','2025-02-11 16:58:14'),(7169,80,'muhasebe','companies',0,'2025-02-11 16:58:14','2025-02-11 16:58:14'),(7170,80,'muhasebe','reservations',0,'2025-02-11 16:58:14','2025-02-11 16:58:14'),(7171,80,'muhasebe','reports',0,'2025-02-11 16:58:14','2025-02-11 16:58:14'),(7172,80,'muhasebe','safe',0,'2025-02-11 16:58:14','2025-02-11 16:58:14'),(7173,80,'muhasebe','backup',0,'2025-02-11 16:58:14','2025-02-11 16:58:14'),(7174,80,'muhasebe','settings',0,'2025-02-11 16:58:14','2025-02-11 16:58:14'),(7175,80,'operasyon','dashboard',1,'2025-02-11 16:58:14','2025-02-11 16:58:14'),(7176,80,'operasyon','definitions',0,'2025-02-11 16:58:14','2025-02-11 16:58:14'),(7177,80,'operasyon','companies',1,'2025-02-11 16:58:14','2025-02-11 16:58:14'),(7178,80,'operasyon','reservations',0,'2025-02-11 16:58:14','2025-02-11 16:58:14'),(7179,80,'operasyon','reports',0,'2025-02-11 16:58:14','2025-02-11 16:58:14'),(7180,80,'operasyon','safe',0,'2025-02-11 16:58:14','2025-02-11 16:58:14'),(7181,80,'operasyon','backup',0,'2025-02-11 16:58:14','2025-02-11 16:58:14'),(7182,80,'operasyon','settings',0,'2025-02-11 16:58:14','2025-02-11 16:58:14');
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `safe`
--

DROP TABLE IF EXISTS `safe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `safe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('cash','pos') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pos_commission_rate` decimal(5,2) DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_company` (`company_id`),
  CONSTRAINT `safe_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `safe`
--

LOCK TABLES `safe` WRITE;
/*!40000 ALTER TABLE `safe` DISABLE KEYS */;
/*!40000 ALTER TABLE `safe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_tours`
--

DROP TABLE IF EXISTS `sub_tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_tours` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `tour_id` int NOT NULL,
  `company_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tour_id` (`tour_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `sub_tours_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tourlist` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sub_tours_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=240 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_tours`
--

LOCK TABLES `sub_tours` WRITE;
/*!40000 ALTER TABLE `sub_tours` DISABLE KEYS */;
INSERT INTO `sub_tours` VALUES (233,'ANTALYA-PC',989,80),(234,'ANTALYA-ONC',989,80),(235,'ANTALYA-CRT',989,80),(236,'ALANYA-CRT',990,80),(237,'ALANYA-ONC',990,80),(238,'QUAD-BIKE-BLT',991,80),(239,'QUAD-BIKE-CRT',991,80);
/*!40000 ALTER TABLE `sub_tours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour_days`
--

DROP TABLE IF EXISTS `tour_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour_days` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tour_id` int NOT NULL,
  `day_number` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tour_id` (`tour_id`),
  CONSTRAINT `tour_days_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14028 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_days`
--

LOCK TABLES `tour_days` WRITE;
/*!40000 ALTER TABLE `tour_days` DISABLE KEYS */;
INSERT INTO `tour_days` VALUES (14007,2033,1,'2025-02-11 14:29:40'),(14008,2033,0,'2025-02-11 14:29:40'),(14009,2033,3,'2025-02-11 14:29:40'),(14010,2033,0,'2025-02-11 14:29:40'),(14011,2033,5,'2025-02-11 14:29:40'),(14012,2033,0,'2025-02-11 14:29:40'),(14013,2033,7,'2025-02-11 14:29:40'),(14014,2034,1,'2025-02-11 14:29:40'),(14015,2034,0,'2025-02-11 14:29:40'),(14016,2034,3,'2025-02-11 14:29:40'),(14017,2034,0,'2025-02-11 14:29:40'),(14018,2034,5,'2025-02-11 14:29:40'),(14019,2034,0,'2025-02-11 14:29:40'),(14020,2034,7,'2025-02-11 14:29:40'),(14021,2035,1,'2025-02-11 14:29:40'),(14022,2035,2,'2025-02-11 14:29:40'),(14023,2035,3,'2025-02-11 14:29:40'),(14024,2035,4,'2025-02-11 14:29:40'),(14025,2035,5,'2025-02-11 14:29:40'),(14026,2035,6,'2025-02-11 14:29:40'),(14027,2035,7,'2025-02-11 14:29:40');
/*!40000 ALTER TABLE `tour_days` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour_options`
--

DROP TABLE IF EXISTS `tour_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour_options` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tour_id` int NOT NULL,
  `option_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tour_id` (`tour_id`),
  CONSTRAINT `tour_options_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_options`
--

LOCK TABLES `tour_options` WRITE;
/*!40000 ALTER TABLE `tour_options` DISABLE KEYS */;
/*!40000 ALTER TABLE `tour_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour_pickup_times`
--

DROP TABLE IF EXISTS `tour_pickup_times`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour_pickup_times` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tour_id` int NOT NULL,
  `hour` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `minute` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `region` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `period_active` tinyint(1) DEFAULT '0',
  `period` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tour_id` (`tour_id`),
  CONSTRAINT `tour_pickup_times_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5993 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_pickup_times`
--

LOCK TABLES `tour_pickup_times` WRITE;
/*!40000 ALTER TABLE `tour_pickup_times` DISABLE KEYS */;
INSERT INTO `tour_pickup_times` VALUES (5980,2033,'09','30','SIDE','KUMKOY',1,'1','2025-02-11 14:29:40'),(5981,2033,'12','30','SIDE','KUMKOY',1,'2','2025-02-11 14:29:40'),(5982,2033,'16','30','SIDE','KUMKOY',0,'3','2025-02-11 14:29:40'),(5983,2033,'09','30','ALANYA','PAYALLAR',1,'1','2025-02-11 14:29:40'),(5984,2033,'09','00','ALANYA','OKURCALAR',1,'2','2025-02-11 14:29:40'),(5985,2033,'08','00','SIDE','EVRENSEKI',1,'1','2025-02-11 14:29:40'),(5986,2034,'09','30','SIDE','KUMKOY',1,'1','2025-02-11 14:29:40'),(5987,2034,'12','30','SIDE','KUMKOY',1,'2','2025-02-11 14:29:40'),(5988,2034,'16','30','SIDE','KUMKOY',0,'3','2025-02-11 14:29:40'),(5989,2034,'09','30','ALANYA','PAYALLAR',1,'1','2025-02-11 14:29:40'),(5990,2034,'09','00','ALANYA','OKURCALAR',1,'2','2025-02-11 14:29:40'),(5991,2034,'08','00','SIDE','EVRENSEKI',1,'1','2025-02-11 14:29:40'),(5992,2035,'09','30','SIDE','COLAKLI',1,'1','2025-02-11 14:29:40');
/*!40000 ALTER TABLE `tour_pickup_times` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour_regions`
--

DROP TABLE IF EXISTS `tour_regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour_regions` (
  `tour_id` int NOT NULL,
  `region_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`tour_id`,`region_name`) USING BTREE,
  CONSTRAINT `tour_regions_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_regions`
--

LOCK TABLES `tour_regions` WRITE;
/*!40000 ALTER TABLE `tour_regions` DISABLE KEYS */;
INSERT INTO `tour_regions` VALUES (2033,'ANTALYA'),(2033,'MANAVGAT'),(2034,'ANTALYA'),(2035,'SIDE');
/*!40000 ALTER TABLE `tour_regions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tourlist`
--

DROP TABLE IF EXISTS `tourlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tourlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `company_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `tourlist_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companyusers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=992 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tourlist`
--

LOCK TABLES `tourlist` WRITE;
/*!40000 ALTER TABLE `tourlist` DISABLE KEYS */;
INSERT INTO `tourlist` VALUES (989,'ANTALYA CITY TOUR',80,'2025-02-11 14:27:36','2025-02-11 14:27:36'),(990,'ALANYA CITY TOUR',80,'2025-02-11 14:27:36','2025-02-11 14:27:36'),(991,'QUAD BIKE',80,'2025-02-11 14:27:36','2025-02-11 14:27:36');
/*!40000 ALTER TABLE `tourlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tours`
--

DROP TABLE IF EXISTS `tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tours` (
  `id` int NOT NULL AUTO_INCREMENT,
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
  `priority` int DEFAULT '3',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `currency` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'EUR',
  `main_tour_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_company_ref` (`company_ref`),
  KEY `idx_operator_id` (`operator_id`),
  KEY `main_tour_id` (`main_tour_id`),
  CONSTRAINT `tours_ibfk_1` FOREIGN KEY (`main_tour_id`) REFERENCES `main_tours` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2036 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tours`
--

LOCK TABLES `tours` WRITE;
/*!40000 ALTER TABLE `tours` DISABLE KEYS */;
INSERT INTO `tours` VALUES (2033,'80','ANTALYA-ONC','oncu','OFGGNCJO',30.00,15.00,15.00,7.00,1,'2025-02-11 14:29:40','2025-02-11 14:29:40',3,'su yoktur','EUR',60),(2034,'80','ALANYA-ONC','oncu','OFGGNCJO',30.00,15.00,15.00,7.00,1,'2025-02-11 14:29:40','2025-02-11 14:29:40',2,'su yoktur','GBP',61),(2035,'80','ANTALYA-PC','paco','UF765QIW',15.00,7.00,7.00,3.50,1,'2025-02-11 14:29:40','2025-02-11 14:29:40',1,'su dah,ş','USD',62);
/*!40000 ALTER TABLE `tours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (34,'sahin','sahinyucel@yandex.com','$2b$10$HxPEFsFq.6VPFSkBZ3dNXu2Z45R1BLtqLT.UNN5bfO4StdQFD78om');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-11 20:13:05
