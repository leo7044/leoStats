--BaseId, done
ALTER TABLE `bases` DROP CONSTRAINT `bases_ibfk_1`;
ALTER TABLE `bases` CHANGE `ID` `ID` INT(9) UNSIGNED NOT NULL;
ALTER TABLE `relation_bases` CHANGE `BaseId` `BaseId` INT(9) UNSIGNED NOT NULL;
ALTER TABLE `bases` ADD CONSTRAINT `bases_ibfk_1` FOREIGN KEY (`WorldId`,`ID`) REFERENCES `relation_bases` (`WorldId`, `BaseId`) ON DELETE CASCADE ON UPDATE CASCADE;

--AccountId, done
ALTER TABLE `player` DROP CONSTRAINT `player_ibfk_2`;
ALTER TABLE `relation_player` DROP CONSTRAINT `relation_player_ibfk_2`;
ALTER TABLE `relation_bases` DROP CONSTRAINT `relation_bases_ibfk_1`;
ALTER TABLE `login` CHANGE `AccountId` `AccountId` MEDIUMINT(7) UNSIGNED NOT NULL;
ALTER TABLE `player` CHANGE `AccountId` `AccountId` MEDIUMINT(7) UNSIGNED NOT NULL;
ALTER TABLE `relation_bases` CHANGE `AccountId` `AccountId` MEDIUMINT(7) UNSIGNED NOT NULL;
ALTER TABLE `relation_player` CHANGE `AccountId` `AccountId` MEDIUMINT(7) UNSIGNED NOT NULL;
ALTER TABLE `player` ADD CONSTRAINT `player_ibfk_2` FOREIGN KEY (`AccountId`) REFERENCES `login` (`AccountId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `relation_player` ADD CONSTRAINT `relation_player_ibfk_2` FOREIGN KEY (`AccountId`) REFERENCES `login` (`AccountId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `relation_bases` ADD CONSTRAINT `relation_bases_ibfk_1` FOREIGN KEY (`AccountId`) REFERENCES `login` (`AccountId`) ON DELETE CASCADE ON UPDATE CASCADE;

--AllianceId, done
ALTER TABLE `alliance` DROP CONSTRAINT `alliance_ibfk_1`;
ALTER TABLE `relation_player` DROP CONSTRAINT `relation_player_ibfk_1`;
ALTER TABLE `relation_alliance` CHANGE `AllianceId` `AllianceId` SMALLINT(4) UNSIGNED NOT NULL;
ALTER TABLE `alliance` CHANGE `AllianceId` `AllianceId` SMALLINT(4) UNSIGNED NOT NULL;
ALTER TABLE `relation_player` CHANGE `AllianceId` `AllianceId` SMALLINT(4) UNSIGNED NOT NULL;
ALTER TABLE `alliance` ADD CONSTRAINT `alliance_ibfk_1` FOREIGN KEY (`WorldId`,`AllianceId`) REFERENCES `relation_alliance` (`WorldId`, `AllianceId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `relation_player` ADD CONSTRAINT `relation_player_ibfk_1` FOREIGN KEY (`WorldId`,`AllianceId`) REFERENCES `relation_alliance` (`WorldId`, `AllianceId`) ON DELETE CASCADE ON UPDATE CASCADE;

--WorldId, done
ALTER TABLE `substitution` DROP CONSTRAINT `substitution_ibfk_1`;
ALTER TABLE `player` DROP CONSTRAINT `player_ibfk_1`;
ALTER TABLE `relation_bases` DROP CONSTRAINT `relation_bases_ibfk_2`;
ALTER TABLE `bases` DROP CONSTRAINT `bases_ibfk_1`;
ALTER TABLE `relation_alliance` DROP CONSTRAINT `relation_alliance_ibfk_1`;
ALTER TABLE `relation_player` DROP CONSTRAINT `relation_player_ibfk_1`;
ALTER TABLE `alliance` DROP CONSTRAINT `alliance_ibfk_1`;
ALTER TABLE `layouts` CHANGE `WorldId` `WorldId` SMALLINT(3) UNSIGNED NOT NULL;
ALTER TABLE `substitution` CHANGE `WorldId` `WorldId` SMALLINT(3) UNSIGNED NOT NULL;
ALTER TABLE `relation_server` CHANGE `WorldId` `WorldId` SMALLINT(3) UNSIGNED NOT NULL;
ALTER TABLE `relation_alliance` CHANGE `WorldId` `WorldId` SMALLINT(3) UNSIGNED NOT NULL;
ALTER TABLE `relation_player` CHANGE `WorldId` `WorldId` SMALLINT(3) UNSIGNED NOT NULL;
ALTER TABLE `relation_bases` CHANGE `WorldId` `WorldId` SMALLINT(3) UNSIGNED NOT NULL;
ALTER TABLE `player` CHANGE `WorldId` `WorldId` SMALLINT(3) UNSIGNED NOT NULL;
ALTER TABLE `alliance` CHANGE `WorldId` `WorldId` SMALLINT(3) UNSIGNED NOT NULL;
ALTER TABLE `bases` CHANGE `WorldId` `WorldId` SMALLINT(3) UNSIGNED NOT NULL;
ALTER TABLE `substitution` ADD CONSTRAINT `substitution_ibfk_1` FOREIGN KEY (`WorldId`) REFERENCES `relation_server` (`WorldId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `player` ADD CONSTRAINT `player_ibfk_1` FOREIGN KEY (`WorldId`) REFERENCES `relation_server` (`WorldId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `relation_bases` ADD CONSTRAINT `relation_bases_ibfk_2` FOREIGN KEY (`WorldId`) REFERENCES `relation_server` (`WorldId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `bases` ADD CONSTRAINT `bases_ibfk_1` FOREIGN KEY (`WorldId`,`ID`) REFERENCES `relation_bases` (`WorldId`, `BaseId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `relation_alliance` ADD CONSTRAINT `relation_alliance_ibfk_1` FOREIGN KEY (`WorldId`) REFERENCES `relation_server` (`WorldId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `relation_player` ADD CONSTRAINT `relation_player_ibfk_1` FOREIGN KEY (`WorldId`,`AllianceId`) REFERENCES `relation_alliance` (`WorldId`, `AllianceId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `alliance` ADD CONSTRAINT `alliance_ibfk_1` FOREIGN KEY (`WorldId`,`AllianceId`) REFERENCES `relation_alliance` (`WorldId`, `AllianceId`) ON DELETE CASCADE ON UPDATE CASCADE;