-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 04. Sep 2018 um 15:36
-- Server-Version: 10.3.9-MariaDB
-- PHP-Version: 7.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `leostats`
--

DELIMITER $$
--
-- Prozeduren
--
CREATE PROCEDURE `getAllianceDataAsAdmin` (IN `WorldId` INT, IN `AllianceId` INT)  READS SQL DATA
SELECT DISTINCT a.Zeit, a.AllianceRank, a.EventRank, a.TotalScore, a.AverageScore, a.VP, a.VPh, a.BonusTiberium, a.BonusCrystal, a.BonusPower, a.BonusInfantrie, a.BonusVehicle, a.BonusAir, a.BonusDef, a.ScoreTib, a.ScoreCry, a.ScorePow, a.ScoreInf, a.ScoreVeh, a.ScoreAir, a.ScoreDef, a.RankTib, a.RankCry, a.RankPow, a.RankInf, a.RankVeh, a.RankAir, a.RankDef FROM relation_player p
JOIN alliance a ON a.WorldId=p.WorldId AND a.AllianceId=p.AllianceId
WHERE p.WorldId=WorldId
AND p.AllianceId=AllianceId
ORDER BY a.Zeit ASC$$

CREATE PROCEDURE `getAllianceDataAsUser` (IN `WorldId` INT, IN `OwnAccountId` INT)  READS SQL DATA
SELECT DISTINCT a.Zeit, a.AllianceRank, a.EventRank, a.TotalScore, a.AverageScore, a.VP, a.VPh, a.BonusTiberium, a.BonusCrystal, a.BonusPower, a.BonusInfantrie, a.BonusVehicle, a.BonusAir, a.BonusDef, a.ScoreTib, a.ScoreCry, a.ScorePow, a.ScoreInf, a.ScoreVeh, a.ScoreAir, a.ScoreDef, a.RankTib, a.RankCry, a.RankPow, a.RankInf, a.RankVeh, a.RankAir, a.RankDef FROM relation_player p
JOIN alliance a ON a.WorldId=p.WorldId AND a.AllianceId=p.AllianceId
WHERE
p.WorldId=WorldId
AND
p.AllianceId=
(
    SELECT p.AllianceId FROM relation_player p WHERE p.WorldId=WorldId AND p.AccountId=OwnAccountId
)
AND
p.AccountId=OwnAccountId
ORDER BY a.Zeit ASC$$

CREATE PROCEDURE `getAlliancePlayerDataAsAdmin` (IN `WorldId` INT, IN `AllianceId` INT)  READS SQL DATA
SELECT l.AccountId, l.UserName, p.Faction, pl.Zeit, pl.ScorePoints, pl.CountBases, pl.CountSup, pl.OverallRank, pl.EventRank, pl.GesamtTiberium, pl.GesamtCrystal, pl.GesamtPower, pl.GesamtCredits, pl.ResearchPoints, pl.Credits, pl.Shoot, pl.PvP, pl.PvE, pl.LvLOff, pl.BaseD, pl.OffD, pl.DefD, pl.DFD, pl.SupD, pl.VP, pl.LP, pl.RepMax, pl.CPMax, pl.CPCur, pl.Funds FROM relation_player p
JOIN login l ON l.AccountId=p.AccountId
JOIN player pl ON pl.WorldId=p.WorldId AND pl.AccountId=p.AccountId
WHERE p.WorldId=WorldId
AND p.AllianceId=AllianceId
AND
pl.Zeit=
(
	SELECT pl.Zeit FROM player pl WHERE pl.WorldId=p.WorldId AND pl.AccountId=p.AccountId ORDER BY pl.Zeit DESC LIMIT 1
)
ORDER BY l.UserName$$

