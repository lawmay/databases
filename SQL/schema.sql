-- CREATE DATABASE chat;

USE chat;

/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/

-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'messages'
--
-- ---

DROP TABLE IF EXISTS `messages`;

CREATE TABLE `messages` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `id_user` INTEGER NULL DEFAULT NULL,
  `id_room` INTEGER NULL DEFAULT NULL,
  `text` MEDIUMTEXT NULL DEFAULT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'users'
--
-- ---

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INTEGER NOT NULL AUTO_INCREMENT DEFAULT NULL,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'rooms'
--
-- ---

DROP TABLE IF EXISTS `rooms`;

CREATE TABLE `rooms` (
  `id` INTEGER NOT NULL AUTO_INCREMENT DEFAULT NULL,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE `messages` ADD FOREIGN KEY (id_user) REFERENCES `users` (`id`);
ALTER TABLE `messages` ADD FOREIGN KEY (id_room) REFERENCES `rooms` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `messages` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `rooms` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `messages` (`id`,`id_user`,`id_room`,`text`) VALUES
-- ('','','','');
-- INSERT INTO `users` (`id`,`name`) VALUES
-- ('','');
-- INSERT INTO `rooms` (`id`,`name`) VALUES
-- ('','');

