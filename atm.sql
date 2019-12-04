-- Adminer 4.7.0 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `cards`;
CREATE TABLE `cards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `card_number` bigint(20) NOT NULL,
  `pin` varchar(255) NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `cards` (`id`, `card_number`, `pin`, `created`) VALUES
(1,	4111111111111111,	'81dc9bdb52d04dc20036dbd8313ed055',	'2019-12-03 16:26:18'),
(2,	4111111111111112,	'd93591bdf7860e1e4ee2fca799911215',	'2019-12-04 12:46:55');

DROP TABLE IF EXISTS `notes`;
CREATE TABLE `notes` (
  `10` int(11) NOT NULL,
  `20` int(11) NOT NULL,
  `50` int(11) NOT NULL,
  `100` int(11) NOT NULL,
  `200` int(11) NOT NULL,
  `500` int(11) NOT NULL,
  `1000` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `notes` (`10`, `20`, `50`, `100`, `200`, `500`, `1000`) VALUES
(1000,	1000,	1000,	1000,	1000,	1000,	1000);

DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `card_id` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `transaction_type` enum('credit','debit') NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `card_id` (`card_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `transactions` (`id`, `card_id`, `amount`, `transaction_type`, `created`) VALUES
(1,	1,	100000.00,	'credit',	'2019-12-03 16:30:55'),
(177,	2,	50000.00,	'credit',	'2019-12-04 12:47:11');

-- 2019-12-04 10:58:14
