-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Erstellungszeit: 18. Feb 2020 um 13:42
-- Server-Version: 10.2.30-MariaDB
-- PHP-Version: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `cncindyserver_leostats`
--

DELIMITER $$
--
-- Prozeduren
--
CREATE PROCEDURE `compareTwoAlliancesAsAdmin` (IN `WorldId` INT, IN `AllianceId1` INT, IN `AllianceId2` INT)  NO SQL
SELECT al1.Zeit, al1.TotalScore AS 'Data1', al2.TotalScore AS 'Data2',
IF (al1.TotalScore >= al2.TotalScore, al1.TotalScore - al2.TotalScore, al2.TotalScore - al1.TotalScore) AS 'Difference'
FROM relation_alliance a
JOIN alliance al1 ON al1.WorldId=a.WorldId AND al1.AllianceId=a.AllianceId
JOIN alliance al2 ON al2.WorldId=a.WorldId AND al2.Zeit=al1.Zeit
WHERE a.WorldId=WorldId
AND al1.AllianceId=AllianceId1
AND al2.AllianceId=AllianceId2
ORDER BY al1.Zeit ASC$$

CREATE PROCEDURE `compareTwoPlayersAsAdmin` (IN `WorldId` INT, IN `AccountId1` INT, IN `AccountId2` INT)  NO SQL
SELECT pl1.Zeit, pl1.ScorePoints AS 'Data1', pl2.ScorePoints AS 'Data2',
IF (pl1.ScorePoints >= pl2.ScorePoints, pl1.ScorePoints - pl2.ScorePoints, pl2.ScorePoints - pl1.ScorePoints) AS 'Difference'
FROM relation_player p
JOIN player pl1 ON pl1.WorldId=p.WorldId AND pl1.AccountId=p.AccountId
JOIN player pl2 ON pl2.WorldId=p.WorldId AND pl2.Zeit=pl1.Zeit
WHERE p.WorldId=WorldId
AND pl1.AccountId=AccountId1
AND pl2.AccountId=AccountId2
ORDER BY pl1.Zeit ASC$$

CREATE PROCEDURE `getAlianceNamesByWorldId` (IN `WorldId` INT)  NO SQL
SELECT a.AllianceName FROM layouts l
join login lo ON lo.UserName=l.PlayerName
JOIN relation_player p ON p.WorldId=l.WorldId AND p.AccountId=lo.AccountId
JOIN relation_alliance a ON a.WorldId=p.WorldId AND a.AllianceId=p.AllianceId
WHERE l.WorldId=WorldId
GROUP BY a.AllianceName
ORDER BY a.AllianceName$$

CREATE PROCEDURE `getAllianceBaseData` (IN `_WorldId` INT, IN `_AllianceId` INT, IN `_OwnAccountId` INT)  NO SQL
SELECT l.UserName, p.Faction, ba.BasePoints, ba.LvLCY, ba.LvLBase, ba.LvLOff, ba.LvLDef, ba.LvLDF, ba.LvLSup, ba.SupArt, ba.Tib, ba.Cry, ba.Pow, ba.Cre, ba.Rep, ba.CnCOpt FROM relation_player p
JOIN relation_bases b ON b.WorldId=p.WorldId AND b.AccountId=p.AccountId
JOIN login l ON l.AccountId=p.AccountId
JOIN bases ba ON ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId
JOIN relation_alliance a ON a.WorldId=p.WorldId AND a.AllianceId=p.AllianceId
WHERE ba.Zeit=
(
	SELECT ba.Zeit FROM bases ba
	WHERE ba.WorldId=p.WorldId
	AND ba.BaseId=b.BaseId
	ORDER BY ba.Zeit DESC LIMIT 1
)
AND p.WorldId=_WorldId
AND a.AllianceId=_AllianceId
AND
IF
(
	(SELECT _OwnAccountId IN (SELECT l.AccountId FROM login l WHERE l.IsAdmin=true)),
	true,
	(
		(
			a.AllianceId=
			(
				SELECT p.AllianceId FROM relation_player p WHERE p.WorldId=_WorldId AND p.AccountId=_OwnAccountId
			)
			AND
			IF
			(
				(SELECT p.MemberRole FROM relation_player p WHERE p.AccountId=_OwnAccountId AND p.WorldId=_WorldId)<=a.MemberRole,
				true,
				p.AccountId=_OwnAccountId
			)
		)
		OR
		(
			a.AllianceId=
			(
				SELECT ash.AllianceIdSet FROM relation_alliance_share ash
				JOIN relation_player p ON p.WorldId=ash.WorldId AND p.AllianceId=ash.AllianceIdGet
				WHERE ash.WorldId=_WorldId AND p.AccountId=_OwnAccountId
			)
			AND
			IF
			(
				(SELECT p.MemberRole FROM relation_player p WHERE p.WorldId=_WorldId AND p.AccountId=_OwnAccountId)<=(SELECT ash.MemberRoleAccess FROM relation_alliance_share ash
				JOIN relation_player p ON p.WorldId=ash.WorldId AND p.AllianceId=ash.AllianceIdGet
				WHERE ash.WorldId=_WorldId and p.AccountId=_OwnAccountId),
				true,
				false
			)
		)
		OR
		(
			p.AccountId=
			(
				SELECT psh.AccountIdSet FROM relation_player_share psh
				JOIN relation_player p ON p.WorldId=psh.WorldId AND p.AccountId=psh.AccountIdGet
				WHERE psh.WorldId=_WorldId AND p.AccountId=_OwnAccountId
			)
		)
	)
)
ORDER BY l.UserName ASC, ba.BaseId ASC$$

