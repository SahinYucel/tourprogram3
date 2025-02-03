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
-- Table structure for table `agency_provider_settings`
--

DROP TABLE IF EXISTS `agency_provider_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agency_provider_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider_id` varchar(255) NOT NULL,
  `earnings` decimal(10,2) DEFAULT '0.00',
  `promotion_rate` decimal(5,2) DEFAULT '0.00',
  `revenue` decimal(10,2) DEFAULT '0.00',
  `pax_adult` int DEFAULT '0',
  `pax_child` int DEFAULT '0',
  `pax_free` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_provider` (`provider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agency_provider_settings`
--

LOCK TABLES `agency_provider_settings` WRITE;
/*!40000 ALTER TABLE `agency_provider_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `agency_provider_settings` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agencyprovider`
--

LOCK TABLES `agencyprovider` WRITE;
/*!40000 ALTER TABLE `agencyprovider` DISABLE KEYS */;
INSERT INTO `agencyprovider` VALUES (306,'D62BHTNA','oncu','505 232 5082',1,76),(307,'BC44KGDM','correct','505 232 5050',1,76),(308,'C9KTR20R','bulent','505 232 5041',1,76);
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
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agencyrolemembers`
--

LOCK TABLES `agencyrolemembers` WRITE;
/*!40000 ALTER TABLE `agencyrolemembers` DISABLE KEYS */;
INSERT INTO `agencyrolemembers` VALUES (73,'admin','admin','$2b$10$TFre8ZUtzZHCmhs3rC2OLeFdsDZJclQDg.bsUBPYKccqD0yC1JDXm',76,'2025-02-01 17:33:11'),(74,'yusuf','operasyon','$2b$10$VxANN/tEHeE1cpz0D.HRh.yOmBa8KHP4ZvtFRqdpRb6Z/up8xBsXe',76,'2025-02-02 00:08:26'),(75,'admin','admin','$2b$10$rqcCbAn2z2likbQcjYdVjut4DyeeHTXkSH9x2sBCLd8pu1QItYCqi',77,'2025-02-02 00:21:27');
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
) ENGINE=InnoDB AUTO_INCREMENT=789 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `areaslist`
--