CREATE PROCEDURE `getAlliancePlayerDataAsUser` (IN `WorldId` INT, IN `OwnAccountId` INT)  READS SQL DATA
SELECT l.AccountId, l.UserName, p.Faction, pl.Zeit, pl.ScorePoints, pl.CountBases, pl.CountSup, pl.OverallRank, pl.EventRank, pl.GesamtTiberium, pl.GesamtCrystal, pl.GesamtPower, pl.GesamtCredits, pl.ResearchPoints, pl.Credits, pl.Shoot, pl.PvP, pl.PvE, pl.LvLOff, pl.BaseD, pl.OffD, pl.DefD, pl.DFD, pl.SupD, pl.VP, pl.LP, pl.RepMax, pl.CPMax, pl.CPCur, pl.Funds FROM relation_player p
JOIN login l ON l.AccountId=p.AccountId
JOIN player pl ON pl.WorldId=p.WorldId AND pl.AccountId=p.AccountId
WHERE
p.WorldId=WorldId
AND
p.AllianceId=
(
	SELECT p.AllianceId FROM relation_player p WHERE p.WorldId=WorldId AND p.AccountId=OwnAccountId
)
AND
pl.Zeit=
(
	SELECT pl.Zeit FROM player pl WHERE pl.WorldId=p.WorldId AND pl.AccountId=p.AccountId ORDER BY pl.Zeit DESC LIMIT 1
)
AND
pl.AccountId IN
(
	SELECT DISTINCT p.AccountId FROM relation_player p
	JOIN relation_alliance a ON a.WorldId=p.WorldId AND a.AllianceId=p.AllianceId
	WHERE
	p.WorldId=WorldId
	AND
	a.AllianceId =
	(
		SELECT p.AllianceId FROM relation_player p WHERE p.WorldId=WorldId AND p.AccountId=OwnAccountId
	)
	AND
	(
		IF
		(
			(SELECT p.MemberRole FROM relation_player p WHERE p.AccountId=OwnAccountId AND p.WorldId=WorldId)<=a.MemberRole,
			true,
			p.AccountId=OwnAccountId
		)
	)
)
ORDER BY l.UserName$$

CREATE PROCEDURE `getBaseDataAsAdmin` (IN `WorldId` INT, IN `BaseId` INT)  READS SQL DATA
SELECT ba.Zeit, b.Name, ba.LvLCY, ba.LvLBase, ba.LvLOff, ba.LvLDef, ba.LvLDF, ba.LvLSup, ba.SupArt, ba.Tib, ba.Cry, ba.Pow, ba.Cre, ba.Rep, p.RepMax, ba.CnCOpt FROM relation_bases b
JOIN bases ba ON ba.WorldId=b.WorldId AND ba.ID=b.BaseId
JOIN player p ON p.WorldId=ba.WorldId AND p.AccountId=b.AccountId AND p.Zeit=ba.Zeit
WHERE
b.WorldId=WorldId
AND
b.BaseId=BaseId
ORDER BY ba.Zeit ASC$$

CREATE PROCEDURE `getBaseDataAsUser` (IN `WorldId` INT, IN `BaseId` INT, IN `OwnAccountId` INT)  READS SQL DATA
SELECT ba.Zeit, b.Name, ba.LvLCY, ba.LvLBase, ba.LvLOff, ba.LvLDef, ba.LvLDF, ba.LvLSup, ba.SupArt, ba.Tib, ba.Cry, ba.Pow, ba.Cre, ba.Rep, p.RepMax, ba.CnCOpt FROM relation_bases b
JOIN bases ba ON ba.WorldId=b.WorldId AND ba.ID=b.BaseId
JOIN player p ON p.WorldId=ba.WorldId AND p.AccountId=b.AccountId AND p.Zeit=ba.Zeit
WHERE
b.WorldId=WorldId
AND
b.BaseId=BaseId
AND
BaseId IN
(
	SELECT b.BaseId FROM relation_bases b
	JOIN relation_alliance a ON a.WorldId=b.WorldId
	JOIN relation_player p ON p.WorldId=b.WorldId AND p.AllianceId=a.AllianceId
	WHERE
	b.WorldId IN
	(
		SELECT p.WorldId FROM relation_player p WHERE p.AccountId=OwnAccountId
	)
	AND
	a.AllianceId =
	(
		SELECT p.AllianceId FROM relation_player p WHERE p.AccountId=OwnAccountId AND p.WorldId=b.WorldId
	)
	AND
	(
		IF
		(
			(SELECT p.MemberRole FROM relation_player p WHERE p.AccountId=OwnAccountId AND p.WorldId=WorldId)<=a.MemberRole,
			true,
			p.AccountId=OwnAccountId
		)
	)
)
ORDER BY ba.Zeit ASC$$