CREATE PROCEDURE `getAllianceDataHistory` (IN `_WorldId` INT, IN `_AllianceId` INT, IN `_OwnAccountId` INT)  NO SQL
SELECT DISTINCT a.Zeit, a.AllianceRank, a.EventRank, a.TotalScore, a.AverageScore, a.VP, a.VPh, a.BonusTiberium, a.BonusCrystal, a.BonusPower, a.BonusInfantrie, a.BonusVehicle, a.BonusAir, a.BonusDef, a.ScoreTib, a.ScoreCry, a.ScorePow, a.ScoreInf, a.ScoreVeh, a.ScoreAir, a.ScoreDef, a.RankTib, a.RankCry, a.RankPow, a.RankInf, a.RankVeh, a.RankAir, a.RankDef FROM relation_player p
JOIN alliance a ON a.WorldId=p.WorldId AND a.AllianceId=p.AllianceId
WHERE p.WorldId=_WorldId
AND p.AllianceId=_AllianceId
AND
IF
(
	(SELECT _OwnAccountId IN (SELECT l.AccountId FROM login l WHERE l.IsAdmin=true)),
	true,
	(
		(
			a.AllianceId=
			(
				SELECT p.AllianceId FROM relation_player p WHERE p.WorldId=_WorldId AND p.AccountId=_OwnAccountId
			)
		)
		OR
		(
			a.AllianceId=
			(
				SELECT ash.AllianceIdSet FROM relation_alliance_share ash
				JOIN relation_player p ON p.WorldId=ash.WorldId AND p.AllianceId=ash.AllianceIdGet
				WHERE ash.WorldId=_WorldId AND p.AccountId=_OwnAccountId
			)
			AND
			IF
			(
				(SELECT p.MemberRole FROM relation_player p WHERE p.WorldId=_WorldId AND p.AccountId=_OwnAccountId)<=(SELECT ash.MemberRoleAccess FROM relation_alliance_share ash
				JOIN relation_player p ON p.WorldId=ash.WorldId AND p.AllianceId=ash.AllianceIdGet
				WHERE ash.WorldId=_WorldId and p.AccountId=_OwnAccountId),
				true,
				false
			)
		)
	)
)
ORDER BY a.Zeit ASC$$

CREATE PROCEDURE `getAlliancePlayerDataAsAdmin` (IN `WorldId` INT, IN `AllianceId` INT)  READS SQL DATA
SELECT l.AccountId, l.UserName, pl.Zeit, pl.ScorePoints, pl.CountBases, pl.CountSup, pl.OverallRank, pl.EventRank, pl.GesamtTiberium, pl.GesamtCrystal, pl.GesamtPower, pl.GesamtCredits, pl.ResearchPoints, pl.Credits, pl.Shoot, pl.PvP, pl.PvE, pl.LvLOff, pl.LvLDef, pl.BaseD, pl.OffD, pl.DefD, pl.DFD, pl.SupD, pl.VP, pl.LP, pl.RepMax, pl.CPMax, pl.CPCur, pl.Funds FROM relation_player p
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
SELECT l.AccountId, l.UserName, pl.Zeit, pl.ScorePoints, pl.CountBases, pl.CountSup, pl.OverallRank, pl.EventRank, pl.GesamtTiberium, pl.GesamtCrystal, pl.GesamtPower, pl.GesamtCredits, pl.ResearchPoints, pl.Credits, pl.Shoot, pl.PvP, pl.PvE, pl.LvLOff, pl.LvLDef, pl.BaseD, pl.OffD, pl.DefD, pl.DFD, pl.SupD, pl.VP, pl.LP, pl.RepMax, pl.CPMax, pl.CPCur, pl.Funds FROM relation_player p
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
SELECT ba.Zeit, b.BaseName, ba.LvLCY, ba.LvLBase, ba.LvLOff, ba.LvLDef, ba.LvLDF, ba.LvLSup, ba.SupArt, ba.Tib, ba.Cry, ba.Pow, ba.Cre, ba.Rep, p.RepMax, ba.CnCOpt FROM relation_bases b
JOIN bases ba ON ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId
JOIN player p ON p.WorldId=ba.WorldId AND p.AccountId=b.AccountId AND p.Zeit=ba.Zeit
WHERE
b.WorldId=WorldId
AND
b.BaseId=BaseId
ORDER BY ba.Zeit ASC$$

CREATE PROCEDURE `getBaseDataAsUser` (IN `WorldId` INT, IN `BaseId` INT, IN `OwnAccountId` INT)  READS SQL DATA
SELECT ba.Zeit, b.BaseName, ba.LvLCY, ba.LvLBase, ba.LvLOff, ba.LvLDef, ba.LvLDF, ba.LvLSup, ba.SupArt, ba.Tib, ba.Cry, ba.Pow, ba.Cre, ba.Rep, p.RepMax, ba.CnCOpt FROM relation_bases b
JOIN bases ba ON ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId
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
SELECT s.WorldId, s.ServerName, a.AllianceId, a.AllianceName, p.AccountId, l.UserName, b.BaseId, b.BaseName
FROM relation_server s
JOIN relation_alliance a ON a.WorldId=s.WorldId
JOIN relation_player p ON p.WorldId=s.WorldId AND p.AllianceId=a.AllianceId
JOIN login l ON l.AccountId=p.AccountId
JOIN relation_bases b ON b.AccountId=p.AccountId AND b.WorldId=s.WorldId
ORDER BY s.ServerName, a.AllianceName, l.UserName, b.BaseId ASC$$

CREATE PROCEDURE `getDropDownListDataAsUser` (IN `OwnAccountId` INT)  READS SQL DATA
SELECT s.WorldId, s.ServerName, a.AllianceId, a.AllianceName, p.AccountId, l.UserName, b.BaseId, b.BaseName
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

CREATE PROCEDURE `getDropDownListDataMemberRoles` (IN `OwnAccountId` INT)  READS SQL DATA
SELECT p.WorldId, p.AllianceId, p.AccountId, a.MemberRole AS NeededMemberRole, p.MemberRole FROM relation_player p
JOIN relation_alliance a ON a.WorldId=p.WorldId AND a.AllianceId=p.AllianceId
WHERE p.AccountId=OwnAccountId
ORDER BY p.WorldId$$

CREATE PROCEDURE `getHistoryAlliancesAsAdmin` (IN `WorldId` INT)  NO SQL
SELECT al.Zeit, a.AllianceId, a.AllianceName, al.AllianceRank, al.EventRank, al.TotalScore, al.AverageScore, al.VP, al.VPh, al.BonusTiberium, al.BonusCrystal, al.BonusPower, al.BonusInfantrie, al.BonusVehicle, al.BonusAir, al.BonusDef, al.ScoreTib, al.ScoreCry, al.ScorePow, al.ScoreInf, al.ScoreVeh, al.ScoreAir, al.ScoreDef, al.RankTib, al.RankCry, al.RankPow, al.RankInf, al.RankVeh, al.RankAir, al.RankDef  FROM alliance al
JOIN relation_alliance a ON a.WorldId=al.WorldId AND a.AllianceId=al.AllianceId
WHERE
a.WorldId=WorldId
ORDER BY al.Zeit ASC, a.AllianceId ASC$$

