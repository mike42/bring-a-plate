-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 11, 2014 at 11:38 AM
-- Server version: 5.5.33-1
-- PHP Version: 5.5.7-2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `bring_a_plate`
--

-- --------------------------------------------------------

--
-- Table structure for table `allergen`
--

CREATE TABLE IF NOT EXISTS `allergen` (
  `allergen_id` int(11) NOT NULL AUTO_INCREMENT,
  `allergen_name` varchar(45) NOT NULL,
  PRIMARY KEY (`allergen_id`),
  UNIQUE KEY `allergen_name_UNIQUE` (`allergen_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Truncate table before insert `allergen`
--

TRUNCATE TABLE `allergen`;
--
-- Dumping data for table `allergen`
--

INSERT INTO `allergen` (`allergen_id`, `allergen_name`) VALUES
(3, 'eggs'),
(6, 'fish'),
(4, 'milk'),
(1, 'peanuts'),
(5, 'sesame seeds'),
(7, 'shellfish'),
(8, 'soy'),
(2, 'tree nuts'),
(9, 'wheat');

-- --------------------------------------------------------

--
-- Table structure for table `food`
--

CREATE TABLE IF NOT EXISTS `food` (
  `food_id` int(11) NOT NULL AUTO_INCREMENT,
  `food_name` varchar(64) DEFAULT NULL,
  `food_desc` text,
  `invitation_invitation_id` int(11) NOT NULL,
  `food_type` enum('main','dessert','salad') NOT NULL,
  PRIMARY KEY (`food_id`),
  KEY `fk_food_invitation1_idx` (`invitation_invitation_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Truncate table before insert `food`
--

TRUNCATE TABLE `food`;
-- --------------------------------------------------------

--
-- Table structure for table `food_has_allergen`
--

CREATE TABLE IF NOT EXISTS `food_has_allergen` (
  `food_food_id` int(11) NOT NULL,
  `allergen_allergen_id` int(11) NOT NULL,
  PRIMARY KEY (`food_food_id`,`allergen_allergen_id`),
  KEY `fk_food_has_allergen_allergen1_idx` (`allergen_allergen_id`),
  KEY `fk_food_has_allergen_food1_idx` (`food_food_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Truncate table before insert `food_has_allergen`
--

TRUNCATE TABLE `food_has_allergen`;
-- --------------------------------------------------------

--
-- Table structure for table `food_meets_requirement`
--

CREATE TABLE IF NOT EXISTS `food_meets_requirement` (
  `food_food_id` int(11) NOT NULL,
  `requirement_requirement_id` int(11) NOT NULL,
  PRIMARY KEY (`food_food_id`,`requirement_requirement_id`),
  KEY `fk_food_has_requirement_requirement1_idx` (`requirement_requirement_id`),
  KEY `fk_food_has_requirement_food1_idx` (`food_food_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Truncate table before insert `food_meets_requirement`
--

TRUNCATE TABLE `food_meets_requirement`;
-- --------------------------------------------------------

--
-- Table structure for table `invitation`
--

CREATE TABLE IF NOT EXISTS `invitation` (
  `invitation_id` int(11) NOT NULL AUTO_INCREMENT,
  `invitation_code` varchar(5) NOT NULL,
  `invitation_name` varchar(45) NOT NULL,
  PRIMARY KEY (`invitation_id`),
  UNIQUE KEY `invitation_code_UNIQUE` (`invitation_code`),
  UNIQUE KEY `invitation_name_UNIQUE` (`invitation_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Truncate table before insert `invitation`
--

TRUNCATE TABLE `invitation`;
-- --------------------------------------------------------

--
-- Table structure for table `person`
--

CREATE TABLE IF NOT EXISTS `person` (
  `person_id` int(11) NOT NULL AUTO_INCREMENT,
  `person_rsvp` enum('none','yes','no') DEFAULT 'none',
  `person_name` varchar(64) DEFAULT NULL,
  `family_invitation_id` int(11) NOT NULL,
  PRIMARY KEY (`person_id`),
  KEY `fk_person_family_idx` (`family_invitation_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Truncate table before insert `person`
--

TRUNCATE TABLE `person`;
-- --------------------------------------------------------

--
-- Table structure for table `person_has_allergy`
--

CREATE TABLE IF NOT EXISTS `person_has_allergy` (
  `person_person_id` int(11) NOT NULL,
  `allergen_allergen_id` int(11) NOT NULL,
  PRIMARY KEY (`person_person_id`,`allergen_allergen_id`),
  KEY `fk_person_has_allergen_allergen1_idx` (`allergen_allergen_id`),
  KEY `fk_person_has_allergen_person1_idx` (`person_person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Truncate table before insert `person_has_allergy`
--

TRUNCATE TABLE `person_has_allergy`;
-- --------------------------------------------------------

--
-- Table structure for table `person_has_requirement`
--

CREATE TABLE IF NOT EXISTS `person_has_requirement` (
  `person_person_id` int(11) NOT NULL,
  `requirement_requirement_id` int(11) NOT NULL,
  PRIMARY KEY (`person_person_id`,`requirement_requirement_id`),
  KEY `fk_person_has_requirement_requirement1_idx` (`requirement_requirement_id`),
  KEY `fk_person_has_requirement_person1_idx` (`person_person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Truncate table before insert `person_has_requirement`
--

TRUNCATE TABLE `person_has_requirement`;
-- --------------------------------------------------------

--
-- Table structure for table `requirement`
--

CREATE TABLE IF NOT EXISTS `requirement` (
  `requirement_id` int(11) NOT NULL,
  `requirement_name` varchar(45) NOT NULL,
  PRIMARY KEY (`requirement_id`),
  UNIQUE KEY `requirement_name_UNIQUE` (`requirement_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Truncate table before insert `requirement`
--

TRUNCATE TABLE `requirement`;
--
-- Dumping data for table `requirement`
--

INSERT INTO `requirement` (`requirement_id`, `requirement_name`) VALUES
(4, 'fructose free'),
(2, 'gluten free'),
(5, 'lactose free'),
(6, 'tasty food'),
(3, 'vegan'),
(1, 'vegetarian');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `food`
--
ALTER TABLE `food`
  ADD CONSTRAINT `fk_food_invitation1` FOREIGN KEY (`invitation_invitation_id`) REFERENCES `invitation` (`invitation_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `food_has_allergen`
--
ALTER TABLE `food_has_allergen`
  ADD CONSTRAINT `fk_food_has_allergen_allergen1` FOREIGN KEY (`allergen_allergen_id`) REFERENCES `allergen` (`allergen_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_food_has_allergen_food1` FOREIGN KEY (`food_food_id`) REFERENCES `food` (`food_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `food_meets_requirement`
--
ALTER TABLE `food_meets_requirement`
  ADD CONSTRAINT `fk_food_has_requirement_food1` FOREIGN KEY (`food_food_id`) REFERENCES `food` (`food_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_food_has_requirement_requirement1` FOREIGN KEY (`requirement_requirement_id`) REFERENCES `requirement` (`requirement_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `person`
--
ALTER TABLE `person`
  ADD CONSTRAINT `fk_person_family` FOREIGN KEY (`family_invitation_id`) REFERENCES `invitation` (`invitation_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `person_has_allergy`
--
ALTER TABLE `person_has_allergy`
  ADD CONSTRAINT `fk_person_has_allergen_allergen1` FOREIGN KEY (`allergen_allergen_id`) REFERENCES `allergen` (`allergen_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_person_has_allergen_person1` FOREIGN KEY (`person_person_id`) REFERENCES `person` (`person_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `person_has_requirement`
--
ALTER TABLE `person_has_requirement`
  ADD CONSTRAINT `fk_person_has_requirement_person1` FOREIGN KEY (`person_person_id`) REFERENCES `person` (`person_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_person_has_requirement_requirement1` FOREIGN KEY (`requirement_requirement_id`) REFERENCES `requirement` (`requirement_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
