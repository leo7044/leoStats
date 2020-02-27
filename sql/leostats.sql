-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Erstellungszeit: 27. Feb 2020 um 17:14
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
SELECT l.AccountId, l.UserName, b.BaseId, ba.Zeit, p.Faction, ba.BasePoints, ba.LvLCY, ba.LvLBase, ba.LvLOff, ba.LvLDef, ba.LvLDF, ba.LvLSup, ba.SupArt, ba.Tib, ba.Cry, ba.Pow, ba.Cre, ba.Rep, ba.CnCOpt FROM relation_player p
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
				SELECT p2.AllianceId FROM relation_player p2 WHERE p2.WorldId=_WorldId AND p2.AccountId=_OwnAccountId
			)
			AND
			IF
			(
				(SELECT p2.MemberRole FROM relation_player p2 WHERE p2.AccountId=_OwnAccountId AND p2.WorldId=_WorldId)<=a.MemberRole,
				true,
				p.AccountId=_OwnAccountId
			)
		)
		OR
		(
			a.AllianceId=
			(
				SELECT ash.AllianceIdSet FROM relation_alliance_share ash
				JOIN relation_player p2 ON p2.WorldId=ash.WorldId AND p2.AllianceId=ash.AllianceIdGet
				WHERE ash.WorldId=_WorldId AND p2.AccountId=_OwnAccountId
			)
			AND
			IF
			(
				(SELECT p2.MemberRole FROM relation_player p2
                WHERE p2.WorldId=_WorldId AND
                p2.AccountId=_OwnAccountId)<=(SELECT ash.MemberRoleAccess FROM relation_alliance_share ash
				JOIN relation_player p2 ON p2.WorldId=ash.WorldId AND p2.AllianceId=ash.AllianceIdGet
				WHERE ash.WorldId=_WorldId and p2.AccountId=_OwnAccountId),
				true,
				false
			)
		)
		OR
		(
			p.AccountId=
			(
				SELECT psh.AccountIdSet FROM relation_player_share psh
				WHERE psh.WorldId=_WorldId
				AND psh.AccountIdGet=_OwnAccountId
			)
		)
	)
)
ORDER BY l.UserName ASC, ba.BaseId ASC$$

CREATE PROCEDURE `getAllianceDataHistory` (IN `_WorldId` INT, IN `_AllianceId` INT, IN `_OwnAccountId` INT)  NO SQL
SELECT DISTINCT al.Zeit, al.AllianceRank, al.EventRank, al.TotalScore, al.AverageScore, al.PvP, al.PvE, al.VP, al.VPh, al.BonusTiberium, al.BonusCrystal, al.BonusPower, al.BonusInfantrie, al.BonusVehicle, al.BonusAir, al.BonusDef, al.ScoreTib, al.ScoreCry, al.ScorePow, al.ScoreInf, al.ScoreVeh, al.ScoreAir, al.ScoreDef, al.RankTib, al.RankCry, al.RankPow, al.RankInf, al.RankVeh, al.RankAir, al.RankDef FROM relation_player p
JOIN alliance al ON al.WorldId=p.WorldId AND al.AllianceId=p.AllianceId
WHERE p.WorldId=_WorldId
AND p.AllianceId=_AllianceId
AND
IF
(
	(SELECT _OwnAccountId IN (SELECT l.AccountId FROM login l WHERE l.IsAdmin=true)),
	true,
	(
		(
			al.AllianceId=
			(
				SELECT p2.AllianceId FROM relation_player p2 WHERE p2.WorldId=_WorldId AND p2.AccountId=_OwnAccountId
			)
		)
		OR
		(
			al.AllianceId=
			(
				SELECT ash.AllianceIdSet FROM relation_alliance_share ash
				JOIN relation_player p2 ON p2.WorldId=ash.WorldId AND p2.AllianceId=ash.AllianceIdGet
				WHERE ash.WorldId=_WorldId AND p2.AccountId=_OwnAccountId
			)
			AND
			IF
			(
				(SELECT p2.MemberRole FROM relation_player p2
				WHERE p2.WorldId=_WorldId
				AND p2.AccountId=_OwnAccountId)<=(SELECT ash.MemberRoleAccess FROM relation_alliance_share ash
				JOIN relation_player p2 ON p2.WorldId=ash.WorldId AND p2.AllianceId=ash.AllianceIdGet
				WHERE ash.WorldId=_WorldId and p2.AccountId=_OwnAccountId),
				true,
				false
			)
		)
	)
)
ORDER BY al.Zeit ASC$$

CREATE PROCEDURE `getAlliancePlayerData` (IN `_WorldId` INT, IN `_AllianceId` INT, IN `_OwnAccountId` INT)  NO SQL
SELECT l.AccountId, l.UserName, pl.Zeit, pl.ScorePoints, pl.CountBases, pl.CountSup, pl.OverallRank, pl.EventRank, pl.GesamtTiberium, pl.GesamtCrystal, pl.GesamtPower, pl.GesamtCredits, pl.ResearchPoints, pl.Credits, pl.Shoot, pl.PvP, pl.PvE, pl.LvLOff, pl.LvLDef, pl.BaseD, pl.OffD, pl.DefD, pl.DFD, pl.SupD, pl.VP, pl.LP, pl.RepMax, pl.CPMax, pl.CPCur, pl.Funds FROM relation_player p
JOIN login l ON l.AccountId=p.AccountId
JOIN player pl ON pl.WorldId=p.WorldId AND pl.AccountId=p.AccountId
JOIN relation_alliance a ON a.WorldId=p.WorldId AND a.AllianceId=p.AllianceId
WHERE
pl.Zeit=
(
	SELECT pl.Zeit FROM player pl
	WHERE pl.WorldId=p.WorldId
	AND pl.AccountId=p.AccountId
	ORDER BY pl.Zeit DESC LIMIT 1
)
AND p.WorldId=_WorldId
AND p.AllianceId=_AllianceId
AND
IF
(
	(SELECT _OwnAccountId IN (SELECT l.AccountId FROM login l WHERE l.IsAdmin=true)),
	true,
	(
		(
			p.AllianceId=
			(
				SELECT p2.AllianceId FROM relation_player p2 WHERE p2.WorldId=_WorldId AND p2.AccountId=_OwnAccountId
			)
			AND
			IF
			(
				(SELECT p2.MemberRole FROM relation_player p2 WHERE p2.AccountId=_OwnAccountId AND p2.WorldId=_WorldId)<=a.MemberRole,
				true,
				p.AccountId=_OwnAccountId
			)
		)
		OR
		(
			p.AllianceId=
			(
				SELECT ash.AllianceIdSet FROM relation_alliance_share ash
				JOIN relation_player p2 ON p2.WorldId=ash.WorldId AND p2.AllianceId=ash.AllianceIdGet
				WHERE ash.WorldId=_WorldId AND p2.AccountId=_OwnAccountId
			)
			AND
			IF
			(
				(SELECT p2.MemberRole FROM relation_player p2
                WHERE p2.WorldId=_WorldId
                AND p2.AccountId=_OwnAccountId)<=(SELECT ash.MemberRoleAccess FROM relation_alliance_share ash
				JOIN relation_player p2 ON p2.WorldId=ash.WorldId AND p2.AllianceId=ash.AllianceIdGet
				WHERE ash.WorldId=_WorldId and p2.AccountId=_OwnAccountId),
				true,
				false
			)
		)
		OR
		(
			p.AccountId=
			(
				SELECT psh.AccountIdSet FROM relation_player_share psh
				WHERE psh.WorldId=_WorldId
				AND psh.AccountIdGet=_OwnAccountId
			)
		)
	)
)
ORDER BY l.UserName$$

CREATE PROCEDURE `getBaseDataHistory` (IN `_WorldId` INT, IN `_BaseId` INT, IN `_OwnAccountId` INT)  NO SQL
SELECT ba.Zeit, ba.PosX, ba.PosY, ba.BasePoints, ba.LvLCY, ba.LvLBase, ba.LvLOff, ba.LvLDef, ba.LvLDF, ba.LvLSup, ba.SupArt, ba.Tib, ba.Cry, ba.Pow, ba.Cre, ba.Rep, pl.RepMax, ba.CnCOpt FROM relation_bases b
JOIN bases ba ON ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId
JOIN player pl ON pl.WorldId=ba.WorldId AND pl.AccountId=b.AccountId AND pl.Zeit=ba.Zeit
JOIN relation_player p ON p.WorldId=b.WorldId AND p.AccountId=b.AccountId
JOIN relation_alliance a ON a.WorldId=b.WorldId AND a.AllianceId=p.AllianceId
WHERE b.WorldId=_WorldId
AND b.BaseId=_BaseId
AND
IF
(
	(SELECT _OwnAccountId IN (SELECT l.AccountId FROM login l WHERE l.IsAdmin=true)),
	true,
	(
		(
			a.AllianceId=
			(
				SELECT p2.AllianceId FROM relation_player p2 WHERE p2.WorldId=_WorldId AND p2.AccountId=_OwnAccountId
			)
			AND
			IF
			(
				(SELECT p2.MemberRole FROM relation_player p2 WHERE p2.AccountId=_OwnAccountId AND p2.WorldId=_WorldId)<=a.MemberRole,
				true,
				p.AccountId=_OwnAccountId
			)
		)
		OR
		(
			a.AllianceId=
			(
				SELECT ash.AllianceIdSet FROM relation_alliance_share ash
				JOIN relation_player p2 ON p2.WorldId=ash.WorldId AND p2.AllianceId=ash.AllianceIdGet
				WHERE ash.WorldId=_WorldId AND p2.AccountId=_OwnAccountId
			)
			AND
			IF
			(
				(SELECT p2.MemberRole FROM relation_player p2
                WHERE p2.WorldId=_WorldId
                AND p2.AccountId=_OwnAccountId)<=(SELECT ash.MemberRoleAccess FROM relation_alliance_share ash
				JOIN relation_player p2 ON p2.WorldId=ash.WorldId AND p2.AllianceId=ash.AllianceIdGet
				WHERE ash.WorldId=_WorldId and p2.AccountId=_OwnAccountId),
				true,
				false
			)
		)
		OR
		(
			p.AccountId=
			(
				SELECT psh.AccountIdSet FROM relation_player_share psh
				WHERE psh.WorldId=_WorldId
				AND psh.AccountIdGet=_OwnAccountId
			)
		)
	)
)
ORDER BY ba.Zeit ASC$$