CREATE PROCEDURE `getHistoryBasesAsAdmin` (IN `WorldId` INT, IN `AccountId` INT, IN `BaseId` INT)  NO SQL
SELECT ba.Zeit, b.BaseId, b.BaseName, ba.LvLCY, ba.LvLBase, ba.LvLOff, ba.LvLDef, ba.LvLDF, ba.LvLSup, ba.SupArt, ba.Tib, ba.Cry, ba.Pow, ba.Cre, ba.Rep FROM bases ba
JOIN relation_bases b ON b.WorldId=ba.WorldId AND b.BaseId=ba.BaseId
WHERE
b.WorldId=WorldId
AND
IF (AccountId>0, AccountId=b.AccountId, true)
AND
IF (BaseId>0, BaseId=b.BaseId, true)
ORDER BY ba.Zeit ASC, b.BaseId ASC$$

CREATE PROCEDURE `getHistoryPlayersAsAdmin` (IN `WorldId` INT, IN `AllianceId` INT, IN `AccountId` INT)  NO SQL
SELECT pl.Zeit, p.AccountId, l.UserName, pl.ScorePoints, pl.CountBases, pl.CountSup, pl.OverallRank, pl.EventRank, pl.GesamtTiberium, pl.GesamtCrystal, pl.GesamtPower, pl.GesamtCredits, pl.ResearchPoints, pl.Credits, pl.Shoot, pl.PvE, pl.LvLOff, pl.BaseD, pl.OffD, pl.DefD, pl.DFD, pl.SupD, pl.VP, pl.LP, pl.RepMax, pl.CPMax, pl.CPCur, pl.Funds, p.MemberRole FROM player pl
JOIN relation_player p ON p.WorldId=pl.WorldId AND p.AccountId=pl.AccountId
JOIN login l ON l.AccountId=p.AccountId
WHERE
p.WorldId=WorldId
AND
IF(AllianceId>0, AllianceId=p.AllianceId, true)
AND
IF(AccountId>0, AccountId=p.AccountId, true)
ORDER BY pl.Zeit ASC, p.AccountId ASC$$

CREATE PROCEDURE `getLayouts` (IN `WorldId` INT, IN `minPosX` INT, IN `maxPosX` INT, IN `minPosY` INT, IN `maxPosY` INT, IN `minDate` DATE, IN `PlayerName` TEXT)  NO SQL
SELECT * FROM layouts l
WHERE
IF (worldId > 0, worldId = l.WorldId, true)
AND
IF (minPosX > 0, minPosX <= l.PosX, true)
AND
IF (maxPosX > 0, maxPosX >= l.PosX, true)
AND
IF (minPosY > 0, minPosY <= l.PosY, true)
AND
IF (maxPosY > 0, maxPosY >= l.PosY, true)
AND
IF (PlayerName <> '', PlayerName=l.PlayerName, true)
AND
l.Zeit >= minDate$$

CREATE PROCEDURE `getLayoutsGroupByPlayerName` ()  NO SQL
SELECT lo.UserName, COUNT(*), MAX(la.Zeit) AS LastScan FROM login lo
JOIN layouts la ON la.AccountId=lo.AccountId
GROUP BY lo.UserName
ORDER BY COUNT(*) DESC$$

CREATE PROCEDURE `getLayoutsGroupByWorldId` ()  NO SQL
SELECT l.WorldId, s.ServerName, COUNT(*), MAX(l.Zeit) AS LastScan FROM layouts l
LEFT JOIN relation_server s ON s.WorldId=l.WorldId
GROUP BY l.WorldId
ORDER BY COUNT(*) DESC$$

CREATE PROCEDURE `getLayoutsGroupByYearMonth` ()  NO SQL
SELECT str_to_date(l.Zeit, '%Y-%m'), COUNT(*) FROM layouts l
GROUP BY str_to_date(l.Zeit, '%Y-%m')$$

CREATE PROCEDURE `getLayoutsOrderByCrystal` (IN `worldId` INT, IN `minPosX` INT, IN `maxPosX` INT, IN `minPosY` INT, IN `maxPosY` INT, IN `minDate` DATE, IN `PlayerName` TEXT, IN `FieldsTib` INT)  NO SQL
SELECT la.WorldId, la.Zeit, lo.UserName, la.PosX, la.PosY, la.Layout, la.CncOpt FROM login lo
JOIN layouts la ON la.AccountId=lo.AccountId
WHERE
IF (worldId > 0, worldId = la.WorldId, true)
AND
IF (minPosX > 0, minPosX <= la.PosX, true)
AND
IF (maxPosX > 0, maxPosX >= la.PosX, true)
AND
IF (minPosY > 0, minPosY <= la.PosY, true)
AND
IF (maxPosY > 0, maxPosY >= la.PosY, true)
AND
IF (PlayerName <> '', lo.UserName LIKE CONCAT('%', PlayerName, '%'), true)
AND
IF (FieldsTib <> '', FieldsTib=la.FieldsTib, true)
AND
la.Zeit >= minDate
ORDER BY la.Crystal6 DESC, la.Crystal5 DESC, la.Crystal4 DESC, la.Crystal3 DESC, la.Crystal2 DESC, la.Crystal1 DESC
LIMIT 100$$

CREATE PROCEDURE `getLayoutsOrderByDate` (IN `worldId` INT, IN `minPosX` INT, IN `maxPosX` INT, IN `minPosY` INT, IN `maxPosY` INT, IN `minDate` DATE, IN `PlayerName` TEXT, IN `FieldsTib` INT)  NO SQL
SELECT la.WorldId, la.Zeit, lo.UserName, la.PosX, la.PosY, la.Layout, la.CncOpt FROM login lo
JOIN layouts la ON la.AccountId=lo.AccountId
WHERE
IF (worldId > 0, worldId = la.WorldId, true)
AND
IF (minPosX > 0, minPosX <= la.PosX, true)
AND
IF (maxPosX > 0, maxPosX >= la.PosX, true)
AND
IF (minPosY > 0, minPosY <= la.PosY, true)
AND
IF (maxPosY > 0, maxPosY >= la.PosY, true)
AND
IF (PlayerName <> '', lo.UserName LIKE CONCAT('%', PlayerName, '%'), true)
AND
IF (FieldsTib <> '', FieldsTib=la.FieldsTib, true)
ORDER by la.Zeit DESC
LIMIT 100$$