LOCK TABLES `areaslist` WRITE;
/*!40000 ALTER TABLE `areaslist` DISABLE KEYS */;
INSERT INTO `areaslist` VALUES (767,'SIDE',390,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(768,'COLAKLI',390,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(769,'GUNDOGDU',390,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(770,'EVRENSEKI',390,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(771,'KIZILOT',390,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(772,'KIZILAGAC',390,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(773,'TITREYENGOL',390,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(774,'KUMKOY',390,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(775,'ALANYA',391,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(776,'TURKLER',391,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(777,'PAYALLAR',391,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(778,'OKURCALAR',391,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(779,'MAHMUTLAR',391,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(780,'OBA',391,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(781,'ALANYA',391,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(782,'KONAKLI',391,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(783,'TURKLER',391,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(784,'AVSALLAR',391,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(785,'OKURCALAR',391,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(786,'CENGER',391,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(787,'KIZILOT',391,76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(788,'KIZILAGAC',391,76,'2025-02-01 23:30:12','2025-02-01 23:30:12');
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
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companyusers`
--

LOCK TABLES `companyusers` WRITE;
/*!40000 ALTER TABLE `companyusers` DISABLE KEYS */;
INSERT INTO `companyusers` VALUES (76,'maxtoria','Agency','MAX2810','maxtoria','$2b$10$kZ3Ar/Lw1/UyAVqiFc0PBOFOHgyDFqQ2.468smQ6VF.C8qHA1/BOq','1','2025-02-01 17:32:03','OOD1PO'),(77,'w2meet','Agency','W2M2628','w2meet','$2b$10$6wbY2bxy/f1jE1ZIbtdStupbv9Gbc8GulvqqBVR8mlntk.LX8Y8NO','1','2025-02-02 00:20:28','GKFI2Y');
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
) ENGINE=InnoDB AUTO_INCREMENT=478 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `create_areaslist`
--

LOCK TABLES `create_areaslist` WRITE;
/*!40000 ALTER TABLE `create_areaslist` DISABLE KEYS */;
INSERT INTO `create_areaslist` VALUES (474,'ANTALYA',76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(475,'ALANYA',76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(476,'SIDE',76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(477,'MANAVGAT',76,'2025-02-01 23:30:12','2025-02-01 23:30:12');
/*!40000 ALTER TABLE `create_areaslist` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=392 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regionslist`
--

LOCK TABLES `regionslist` WRITE;
/*!40000 ALTER TABLE `regionslist` DISABLE KEYS */;
INSERT INTO `regionslist` VALUES (390,'SIDE',76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(391,'ALANYA',76,'2025-02-01 23:30:12','2025-02-01 23:30:12');
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
) ENGINE=InnoDB AUTO_INCREMENT=6446 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (6430,76,'muhasebe','dashboard',1,'2025-02-02 01:09:17','2025-02-02 01:09:17'),(6431,76,'muhasebe','companies',0,'2025-02-02 01:09:17','2025-02-02 01:09:17'),(6432,76,'muhasebe','guides',0,'2025-02-02 01:09:17','2025-02-02 01:09:17'),(6433,76,'muhasebe','tours',0,'2025-02-02 01:09:17','2025-02-02 01:09:17'),(6434,76,'muhasebe','reports',0,'2025-02-02 01:09:17','2025-02-02 01:09:17'),(6435,76,'muhasebe','safe',0,'2025-02-02 01:09:17','2025-02-02 01:09:17'),(6436,76,'muhasebe','backup',0,'2025-02-02 01:09:17','2025-02-02 01:09:17'),(6437,76,'muhasebe','settings',0,'2025-02-02 01:09:17','2025-02-02 01:09:17'),(6438,76,'operasyon','dashboard',1,'2025-02-02 01:09:17','2025-02-02 01:09:17'),(6439,76,'operasyon','companies',1,'2025-02-02 01:09:17','2025-02-02 01:09:17'),(6440,76,'operasyon','guides',1,'2025-02-02 01:09:17','2025-02-02 01:09:17'),(6441,76,'operasyon','tours',1,'2025-02-02 01:09:17','2025-02-02 01:09:17'),(6442,76,'operasyon','reports',1,'2025-02-02 01:09:17','2025-02-02 01:09:17'),(6443,76,'operasyon','safe',0,'2025-02-02 01:09:17','2025-02-02 01:09:17'),(6444,76,'operasyon','backup',0,'2025-02-02 01:09:17','2025-02-02 01:09:17'),(6445,76,'operasyon','settings',0,'2025-02-02 01:09:17','2025-02-02 01:09:17');
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
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
  CONSTRAINT `tour_days_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tour_days_chk_1` CHECK (((`day_number` >= 0) and (`day_number` <= 7)))
) ENGINE=InnoDB AUTO_INCREMENT=5922 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_days`
--

LOCK TABLES `tour_days` WRITE;
/*!40000 ALTER TABLE `tour_days` DISABLE KEYS */;
INSERT INTO `tour_days` VALUES (5887,873,1,'2025-02-02 01:11:35'),(5888,873,2,'2025-02-02 01:11:35'),(5889,873,3,'2025-02-02 01:11:35'),(5890,873,4,'2025-02-02 01:11:35'),(5891,873,5,'2025-02-02 01:11:35'),(5892,873,6,'2025-02-02 01:11:35'),(5893,873,7,'2025-02-02 01:11:35'),(5894,874,1,'2025-02-02 01:11:35'),(5895,874,0,'2025-02-02 01:11:35'),(5896,874,3,'2025-02-02 01:11:35'),(5897,874,0,'2025-02-02 01:11:35'),(5898,874,0,'2025-02-02 01:11:35'),(5899,874,0,'2025-02-02 01:11:35'),(5900,874,0,'2025-02-02 01:11:35'),(5901,875,1,'2025-02-02 01:11:35'),(5902,875,2,'2025-02-02 01:11:35'),(5903,875,3,'2025-02-02 01:11:35'),(5904,875,4,'2025-02-02 01:11:35'),(5905,875,5,'2025-02-02 01:11:35'),(5906,875,6,'2025-02-02 01:11:35'),(5907,875,7,'2025-02-02 01:11:35'),(5908,876,1,'2025-02-02 01:11:35'),(5909,876,0,'2025-02-02 01:11:35'),(5910,876,3,'2025-02-02 01:11:35'),(5911,876,0,'2025-02-02 01:11:35'),(5912,876,0,'2025-02-02 01:11:35'),(5913,876,0,'2025-02-02 01:11:35'),(5914,876,0,'2025-02-02 01:11:35'),(5915,877,1,'2025-02-02 01:11:35'),(5916,877,2,'2025-02-02 01:11:35'),(5917,877,3,'2025-02-02 01:11:35'),(5918,877,4,'2025-02-02 01:11:35'),(5919,877,5,'2025-02-02 01:11:35'),(5920,877,6,'2025-02-02 01:11:35'),(5921,877,7,'2025-02-02 01:11:35');
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=3349 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_pickup_times`
--

LOCK TABLES `tour_pickup_times` WRITE;
/*!40000 ALTER TABLE `tour_pickup_times` DISABLE KEYS */;
INSERT INTO `tour_pickup_times` VALUES (3334,873,'10','00','SIDE','COLAKLI',1,'2','2025-02-02 01:11:35'),(3335,873,'12','30','SIDE','COLAKLI',1,'1','2025-02-02 01:11:35'),(3336,873,'16','30','SIDE','COLAKLI',1,'3','2025-02-02 01:11:35'),(3337,874,'10','00','SIDE','COLAKLI',1,'1','2025-02-02 01:11:35'),(3338,874,'12','30','SIDE','COLAKLI',1,'2','2025-02-02 01:11:35'),(3339,874,'16','30','SIDE','COLAKLI',1,'3','2025-02-02 01:11:35'),(3340,875,'10','00','SIDE','COLAKLI',1,'2','2025-02-02 01:11:35'),(3341,875,'12','30','SIDE','COLAKLI',1,'1','2025-02-02 01:11:35'),(3342,875,'16','30','SIDE','COLAKLI',1,'3','2025-02-02 01:11:35'),(3343,876,'10','00','SIDE','COLAKLI',1,'1','2025-02-02 01:11:35'),(3344,876,'12','30','SIDE','COLAKLI',1,'2','2025-02-02 01:11:35'),(3345,876,'16','30','SIDE','COLAKLI',1,'3','2025-02-02 01:11:35'),(3346,877,'10','00','SIDE','COLAKLI',1,'2','2025-02-02 01:11:35'),(3347,877,'12','30','SIDE','COLAKLI',1,'1','2025-02-02 01:11:35'),(3348,877,'16','30','SIDE','COLAKLI',1,'3','2025-02-02 01:11:35');
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
INSERT INTO `tour_regions` VALUES (873,'ANTALYA'),(874,'ALANYA'),(875,'ALANYA'),(875,'ANTALYA'),(876,'ALANYA'),(877,'ANTALYA');
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
) ENGINE=InnoDB AUTO_INCREMENT=668 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tourlist`
--

LOCK TABLES `tourlist` WRITE;
/*!40000 ALTER TABLE `tourlist` DISABLE KEYS */;
INSERT INTO `tourlist` VALUES (663,'ANTALYA CITY TOUR',76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(664,'BUGGY',76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(665,'QUAD BIKE',76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(666,'ALANYA CITY TOUR',76,'2025-02-01 23:30:12','2025-02-01 23:30:12'),(667,'BUGGYDOUBLE',76,'2025-02-01 23:30:12','2025-02-01 23:30:12');
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
  `child_price` decimal(10,2) DEFAULT '0.00',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_company_ref` (`company_ref`),
  KEY `idx_operator_id` (`operator_id`)
) ENGINE=InnoDB AUTO_INCREMENT=878 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tours`
--

LOCK TABLES `tours` WRITE;
/*!40000 ALTER TABLE `tours` DISABLE KEYS */;
INSERT INTO `tours` VALUES (873,'76','ANTALYA CITY TOUR','oncu','D62BHTNA',30.00,15.00,1,'2025-02-02 01:11:35','2025-02-02 01:11:35'),(874,'76','BUGGY','oncu','D62BHTNA',15.00,7.00,1,'2025-02-02 01:11:35','2025-02-02 01:11:35'),(875,'76','ALANYA CITY TOUR','oncu','D62BHTNA',30.00,15.00,1,'2025-02-02 01:11:35','2025-02-02 01:11:35'),(876,'76','BUGGY (Kopya)','oncu','D62BHTNA',15.00,7.00,1,'2025-02-02 01:11:35','2025-02-02 01:11:35'),(877,'76','ANTALYA CITY TOUR (Kopya)','oncu','D62BHTNA',30.00,15.00,1,'2025-02-02 01:11:35','2025-02-02 01:11:35');
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

-- Dump completed on 2025-02-02  4:11:49