CREATE PROCEDURE `getDropDownListData` (IN `_OwnAccountId` INT)  NO SQL
SELECT s.WorldId, s.ServerName, a.AllianceId, a.AllianceName, p.AccountId, l.UserName, b.BaseId, b.BaseName
FROM relation_server s
JOIN relation_alliance a ON a.WorldId=s.WorldId
JOIN relation_player p ON p.WorldId=s.WorldId AND p.AllianceId=a.AllianceId
JOIN login l ON l.AccountId=p.AccountId
JOIN relation_bases b ON b.AccountId=p.AccountId AND b.WorldId=s.WorldId
WHERE
IF
(
	(SELECT _OwnAccountId IN (SELECT l.AccountId FROM login l WHERE l.IsAdmin=true)),
	true,
	(
		(
			s.WorldId IN
			(
				SELECT p2.WorldId FROM relation_player p2 WHERE p2.AccountId=_OwnAccountId
			)
		)
		AND
		(
			(
				a.AllianceId=
				(
					SELECT p2.AllianceId FROM relation_player p2 WHERE p2.WorldId=s.WorldId AND p2.AccountId=_OwnAccountId
				)
				AND
				IF
				(
					(SELECT p2.MemberRole FROM relation_player p2 WHERE p2.AccountId=_OwnAccountId AND p2.WorldId=s.WorldId)<=a.MemberRole,
					true,
					p.AccountId=_OwnAccountId
				)
			)
			OR
			(
				a.AllianceId=
				(
					SELECT ash.AllianceIdSet FROM relation_alliance_share ash
					JOIN relation_player p2 ON p2.WorldId=ash.WorldId AND p2.AllianceId=ash.AllianceIdGet
					WHERE ash.WorldId=s.WorldId AND p2.AccountId=_OwnAccountId
				)
				AND
				IF
				(
					(SELECT p2.MemberRole FROM relation_player p2
					WHERE p2.WorldId=s.WorldId AND
					p2.AccountId=_OwnAccountId)<=(SELECT ash.MemberRoleAccess FROM relation_alliance_share ash
					JOIN relation_player p2 ON p2.WorldId=ash.WorldId AND p2.AllianceId=ash.AllianceIdGet
					WHERE ash.WorldId=s.WorldId and p2.AccountId=_OwnAccountId),
					true,
					false
				)
			)
			OR
			(
				p.AccountId=
				(
					SELECT psh.AccountIdSet FROM relation_player_share psh
					WHERE psh.WorldId=s.WorldId
					AND psh.AccountIdGet=_OwnAccountId
				)
			)
		)
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

CREATE PROCEDURE `getLayoutNumberGroupByPlayerName` ()  NO SQL
SELECT lo.UserName, COUNT(*), MAX(la.Zeit) AS LastScan FROM login lo
JOIN layouts la ON la.AccountId=lo.AccountId
GROUP BY lo.UserName
ORDER BY COUNT(*) DESC$$

CREATE PROCEDURE `getLayoutNumberGroupByWorldId` ()  NO SQL
SELECT l.WorldId, s.ServerName, COUNT(*), MAX(l.Zeit) AS LastScan FROM layouts l
LEFT JOIN relation_server s ON s.WorldId=l.WorldId
GROUP BY l.WorldId
ORDER BY COUNT(*) DESC$$

CREATE PROCEDURE `getLayoutNumberGroupByYearMonth` ()  NO SQL
SELECT str_to_date(l.Zeit, '%Y-%m'), COUNT(*) FROM layouts l
GROUP BY str_to_date(l.Zeit, '%Y-%m')$$

CREATE PROCEDURE `getLayouts` (IN `_WorldId` INT, IN `_minPosX` INT, IN `_maxPosX` INT, IN `_minPosY` INT, IN `_maxPosY` INT, IN `_minDate` DATE, IN `_PlayerName` TEXT, IN `_FieldsTib` INT, IN `_OrderBy` TEXT)  NO SQL
SELECT la.WorldId, la.Zeit, lo.UserName, la.PosX, la.PosY, la.Layout, la.CncOpt FROM login lo
JOIN layouts la ON la.AccountId=lo.AccountId
WHERE
IF (_WorldId > 0, _WorldId = la.WorldId, true)
AND
IF (_minPosX > 0, _minPosX <= la.PosX, true)
AND
IF (_maxPosX > 0, _maxPosX >= la.PosX, true)
AND
IF (_minPosY > 0, _minPosY <= la.PosY, true)
AND
IF (_maxPosY > 0, _maxPosY >= la.PosY, true)
AND
IF (_PlayerName <> '', lo.UserName LIKE CONCAT('%', _PlayerName, '%'), true)
AND
IF (_FieldsTib <> '', _FieldsTib=la.FieldsTib, true)
AND
la.Zeit >= _minDate
ORDER BY
CASE _OrderBy WHEN 'Tiberium' THEN la.Tiberium6 END DESC,
CASE _OrderBy WHEN 'Tiberium' THEN la.Tiberium5 END DESC,
CASE _OrderBy WHEN 'Tiberium' THEN la.Tiberium4 END DESC,
CASE _OrderBy WHEN 'Tiberium' THEN la.Tiberium3 END DESC,
CASE _OrderBy WHEN 'Tiberium' THEN la.Tiberium2 END DESC,
CASE _OrderBy WHEN 'Tiberium' THEN la.Tiberium1 END DESC,
CASE _OrderBy WHEN 'Crystal' THEN la.Crystal6 END DESC,
CASE _OrderBy WHEN 'Crystal' THEN la.Crystal5 END DESC,
CASE _OrderBy WHEN 'Crystal' THEN la.Crystal4 END DESC,
CASE _OrderBy WHEN 'Crystal' THEN la.Crystal3 END DESC,
CASE _OrderBy WHEN 'Crystal' THEN la.Crystal2 END DESC,
CASE _OrderBy WHEN 'Crystal' THEN la.Crystal1 END DESC,
CASE _OrderBy WHEN 'Mixed' THEN la.Mixed6 END DESC,
CASE _OrderBy WHEN 'Mixed' THEN la.Mixed5 END DESC,
CASE _OrderBy WHEN 'Mixed' THEN la.Mixed4 END DESC,
CASE _OrderBy WHEN 'Mixed' THEN la.Mixed3 END DESC,
CASE _OrderBy WHEN 'Mixed' THEN la.Mixed2 END DESC,
CASE _OrderBy WHEN 'Mixed' THEN la.Mixed1 END DESC,
CASE _OrderBy WHEN 'Power' THEN la.Power8 END DESC,
CASE _OrderBy WHEN 'Power' THEN la.Power7 END DESC,
CASE _OrderBy WHEN 'Power' THEN la.Power6 END DESC,
CASE _OrderBy WHEN 'Power' THEN la.Power5 END DESC,
CASE _OrderBy WHEN 'Power' THEN la.Power4 END DESC,
CASE _OrderBy WHEN 'Power' THEN la.Power3 END DESC,
CASE _OrderBy WHEN 'Power' THEN la.Power2 END DESC,
CASE _OrderBy WHEN 'Date' THEN la.Zeit END DESC
LIMIT 100$$

CREATE PROCEDURE `getLoginGroupByAlliance` ()  NO SQL
SELECT a.WorldId, s.ServerName, a.AllianceId, a.AllianceName, MAX(al.Zeit) FROM relation_alliance a
JOIN alliance al ON al.WorldId=a.WorldId AND al.AllianceId=a.AllianceId
JOIN relation_server s ON s.WorldId=a.WorldId
GROUP BY a.WorldId, a.AllianceId
ORDER BY MAX(al.Zeit) DESC, a.WorldId ASC, a.AllianceName ASC$$

CREATE PROCEDURE `getLoginGroupByPasswordChanged` ()  NO SQL
SELECT l.Password!=sha2(CONCAT(l.UserName, '_', l.AccountId), 512) AS PasswordChanged, COUNT(*) FROM login l
GROUP BY PasswordChanged$$

CREATE PROCEDURE `getLoginGroupByPlayer` ()  NO SQL
SELECT l.AccountId, l.UserName, MAX(p.Zeit) FROM login l
JOIN player p ON p.AccountId=l.AccountId
GROUP BY l.AccountId
ORDER BY MAX(p.Zeit) DESC, l.UserName ASC$$

CREATE PROCEDURE `getOverview` (IN `_WorldId` INT, IN `_AllianceId` INT, IN `_OwnAccountId` INT)  NO SQL
SELECT SUM(CASE WHEN ba.LvLBase BETWEEN 0 AND 0.99 THEN 1 ELSE 0 END) AS LvLBase0,
SUM(CASE WHEN ba.LvLOff BETWEEN 0 AND 0.99 THEN 1 ELSE 0 END) AS LvLOff0,
SUM(CASE WHEN ba.LvLDef BETWEEN 0 AND 0.99 THEN 1 ELSE 0 END) AS LvLDef0,
SUM(CASE WHEN ba.LvLSup=0 THEN 1 ELSE 0 END) AS LvLSup0,
SUM(CASE WHEN ba.LvLBase BETWEEN 1 AND 1.99 THEN 1 ELSE 0 END) AS LvLBase1,
SUM(CASE WHEN ba.LvLOff BETWEEN 1 AND 1.99 THEN 1 ELSE 0 END) AS LvLOff1,
SUM(CASE WHEN ba.LvLDef BETWEEN 1 AND 1.99 THEN 1 ELSE 0 END) AS LvLDef1,
SUM(CASE WHEN ba.LvLSup=1 THEN 1 ELSE 0 END) AS LvLSup1,
SUM(CASE WHEN ba.LvLBase BETWEEN 2 AND 2.99 THEN 1 ELSE 0 END) AS LvLBase2,
SUM(CASE WHEN ba.LvLOff BETWEEN 2 AND 2.99 THEN 1 ELSE 0 END) AS LvLOff2,
SUM(CASE WHEN ba.LvLDef BETWEEN 2 AND 2.99 THEN 1 ELSE 0 END) AS LvLDef2,
SUM(CASE WHEN ba.LvLSup=2 THEN 1 ELSE 0 END) AS LvLSup2,
SUM(CASE WHEN ba.LvLBase BETWEEN 3 AND 3.99 THEN 1 ELSE 0 END) AS LvLBase3,
SUM(CASE WHEN ba.LvLOff BETWEEN 3 AND 3.99 THEN 1 ELSE 0 END) AS LvLOff3,
SUM(CASE WHEN ba.LvLDef BETWEEN 3 AND 3.99 THEN 1 ELSE 0 END) AS LvLDef3,
SUM(CASE WHEN ba.LvLSup=3 THEN 1 ELSE 0 END) AS LvLSup3,
SUM(CASE WHEN ba.LvLBase BETWEEN 4 AND 4.99 THEN 1 ELSE 0 END) AS LvLBase4,
SUM(CASE WHEN ba.LvLOff BETWEEN 4 AND 4.99 THEN 1 ELSE 0 END) AS LvLOff4,
SUM(CASE WHEN ba.LvLDef BETWEEN 4 AND 4.99 THEN 1 ELSE 0 END) AS LvLDef4,
SUM(CASE WHEN ba.LvLSup=4 THEN 1 ELSE 0 END) AS LvLSup4,
SUM(CASE WHEN ba.LvLBase BETWEEN 5 AND 5.99 THEN 1 ELSE 0 END) AS LvLBase5,
SUM(CASE WHEN ba.LvLOff BETWEEN 5 AND 5.99 THEN 1 ELSE 0 END) AS LvLOff5,
SUM(CASE WHEN ba.LvLDef BETWEEN 5 AND 5.99 THEN 1 ELSE 0 END) AS LvLDef5,
SUM(CASE WHEN ba.LvLSup=5 THEN 1 ELSE 0 END) AS LvLSup5,
SUM(CASE WHEN ba.LvLBase BETWEEN 6 AND 6.99 THEN 1 ELSE 0 END) AS LvLBase6,
SUM(CASE WHEN ba.LvLOff BETWEEN 6 AND 6.99 THEN 1 ELSE 0 END) AS LvLOff6,
SUM(CASE WHEN ba.LvLDef BETWEEN 6 AND 6.99 THEN 1 ELSE 0 END) AS LvLDef6,
SUM(CASE WHEN ba.LvLSup=6 THEN 1 ELSE 0 END) AS LvLSup6,
SUM(CASE WHEN ba.LvLBase BETWEEN 7 AND 7.99 THEN 1 ELSE 0 END) AS LvLBase7,
SUM(CASE WHEN ba.LvLOff BETWEEN 7 AND 7.99 THEN 1 ELSE 0 END) AS LvLOff7,
SUM(CASE WHEN ba.LvLDef BETWEEN 7 AND 7.99 THEN 1 ELSE 0 END) AS LvLDef7,
SUM(CASE WHEN ba.LvLSup=7 THEN 1 ELSE 0 END) AS LvLSup7,
SUM(CASE WHEN ba.LvLBase BETWEEN 8 AND 8.99 THEN 1 ELSE 0 END) AS LvLBase8,
SUM(CASE WHEN ba.LvLOff BETWEEN 8 AND 8.99 THEN 1 ELSE 0 END) AS LvLOff8,
SUM(CASE WHEN ba.LvLDef BETWEEN 8 AND 8.99 THEN 1 ELSE 0 END) AS LvLDef8,
SUM(CASE WHEN ba.LvLSup=8 THEN 1 ELSE 0 END) AS LvLSup8,
SUM(CASE WHEN ba.LvLBase BETWEEN 9 AND 9.99 THEN 1 ELSE 0 END) AS LvLBase9,
SUM(CASE WHEN ba.LvLOff BETWEEN 9 AND 9.99 THEN 1 ELSE 0 END) AS LvLOff9,
SUM(CASE WHEN ba.LvLDef BETWEEN 9 AND 9.99 THEN 1 ELSE 0 END) AS LvLDef9,
SUM(CASE WHEN ba.LvLSup=9 THEN 1 ELSE 0 END) AS LvLSup9,
SUM(CASE WHEN ba.LvLBase BETWEEN 10 AND 10.99 THEN 1 ELSE 0 END) AS LvLBase10,
SUM(CASE WHEN ba.LvLOff BETWEEN 10 AND 10.99 THEN 1 ELSE 0 END) AS LvLOff10,
SUM(CASE WHEN ba.LvLDef BETWEEN 10 AND 10.99 THEN 1 ELSE 0 END) AS LvLDef10,
SUM(CASE WHEN ba.LvLSup=10 THEN 1 ELSE 0 END) AS LvLSup10,
SUM(CASE WHEN ba.LvLBase BETWEEN 11 AND 11.99 THEN 1 ELSE 0 END) AS LvLBase11,
SUM(CASE WHEN ba.LvLOff BETWEEN 11 AND 11.99 THEN 1 ELSE 0 END) AS LvLOff11,
SUM(CASE WHEN ba.LvLDef BETWEEN 11 AND 11.99 THEN 1 ELSE 0 END) AS LvLDef11,
SUM(CASE WHEN ba.LvLSup=11 THEN 1 ELSE 0 END) AS LvLSup11,
SUM(CASE WHEN ba.LvLBase BETWEEN 12 AND 12.99 THEN 1 ELSE 0 END) AS LvLBase12,
SUM(CASE WHEN ba.LvLOff BETWEEN 12 AND 12.99 THEN 1 ELSE 0 END) AS LvLOff12,
SUM(CASE WHEN ba.LvLDef BETWEEN 12 AND 12.99 THEN 1 ELSE 0 END) AS LvLDef12,
SUM(CASE WHEN ba.LvLSup=12 THEN 1 ELSE 0 END) AS LvLSup12,
SUM(CASE WHEN ba.LvLBase BETWEEN 13 AND 13.99 THEN 1 ELSE 0 END) AS LvLBase13,
SUM(CASE WHEN ba.LvLOff BETWEEN 13 AND 13.99 THEN 1 ELSE 0 END) AS LvLOff13,
SUM(CASE WHEN ba.LvLDef BETWEEN 13 AND 13.99 THEN 1 ELSE 0 END) AS LvLDef13,
SUM(CASE WHEN ba.LvLSup=13 THEN 1 ELSE 0 END) AS LvLSup13,
SUM(CASE WHEN ba.LvLBase BETWEEN 14 AND 14.99 THEN 1 ELSE 0 END) AS LvLBase14,
SUM(CASE WHEN ba.LvLOff BETWEEN 14 AND 14.99 THEN 1 ELSE 0 END) AS LvLOff14,
SUM(CASE WHEN ba.LvLDef BETWEEN 14 AND 14.99 THEN 1 ELSE 0 END) AS LvLDef14,
SUM(CASE WHEN ba.LvLSup=14 THEN 1 ELSE 0 END) AS LvLSup14,
SUM(CASE WHEN ba.LvLBase BETWEEN 15 AND 15.99 THEN 1 ELSE 0 END) AS LvLBase15,
SUM(CASE WHEN ba.LvLOff BETWEEN 15 AND 15.99 THEN 1 ELSE 0 END) AS LvLOff15,
SUM(CASE WHEN ba.LvLDef BETWEEN 15 AND 15.99 THEN 1 ELSE 0 END) AS LvLDef15,
SUM(CASE WHEN ba.LvLSup=15 THEN 1 ELSE 0 END) AS LvLSup15,
SUM(CASE WHEN ba.LvLBase BETWEEN 16 AND 16.99 THEN 1 ELSE 0 END) AS LvLBase16,
SUM(CASE WHEN ba.LvLOff BETWEEN 16 AND 16.99 THEN 1 ELSE 0 END) AS LvLOff16,
SUM(CASE WHEN ba.LvLDef BETWEEN 16 AND 16.99 THEN 1 ELSE 0 END) AS LvLDef16,
SUM(CASE WHEN ba.LvLSup=16 THEN 1 ELSE 0 END) AS LvLSup16,
SUM(CASE WHEN ba.LvLBase BETWEEN 17 AND 17.99 THEN 1 ELSE 0 END) AS LvLBase17,
SUM(CASE WHEN ba.LvLOff BETWEEN 17 AND 17.99 THEN 1 ELSE 0 END) AS LvLOff17,
SUM(CASE WHEN ba.LvLDef BETWEEN 17 AND 17.99 THEN 1 ELSE 0 END) AS LvLDef17,
SUM(CASE WHEN ba.LvLSup=17 THEN 1 ELSE 0 END) AS LvLSup17,
SUM(CASE WHEN ba.LvLBase BETWEEN 18 AND 18.99 THEN 1 ELSE 0 END) AS LvLBase18,
SUM(CASE WHEN ba.LvLOff BETWEEN 18 AND 18.99 THEN 1 ELSE 0 END) AS LvLOff18,
SUM(CASE WHEN ba.LvLDef BETWEEN 18 AND 18.99 THEN 1 ELSE 0 END) AS LvLDef18,
SUM(CASE WHEN ba.LvLSup=18 THEN 1 ELSE 0 END) AS LvLSup18,
SUM(CASE WHEN ba.LvLBase BETWEEN 19 AND 19.99 THEN 1 ELSE 0 END) AS LvLBase19,
SUM(CASE WHEN ba.LvLOff BETWEEN 19 AND 19.99 THEN 1 ELSE 0 END) AS LvLOff19,
SUM(CASE WHEN ba.LvLDef BETWEEN 19 AND 19.99 THEN 1 ELSE 0 END) AS LvLDef19,
SUM(CASE WHEN ba.LvLSup=19 THEN 1 ELSE 0 END) AS LvLSup19,
SUM(CASE WHEN ba.LvLBase BETWEEN 20 AND 20.99 THEN 1 ELSE 0 END) AS LvLBase20,
SUM(CASE WHEN ba.LvLOff BETWEEN 20 AND 20.99 THEN 1 ELSE 0 END) AS LvLOff20,
SUM(CASE WHEN ba.LvLDef BETWEEN 20 AND 20.99 THEN 1 ELSE 0 END) AS LvLDef20,
SUM(CASE WHEN ba.LvLSup=20 THEN 1 ELSE 0 END) AS LvLSup20,
SUM(CASE WHEN ba.LvLBase BETWEEN 21 AND 21.99 THEN 1 ELSE 0 END) AS LvLBase21,
SUM(CASE WHEN ba.LvLOff BETWEEN 21 AND 21.99 THEN 1 ELSE 0 END) AS LvLOff21,
SUM(CASE WHEN ba.LvLDef BETWEEN 21 AND 21.99 THEN 1 ELSE 0 END) AS LvLDef21,
SUM(CASE WHEN ba.LvLSup=21 THEN 1 ELSE 0 END) AS LvLSup21,
SUM(CASE WHEN ba.LvLBase BETWEEN 22 AND 22.99 THEN 1 ELSE 0 END) AS LvLBase22,
SUM(CASE WHEN ba.LvLOff BETWEEN 22 AND 22.99 THEN 1 ELSE 0 END) AS LvLOff22,
SUM(CASE WHEN ba.LvLDef BETWEEN 22 AND 22.99 THEN 1 ELSE 0 END) AS LvLDef22,
SUM(CASE WHEN ba.LvLSup=22 THEN 1 ELSE 0 END) AS LvLSup22,
SUM(CASE WHEN ba.LvLBase BETWEEN 23 AND 23.99 THEN 1 ELSE 0 END) AS LvLBase23,
SUM(CASE WHEN ba.LvLOff BETWEEN 23 AND 23.99 THEN 1 ELSE 0 END) AS LvLOff23,
SUM(CASE WHEN ba.LvLDef BETWEEN 23 AND 23.99 THEN 1 ELSE 0 END) AS LvLDef23,
SUM(CASE WHEN ba.LvLSup=23 THEN 1 ELSE 0 END) AS LvLSup23,
SUM(CASE WHEN ba.LvLBase BETWEEN 24 AND 24.99 THEN 1 ELSE 0 END) AS LvLBase24,
SUM(CASE WHEN ba.LvLOff BETWEEN 24 AND 24.99 THEN 1 ELSE 0 END) AS LvLOff24,
SUM(CASE WHEN ba.LvLDef BETWEEN 24 AND 24.99 THEN 1 ELSE 0 END) AS LvLDef24,
SUM(CASE WHEN ba.LvLSup=24 THEN 1 ELSE 0 END) AS LvLSup24,
SUM(CASE WHEN ba.LvLBase BETWEEN 25 AND 25.99 THEN 1 ELSE 0 END) AS LvLBase25,
SUM(CASE WHEN ba.LvLOff BETWEEN 25 AND 25.99 THEN 1 ELSE 0 END) AS LvLOff25,
SUM(CASE WHEN ba.LvLDef BETWEEN 25 AND 25.99 THEN 1 ELSE 0 END) AS LvLDef25,
SUM(CASE WHEN ba.LvLSup=25 THEN 1 ELSE 0 END) AS LvLSup25,
SUM(CASE WHEN ba.LvLBase BETWEEN 26 AND 26.99 THEN 1 ELSE 0 END) AS LvLBase26,
SUM(CASE WHEN ba.LvLOff BETWEEN 26 AND 26.99 THEN 1 ELSE 0 END) AS LvLOff26,
SUM(CASE WHEN ba.LvLDef BETWEEN 26 AND 26.99 THEN 1 ELSE 0 END) AS LvLDef26,
SUM(CASE WHEN ba.LvLSup=26 THEN 1 ELSE 0 END) AS LvLSup26,
SUM(CASE WHEN ba.LvLBase BETWEEN 27 AND 27.99 THEN 1 ELSE 0 END) AS LvLBase27,
SUM(CASE WHEN ba.LvLOff BETWEEN 27 AND 27.99 THEN 1 ELSE 0 END) AS LvLOff27,
SUM(CASE WHEN ba.LvLDef BETWEEN 27 AND 27.99 THEN 1 ELSE 0 END) AS LvLDef27,
SUM(CASE WHEN ba.LvLSup=27 THEN 1 ELSE 0 END) AS LvLSup27,
SUM(CASE WHEN ba.LvLBase BETWEEN 28 AND 28.99 THEN 1 ELSE 0 END) AS LvLBase28,
SUM(CASE WHEN ba.LvLOff BETWEEN 28 AND 28.99 THEN 1 ELSE 0 END) AS LvLOff28,
SUM(CASE WHEN ba.LvLDef BETWEEN 28 AND 28.99 THEN 1 ELSE 0 END) AS LvLDef28,
SUM(CASE WHEN ba.LvLSup=28 THEN 1 ELSE 0 END) AS LvLSup28,
SUM(CASE WHEN ba.LvLBase BETWEEN 29 AND 29.99 THEN 1 ELSE 0 END) AS LvLBase29,
SUM(CASE WHEN ba.LvLOff BETWEEN 29 AND 29.99 THEN 1 ELSE 0 END) AS LvLOff29,
SUM(CASE WHEN ba.LvLDef BETWEEN 29 AND 29.99 THEN 1 ELSE 0 END) AS LvLDef29,
SUM(CASE WHEN ba.LvLSup=29 THEN 1 ELSE 0 END) AS LvLSup29,
SUM(CASE WHEN ba.LvLBase BETWEEN 30 AND 30.99 THEN 1 ELSE 0 END) AS LvLBase30,
SUM(CASE WHEN ba.LvLOff BETWEEN 30 AND 30.99 THEN 1 ELSE 0 END) AS LvLOff30,
SUM(CASE WHEN ba.LvLDef BETWEEN 30 AND 30.99 THEN 1 ELSE 0 END) AS LvLDef30,
SUM(CASE WHEN ba.LvLSup=30 THEN 1 ELSE 0 END) AS LvLSup30,
SUM(CASE WHEN ba.LvLBase BETWEEN 31 AND 31.99 THEN 1 ELSE 0 END) AS LvLBase31,
SUM(CASE WHEN ba.LvLOff BETWEEN 31 AND 31.99 THEN 1 ELSE 0 END) AS LvLOff31,
SUM(CASE WHEN ba.LvLDef BETWEEN 31 AND 31.99 THEN 1 ELSE 0 END) AS LvLDef31,
SUM(CASE WHEN ba.LvLSup=31 THEN 1 ELSE 0 END) AS LvLSup31,
SUM(CASE WHEN ba.LvLBase BETWEEN 32 AND 32.99 THEN 1 ELSE 0 END) AS LvLBase32,
SUM(CASE WHEN ba.LvLOff BETWEEN 32 AND 32.99 THEN 1 ELSE 0 END) AS LvLOff32,
SUM(CASE WHEN ba.LvLDef BETWEEN 32 AND 32.99 THEN 1 ELSE 0 END) AS LvLDef32,
SUM(CASE WHEN ba.LvLSup=32 THEN 1 ELSE 0 END) AS LvLSup32,
SUM(CASE WHEN ba.LvLBase BETWEEN 33 AND 33.99 THEN 1 ELSE 0 END) AS LvLBase33,
SUM(CASE WHEN ba.LvLOff BETWEEN 33 AND 33.99 THEN 1 ELSE 0 END) AS LvLOff33,
SUM(CASE WHEN ba.LvLDef BETWEEN 33 AND 33.99 THEN 1 ELSE 0 END) AS LvLDef33,
SUM(CASE WHEN ba.LvLSup=33 THEN 1 ELSE 0 END) AS LvLSup33,
SUM(CASE WHEN ba.LvLBase BETWEEN 34 AND 34.99 THEN 1 ELSE 0 END) AS LvLBase34,
SUM(CASE WHEN ba.LvLOff BETWEEN 34 AND 34.99 THEN 1 ELSE 0 END) AS LvLOff34,
SUM(CASE WHEN ba.LvLDef BETWEEN 34 AND 34.99 THEN 1 ELSE 0 END) AS LvLDef34,
SUM(CASE WHEN ba.LvLSup=34 THEN 1 ELSE 0 END) AS LvLSup34,
SUM(CASE WHEN ba.LvLBase BETWEEN 35 AND 35.99 THEN 1 ELSE 0 END) AS LvLBase35,
SUM(CASE WHEN ba.LvLOff BETWEEN 35 AND 35.99 THEN 1 ELSE 0 END) AS LvLOff35,
SUM(CASE WHEN ba.LvLDef BETWEEN 35 AND 35.99 THEN 1 ELSE 0 END) AS LvLDef35,
SUM(CASE WHEN ba.LvLSup=35 THEN 1 ELSE 0 END) AS LvLSup35,
SUM(CASE WHEN ba.LvLBase BETWEEN 36 AND 36.99 THEN 1 ELSE 0 END) AS LvLBase36,
SUM(CASE WHEN ba.LvLOff BETWEEN 36 AND 36.99 THEN 1 ELSE 0 END) AS LvLOff36,
SUM(CASE WHEN ba.LvLDef BETWEEN 36 AND 36.99 THEN 1 ELSE 0 END) AS LvLDef36,
SUM(CASE WHEN ba.LvLSup=36 THEN 1 ELSE 0 END) AS LvLSup36,
SUM(CASE WHEN ba.LvLBase BETWEEN 37 AND 37.99 THEN 1 ELSE 0 END) AS LvLBase37,
SUM(CASE WHEN ba.LvLOff BETWEEN 37 AND 37.99 THEN 1 ELSE 0 END) AS LvLOff37,
SUM(CASE WHEN ba.LvLDef BETWEEN 37 AND 37.99 THEN 1 ELSE 0 END) AS LvLDef37,
SUM(CASE WHEN ba.LvLSup=37 THEN 1 ELSE 0 END) AS LvLSup37,
SUM(CASE WHEN ba.LvLBase BETWEEN 38 AND 38.99 THEN 1 ELSE 0 END) AS LvLBase38,
SUM(CASE WHEN ba.LvLOff BETWEEN 38 AND 38.99 THEN 1 ELSE 0 END) AS LvLOff38,
SUM(CASE WHEN ba.LvLDef BETWEEN 38 AND 38.99 THEN 1 ELSE 0 END) AS LvLDef38,
SUM(CASE WHEN ba.LvLSup=38 THEN 1 ELSE 0 END) AS LvLSup38,
SUM(CASE WHEN ba.LvLBase BETWEEN 39 AND 39.99 THEN 1 ELSE 0 END) AS LvLBase39,
SUM(CASE WHEN ba.LvLOff BETWEEN 39 AND 39.99 THEN 1 ELSE 0 END) AS LvLOff39,
SUM(CASE WHEN ba.LvLDef BETWEEN 39 AND 39.99 THEN 1 ELSE 0 END) AS LvLDef39,
SUM(CASE WHEN ba.LvLSup=39 THEN 1 ELSE 0 END) AS LvLSup39,
SUM(CASE WHEN ba.LvLBase BETWEEN 40 AND 40.99 THEN 1 ELSE 0 END) AS LvLBase40,
SUM(CASE WHEN ba.LvLOff BETWEEN 40 AND 40.99 THEN 1 ELSE 0 END) AS LvLOff40,
SUM(CASE WHEN ba.LvLDef BETWEEN 40 AND 40.99 THEN 1 ELSE 0 END) AS LvLDef40,
SUM(CASE WHEN ba.LvLSup=40 THEN 1 ELSE 0 END) AS LvLSup40,
SUM(CASE WHEN ba.LvLBase BETWEEN 41 AND 41.99 THEN 1 ELSE 0 END) AS LvLBase41,
SUM(CASE WHEN ba.LvLOff BETWEEN 41 AND 41.99 THEN 1 ELSE 0 END) AS LvLOff41,
SUM(CASE WHEN ba.LvLDef BETWEEN 41 AND 41.99 THEN 1 ELSE 0 END) AS LvLDef41,
SUM(CASE WHEN ba.LvLSup=41 THEN 1 ELSE 0 END) AS LvLSup41,
SUM(CASE WHEN ba.LvLBase BETWEEN 42 AND 42.99 THEN 1 ELSE 0 END) AS LvLBase42,
SUM(CASE WHEN ba.LvLOff BETWEEN 42 AND 42.99 THEN 1 ELSE 0 END) AS LvLOff42,
SUM(CASE WHEN ba.LvLDef BETWEEN 42 AND 42.99 THEN 1 ELSE 0 END) AS LvLDef42,
SUM(CASE WHEN ba.LvLSup=42 THEN 1 ELSE 0 END) AS LvLSup42,
SUM(CASE WHEN ba.LvLBase BETWEEN 43 AND 43.99 THEN 1 ELSE 0 END) AS LvLBase43,
SUM(CASE WHEN ba.LvLOff BETWEEN 43 AND 43.99 THEN 1 ELSE 0 END) AS LvLOff43,
SUM(CASE WHEN ba.LvLDef BETWEEN 43 AND 43.99 THEN 1 ELSE 0 END) AS LvLDef43,
SUM(CASE WHEN ba.LvLSup=43 THEN 1 ELSE 0 END) AS LvLSup43,
SUM(CASE WHEN ba.LvLBase BETWEEN 44 AND 44.99 THEN 1 ELSE 0 END) AS LvLBase44,
SUM(CASE WHEN ba.LvLOff BETWEEN 44 AND 44.99 THEN 1 ELSE 0 END) AS LvLOff44,
SUM(CASE WHEN ba.LvLDef BETWEEN 44 AND 44.99 THEN 1 ELSE 0 END) AS LvLDef44,
SUM(CASE WHEN ba.LvLSup=44 THEN 1 ELSE 0 END) AS LvLSup44,
SUM(CASE WHEN ba.LvLBase BETWEEN 45 AND 45.99 THEN 1 ELSE 0 END) AS LvLBase45,
SUM(CASE WHEN ba.LvLOff BETWEEN 45 AND 45.99 THEN 1 ELSE 0 END) AS LvLOff45,
SUM(CASE WHEN ba.LvLDef BETWEEN 45 AND 45.99 THEN 1 ELSE 0 END) AS LvLDef45,
SUM(CASE WHEN ba.LvLSup=45 THEN 1 ELSE 0 END) AS LvLSup45,
SUM(CASE WHEN ba.LvLBase BETWEEN 46 AND 46.99 THEN 1 ELSE 0 END) AS LvLBase46,
SUM(CASE WHEN ba.LvLOff BETWEEN 46 AND 46.99 THEN 1 ELSE 0 END) AS LvLOff46,
SUM(CASE WHEN ba.LvLDef BETWEEN 46 AND 46.99 THEN 1 ELSE 0 END) AS LvLDef46,
SUM(CASE WHEN ba.LvLSup=46 THEN 1 ELSE 0 END) AS LvLSup46,
SUM(CASE WHEN ba.LvLBase BETWEEN 47 AND 47.99 THEN 1 ELSE 0 END) AS LvLBase47,
SUM(CASE WHEN ba.LvLOff BETWEEN 47 AND 47.99 THEN 1 ELSE 0 END) AS LvLOff47,
SUM(CASE WHEN ba.LvLDef BETWEEN 47 AND 47.99 THEN 1 ELSE 0 END) AS LvLDef47,
SUM(CASE WHEN ba.LvLSup=47 THEN 1 ELSE 0 END) AS LvLSup47,
SUM(CASE WHEN ba.LvLBase BETWEEN 48 AND 48.99 THEN 1 ELSE 0 END) AS LvLBase48,
SUM(CASE WHEN ba.LvLOff BETWEEN 48 AND 48.99 THEN 1 ELSE 0 END) AS LvLOff48,
SUM(CASE WHEN ba.LvLDef BETWEEN 48 AND 48.99 THEN 1 ELSE 0 END) AS LvLDef48,
SUM(CASE WHEN ba.LvLSup=48 THEN 1 ELSE 0 END) AS LvLSup48,
SUM(CASE WHEN ba.LvLBase BETWEEN 49 AND 49.99 THEN 1 ELSE 0 END) AS LvLBase49,
SUM(CASE WHEN ba.LvLOff BETWEEN 49 AND 49.99 THEN 1 ELSE 0 END) AS LvLOff49,
SUM(CASE WHEN ba.LvLDef BETWEEN 49 AND 49.99 THEN 1 ELSE 0 END) AS LvLDef49,
SUM(CASE WHEN ba.LvLSup=49 THEN 1 ELSE 0 END) AS LvLSup49,
SUM(CASE WHEN ba.LvLBase BETWEEN 50 AND 50.99 THEN 1 ELSE 0 END) AS LvLBase50,
SUM(CASE WHEN ba.LvLOff BETWEEN 50 AND 50.99 THEN 1 ELSE 0 END) AS LvLOff50,
SUM(CASE WHEN ba.LvLDef BETWEEN 50 AND 50.99 THEN 1 ELSE 0 END) AS LvLDef50,
SUM(CASE WHEN ba.LvLSup=50 THEN 1 ELSE 0 END) AS LvLSup50,
SUM(CASE WHEN ba.LvLBase BETWEEN 51 AND 51.99 THEN 1 ELSE 0 END) AS LvLBase51,
SUM(CASE WHEN ba.LvLOff BETWEEN 51 AND 51.99 THEN 1 ELSE 0 END) AS LvLOff51,
SUM(CASE WHEN ba.LvLDef BETWEEN 51 AND 51.99 THEN 1 ELSE 0 END) AS LvLDef51,
SUM(CASE WHEN ba.LvLSup=51 THEN 1 ELSE 0 END) AS LvLSup51,
SUM(CASE WHEN ba.LvLBase BETWEEN 52 AND 52.99 THEN 1 ELSE 0 END) AS LvLBase52,
SUM(CASE WHEN ba.LvLOff BETWEEN 52 AND 52.99 THEN 1 ELSE 0 END) AS LvLOff52,
SUM(CASE WHEN ba.LvLDef BETWEEN 52 AND 52.99 THEN 1 ELSE 0 END) AS LvLDef52,
SUM(CASE WHEN ba.LvLSup=52 THEN 1 ELSE 0 END) AS LvLSup52,
SUM(CASE WHEN ba.LvLBase BETWEEN 53 AND 53.99 THEN 1 ELSE 0 END) AS LvLBase53,
SUM(CASE WHEN ba.LvLOff BETWEEN 53 AND 53.99 THEN 1 ELSE 0 END) AS LvLOff53,
SUM(CASE WHEN ba.LvLDef BETWEEN 53 AND 53.99 THEN 1 ELSE 0 END) AS LvLDef53,
SUM(CASE WHEN ba.LvLSup=53 THEN 1 ELSE 0 END) AS LvLSup53,
SUM(CASE WHEN ba.LvLBase BETWEEN 54 AND 54.99 THEN 1 ELSE 0 END) AS LvLBase54,
SUM(CASE WHEN ba.LvLOff BETWEEN 54 AND 54.99 THEN 1 ELSE 0 END) AS LvLOff54,
SUM(CASE WHEN ba.LvLDef BETWEEN 54 AND 54.99 THEN 1 ELSE 0 END) AS LvLDef54,
SUM(CASE WHEN ba.LvLSup=54 THEN 1 ELSE 0 END) AS LvLSup54,
SUM(CASE WHEN ba.LvLBase BETWEEN 55 AND 55.99 THEN 1 ELSE 0 END) AS LvLBase55,
SUM(CASE WHEN ba.LvLOff BETWEEN 55 AND 55.99 THEN 1 ELSE 0 END) AS LvLOff55,
SUM(CASE WHEN ba.LvLDef BETWEEN 55 AND 55.99 THEN 1 ELSE 0 END) AS LvLDef55,
SUM(CASE WHEN ba.LvLSup=55 THEN 1 ELSE 0 END) AS LvLSup55,
SUM(CASE WHEN ba.LvLBase BETWEEN 56 AND 56.99 THEN 1 ELSE 0 END) AS LvLBase56,
SUM(CASE WHEN ba.LvLOff BETWEEN 56 AND 56.99 THEN 1 ELSE 0 END) AS LvLOff56,
SUM(CASE WHEN ba.LvLDef BETWEEN 56 AND 56.99 THEN 1 ELSE 0 END) AS LvLDef56,
SUM(CASE WHEN ba.LvLSup=56 THEN 1 ELSE 0 END) AS LvLSup56,
SUM(CASE WHEN ba.LvLBase BETWEEN 57 AND 57.99 THEN 1 ELSE 0 END) AS LvLBase57,
SUM(CASE WHEN ba.LvLOff BETWEEN 57 AND 57.99 THEN 1 ELSE 0 END) AS LvLOff57,
SUM(CASE WHEN ba.LvLDef BETWEEN 57 AND 57.99 THEN 1 ELSE 0 END) AS LvLDef57,
SUM(CASE WHEN ba.LvLSup=57 THEN 1 ELSE 0 END) AS LvLSup57,
SUM(CASE WHEN ba.LvLBase BETWEEN 58 AND 58.99 THEN 1 ELSE 0 END) AS LvLBase58,
SUM(CASE WHEN ba.LvLOff BETWEEN 58 AND 58.99 THEN 1 ELSE 0 END) AS LvLOff58,
SUM(CASE WHEN ba.LvLDef BETWEEN 58 AND 58.99 THEN 1 ELSE 0 END) AS LvLDef58,
SUM(CASE WHEN ba.LvLSup=58 THEN 1 ELSE 0 END) AS LvLSup58,
SUM(CASE WHEN ba.LvLBase BETWEEN 59 AND 59.99 THEN 1 ELSE 0 END) AS LvLBase59,
SUM(CASE WHEN ba.LvLOff BETWEEN 59 AND 59.99 THEN 1 ELSE 0 END) AS LvLOff59,
SUM(CASE WHEN ba.LvLDef BETWEEN 59 AND 59.99 THEN 1 ELSE 0 END) AS LvLDef59,
SUM(CASE WHEN ba.LvLSup=59 THEN 1 ELSE 0 END) AS LvLSup59,
SUM(CASE WHEN ba.LvLBase BETWEEN 60 AND 60.99 THEN 1 ELSE 0 END) AS LvLBase60,
SUM(CASE WHEN ba.LvLOff BETWEEN 60 AND 60.99 THEN 1 ELSE 0 END) AS LvLOff60,
SUM(CASE WHEN ba.LvLDef BETWEEN 60 AND 60.99 THEN 1 ELSE 0 END) AS LvLDef60,
SUM(CASE WHEN ba.LvLSup=60 THEN 1 ELSE 0 END) AS LvLSup60,
SUM(CASE WHEN ba.LvLBase BETWEEN 61 AND 61.99 THEN 1 ELSE 0 END) AS LvLBase61,
SUM(CASE WHEN ba.LvLOff BETWEEN 61 AND 61.99 THEN 1 ELSE 0 END) AS LvLOff61,
SUM(CASE WHEN ba.LvLDef BETWEEN 61 AND 61.99 THEN 1 ELSE 0 END) AS LvLDef61,
SUM(CASE WHEN ba.LvLSup=61 THEN 1 ELSE 0 END) AS LvLSup61,
SUM(CASE WHEN ba.LvLBase BETWEEN 62 AND 62.99 THEN 1 ELSE 0 END) AS LvLBase62,
SUM(CASE WHEN ba.LvLOff BETWEEN 62 AND 62.99 THEN 1 ELSE 0 END) AS LvLOff62,
SUM(CASE WHEN ba.LvLDef BETWEEN 62 AND 62.99 THEN 1 ELSE 0 END) AS LvLDef62,
SUM(CASE WHEN ba.LvLSup=62 THEN 1 ELSE 0 END) AS LvLSup62,
SUM(CASE WHEN ba.LvLBase BETWEEN 63 AND 63.99 THEN 1 ELSE 0 END) AS LvLBase63,
SUM(CASE WHEN ba.LvLOff BETWEEN 63 AND 63.99 THEN 1 ELSE 0 END) AS LvLOff63,
SUM(CASE WHEN ba.LvLDef BETWEEN 63 AND 63.99 THEN 1 ELSE 0 END) AS LvLDef63,
SUM(CASE WHEN ba.LvLSup=63 THEN 1 ELSE 0 END) AS LvLSup63,
SUM(CASE WHEN ba.LvLBase BETWEEN 64 AND 64.99 THEN 1 ELSE 0 END) AS LvLBase64,
SUM(CASE WHEN ba.LvLOff BETWEEN 64 AND 64.99 THEN 1 ELSE 0 END) AS LvLOff64,
SUM(CASE WHEN ba.LvLDef BETWEEN 64 AND 64.99 THEN 1 ELSE 0 END) AS LvLDef64,
SUM(CASE WHEN ba.LvLSup=64 THEN 1 ELSE 0 END) AS LvLSup64,
SUM(CASE WHEN ba.LvLBase BETWEEN 65 AND 65.99 THEN 1 ELSE 0 END) AS LvLBase65,
SUM(CASE WHEN ba.LvLOff BETWEEN 65 AND 65.99 THEN 1 ELSE 0 END) AS LvLOff65,
SUM(CASE WHEN ba.LvLDef BETWEEN 65 AND 65.99 THEN 1 ELSE 0 END) AS LvLDef65,
SUM(CASE WHEN ba.LvLSup=65 THEN 1 ELSE 0 END) AS LvLSup65,
SUM(CASE WHEN ba.LvLBase BETWEEN 66 AND 66.99 THEN 1 ELSE 0 END) AS LvLBase66,
SUM(CASE WHEN ba.LvLOff BETWEEN 66 AND 66.99 THEN 1 ELSE 0 END) AS LvLOff66,
SUM(CASE WHEN ba.LvLDef BETWEEN 66 AND 66.99 THEN 1 ELSE 0 END) AS LvLDef66,
SUM(CASE WHEN ba.LvLSup=66 THEN 1 ELSE 0 END) AS LvLSup66,
SUM(CASE WHEN ba.LvLBase BETWEEN 67 AND 67.99 THEN 1 ELSE 0 END) AS LvLBase67,
SUM(CASE WHEN ba.LvLOff BETWEEN 67 AND 67.99 THEN 1 ELSE 0 END) AS LvLOff67,
SUM(CASE WHEN ba.LvLDef BETWEEN 67 AND 67.99 THEN 1 ELSE 0 END) AS LvLDef67,
SUM(CASE WHEN ba.LvLSup=67 THEN 1 ELSE 0 END) AS LvLSup67,
SUM(CASE WHEN ba.LvLBase BETWEEN 68 AND 68.99 THEN 1 ELSE 0 END) AS LvLBase68,
SUM(CASE WHEN ba.LvLOff BETWEEN 68 AND 68.99 THEN 1 ELSE 0 END) AS LvLOff68,
SUM(CASE WHEN ba.LvLDef BETWEEN 68 AND 68.99 THEN 1 ELSE 0 END) AS LvLDef68,
SUM(CASE WHEN ba.LvLSup=68 THEN 1 ELSE 0 END) AS LvLSup68,
SUM(CASE WHEN ba.LvLBase BETWEEN 69 AND 69.99 THEN 1 ELSE 0 END) AS LvLBase69,
SUM(CASE WHEN ba.LvLOff BETWEEN 69 AND 69.99 THEN 1 ELSE 0 END) AS LvLOff69,
SUM(CASE WHEN ba.LvLDef BETWEEN 69 AND 69.99 THEN 1 ELSE 0 END) AS LvLDef69,
SUM(CASE WHEN ba.LvLSup=69 THEN 1 ELSE 0 END) AS LvLSup69,
SUM(CASE WHEN ba.LvLBase BETWEEN 70 AND 70.99 THEN 1 ELSE 0 END) AS LvLBase70,
SUM(CASE WHEN ba.LvLOff BETWEEN 70 AND 70.99 THEN 1 ELSE 0 END) AS LvLOff70,
SUM(CASE WHEN ba.LvLDef BETWEEN 70 AND 70.99 THEN 1 ELSE 0 END) AS LvLDef70,
SUM(CASE WHEN ba.LvLSup=70 THEN 1 ELSE 0 END) AS LvLSup70,
SUM(CASE WHEN ba.LvLBase BETWEEN 71 AND 71.99 THEN 1 ELSE 0 END) AS LvLBase71,
SUM(CASE WHEN ba.LvLOff BETWEEN 71 AND 71.99 THEN 1 ELSE 0 END) AS LvLOff71,
SUM(CASE WHEN ba.LvLDef BETWEEN 71 AND 71.99 THEN 1 ELSE 0 END) AS LvLDef71,
SUM(CASE WHEN ba.LvLSup=71 THEN 1 ELSE 0 END) AS LvLSup71,
SUM(CASE WHEN ba.LvLBase BETWEEN 72 AND 72.99 THEN 1 ELSE 0 END) AS LvLBase72,
SUM(CASE WHEN ba.LvLOff BETWEEN 72 AND 72.99 THEN 1 ELSE 0 END) AS LvLOff72,
SUM(CASE WHEN ba.LvLDef BETWEEN 72 AND 72.99 THEN 1 ELSE 0 END) AS LvLDef72,
SUM(CASE WHEN ba.LvLSup=72 THEN 1 ELSE 0 END) AS LvLSup72,
SUM(CASE WHEN ba.LvLBase BETWEEN 73 AND 73.99 THEN 1 ELSE 0 END) AS LvLBase73,
SUM(CASE WHEN ba.LvLOff BETWEEN 73 AND 73.99 THEN 1 ELSE 0 END) AS LvLOff73,
SUM(CASE WHEN ba.LvLDef BETWEEN 73 AND 73.99 THEN 1 ELSE 0 END) AS LvLDef73,
SUM(CASE WHEN ba.LvLSup=73 THEN 1 ELSE 0 END) AS LvLSup73,
SUM(CASE WHEN ba.LvLBase BETWEEN 74 AND 74.99 THEN 1 ELSE 0 END) AS LvLBase74,
SUM(CASE WHEN ba.LvLOff BETWEEN 74 AND 74.99 THEN 1 ELSE 0 END) AS LvLOff74,
SUM(CASE WHEN ba.LvLDef BETWEEN 74 AND 74.99 THEN 1 ELSE 0 END) AS LvLDef74,
SUM(CASE WHEN ba.LvLSup=74 THEN 1 ELSE 0 END) AS LvLSup74,
SUM(CASE WHEN ba.LvLBase BETWEEN 75 AND 75.99 THEN 1 ELSE 0 END) AS LvLBase75,
SUM(CASE WHEN ba.LvLOff BETWEEN 75 AND 75.99 THEN 1 ELSE 0 END) AS LvLOff75,
SUM(CASE WHEN ba.LvLDef BETWEEN 75 AND 75.99 THEN 1 ELSE 0 END) AS LvLDef75,
SUM(CASE WHEN ba.LvLSup=75 THEN 1 ELSE 0 END) AS LvLSup75,
SUM(CASE WHEN ba.LvLBase BETWEEN 76 AND 76.99 THEN 1 ELSE 0 END) AS LvLBase76,
SUM(CASE WHEN ba.LvLOff BETWEEN 76 AND 76.99 THEN 1 ELSE 0 END) AS LvLOff76,
SUM(CASE WHEN ba.LvLDef BETWEEN 76 AND 76.99 THEN 1 ELSE 0 END) AS LvLDef76,
SUM(CASE WHEN ba.LvLSup=76 THEN 1 ELSE 0 END) AS LvLSup76,
SUM(CASE WHEN ba.LvLBase BETWEEN 77 AND 77.99 THEN 1 ELSE 0 END) AS LvLBase77,
SUM(CASE WHEN ba.LvLOff BETWEEN 77 AND 77.99 THEN 1 ELSE 0 END) AS LvLOff77,
SUM(CASE WHEN ba.LvLDef BETWEEN 77 AND 77.99 THEN 1 ELSE 0 END) AS LvLDef77,
SUM(CASE WHEN ba.LvLSup=77 THEN 1 ELSE 0 END) AS LvLSup77,
SUM(CASE WHEN ba.LvLBase BETWEEN 78 AND 78.99 THEN 1 ELSE 0 END) AS LvLBase78,
SUM(CASE WHEN ba.LvLOff BETWEEN 78 AND 78.99 THEN 1 ELSE 0 END) AS LvLOff78,
SUM(CASE WHEN ba.LvLDef BETWEEN 78 AND 78.99 THEN 1 ELSE 0 END) AS LvLDef78,
SUM(CASE WHEN ba.LvLSup=78 THEN 1 ELSE 0 END) AS LvLSup78,
SUM(CASE WHEN ba.LvLBase BETWEEN 79 AND 79.99 THEN 1 ELSE 0 END) AS LvLBase79,
SUM(CASE WHEN ba.LvLOff BETWEEN 79 AND 79.99 THEN 1 ELSE 0 END) AS LvLOff79,
SUM(CASE WHEN ba.LvLDef BETWEEN 79 AND 79.99 THEN 1 ELSE 0 END) AS LvLDef79,
SUM(CASE WHEN ba.LvLSup=79 THEN 1 ELSE 0 END) AS LvLSup79,
SUM(CASE WHEN ba.LvLBase BETWEEN 80 AND 80.99 THEN 1 ELSE 0 END) AS LvLBase80,
SUM(CASE WHEN ba.LvLOff BETWEEN 80 AND 80.99 THEN 1 ELSE 0 END) AS LvLOff80,
SUM(CASE WHEN ba.LvLDef BETWEEN 80 AND 80.99 THEN 1 ELSE 0 END) AS LvLDef80,
SUM(CASE WHEN ba.LvLSup=80 THEN 1 ELSE 0 END) AS LvLSup80,
SUM(CASE WHEN ba.LvLBase BETWEEN 81 AND 81.99 THEN 1 ELSE 0 END) AS LvLBase81,
SUM(CASE WHEN ba.LvLOff BETWEEN 81 AND 81.99 THEN 1 ELSE 0 END) AS LvLOff81,
SUM(CASE WHEN ba.LvLDef BETWEEN 81 AND 81.99 THEN 1 ELSE 0 END) AS LvLDef81,
SUM(CASE WHEN ba.LvLSup=81 THEN 1 ELSE 0 END) AS LvLSup81,
SUM(CASE WHEN ba.LvLBase BETWEEN 82 AND 82.99 THEN 1 ELSE 0 END) AS LvLBase82,
SUM(CASE WHEN ba.LvLOff BETWEEN 82 AND 82.99 THEN 1 ELSE 0 END) AS LvLOff82,
SUM(CASE WHEN ba.LvLDef BETWEEN 82 AND 82.99 THEN 1 ELSE 0 END) AS LvLDef82,
SUM(CASE WHEN ba.LvLSup=82 THEN 1 ELSE 0 END) AS LvLSup82
FROM relation_bases b
JOIN relation_alliance a ON a.WorldId=b.WorldId
JOIN relation_player p ON p.WorldId=b.WorldId and p.AllianceId=a.AllianceId AND p.AccountId=b.AccountId
JOIN bases ba ON ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId
AND ba.Zeit=
(
    SELECT ba.Zeit FROM bases ba
    WHERE ba.WorldId=b.WorldId
    AND ba.BaseId=b.BaseId
    ORDER BY ba.Zeit DESC LIMIT 1
)
WHERE b.WorldId=_WorldId
AND
IF (_AllianceId > 0, _AllianceId = p.AllianceId, true)
AND
IF
(
	(SELECT _OwnAccountId IN (SELECT l.AccountId FROM login l WHERE l.IsAdmin=true)),
	true,
	(
        (
            b.WorldId IN
			(
				SELECT p2.WorldId FROM relation_player p2 WHERE p2.AccountId=_OwnAccountId
			)
        )
        AND
        (
        	(
				a.AllianceId=
				(
					SELECT p2.AllianceId FROM relation_player p2 WHERE p2.WorldId=b.WorldId AND p2.AccountId=_OwnAccountId
				)
				AND
				IF
				(
					(SELECT p2.MemberRole FROM relation_player p2 WHERE p2.AccountId=_OwnAccountId AND p2.WorldId=b.WorldId)<=a.MemberRole,
					true,
					p.AccountId=_OwnAccountId
				)
			)
			OR
			(
				a.AllianceId=
				(
					SELECT ash.AllianceIdSet FROM relation_alliance_share ash
					JOIN relation_player p2 ON p2.WorldId=ash.WorldId AND p2.AllianceId=ash.AllianceIdGet
					WHERE ash.WorldId=b.WorldId AND p2.AccountId=_OwnAccountId
				)
				AND
				IF
				(
					(SELECT p2.MemberRole FROM relation_player p2
					WHERE p2.WorldId=b.WorldId AND
					p2.AccountId=_OwnAccountId)<=(SELECT ash.MemberRoleAccess FROM relation_alliance_share ash
					JOIN relation_player p2 ON p2.WorldId=ash.WorldId AND p2.AllianceId=ash.AllianceIdGet
					WHERE ash.WorldId=b.WorldId and p2.AccountId=_OwnAccountId),
					true,
					false
				)
			)
			OR
			(
				p.AccountId=
				(
					SELECT psh.AccountIdSet FROM relation_player_share psh
					WHERE psh.WorldId=b.WorldId
					AND psh.AccountIdGet=_OwnAccountId
				)
			)
        )
    )
)$$

CREATE PROCEDURE `getOverviewByColName` (IN `_ColName` TEXT, IN `_WorldId` INT, IN `_AllianceId` INT, IN `_OwnAccountId` INT)  NO SQL
BEGIN
	SET @sqlQuery:=
    CONCAT('SELECT SUM(CASE WHEN ba.',_ColName,' BETWEEN 0 AND 0.99 THEN 1 ELSE 0 END) AS ',_ColName,'0, SUM(CASE WHEN ba.',_ColName,' BETWEEN 1 AND 1.99 THEN 1 ELSE 0 END) AS ',_ColName,'1, SUM(CASE WHEN ba.',_ColName,' BETWEEN 2 AND 2.99 THEN 1 ELSE 0 END) AS ',_ColName,'2, SUM(CASE WHEN ba.',_ColName,' BETWEEN 3 AND 3.99 THEN 1 ELSE 0 END) AS ',_ColName,'3, SUM(CASE WHEN ba.',_ColName,' BETWEEN 4 AND 4.99 THEN 1 ELSE 0 END) AS ',_ColName,'4, SUM(CASE WHEN ba.',_ColName,' BETWEEN 5 AND 5.99 THEN 1 ELSE 0 END) AS ',_ColName,'5, SUM(CASE WHEN ba.',_ColName,' BETWEEN 6 AND 6.99 THEN 1 ELSE 0 END) AS ',_ColName,'6, SUM(CASE WHEN ba.',_ColName,' BETWEEN 7 AND 7.99 THEN 1 ELSE 0 END) AS ',_ColName,'7, SUM(CASE WHEN ba.',_ColName,' BETWEEN 8 AND 8.99 THEN 1 ELSE 0 END) AS ',_ColName,'8, SUM(CASE WHEN ba.',_ColName,' BETWEEN 9 AND 9.99 THEN 1 ELSE 0 END) AS ',_ColName,'9, SUM(CASE WHEN ba.',_ColName,' BETWEEN 10 AND 10.99 THEN 1 ELSE 0 END) AS ',_ColName,'10, SUM(CASE WHEN ba.',_ColName,' BETWEEN 11 AND 11.99 THEN 1 ELSE 0 END) AS ',_ColName,'11, SUM(CASE WHEN ba.',_ColName,' BETWEEN 12 AND 12.99 THEN 1 ELSE 0 END) AS ',_ColName,'12, SUM(CASE WHEN ba.',_ColName,' BETWEEN 13 AND 13.99 THEN 1 ELSE 0 END) AS ',_ColName,'13, SUM(CASE WHEN ba.',_ColName,' BETWEEN 14 AND 14.99 THEN 1 ELSE 0 END) AS ',_ColName,'14, SUM(CASE WHEN ba.',_ColName,' BETWEEN 15 AND 15.99 THEN 1 ELSE 0 END) AS ',_ColName,'15, SUM(CASE WHEN ba.',_ColName,' BETWEEN 16 AND 16.99 THEN 1 ELSE 0 END) AS ',_ColName,'16, SUM(CASE WHEN ba.',_ColName,' BETWEEN 17 AND 17.99 THEN 1 ELSE 0 END) AS ',_ColName,'17, SUM(CASE WHEN ba.',_ColName,' BETWEEN 18 AND 18.99 THEN 1 ELSE 0 END) AS ',_ColName,'18, SUM(CASE WHEN ba.',_ColName,' BETWEEN 19 AND 19.99 THEN 1 ELSE 0 END) AS ',_ColName,'19, SUM(CASE WHEN ba.',_ColName,' BETWEEN 20 AND 20.99 THEN 1 ELSE 0 END) AS ',_ColName,'20, SUM(CASE WHEN ba.',_ColName,' BETWEEN 21 AND 21.99 THEN 1 ELSE 0 END) AS ',_ColName,'21, SUM(CASE WHEN ba.',_ColName,' BETWEEN 22 AND 22.99 THEN 1 ELSE 0 END) AS ',_ColName,'22, SUM(CASE WHEN ba.',_ColName,' BETWEEN 23 AND 23.99 THEN 1 ELSE 0 END) AS ',_ColName,'23, SUM(CASE WHEN ba.',_ColName,' BETWEEN 24 AND 24.99 THEN 1 ELSE 0 END) AS ',_ColName,'24, SUM(CASE WHEN ba.',_ColName,' BETWEEN 25 AND 25.99 THEN 1 ELSE 0 END) AS ',_ColName,'25, SUM(CASE WHEN ba.',_ColName,' BETWEEN 26 AND 26.99 THEN 1 ELSE 0 END) AS ',_ColName,'26, SUM(CASE WHEN ba.',_ColName,' BETWEEN 27 AND 27.99 THEN 1 ELSE 0 END) AS ',_ColName,'27, SUM(CASE WHEN ba.',_ColName,' BETWEEN 28 AND 28.99 THEN 1 ELSE 0 END) AS ',_ColName,'28, SUM(CASE WHEN ba.',_ColName,' BETWEEN 29 AND 29.99 THEN 1 ELSE 0 END) AS ',_ColName,'29, SUM(CASE WHEN ba.',_ColName,' BETWEEN 30 AND 30.99 THEN 1 ELSE 0 END) AS ',_ColName,'30, SUM(CASE WHEN ba.',_ColName,' BETWEEN 31 AND 31.99 THEN 1 ELSE 0 END) AS ',_ColName,'31, SUM(CASE WHEN ba.',_ColName,' BETWEEN 32 AND 32.99 THEN 1 ELSE 0 END) AS ',_ColName,'32, SUM(CASE WHEN ba.',_ColName,' BETWEEN 33 AND 33.99 THEN 1 ELSE 0 END) AS ',_ColName,'33, SUM(CASE WHEN ba.',_ColName,' BETWEEN 34 AND 34.99 THEN 1 ELSE 0 END) AS ',_ColName,'34, SUM(CASE WHEN ba.',_ColName,' BETWEEN 35 AND 35.99 THEN 1 ELSE 0 END) AS ',_ColName,'35, SUM(CASE WHEN ba.',_ColName,' BETWEEN 36 AND 36.99 THEN 1 ELSE 0 END) AS ',_ColName,'36, SUM(CASE WHEN ba.',_ColName,' BETWEEN 37 AND 37.99 THEN 1 ELSE 0 END) AS ',_ColName,'37, SUM(CASE WHEN ba.',_ColName,' BETWEEN 38 AND 38.99 THEN 1 ELSE 0 END) AS ',_ColName,'38, SUM(CASE WHEN ba.',_ColName,' BETWEEN 39 AND 39.99 THEN 1 ELSE 0 END) AS ',_ColName,'39, SUM(CASE WHEN ba.',_ColName,' BETWEEN 40 AND 40.99 THEN 1 ELSE 0 END) AS ',_ColName,'40, SUM(CASE WHEN ba.',_ColName,' BETWEEN 41 AND 41.99 THEN 1 ELSE 0 END) AS ',_ColName,'41, SUM(CASE WHEN ba.',_ColName,' BETWEEN 42 AND 42.99 THEN 1 ELSE 0 END) AS ',_ColName,'42, SUM(CASE WHEN ba.',_ColName,' BETWEEN 43 AND 43.99 THEN 1 ELSE 0 END) AS ',_ColName,'43, SUM(CASE WHEN ba.',_ColName,' BETWEEN 44 AND 44.99 THEN 1 ELSE 0 END) AS ',_ColName,'44, SUM(CASE WHEN ba.',_ColName,' BETWEEN 45 AND 45.99 THEN 1 ELSE 0 END) AS ',_ColName,'45, SUM(CASE WHEN ba.',_ColName,' BETWEEN 46 AND 46.99 THEN 1 ELSE 0 END) AS ',_ColName,'46, SUM(CASE WHEN ba.',_ColName,' BETWEEN 47 AND 47.99 THEN 1 ELSE 0 END) AS ',_ColName,'47, SUM(CASE WHEN ba.',_ColName,' BETWEEN 48 AND 48.99 THEN 1 ELSE 0 END) AS ',_ColName,'48, SUM(CASE WHEN ba.',_ColName,' BETWEEN 49 AND 49.99 THEN 1 ELSE 0 END) AS ',_ColName,'49, SUM(CASE WHEN ba.',_ColName,' BETWEEN 50 AND 50.99 THEN 1 ELSE 0 END) AS ',_ColName,'50, SUM(CASE WHEN ba.',_ColName,' BETWEEN 51 AND 51.99 THEN 1 ELSE 0 END) AS ',_ColName,'51, SUM(CASE WHEN ba.',_ColName,' BETWEEN 52 AND 52.99 THEN 1 ELSE 0 END) AS ',_ColName,'52, SUM(CASE WHEN ba.',_ColName,' BETWEEN 53 AND 53.99 THEN 1 ELSE 0 END) AS ',_ColName,'53, SUM(CASE WHEN ba.',_ColName,' BETWEEN 54 AND 54.99 THEN 1 ELSE 0 END) AS ',_ColName,'54, SUM(CASE WHEN ba.',_ColName,' BETWEEN 55 AND 55.99 THEN 1 ELSE 0 END) AS ',_ColName,'55, SUM(CASE WHEN ba.',_ColName,' BETWEEN 56 AND 56.99 THEN 1 ELSE 0 END) AS ',_ColName,'56, SUM(CASE WHEN ba.',_ColName,' BETWEEN 57 AND 57.99 THEN 1 ELSE 0 END) AS ',_ColName,'57, SUM(CASE WHEN ba.',_ColName,' BETWEEN 58 AND 58.99 THEN 1 ELSE 0 END) AS ',_ColName,'58, SUM(CASE WHEN ba.',_ColName,' BETWEEN 59 AND 59.99 THEN 1 ELSE 0 END) AS ',_ColName,'59, SUM(CASE WHEN ba.',_ColName,' BETWEEN 60 AND 60.99 THEN 1 ELSE 0 END) AS ',_ColName,'60, SUM(CASE WHEN ba.',_ColName,' BETWEEN 61 AND 61.99 THEN 1 ELSE 0 END) AS ',_ColName,'61, SUM(CASE WHEN ba.',_ColName,' BETWEEN 62 AND 62.99 THEN 1 ELSE 0 END) AS ',_ColName,'62, SUM(CASE WHEN ba.',_ColName,' BETWEEN 63 AND 63.99 THEN 1 ELSE 0 END) AS ',_ColName,'63, SUM(CASE WHEN ba.',_ColName,' BETWEEN 64 AND 64.99 THEN 1 ELSE 0 END) AS ',_ColName,'64, SUM(CASE WHEN ba.',_ColName,' BETWEEN 65 AND 65.99 THEN 1 ELSE 0 END) AS ',_ColName,'65, SUM(CASE WHEN ba.',_ColName,' BETWEEN 66 AND 66.99 THEN 1 ELSE 0 END) AS ',_ColName,'66, SUM(CASE WHEN ba.',_ColName,' BETWEEN 67 AND 67.99 THEN 1 ELSE 0 END) AS ',_ColName,'67, SUM(CASE WHEN ba.',_ColName,' BETWEEN 68 AND 68.99 THEN 1 ELSE 0 END) AS ',_ColName,'68, SUM(CASE WHEN ba.',_ColName,' BETWEEN 69 AND 69.99 THEN 1 ELSE 0 END) AS ',_ColName,'69, SUM(CASE WHEN ba.',_ColName,' BETWEEN 70 AND 70.99 THEN 1 ELSE 0 END) AS ',_ColName,'70, SUM(CASE WHEN ba.',_ColName,' BETWEEN 71 AND 71.99 THEN 1 ELSE 0 END) AS ',_ColName,'71, SUM(CASE WHEN ba.',_ColName,' BETWEEN 72 AND 72.99 THEN 1 ELSE 0 END) AS ',_ColName,'72, SUM(CASE WHEN ba.',_ColName,' BETWEEN 73 AND 73.99 THEN 1 ELSE 0 END) AS ',_ColName,'73, SUM(CASE WHEN ba.',_ColName,' BETWEEN 74 AND 74.99 THEN 1 ELSE 0 END) AS ',_ColName,'74, SUM(CASE WHEN ba.',_ColName,' BETWEEN 75 AND 75.99 THEN 1 ELSE 0 END) AS ',_ColName,'75, SUM(CASE WHEN ba.',_ColName,' BETWEEN 76 AND 76.99 THEN 1 ELSE 0 END) AS ',_ColName,'76, SUM(CASE WHEN ba.',_ColName,' BETWEEN 77 AND 77.99 THEN 1 ELSE 0 END) AS ',_ColName,'77, SUM(CASE WHEN ba.',_ColName,' BETWEEN 78 AND 78.99 THEN 1 ELSE 0 END) AS ',_ColName,'78, SUM(CASE WHEN ba.',_ColName,' BETWEEN 79 AND 79.99 THEN 1 ELSE 0 END) AS ',_ColName,'79, SUM(CASE WHEN ba.',_ColName,' BETWEEN 80 AND 80.99 THEN 1 ELSE 0 END) AS ',_ColName,'80, SUM(CASE WHEN ba.',_ColName,' BETWEEN 81 AND 81.99 THEN 1 ELSE 0 END) AS ',_ColName,'81, SUM(CASE WHEN ba.',_ColName,' BETWEEN 82 AND 82.99 THEN 1 ELSE 0 END) AS ',_ColName,'82 FROM relation_bases b JOIN relation_alliance a ON a.WorldId=b.WorldId JOIN relation_player p ON p.WorldId=b.WorldId and p.AllianceId=a.AllianceId AND p.AccountId=b.AccountId JOIN bases ba ON ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId AND ba.Zeit=(SELECT ba.Zeit FROM bases ba WHERE ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId ORDER BY ba.Zeit DESC LIMIT 1) WHERE b.WorldId=',_WorldId,' AND IF(',_AllianceId,' > 0, ',_AllianceId,' = p.AllianceId, true) AND IF ( (SELECT ',_OwnAccountId,' IN (SELECT l.AccountId FROM login l WHERE l.IsAdmin=true)), true, ( ( b.WorldId IN ( SELECT p2.WorldId FROM relation_player p2 WHERE p2.AccountId=',_OwnAccountId,') ) AND ( ( a.AllianceId= ( SELECT p2.AllianceId FROM relation_player p2 WHERE p2.WorldId=b.WorldId AND p2.AccountId=',_OwnAccountId,' ) AND IF ( (SELECT p2.MemberRole FROM relation_player p2 WHERE p2.AccountId=',_OwnAccountId,' AND p2.WorldId=b.WorldId)<=a.MemberRole, true, p.AccountId=',_OwnAccountId,' ) ) OR ( a.AllianceId= ( SELECT ash.AllianceIdSet FROM relation_alliance_share ash JOIN relation_player p2 ON p2.WorldId=ash.WorldId AND p2.AllianceId=ash.AllianceIdGet WHERE ash.WorldId=b.WorldId AND p2.AccountId=',_OwnAccountId,' ) AND IF ( (SELECT p2.MemberRole FROM relation_player p2 WHERE p2.WorldId=b.WorldId AND p2.AccountId=',_OwnAccountId,')<=(SELECT ash.MemberRoleAccess FROM relation_alliance_share ash JOIN relation_player p2 ON p2.WorldId=ash.WorldId AND p2.AllianceId=ash.AllianceIdGet WHERE ash.WorldId=b.WorldId and p2.AccountId=',_OwnAccountId,'), true, false ) ) OR ( p.AccountId= ( SELECT psh.AccountIdSet FROM relation_player_share psh WHERE psh.WorldId=b.WorldId AND psh.AccountIdGet=',_OwnAccountId,' ) ) ) ) );');
	PREPARE stmt FROM @sqlQuery;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END$$

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

CREATE PROCEDURE `getReportsGroupByTargetLevel` (IN `_WorldId` INT)  NO SQL
SELECT r.TargetLevel, COUNT(*), SUM(r.GainTib), SUM(r.GainCry), SUM(r.GainCre), SUM(r.GainRp), SUM(r.CostCry), SUM(r.CostRep), ROUND(AVG(r.GainTib), 0), ROUND(AVG(r.GainCry), 0), ROUND(AVG(r.GainCre), 0), ROUND(AVG(r.GainRp), 0), ROUND(AVG(r.CostCry), 0), ROUND(AVG(r.CostRep), 0) FROM reports r
WHERE
IF (_WorldId<>'', r.WorldId=_WorldId, true)
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
  `Shoot` int(11) UNSIGNED NOT NULL,
  `PvP` int(11) UNSIGNED NOT NULL,
  `PvE` int(11) UNSIGNED NOT NULL,
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
  `PosX` smallint(4) UNSIGNED NOT NULL,
  `PosY` smallint(4) UNSIGNED NOT NULL,
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
  `IsAdmin` bit(1) NOT NULL DEFAULT b'0',
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