CREATE PROCEDURE `getLayoutsOrderByMixed` (IN `worldId` INT, IN `minPosX` INT, IN `maxPosX` INT, IN `minPosY` INT, IN `maxPosY` INT, IN `minDate` DATE, IN `PlayerName` TEXT, IN `FieldsTib` INT)  NO SQL
SELECT la.WorldId, la.Zeit, lo.UserName, la.PosX, la.PosY, la.Layout, la.CncOpt FROM login lo
JOIN layouts la ON la.AccountId=lo.AccountId
WHERE
IF (worldId > 0, worldId = la.WorldId, true)
AND
IF (minPosX > 0, minPosX <= la.PosX, true)
AND
IF (maxPosX > 0, maxPosX >= la.PosX, true)
AND
IF (minPosY > 0, minPosY <= la.PosY, true)
AND
IF (maxPosY > 0, maxPosY >= la.PosY, true)
AND
IF (PlayerName <> '', lo.UserName LIKE CONCAT('%', PlayerName, '%'), true)
AND
IF (FieldsTib <> '', FieldsTib=la.FieldsTib, true)
AND
la.Zeit >= minDate
ORDER BY la.Mixed6 DESC, la.Mixed5 DESC, la.Mixed4 DESC, la.Mixed3 DESC, la.Mixed2 DESC, la.Mixed1 DESC
LIMIT 100$$

CREATE PROCEDURE `getLayoutsOrderByPower` (IN `worldId` INT, IN `minPosX` INT, IN `maxPosX` INT, IN `minPosY` INT, IN `maxPosY` INT, IN `minDate` DATE, IN `PlayerName` TEXT, IN `FieldsTib` INT)  NO SQL
SELECT la.WorldId, la.Zeit, lo.UserName, la.PosX, la.PosY, la.Layout, la.CncOpt FROM login lo
JOIN layouts la ON la.AccountId=lo.AccountId
WHERE
IF (worldId > 0, worldId = la.WorldId, true)
AND
IF (minPosX > 0, minPosX <= la.PosX, true)
AND
IF (maxPosX > 0, maxPosX >= la.PosX, true)
AND
IF (minPosY > 0, minPosY <= la.PosY, true)
AND
IF (maxPosY > 0, maxPosY >= la.PosY, true)
AND
IF (PlayerName <> '', lo.UserName LIKE CONCAT('%', PlayerName, '%'), true)
AND
IF (FieldsTib <> '', FieldsTib=la.FieldsTib, true)
AND
la.Zeit >= minDate
ORDER BY la.Power8 DESC, la.Power7 DESC, la.Power6 DESC, la.Power5 DESC, la.Power4 DESC, la.Power3 DESC, la.Power2 DESC
LIMIT 100$$

CREATE PROCEDURE `getLayoutsOrderByTiberium` (IN `worldId` INT, IN `minPosX` INT, IN `maxPosX` INT, IN `minPosY` INT, IN `maxPosY` INT, IN `minDate` DATE, IN `PlayerName` TEXT, IN `FieldsTib` INT)  NO SQL
SELECT la.WorldId, la.Zeit, lo.UserName, la.PosX, la.PosY, la.Layout, la.CncOpt FROM login lo
JOIN layouts la ON la.AccountId=lo.AccountId
WHERE
IF (worldId > 0, worldId = la.WorldId, true)
AND
IF (minPosX > 0, minPosX <= la.PosX, true)
AND
IF (maxPosX > 0, maxPosX >= la.PosX, true)
AND
IF (minPosY > 0, minPosY <= la.PosY, true)
AND
IF (maxPosY > 0, maxPosY >= la.PosY, true)
AND
IF (PlayerName <> '', lo.UserName LIKE CONCAT('%', PlayerName, '%'), true)
AND
IF (FieldsTib <> '', FieldsTib=la.FieldsTib, true)
AND
la.Zeit >= minDate
ORDER BY la.Tiberium6 DESC, la.Tiberium5 DESC, la.Tiberium4 DESC, la.Tiberium3 DESC, la.Tiberium2 DESC, la.Tiberium1 DESC
LIMIT 100$$

CREATE PROCEDURE `getLoginGroupByAlliance` ()  NO SQL
SELECT a.WorldId, s.ServerName, a.AllianceId, a.AllianceName, MAX(al.Zeit) FROM relation_alliance a
JOIN alliance al ON al.WorldId=a.WorldId AND al.AllianceId=a.AllianceId
JOIN relation_server s ON s.WorldId=a.WorldId
GROUP BY a.WorldId, a.AllianceId
ORDER BY MAX(al.Zeit) DESC, a.WorldId ASC, a.AllianceName ASC$$

CREATE PROCEDURE `getLoginGroupByPasswordChanged` ()  NO SQL
SELECT l.Password!=sha2(concat(l.UserName, '_', l.AccountId), 512) AS PasswordChanged, COUNT(*) FROM login l
GROUP BY PasswordChanged$$

CREATE PROCEDURE `getLoginGroupByPlayer` ()  NO SQL
SELECT l.AccountId, l.UserName, MAX(p.Zeit) FROM login l
JOIN player p ON p.AccountId=l.AccountId
GROUP BY l.AccountId
ORDER BY MAX(p.Zeit) DESC, l.UserName ASC$$

CREATE PROCEDURE `getPlayerBaseDataAsAdmin` (IN `WorldId` INT, IN `AccountId` INT)  READS SQL DATA
SELECT b.BaseId, b.BaseName, ba.LvLCY, ba.LvLBase, ba.LvLOff, ba.LvLDef, ba.LvLDF, ba.LvLSup, ba.SupArt, ba.Tib, ba.Cry, ba.Pow, ba.Cre, ba.Rep, ba.CnCOpt FROM relation_bases b
JOIN bases ba ON ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId
WHERE b.WorldId=WorldId
AND b.AccountId=AccountId
AND
ba.Zeit=
(
    SELECT ba.Zeit FROM bases ba WHERE ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId ORDER BY ba.Zeit DESC LIMIT 1
)
ORDER BY b.BaseId$$

CREATE PROCEDURE `getPlayerBaseDataAsUser` (IN `WorldId` INT, IN `AccountId` INT, IN `OwnAccountId` INT)  READS SQL DATA
SELECT b.BaseId, b.BaseName, ba.LvLCY, ba.LvLBase, ba.LvLOff, ba.LvLDef, ba.LvLDF, ba.LvLSup, ba.SupArt, ba.Tib, ba.Cry, ba.Pow, ba.Cre, ba.Rep, ba.CnCOpt FROM relation_bases b
JOIN bases ba ON ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId
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
    SELECT ba.Zeit FROM bases ba WHERE ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId ORDER BY ba.Zeit DESC LIMIT 1
)
ORDER BY b.BaseId$$