CREATE PROCEDURE `getDropDownListDataAsAdmin` ()  READS SQL DATA
SELECT s.WorldId, s.ServerName, a.AllianceId, a.AllianceName, p.AccountId, l.UserName, b.BaseId, b.Name
FROM relation_server s
JOIN relation_alliance a ON a.WorldId=s.WorldId
JOIN relation_player p ON p.WorldId=s.WorldId AND p.AllianceId=a.AllianceId
JOIN login l ON l.AccountId=p.AccountId
JOIN relation_bases b ON b.AccountId=p.AccountId AND b.WorldId=s.WorldId
ORDER BY s.ServerName, a.AllianceName, l.UserName, b.BaseId ASC$$

CREATE PROCEDURE `getDropDownListDataAsUser` (IN `OwnAccountId` INT)  READS SQL DATA
SELECT s.WorldId, s.ServerName, a.AllianceId, a.AllianceName, p.AccountId, l.UserName, b.BaseId, b.Name
FROM relation_server s
JOIN relation_alliance a ON a.WorldId=s.WorldId
JOIN relation_player p ON p.WorldId=s.WorldId AND p.AllianceId=a.AllianceId
JOIN login l ON l.AccountId=p.AccountId
JOIN relation_bases b ON b.AccountId=p.AccountId AND b.WorldId=s.WorldId
WHERE
s.WorldId IN
(
	SELECT p.WorldId FROM relation_player p WHERE p.AccountId=OwnAccountId
)
AND
a.AllianceId =
(
	SELECT p.AllianceId FROM relation_player p WHERE p.AccountId=OwnAccountId AND p.WorldId=s.WorldId
)
AND
(
	IF
	(
		(SELECT p.MemberRole FROM relation_player p WHERE p.AccountId=OwnAccountId AND p.WorldId=s.WorldId)<=a.MemberRole,
		true,
		p.AccountId=OwnAccountId
	)
)
ORDER BY s.ServerName, a.AllianceName, l.UserName, b.BaseId ASC$$

CREATE PROCEDURE `getPlayerBaseDataAsAdmin` (IN `WorldId` INT, IN `AccountId` INT)  READS SQL DATA
SELECT b.BaseId, b.Name, ba.LvLCY, ba.LvLBase, ba.LvLOff, ba.LvLDef, ba.LvLDF, ba.LvLSup, ba.SupArt, ba.Tib, ba.Cry, ba.Pow, ba.Cre, ba.Rep, ba.CnCOpt FROM relation_bases b
JOIN bases ba ON ba.WorldId=b.WorldId AND ba.ID=b.BaseId
WHERE b.WorldId=WorldId
AND b.AccountId=AccountId
AND
ba.Zeit=
(
    SELECT ba.Zeit FROM bases ba WHERE ba.WorldId=b.WorldId AND ba.ID=b.BaseId ORDER BY ba.Zeit DESC LIMIT 1
)
ORDER BY b.BaseId$$

CREATE PROCEDURE `getPlayerBaseDataAsUser` (IN `WorldId` INT, IN `AccountId` INT, IN `OwnAccountId` INT)  READS SQL DATA
SELECT b.BaseId, b.Name, ba.LvLCY, ba.LvLBase, ba.LvLOff, ba.LvLDef, ba.LvLDF, ba.LvLSup, ba.SupArt, ba.Tib, ba.Cry, ba.Pow, ba.Cre, ba.Rep, ba.CnCOpt FROM relation_bases b
JOIN bases ba ON ba.WorldId=b.WorldId AND ba.ID=b.BaseId
WHERE
b.WorldId=WorldId
AND
b.AccountId=AccountId
AND
AccountId IN
(
    SELECT DISTINCT p.AccountId FROM relation_player p
    JOIN relation_alliance a ON a.WorldId=p.WorldId AND a.AllianceId=p.AllianceId
    WHERE
    p.WorldId=WorldId
    AND
    a.AllianceId =
    (
        SELECT p.AllianceId FROM relation_player p WHERE p.WorldId=WorldId AND p.AccountId=OwnAccountId
    )
    AND
    (
        IF
        (
            (SELECT p.MemberRole FROM relation_player p WHERE p.AccountId=OwnAccountId AND p.WorldId=WorldId)<=a.MemberRole,
            true,
            p.AccountId=OwnAccountId
        )
    )
)
AND
ba.Zeit=
(
    SELECT ba.Zeit FROM bases ba WHERE ba.WorldId=b.WorldId AND ba.ID=b.BaseId ORDER BY ba.Zeit DESC LIMIT 1
)
ORDER BY b.BaseId$$

