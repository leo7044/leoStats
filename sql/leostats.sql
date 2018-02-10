-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 09. Feb 2018 um 08:48
-- Server-Version: 10.2.12-MariaDB
-- PHP-Version: 7.2.2

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
-- Tabellenstruktur für Tabelle `contact`
--

CREATE TABLE `contact` (
  `ID` int(11) NOT NULL,
  `Zeit` datetime NOT NULL,
  `WorldId` int(11) NOT NULL,
  `UserName` text COLLATE utf8_bin NOT NULL,
  `Email` text COLLATE utf8_bin NOT NULL,
  `description` text COLLATE utf8_bin NOT NULL
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
-- Indizes für die Tabelle `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `WorldId` (`WorldId`);

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
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `contact`
--
ALTER TABLE `contact`
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
-- Constraints der Tabelle `contact`
--
ALTER TABLE `contact`
  ADD CONSTRAINT `contact_ibfk_1` FOREIGN KEY (`WorldId`) REFERENCES `relation_server` (`WorldId`) ON DELETE CASCADE ON UPDATE CASCADE;

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