CREATE PROCEDURE `getPlayerDataAsAdmin` (IN `WorldId` INT, IN `AccountId` INT)  READS SQL DATA
SELECT pl.Zeit, pl.ScorePoints,
IFNULL(a.AverageScore, 0) AS AverageScore,
pl.OverallRank, pl.EventRank, pl.GesamtTiberium, pl.GesamtCrystal, pl.GesamtPower, pl.GesamtCredits, pl.ResearchPoints, pl.Credits, pl.Shoot, pl.PvP, pl.PvE, pl.LvLOff, pl.LvLDef, pl.BaseD, pl.OffD, pl.DefD, pl.DFD, pl.SupD, pl.VP, pl.LP, pl.RepMax, pl.CPMax, pl.CPCur, pl.Funds FROM player pl
JOIN relation_player p ON p.WorldId=pl.WorldId AND p.AccountId=pl.AccountId
LEFT JOIN alliance a ON a.WorldId=pl.WorldId AND a.AllianceId=p.AllianceId AND a.Zeit=pl.Zeit
WHERE pl.WorldId=WorldId
AND pl.AccountId=AccountId
ORDER BY pl.Zeit ASC$$

CREATE PROCEDURE `getPlayerDataAsUser` (IN `WorldId` INT, IN `AccountId` INT, IN `OwnAccountId` INT)  READS SQL DATA
SELECT pl.Zeit, pl.ScorePoints,
IFNULL(a.AverageScore, 0) AS AverageScore,
pl.OverallRank, pl.EventRank, pl.GesamtTiberium, pl.GesamtCrystal, pl.GesamtPower, pl.GesamtCredits, pl.ResearchPoints, pl.Credits, pl.Shoot, pl.PvP, pl.PvE, pl.LvLOff, pl.LvLDef, pl.BaseD, pl.OffD, pl.DefD, pl.DFD, pl.SupD, pl.VP, pl.LP, pl.RepMax, pl.CPMax, pl.CPCur, pl.Funds FROM player pl
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

CREATE PROCEDURE `getReportsGroupByAccountIdWhereWorldId` (IN `WorldId` INT)  NO SQL
SELECT r.AccountId, COUNT(*), SUM(r.GainTib), SUM(r.GainCry), SUM(r.GainCre), SUM(r.GainRp), SUM(CostCry), SUM(CostRep) FROM reports r
WHERE r.WorldId=WorldId
GROUP BY r.AccountId
ORDER BY COUNT(*) DESC, r.AccountId ASC$$

CREATE PROCEDURE `getReportsGroupByBaseIdWhereDate` (IN `WorldId` INT, IN `AccountId` INT, IN `Date` DATE)  NO SQL
SELECT r.OwnBaseId, COUNT(*), SUM(r.GainTib), SUM(r.GainCry), SUM(r.GainCre), SUM(r.GainRp), SUM(CostCry), SUM(CostRep) FROM reports r
WHERE r.WorldId=WorldId
AND r.AccountId=AccountId
and DATE(r.AttackTime)=Date
GROUP BY r.OwnBaseId
ORDER BY r.OwnBaseId ASC$$

CREATE PROCEDURE `getReportsGroupByDate` (IN `WorldId` INT, IN `AccountId` INT)  NO SQL
SELECT DATE(r.AttackTime), COUNT(*), SUM(r.GainTib), SUM(r.GainCry), SUM(r.GainCre), SUM(r.GainRp), SUM(CostCry), SUM(CostRep) FROM reports r
WHERE r.WorldId=WorldId
AND r.AccountId=AccountId
GROUP BY DATE(r.AttackTime)
ORDER BY DATE(r.AttackTime) ASC$$

CREATE PROCEDURE `getReportsGroupByDateBaseId` (IN `WorldId` INT, IN `AccountId` INT)  NO SQL
SELECT r.OwnBaseId, COUNT(*), SUM(r.GainTib), SUM(r.GainCry), SUM(r.GainCre), SUM(r.GainRp), SUM(CostCry), SUM(CostRep) FROM reports r
WHERE r.WorldId=WorldId
AND r.AccountId=AccountId
GROUP BY r.OwnBaseId
ORDER BY r.OwnBaseId ASC$$

CREATE PROCEDURE `getReportsGroupByHourToday` (IN `WorldId` INT, IN `AccountId` INT)  NO SQL
SELECT HOUR(r.AttackTime), COUNT(*), SUM(r.GainTib), SUM(r.GainCry), SUM(r.GainCre), SUM(r.GainRp), SUM(CostCry), SUM(CostRep) FROM reports r
WHERE r.WorldId=WorldId
AND r.AccountId=AccountId
AND DATE(r.AttackTime)=CURRENT_DATE()
GROUP BY HOUR(r.AttackTime)
ORDER BY HOUR(r.AttackTime) ASC$$

CREATE PROCEDURE `getReportsGroupByHourWhereDate` (IN `WorldId` INT, IN `AccountId` INT, IN `Date` DATE)  NO SQL
SELECT HOUR(r.AttackTime), COUNT(*), SUM(r.GainTib), SUM(r.GainCry), SUM(r.GainCre), SUM(r.GainRp), SUM(CostCry), SUM(CostRep) FROM reports r
WHERE r.WorldId=WorldId
AND r.AccountId=AccountId
AND DATE(r.AttackTime)=Date
GROUP BY HOUR(r.AttackTime)
ORDER BY HOUR(r.AttackTime) ASC$$

CREATE PROCEDURE `getReportsGroupByHourYesterday` (IN `WorldId` INT, IN `AccountId` INT)  NO SQL
SELECT HOUR(r.AttackTime), COUNT(*), SUM(r.GainTib), SUM(r.GainCry), SUM(r.GainCre), SUM(r.GainRp), SUM(CostCry), SUM(CostRep) FROM reports r
WHERE r.WorldId=WorldId
AND r.AccountId=AccountId
AND DATE(r.AttackTime)=ADDDATE(CURRENT_DATE(), -1)
GROUP BY HOUR(r.AttackTime)
ORDER BY HOUR(r.AttackTime) ASC$$