CREATE PROCEDURE `getPlayerDataAsAdmin` (IN `WorldId` INT, IN `AccountId` INT)  READS SQL DATA
SELECT pl.Zeit, pl.ScorePoints,
IFNULL(a.AverageScore, 0) AS AverageScore,
pl.OverallRank, pl.EventRank, pl.GesamtTiberium, pl.GesamtCrystal, pl.GesamtPower, pl.GesamtCredits, pl.ResearchPoints, pl.Credits, pl.Shoot, pl.PvP, pl.PvE, pl.LvLOff, pl.BaseD, pl.OffD, pl.DefD, pl.DFD, pl.SupD, pl.VP, pl.LP, pl.RepMax, pl.CPMax, pl.CPCur, pl.Funds FROM player pl
JOIN relation_player p ON p.WorldId=pl.WorldId AND p.AccountId=pl.AccountId
LEFT JOIN alliance a ON a.WorldId=pl.WorldId AND a.AllianceId=p.AllianceId AND a.Zeit=pl.Zeit
WHERE pl.WorldId=WorldId
AND pl.AccountId=AccountId
ORDER BY pl.Zeit ASC$$

CREATE PROCEDURE `getPlayerDataAsUser` (IN `WorldId` INT, IN `AccountId` INT, IN `OwnAccountId` INT)  READS SQL DATA
SELECT pl.Zeit, pl.ScorePoints,
IFNULL(a.AverageScore, 0) AS AverageScore,
pl.OverallRank, pl.EventRank, pl.GesamtTiberium, pl.GesamtCrystal, pl.GesamtPower, pl.GesamtCredits, pl.ResearchPoints, pl.Credits, pl.Shoot, pl.PvP, pl.PvE, pl.LvLOff, pl.BaseD, pl.OffD, pl.DefD, pl.DFD, pl.SupD, pl.VP, pl.LP, pl.RepMax, pl.CPMax, pl.CPCur, pl.Funds FROM player pl
JOIN relation_player p ON p.WorldId=pl.WorldId AND p.AccountId=pl.AccountId
LEFT JOIN alliance a ON a.WorldId=pl.WorldId AND a.AllianceId=p.AllianceId AND a.Zeit=pl.Zeit
WHERE
pl.WorldId=WorldId
AND
p.AllianceId IN
(
	SELECT p.AllianceId FROM relation_player p WHERE p.WorldId=WorldId AND p.AccountId=OwnAccountId
)
AND
pl.AccountId=AccountId
AND
AccountId IN
(
	SELECT DISTINCT p.AccountId FROM relation_player p
	JOIN relation_alliance a ON a.WorldId=p.WorldId AND a.AllianceId=p.AllianceId
	WHERE
	p.WorldId=WorldId
	AND
	a.AllianceId =
	(
		SELECT p.AllianceId FROM relation_player p WHERE p.WorldId=WorldId AND p.AccountId=OwnAccountId
	)
	AND
	(
		IF
		(
			(SELECT p.MemberRole FROM relation_player p WHERE p.AccountId=OwnAccountId AND p.WorldId=WorldId)<=a.MemberRole,
			true,
			p.AccountId=OwnAccountId
		)
	)
)
ORDER BY pl.Zeit ASC$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `adminlog`
--

