CREATE DATABASE  IF NOT EXISTS `trement` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `trement`;
-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: trement
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `treatment`
--

DROP TABLE IF EXISTS `treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment` (
  `idtreatment` int NOT NULL AUTO_INCREMENT,
  `description` longtext NOT NULL,
  `date` varchar(10) NOT NULL,
  `doctor` int NOT NULL,
  `pacient` int DEFAULT NULL,
  `appliedBy` int DEFAULT NULL,
  PRIMARY KEY (`idtreatment`),
  KEY `key_doctor_idx` (`doctor`),
  KEY `key_assistant_idx` (`appliedBy`),
  KEY `key_pacient_idx` (`pacient`),
  CONSTRAINT `key_assistant` FOREIGN KEY (`appliedBy`) REFERENCES `employee` (`idemployee`),
  CONSTRAINT `key_doctor` FOREIGN KEY (`doctor`) REFERENCES `employee` (`idemployee`),
  CONSTRAINT `key_pacient` FOREIGN KEY (`pacient`) REFERENCES `pacient` (`idpacient`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment`
--

LOCK TABLES `treatment` WRITE;
/*!40000 ALTER TABLE `treatment` DISABLE KEYS */;
INSERT INTO `treatment` VALUES (3,'Perfuzie cu paracetamol 500ml','12-02-2023',2,2,4),(4,'Odihna la pat','12-02-2023',2,2,NULL),(5,'Odihna la pat','11-02-2023',2,1,4),(6,'Realizare computer tomograf la zona toracala','11-02-2023',2,1,4),(7,'Administrare anitbiotic','14-02-2023',2,1,4),(9,'Operatie de apendicita','03-14-2023',2,1,NULL),(11,'Operatie de polipi','03-29-2023',3,2,5),(12,'Masaj recuperare coapsa','03-29-2023',4,NULL,NULL),(16,'Tratament intravenos','15-05-2023',3,1,NULL),(18,'Tratament intravenos','15-05-2023',3,1,NULL),(24,'Masaj recuperare coapsa','2023-03-15',3,2,NULL),(25,'Tratament intravenos','2023-03-15',3,1,NULL),(26,'Tratament intravenos','2023-03-15',3,1,NULL),(27,'Masaj recuperare coapsa','2023-03-15',3,2,NULL);
/*!40000 ALTER TABLE `treatment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-03-15 15:26:09