CREATE PROCEDURE `getReportsGroupByTargetLevel` (IN `WorldId` INT)  NO SQL
SELECT r.TargetLevel, COUNT(*), SUM(r.GainTib), SUM(r.GainCry), SUM(r.GainCre), SUM(r.GainRp), SUM(CostCry), SUM(CostRep) FROM reports r
WHERE r.WorldId=WorldId
GROUP BY r.TargetLevel
ORDER BY r.TargetLevel DESC$$

CREATE PROCEDURE `getReportsGroupByWorldId` ()  NO SQL
SELECT r.WorldId, COUNT(*), SUM(r.GainTib), SUM(r.GainCry), SUM(r.GainCre), SUM(r.GainRp), SUM(CostCry), SUM(CostRep) FROM reports r
GROUP BY r.WorldId
ORDER BY COUNT(*) DESC$$

CREATE PROCEDURE `getTransmissionsPerDay` ()  NO SQL
SELECT pl.Zeit, count(*) FROM player pl GROUP BY pl.Zeit$$

CREATE PROCEDURE `getTransmissionsPerDayUnique` ()  NO SQL
SELECT pl.Zeit, COUNT(DISTINCT pl.AccountId)
FROM player pl
GROUP BY pl.Zeit
ORDER BY pl.Zeit ASC$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `adminlog`
--