CREATE TABLE `adminlog` (
  `ID` int(11) NOT NULL,
  `Zeit` datetime NOT NULL,
  `Initiator` text COLLATE utf8_bin NOT NULL,
  `Description` text COLLATE utf8_bin NOT NULL,
  `Show` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `alliance`
--

CREATE TABLE `alliance` (
  `Zeit` date NOT NULL,
  `WorldId` int(11) NOT NULL,
  `AllianceId` int(11) NOT NULL,
  `AllianceRank` int(5) NOT NULL,
  `EventRank` int(5) NOT NULL,
  `TotalScore` bigint(11) NOT NULL,
  `AverageScore` bigint(11) NOT NULL,
  `VP` bigint(10) NOT NULL,
  `VPh` int(7) NOT NULL,
  `BonusTiberium` int(8) NOT NULL,
  `BonusCrystal` int(8) NOT NULL,
  `BonusPower` int(8) NOT NULL,
  `BonusInfantrie` int(3) NOT NULL,
  `BonusVehicle` int(3) NOT NULL,
  `BonusAir` int(3) NOT NULL,
  `BonusDef` int(3) NOT NULL,
  `ScoreTib` bigint(10) NOT NULL,
  `ScoreCry` bigint(10) NOT NULL,
  `ScorePow` bigint(10) NOT NULL,
  `ScoreInf` bigint(10) NOT NULL,
  `ScoreVeh` bigint(10) NOT NULL,
  `ScoreAir` bigint(10) NOT NULL,
  `ScoreDef` bigint(10) NOT NULL,
  `RankTib` int(5) NOT NULL,
  `RankCry` int(5) NOT NULL,
  `RankPow` int(5) NOT NULL,
  `RankInf` int(5) NOT NULL,
  `RankVeh` int(5) NOT NULL,
  `RankAir` int(5) NOT NULL,
  `RankDef` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `bases`
--

CREATE TABLE `bases` (
  `Zeit` date NOT NULL,
  `WorldId` int(11) NOT NULL,
  `ID` int(11) NOT NULL,
  `LvLCY` int(2) NOT NULL,
  `LvLBase` decimal(4,2) NOT NULL,
  `LvLOff` decimal(4,2) NOT NULL,
  `LvLDef` decimal(4,2) NOT NULL,
  `LvLDF` int(2) NOT NULL,
  `LvLSup` int(2) NOT NULL,
  `SupArt` tinytext COLLATE utf8_bin NOT NULL,
  `Tib` bigint(10) NOT NULL,
  `Cry` bigint(10) NOT NULL,
  `Pow` bigint(10) NOT NULL,
  `Cre` bigint(10) NOT NULL,
  `Rep` int(7) NOT NULL,
  `CnCOpt` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `login`
--

CREATE TABLE `login` (
  `AccountId` int(11) NOT NULL,
  `UserName` text COLLATE utf8_bin NOT NULL,
  `Password` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `player`
--

CREATE TABLE `player` (
  `Zeit` date NOT NULL,
  `WorldId` int(11) NOT NULL,
  `AccountId` int(11) NOT NULL,
  `ScorePoints` bigint(11) NOT NULL,
  `CountBases` int(2) NOT NULL,
  `CountSup` int(2) NOT NULL,
  `OverallRank` int(5) NOT NULL,
  `EventRank` int(5) NOT NULL,
  `GesamtTiberium` bigint(11) NOT NULL,
  `GesamtCrystal` bigint(11) NOT NULL,
  `GesamtPower` bigint(11) NOT NULL,
  `GesamtCredits` bigint(11) NOT NULL,
  `ResearchPoints` bigint(15) NOT NULL,
  `Credits` bigint(15) NOT NULL,
  `Shoot` int(5) NOT NULL,
  `PvP` int(5) NOT NULL,
  `PvE` int(5) NOT NULL,
  `LvLOff` decimal(4,2) NOT NULL,
  `BaseD` decimal(4,2) NOT NULL,
  `OffD` decimal(4,2) NOT NULL,
  `DefD` decimal(4,2) NOT NULL,
  `DFD` decimal(4,2) NOT NULL,
  `SupD` decimal(4,2) NOT NULL,
  `VP` int(8) NOT NULL,
  `LP` int(7) NOT NULL,
  `RepMax` int(7) NOT NULL,
  `CPMax` int(5) NOT NULL,
  `CPCur` int(5) NOT NULL,
  `Funds` int(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `relation_alliance`
--

CREATE TABLE `relation_alliance` (
  `WorldId` int(11) NOT NULL,
  `AllianceId` int(11) NOT NULL,
  `AllianceName` text COLLATE utf8_bin NOT NULL,
  `MemberRole` int(11) NOT NULL DEFAULT 3
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `relation_bases`
--

CREATE TABLE `relation_bases` (
  `WorldId` int(11) NOT NULL,
  `AccountId` int(11) NOT NULL,
  `BaseId` int(11) NOT NULL,
  `Name` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `relation_player`
--

CREATE TABLE `relation_player` (
  `WorldId` int(11) NOT NULL,
  `AllianceId` int(11) NOT NULL,
  `AccountId` int(11) NOT NULL,
  `Faction` int(11) NOT NULL,
  `MemberRole` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `relation_server`
--

CREATE TABLE `relation_server` (
  `WorldId` int(11) NOT NULL,
  `ServerName` text COLLATE utf8_bin NOT NULL,
  `SeasonServer` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `substitution`
--

CREATE TABLE `substitution` (
  `WorldId` int(11) NOT NULL,
  `PlayerNameSet` text COLLATE utf8_bin NOT NULL,
  `PlayerNameGet` text COLLATE utf8_bin NOT NULL,
  `active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `adminlog`
--
ALTER TABLE `adminlog`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `alliance`
--
ALTER TABLE `alliance`
  ADD PRIMARY KEY (`Zeit`,`WorldId`,`AllianceId`),
  ADD KEY `WorldId` (`WorldId`,`AllianceId`);

--
-- Indizes für die Tabelle `bases`
--
ALTER TABLE `bases`
  ADD PRIMARY KEY (`Zeit`,`WorldId`,`ID`),
  ADD KEY `WorldId` (`WorldId`,`ID`);

--
-- Indizes für die Tabelle `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`AccountId`);

--
-- Indizes für die Tabelle `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`Zeit`,`WorldId`,`AccountId`),
  ADD KEY `WorldId` (`WorldId`),
  ADD KEY `AccountId` (`AccountId`);

--
-- Indizes für die Tabelle `relation_alliance`
--
ALTER TABLE `relation_alliance`
  ADD PRIMARY KEY (`WorldId`,`AllianceId`);

--
-- Indizes für die Tabelle `relation_bases`
--
ALTER TABLE `relation_bases`
  ADD PRIMARY KEY (`WorldId`,`BaseId`),
  ADD KEY `AccountId` (`AccountId`);

--
-- Indizes für die Tabelle `relation_player`
--
ALTER TABLE `relation_player`
  ADD PRIMARY KEY (`WorldId`,`AccountId`),
  ADD KEY `WorldId` (`WorldId`,`AllianceId`),
  ADD KEY `AccountId` (`AccountId`);

--
-- Indizes für die Tabelle `relation_server`
--
ALTER TABLE `relation_server`
  ADD PRIMARY KEY (`WorldId`);

--
-- Indizes für die Tabelle `substitution`
--
ALTER TABLE `substitution`
  ADD PRIMARY KEY (`WorldId`,`PlayerNameSet`(25));

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `adminlog`
--
ALTER TABLE `adminlog`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `alliance`
--
ALTER TABLE `alliance`
  ADD CONSTRAINT `alliance_ibfk_1` FOREIGN KEY (`WorldId`,`AllianceId`) REFERENCES `relation_alliance` (`WorldId`, `AllianceId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `bases`
--
ALTER TABLE `bases`
  ADD CONSTRAINT `bases_ibfk_1` FOREIGN KEY (`WorldId`,`ID`) REFERENCES `relation_bases` (`WorldId`, `BaseId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `player`
--
ALTER TABLE `player`
  ADD CONSTRAINT `player_ibfk_1` FOREIGN KEY (`WorldId`) REFERENCES `relation_server` (`WorldId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `player_ibfk_2` FOREIGN KEY (`AccountId`) REFERENCES `login` (`AccountId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `relation_alliance`
--
ALTER TABLE `relation_alliance`
  ADD CONSTRAINT `relation_alliance_ibfk_1` FOREIGN KEY (`WorldId`) REFERENCES `relation_server` (`WorldId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `relation_bases`
--
ALTER TABLE `relation_bases`
  ADD CONSTRAINT `relation_bases_ibfk_1` FOREIGN KEY (`AccountId`) REFERENCES `login` (`AccountId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `relation_bases_ibfk_2` FOREIGN KEY (`WorldId`) REFERENCES `relation_server` (`WorldId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `relation_player`
--
ALTER TABLE `relation_player`
  ADD CONSTRAINT `relation_player_ibfk_1` FOREIGN KEY (`WorldId`,`AllianceId`) REFERENCES `relation_alliance` (`WorldId`, `AllianceId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `relation_player_ibfk_2` FOREIGN KEY (`AccountId`) REFERENCES `login` (`AccountId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `substitution`
--
ALTER TABLE `substitution`
  ADD CONSTRAINT `substitution_ibfk_1` FOREIGN KEY (`WorldId`) REFERENCES `relation_server` (`WorldId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