CREATE TABLE `adminlog` (
  `Id` int(11) UNSIGNED NOT NULL,
  `Zeit` datetime NOT NULL,
  `Initiator` tinytext COLLATE utf8_bin NOT NULL,
  `Description` tinytext COLLATE utf8_bin NOT NULL,
  `ShowRow` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `alliance`
--

CREATE TABLE `alliance` (
  `Zeit` date NOT NULL,
  `WorldId` smallint(3) UNSIGNED NOT NULL,
  `AllianceId` smallint(4) UNSIGNED NOT NULL,
  `AllianceRank` smallint(4) UNSIGNED NOT NULL,
  `EventRank` smallint(4) UNSIGNED NOT NULL,
  `TotalScore` bigint(12) UNSIGNED NOT NULL,
  `AverageScore` int(10) UNSIGNED NOT NULL,
  `VP` int(9) UNSIGNED NOT NULL,
  `VPh` mediumint(7) UNSIGNED NOT NULL,
  `BonusTiberium` int(9) UNSIGNED NOT NULL,
  `BonusCrystal` int(9) UNSIGNED NOT NULL,
  `BonusPower` int(9) UNSIGNED NOT NULL,
  `BonusInfantrie` smallint(3) UNSIGNED NOT NULL,
  `BonusVehicle` smallint(3) UNSIGNED NOT NULL,
  `BonusAir` smallint(3) UNSIGNED NOT NULL,
  `BonusDef` smallint(3) UNSIGNED NOT NULL,
  `ScoreTib` bigint(12) UNSIGNED NOT NULL,
  `ScoreCry` bigint(12) UNSIGNED NOT NULL,
  `ScorePow` bigint(12) UNSIGNED NOT NULL,
  `ScoreInf` bigint(12) UNSIGNED NOT NULL,
  `ScoreVeh` bigint(12) UNSIGNED NOT NULL,
  `ScoreAir` bigint(12) UNSIGNED NOT NULL,
  `ScoreDef` bigint(12) UNSIGNED NOT NULL,
  `RankTib` smallint(4) UNSIGNED NOT NULL,
  `RankCry` smallint(4) UNSIGNED NOT NULL,
  `RankPow` smallint(4) UNSIGNED NOT NULL,
  `RankInf` smallint(4) UNSIGNED NOT NULL,
  `RankVeh` smallint(4) UNSIGNED NOT NULL,
  `RankAir` smallint(4) UNSIGNED NOT NULL,
  `RankDef` smallint(4) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `bases`
--

CREATE TABLE `bases` (
  `Zeit` date NOT NULL,
  `WorldId` smallint(3) UNSIGNED NOT NULL,
  `BaseId` int(9) UNSIGNED NOT NULL,
  `BasePoints` int(9) UNSIGNED NOT NULL,
  `LvLCY` tinyint(2) UNSIGNED NOT NULL,
  `LvLBase` decimal(4,2) UNSIGNED NOT NULL,
  `LvLOff` decimal(4,2) UNSIGNED NOT NULL,
  `LvLDef` decimal(4,2) UNSIGNED NOT NULL,
  `LvLDF` tinyint(2) UNSIGNED NOT NULL,
  `LvLSup` tinyint(2) UNSIGNED NOT NULL,
  `SupArt` enum('','Art','Ion','Air') COLLATE utf8_bin NOT NULL,
  `Tib` bigint(10) UNSIGNED NOT NULL,
  `Cry` bigint(10) UNSIGNED NOT NULL,
  `Pow` bigint(12) UNSIGNED NOT NULL,
  `Cre` bigint(11) UNSIGNED NOT NULL,
  `Rep` mediumint(7) UNSIGNED NOT NULL,
  `CnCOpt` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `layouts`
--

CREATE TABLE `layouts` (
  `WorldId` smallint(3) UNSIGNED NOT NULL,
  `Zeit` datetime NOT NULL,
  `AccountId` int(7) UNSIGNED NOT NULL,
  `PlayerName` varchar(16) COLLATE utf8_bin NOT NULL,
  `PosX` smallint(4) UNSIGNED NOT NULL,
  `PosY` smallint(4) UNSIGNED NOT NULL,
  `FieldsTib` tinyint(1) NOT NULL,
  `FieldsCry` tinyint(1) NOT NULL,
  `Layout` text COLLATE utf8_bin NOT NULL,
  `CncOpt` tinytext COLLATE utf8_bin NOT NULL,
  `ReservedBy` int(7) UNSIGNED NOT NULL,
  `Tiberium6` tinyint(1) UNSIGNED NOT NULL,
  `Tiberium5` tinyint(1) UNSIGNED NOT NULL,
  `Tiberium4` tinyint(1) UNSIGNED NOT NULL,
  `Tiberium3` tinyint(2) UNSIGNED NOT NULL,
  `Tiberium2` tinyint(2) UNSIGNED NOT NULL,
  `Tiberium1` tinyint(2) UNSIGNED NOT NULL,
  `Crystal6` tinyint(1) UNSIGNED NOT NULL,
  `Crystal5` tinyint(1) UNSIGNED NOT NULL,
  `Crystal4` tinyint(1) UNSIGNED NOT NULL,
  `Crystal3` tinyint(2) UNSIGNED NOT NULL,
  `Crystal2` tinyint(2) UNSIGNED NOT NULL,
  `Crystal1` tinyint(2) UNSIGNED NOT NULL,
  `Mixed6` tinyint(1) UNSIGNED NOT NULL,
  `Mixed5` tinyint(1) UNSIGNED NOT NULL,
  `Mixed4` tinyint(2) UNSIGNED NOT NULL,
  `Mixed3` tinyint(2) UNSIGNED NOT NULL,
  `Mixed2` tinyint(2) UNSIGNED NOT NULL,
  `Mixed1` tinyint(2) UNSIGNED NOT NULL,
  `Power8` tinyint(2) UNSIGNED NOT NULL,
  `Power7` tinyint(2) UNSIGNED NOT NULL,
  `Power6` tinyint(2) UNSIGNED NOT NULL,
  `Power5` tinyint(2) UNSIGNED NOT NULL,
  `Power4` tinyint(2) UNSIGNED NOT NULL,
  `Power3` tinyint(2) UNSIGNED NOT NULL,
  `Power2` tinyint(2) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `login`
--

CREATE TABLE `login` (
  `AccountId` int(7) UNSIGNED NOT NULL,
  `UserName` varchar(16) COLLATE utf8_bin NOT NULL,
  `Password` char(128) COLLATE utf8_bin NOT NULL,
  `IsAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `LastTransmission` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ScriptLocalVersion` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `player`
--

CREATE TABLE `player` (
  `Zeit` date NOT NULL,
  `WorldId` smallint(3) UNSIGNED NOT NULL,
  `AccountId` int(7) UNSIGNED NOT NULL,
  `ScorePoints` bigint(10) UNSIGNED NOT NULL,
  `CountBases` tinyint(2) UNSIGNED NOT NULL,
  `CountSup` tinyint(2) UNSIGNED NOT NULL,
  `OverallRank` smallint(5) UNSIGNED NOT NULL,
  `EventRank` smallint(5) UNSIGNED NOT NULL,
  `GesamtTiberium` bigint(11) UNSIGNED NOT NULL,
  `GesamtCrystal` bigint(11) UNSIGNED NOT NULL,
  `GesamtPower` bigint(13) UNSIGNED NOT NULL,
  `GesamtCredits` bigint(12) UNSIGNED NOT NULL,
  `ResearchPoints` bigint(16) UNSIGNED NOT NULL,
  `Credits` bigint(16) UNSIGNED NOT NULL,
  `Shoot` smallint(4) UNSIGNED NOT NULL,
  `PvP` smallint(4) UNSIGNED NOT NULL,
  `PvE` smallint(4) UNSIGNED NOT NULL,
  `LvLOff` decimal(4,2) UNSIGNED NOT NULL,
  `LvLDef` decimal(4,2) UNSIGNED NOT NULL,
  `BaseD` decimal(4,2) UNSIGNED NOT NULL,
  `OffD` decimal(4,2) UNSIGNED NOT NULL,
  `DefD` decimal(4,2) UNSIGNED NOT NULL,
  `DFD` decimal(4,2) UNSIGNED NOT NULL,
  `SupD` decimal(4,2) UNSIGNED NOT NULL,
  `VP` mediumint(7) UNSIGNED NOT NULL,
  `LP` mediumint(6) UNSIGNED NOT NULL,
  `RepMax` int(7) UNSIGNED NOT NULL,
  `CPMax` mediumint(5) UNSIGNED NOT NULL,
  `CPCur` mediumint(5) UNSIGNED NOT NULL,
  `Funds` mediumint(6) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `relation_alliance`
--

CREATE TABLE `relation_alliance` (
  `WorldId` smallint(3) UNSIGNED NOT NULL,
  `AllianceId` smallint(4) UNSIGNED NOT NULL,
  `AllianceName` varchar(20) COLLATE utf8_bin NOT NULL,
  `MemberRole` tinyint(1) UNSIGNED NOT NULL DEFAULT 5
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `relation_alliance_share`
--

CREATE TABLE `relation_alliance_share` (
  `WorldId` smallint(3) UNSIGNED NOT NULL,
  `AllianceIdSet` smallint(4) UNSIGNED NOT NULL,
  `AllianceIdGet` smallint(4) UNSIGNED NOT NULL,
  `MemberRoleAccess` tinyint(1) UNSIGNED NOT NULL DEFAULT 5
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `relation_bases`
--

CREATE TABLE `relation_bases` (
  `WorldId` smallint(3) UNSIGNED NOT NULL,
  `AccountId` int(7) UNSIGNED NOT NULL,
  `BaseId` int(9) UNSIGNED NOT NULL,
  `BaseName` varchar(19) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `relation_player`
--

CREATE TABLE `relation_player` (
  `WorldId` smallint(3) UNSIGNED NOT NULL,
  `AllianceId` smallint(4) UNSIGNED NOT NULL,
  `AccountId` int(7) UNSIGNED NOT NULL,
  `Faction` tinyint(1) NOT NULL,
  `MemberRole` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `relation_player_share`
--

CREATE TABLE `relation_player_share` (
  `WorldId` smallint(3) UNSIGNED NOT NULL,
  `AccountIdSet` int(7) UNSIGNED NOT NULL,
  `AccountIdGet` int(7) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `relation_server`
--

CREATE TABLE `relation_server` (
  `WorldId` smallint(3) UNSIGNED NOT NULL,
  `ServerName` tinytext COLLATE utf8_bin NOT NULL,
  `SeasonServer` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `reports`
--

CREATE TABLE `reports` (
  `WorldId` smallint(3) UNSIGNED NOT NULL,
  `AccountId` int(7) UNSIGNED NOT NULL,
  `ReportId` int(8) UNSIGNED NOT NULL,
  `OwnBaseId` int(9) UNSIGNED NOT NULL,
  `AttackTime` datetime NOT NULL,
  `TargetLevel` tinyint(2) UNSIGNED NOT NULL,
  `TargetFaction` tinyint(1) UNSIGNED NOT NULL,
  `BattleStatus` tinyint(1) UNSIGNED NOT NULL,
  `GainTib` bigint(12) UNSIGNED NOT NULL,
  `GainCry` bigint(12) UNSIGNED NOT NULL,
  `GainCre` bigint(11) UNSIGNED NOT NULL,
  `GainRp` bigint(11) UNSIGNED NOT NULL,
  `CostCry` bigint(11) UNSIGNED NOT NULL,
  `CostRep` mediumint(6) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `substitution`
--

CREATE TABLE `substitution` (
  `WorldId` smallint(3) UNSIGNED NOT NULL,
  `PlayerNameSet` varchar(16) COLLATE utf8_bin NOT NULL,
  `PlayerNameGet` varchar(16) COLLATE utf8_bin NOT NULL,
  `active` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tmp_logs`
--

CREATE TABLE `tmp_logs` (
  `Zeit` timestamp NOT NULL DEFAULT current_timestamp(),
  `StringValueOld` text COLLATE utf8_bin NOT NULL,
  `StringValueNew` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `adminlog`
--
ALTER TABLE `adminlog`
  ADD PRIMARY KEY (`Id`);

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
  ADD PRIMARY KEY (`Zeit`,`WorldId`,`BaseId`),
  ADD KEY `WorldId` (`WorldId`,`BaseId`);

--
-- Indizes für die Tabelle `layouts`
--
ALTER TABLE `layouts`
  ADD PRIMARY KEY (`WorldId`,`PosX`,`PosY`),
  ADD KEY `PlayerName` (`PlayerName`),
  ADD KEY `ReservedBy` (`ReservedBy`) USING BTREE,
  ADD KEY `AccountId` (`AccountId`) USING BTREE;

--
-- Indizes für die Tabelle `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`AccountId`),
  ADD KEY `UserName` (`UserName`);

--
-- Indizes für die Tabelle `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`Zeit`,`WorldId`,`AccountId`),
  ADD KEY `WorldId` (`WorldId`,`AccountId`);

--
-- Indizes für die Tabelle `relation_alliance`
--
ALTER TABLE `relation_alliance`
  ADD PRIMARY KEY (`WorldId`,`AllianceId`);

--
-- Indizes für die Tabelle `relation_alliance_share`
--
ALTER TABLE `relation_alliance_share`
  ADD PRIMARY KEY (`WorldId`,`AllianceIdSet`,`AllianceIdGet`),
  ADD KEY `WorldId` (`WorldId`,`AllianceIdGet`);

--
-- Indizes für die Tabelle `relation_bases`
--
ALTER TABLE `relation_bases`
  ADD PRIMARY KEY (`WorldId`,`BaseId`),
  ADD KEY `WorldId` (`WorldId`,`AccountId`);

--
-- Indizes für die Tabelle `relation_player`
--
ALTER TABLE `relation_player`
  ADD PRIMARY KEY (`WorldId`,`AccountId`),
  ADD KEY `WorldId` (`WorldId`,`AllianceId`),
  ADD KEY `AccountId` (`AccountId`);

--
-- Indizes für die Tabelle `relation_player_share`
--
ALTER TABLE `relation_player_share`
  ADD PRIMARY KEY (`WorldId`,`AccountIdSet`,`AccountIdGet`),
  ADD KEY `WorldId` (`WorldId`,`AccountIdGet`);

--
-- Indizes für die Tabelle `relation_server`
--
ALTER TABLE `relation_server`
  ADD PRIMARY KEY (`WorldId`);

--
-- Indizes für die Tabelle `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`WorldId`,`ReportId`),
  ADD KEY `WorldId` (`WorldId`,`AccountId`,`OwnBaseId`);

--
-- Indizes für die Tabelle `substitution`
--
ALTER TABLE `substitution`
  ADD PRIMARY KEY (`WorldId`,`PlayerNameSet`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `adminlog`
--
ALTER TABLE `adminlog`
  MODIFY `Id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `bases_ibfk_1` FOREIGN KEY (`WorldId`,`BaseId`) REFERENCES `relation_bases` (`WorldId`, `BaseId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `layouts`
--
ALTER TABLE `layouts`
  ADD CONSTRAINT `layouts_ibfk_1` FOREIGN KEY (`WorldId`) REFERENCES `relation_server` (`WorldId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `layouts_ibfk_2` FOREIGN KEY (`ReservedBy`) REFERENCES `login` (`AccountId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `layouts_ibfk_3` FOREIGN KEY (`AccountId`) REFERENCES `login` (`AccountId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `player`
--
ALTER TABLE `player`
  ADD CONSTRAINT `player_ibfk_1` FOREIGN KEY (`WorldId`,`AccountId`) REFERENCES `relation_player` (`WorldId`, `AccountId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `relation_alliance`
--
ALTER TABLE `relation_alliance`
  ADD CONSTRAINT `relation_alliance_ibfk_1` FOREIGN KEY (`WorldId`) REFERENCES `relation_server` (`WorldId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `relation_alliance_share`
--
ALTER TABLE `relation_alliance_share`
  ADD CONSTRAINT `relation_alliance_share_ibfk_1` FOREIGN KEY (`WorldId`,`AllianceIdSet`) REFERENCES `relation_alliance` (`WorldId`, `AllianceId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `relation_alliance_share_ibfk_2` FOREIGN KEY (`WorldId`,`AllianceIdGet`) REFERENCES `relation_alliance` (`WorldId`, `AllianceId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `relation_bases`
--
ALTER TABLE `relation_bases`
  ADD CONSTRAINT `relation_bases_ibfk_1` FOREIGN KEY (`WorldId`,`AccountId`) REFERENCES `relation_player` (`WorldId`, `AccountId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `relation_player`
--
ALTER TABLE `relation_player`
  ADD CONSTRAINT `relation_player_ibfk_1` FOREIGN KEY (`WorldId`,`AllianceId`) REFERENCES `relation_alliance` (`WorldId`, `AllianceId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `relation_player_ibfk_2` FOREIGN KEY (`AccountId`) REFERENCES `login` (`AccountId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `relation_player_share`
--
ALTER TABLE `relation_player_share`
  ADD CONSTRAINT `relation_player_share_ibfk_1` FOREIGN KEY (`WorldId`,`AccountIdSet`) REFERENCES `relation_player` (`WorldId`, `AccountId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `relation_player_share_ibfk_2` FOREIGN KEY (`WorldId`,`AccountIdGet`) REFERENCES `relation_player` (`WorldId`, `AccountId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`WorldId`,`AccountId`,`OwnBaseId`) REFERENCES `relation_bases` (`WorldId`, `AccountId`, `BaseId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `substitution`
--
ALTER TABLE `substitution`
  ADD CONSTRAINT `substitution_ibfk_1` FOREIGN KEY (`WorldId`) REFERENCES `relation_server` (`WorldId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
