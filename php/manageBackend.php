<?php
/* Developer: leo7044 */
header("Access-Control-Allow-Origin: *"); // von einer anderen Website drauf zugreifen
header("Content-Type: application/json; charset=utf-8"); // JSON-Antwort
include_once('config.php'); // Datenbankanbindung
session_start(); // starten der PHP-Session
$_post = filter_input_array(INPUT_POST); // es werden nur POST-Variablen akzeptiert, damit nicht mittels Link (get-vars) Anderungen an DB vorgenommen werden können
$_post = replaceChars($_post);
$action = $_post['action'];
if (!$conn->connect_error)
{
	switch ($action)
	{
		case 'sendDataFromInGame':
		{
            $UserAnswer = [];
            $ObjectData = $_post['ObjectData'];
            $ObjectServer = $ObjectData['server'];
            $ObjectAlliance = $ObjectData['alliance'];
            $ObjectPlayer = $ObjectData['player'];
            $ObjectBases = $ObjectData['bases'];
            $ObjectSubstitution = $ObjectData['substitution'];
            // Login
            $AccountId = $ObjectPlayer['AccountId'];
            $PlayerName = $ObjectPlayer['PlayerName'];
            $PasswordStandardMd5 = md5($PlayerName . '_' . $AccountId);
            $PasswordStandardSha512 = hash('sha512', $PlayerName . '_' . $AccountId);
            $result = $conn->query("SELECT `AccountId`, `UserName`, `Password` FROM `login` WHERE `AccountId`='$AccountId';");
            $oldPlayerName = '';
            $password = '';
            $accountExists = false;
            $strQuery = '';
            while ($zeile = $result->fetch_assoc())
            {
                $accountExists = true;
                $oldPlayerName = $zeile['UserName'];
                $password = $zeile['Password'];
            }
            if (!$accountExists)
            {
                $strQuery .= "INSERT INTO `login`(`AccountId`, `UserName`, `Password`) VALUES ('$AccountId', '$PlayerName', '$PasswordStandard');";
                $Time = date("Y-m-d H:i:s");
                $strQuery .= "INSERT INTO `adminlog`(`Zeit`, `Initiator`, `Description`, `Show`) VALUES ('$Time', '$PlayerName', 'Spieler angelegt', true);";
                $UserAnswer[0] = 0;
                $UserAnswer[1] = 'UserDidNotChangedPassword';
            }
            else
            {
                if ($PlayerName != $oldPlayerName)
                {
                    $strQuery .= "UPDATE `login` SET `UserName`='$PlayerName' WHERE `AccountId`='$AccountId';";
                    $Time = date("Y-m-d H:i:s");
                    $strQuery .= "INSERT INTO `adminlog`(`Zeit`, `Initiator`, `Description`, `Show`) VALUES ('$Time', '$PlayerName', 'Spieler umbenannt (alter Name: " . $oldPlayerName . ")', true);";
                }
            }
            if (!$password || $password == $PasswordStandardMd5 || $password == $PasswordStandardSha512)
            {
                $UserAnswer[0] = 0;
                $UserAnswer[1] = 'UserDidNotChangedPassword';
            }
            else
            {
                $UserAnswer[0] = 1;
                $UserAnswer[1] = 'UserChangedPassword';
            }
            // RelationServer
            $WorldId = $ObjectServer['WorldId'];
            $ServerName = $ObjectServer['ServerName'];
            $SeasonServer = $ObjectServer['SeasonServer'];
            $strQuery .= "INSERT INTO `relation_server` (WorldId, ServerName, SeasonServer) VALUES ('$WorldId', '$ServerName', $SeasonServer) ON DUPLICATE KEY UPDATE WorldId = VALUES(WorldId), ServerName = VALUES(ServerName), SeasonServer = VALUES(SeasonServer);";
            // RelationAlliance
            $AllianceId = $ObjectAlliance['AllianceId'];
            $AllianceName = $ObjectAlliance['AllianceName'];
            $strQuery .= "INSERT INTO `relation_alliance` (WorldId, AllianceId, AllianceName) VALUES ('$WorldId', '$AllianceId', '$AllianceName') ON DUPLICATE KEY UPDATE WorldId = VALUES(WorldId), AllianceId = VALUES(AllianceId), AllianceName = VALUES(AllianceName);";
            // RelationPlayer
            $MemberRole = $ObjectPlayer['MemberRole'];
            $strQuery .= "INSERT INTO `relation_player` (WorldId, AllianceId, AccountId, MemberRole) VALUES ('$WorldId', '$AllianceId', '$AccountId', '$MemberRole') ON DUPLICATE KEY UPDATE WorldId = VALUES(WorldId), AllianceId = VALUES(AllianceId), AccountId = VALUES(AccountId), MemberRole = VALUES(MemberRole);";
            // RelationBases and Bases
            $strQueryBasesRelation = "INSERT INTO `relation_bases` (WorldId, AccountId, BaseId, `Name`) VALUES ";
            $strQueryBases = "INSERT INTO `bases`(`Zeit`, `WorldId`, `ID`, `LvLCY`, `LvLBase`, `LvLOff`, `LvLDef`, `LvLDF`, `LvLSup`, `SupArt`, `Tib`, `Cry`, `Pow`, `Cre`, `Rep`, `CnCOpt`) VALUES ";
            $TimeDay = date("Y-m-d");
            foreach ($ObjectBases as $key => $ObjectBase)
            {
                $BaseId = $ObjectBase['BaseId'];
                $Name = $ObjectBase['Name'];
                $LvLCY = $ObjectBase['LvLCY'];
                $LvLBase = $ObjectBase['LvLBase'];
                $LvLOff = $ObjectBase['LvLOffense'];
                $LvLDef = $ObjectBase['LvLDefense'];
                $LvLDF = $ObjectBase['LvLDF'];
                $LvLSup = $ObjectBase['LvLSupport'];
                $SupArt = $ObjectBase['SupArt'];
                $Tib = $ObjectBase['TiberiumPerHour'];
                $Cry = $ObjectBase['CrystalPerHour'];
                $Pow = $ObjectBase['PowerPerHour'];
                $Cre = $ObjectBase['CreditsPerHour'];
                $Rep = $ObjectBase['CurrentRepairTime'];
                $CnCOpt = $ObjectBase['CnCOpt'];
                if ($key != count($ObjectBases) - 1)
                {
                    $strQueryBasesRelation .= "('$WorldId', '$AccountId', '$BaseId', '$Name'),";
                    $strQueryBases .= "('$TimeDay', '$WorldId', '$BaseId', '$LvLCY', '$LvLBase', '$LvLOff', '$LvLDef', '$LvLDF', '$LvLSup', '$SupArt', '$Tib', '$Cry', '$Pow', '$Cre', '$Rep', '$CnCOpt'),";
                }
                else
                {
                    $strQueryBasesRelation .= "('$WorldId', '$AccountId', '$BaseId', '$Name')";
                    $strQueryBases .= "('$TimeDay', '$WorldId', '$BaseId', '$LvLCY', '$LvLBase', '$LvLOff', '$LvLDef', '$LvLDF', '$LvLSup', '$SupArt', '$Tib', '$Cry', '$Pow', '$Cre', '$Rep', '$CnCOpt')";
                }
            }
            $strQueryBasesRelation .= " ON DUPLICATE KEY UPDATE WorldId = VALUES(WorldId), AccountId = VALUES(AccountId), BaseId = VALUES(BaseId), Name = VALUES(Name);";
            $strQueryBases .= " ON DUPLICATE KEY UPDATE Zeit = VALUES(Zeit), WorldId = VALUES(WorldId), ID = VALUES(ID), LvLCY = VALUES(LvLCY), LvLBase = VALUES(LvLBase), LvLOff = VALUES(LvLOff), LvLDef = VALUES(LvLDef), LvLDF = VALUES(LvLDF), LvLSup = VALUES(LvLSup), SupArt = VALUES(SupArt), Tib = VALUES(Tib), Cry = VALUES(Cry), Pow = VALUES(Pow), Cre = VALUES(Cre), Rep = VALUES(Rep), CnCOpt = VALUES(CnCOpt);";
            $strQuery .= $strQueryBasesRelation;
            $strQuery .= $strQueryBases;
            // Alliance
            $AllianceRank = $ObjectAlliance['AllianceRank'];
            $AllianceEventRank = $ObjectAlliance['AllianceEventRank'];
            $AllianceTotalScore = $ObjectAlliance['AllianceTotalScore'];
            $AllianceAverageScore = $ObjectAlliance['AllianceAverageScore'];
            $AllianceVeteranPoints = $ObjectAlliance['AllianceVeteranPoints'];
            $AllianceProdVetPoints = $ObjectAlliance['AllianceProdVetPoints'];
            $BonusTiberium = $ObjectAlliance['BonusTiberium'];
            $BonusCrystal = $ObjectAlliance['BonusCrystal'];
            $BonusPower = $ObjectAlliance['BonusPower'];
            $BonusInfantrie = $ObjectAlliance['BonusInfantrie'];
            $BonusVehicle = $ObjectAlliance['BonusVehicle'];
            $BonusAir = $ObjectAlliance['BonusAir'];
            $BonusDef = $ObjectAlliance['BonusDef'];
            $RankTib = $ObjectAlliance['RankTib'];
            $RankCry = $ObjectAlliance['RankCry'];
            $RankPow = $ObjectAlliance['RankPow'];
            $RankInf = $ObjectAlliance['RankInf'];
            $RankVeh = $ObjectAlliance['RankVeh'];
            $RankAir = $ObjectAlliance['RankAir'];
            $RankDef = $ObjectAlliance['RankDef'];
            $ScoreTib = $ObjectAlliance['ScoreTib'];
            $ScoreCry = $ObjectAlliance['ScoreCry'];
            $ScorePow = $ObjectAlliance['ScorePow'];
            $ScoreInf = $ObjectAlliance['ScoreInf'];
            $ScoreVeh = $ObjectAlliance['ScoreVeh'];
            $ScoreAir = $ObjectAlliance['ScoreAir'];
            $ScoreDef = $ObjectAlliance['ScoreDef'];
            $strQuery .= "INSERT INTO `alliance`(`Zeit`, `WorldId`, `AllianceId`, `AllianceRank`, `EventRank`, `TotalScore`, `AverageScore`, `VP`, `VPh`, `BonusTiberium`, `BonusCrystal`, `BonusPower`, `BonusInfantrie`, `BonusVehicle`, `BonusAir`, `BonusDef`, `ScoreTib`, `ScoreCry`, `ScorePow`, `ScoreInf`, `ScoreVeh`, `ScoreAir`, `ScoreDef`, `RankTib`, `RankCry`, `RankPow`, `RankInf`, `RankVeh`, `RankAir`, `RankDef`) VALUES ('$TimeDay', '$WorldId', '$AllianceId', '$AllianceRank', '$AllianceEventRank', '$AllianceTotalScore', '$AllianceAverageScore', '$AllianceVeteranPoints', '$AllianceProdVetPoints', '$BonusTiberium', '$BonusCrystal', '$BonusPower', '$BonusInfantrie', '$BonusVehicle', '$BonusAir', '$BonusDef', '$ScoreTib', '$ScoreCry', '$ScorePow', '$ScoreInf', '$ScoreVeh', '$ScoreAir', '$ScoreDef', '$RankTib', '$RankCry', '$RankPow', '$RankInf', '$RankVeh', '$RankAir', '$RankDef') ON DUPLICATE KEY UPDATE Zeit = VALUES(Zeit), WorldId = VALUES(WorldId), AllianceId = VALUES(AllianceId), AllianceRank = VALUES(AllianceRank), EventRank = VALUES(EventRank), TotalScore = VALUES(TotalScore), AverageScore = VALUES(AverageScore), VP = VALUES(VP), VPh = VALUES(VPh), BonusTiberium = VALUES(BonusTiberium), BonusCrystal = VALUES(BonusCrystal), BonusPower = VALUES(BonusPower), BonusInfantrie = VALUES(BonusInfantrie), BonusVehicle = VALUES(BonusVehicle), BonusAir = VALUES(BonusAir), BonusDef = VALUES(BonusDef), ScoreTib = VALUES(ScoreTib), ScoreCry = VALUES(ScoreCry), ScorePow = VALUES(ScorePow), ScoreInf = VALUES(ScoreInf), ScoreVeh = VALUES(ScoreVeh), ScoreAir = VALUES(ScoreAir), ScoreDef = VALUES(ScoreDef), RankTib = VALUES(RankTib), RankCry = VALUES(RankCry), RankPow = VALUES(RankPow), RankInf = VALUES(RankInf), RankVeh = VALUES(RankVeh), RankAir = VALUES(RankAir), RankDef = VALUES(RankDef);";
            // Player
            $ScorePoints = $ObjectPlayer['PlayerScorePoints'];
            $PlayerRank = $ObjectPlayer['PlayerRank'];
            $PlayerEventRank = $ObjectPlayer['PlayerEventRank'];
            $ResearchPoints = $ObjectPlayer['ResearchPoints'];
            $Credits = $ObjectPlayer['Credits'];
            $Funds = $ObjectPlayer['Funds'];
            $LegacyPoints = $ObjectPlayer['LegacyPoints'];
            $PlayerVeteranPoints = $ObjectPlayer['PlayerVeteranPoints'];
            $RepMax = $ObjectPlayer['MaxRepairTime'];
            $CPMax = $ObjectPlayer['CommandPointsMaxStorage'];
            $CPCur = $ObjectPlayer['CommandPointsCurrent'];
            $Shoot = $ObjectPlayer['Shoot'];
            $PvE = $ObjectPlayer['PvE'];
            $PvP = $ObjectPlayer['PvP'];
            $CountBases = $ObjectPlayer['CountBases'];
            $CountSup = $ObjectPlayer['CountSup'];
            $LvLHighestOff = $ObjectPlayer['LvLHighestOff'];
            $ProductionTiberium = $ObjectPlayer['ProductionTiberium'];
            $ProductionCrystal = $ObjectPlayer['ProductionCrystal'];
            $ProductionPower = $ObjectPlayer['ProductionPower'];
            $ProductionCredits = $ObjectPlayer['ProductionCredits'];
            $AverageBase = $ObjectPlayer['AverageBase'];
            $AverageOff = $ObjectPlayer['AverageOff'];
            $AverageDef = $ObjectPlayer['AverageDef'];
            $AverageDF = $ObjectPlayer['AverageDF'];
            $AverageSup = $ObjectPlayer['AverageSup'];
            $strQuery .= "INSERT INTO `player`(`Zeit`, `WorldId`, `AccountId`, `ScorePoints`, `CountBases`, `CountSup`, `OverallRank`, `EventRank`, `GesamtTiberium`, `GesamtCrystal`, `GesamtPower`, `GesamtCredits`, `ResearchPoints`, `Credits`, `Shoot`, `PvP`, `PvE`, `LvLOff`, `BaseD`, `OffD`, `DefD`, `DFD`, `SupD`, `VP`, `LP`, `RepMax`, `CPMax`, `CPCur`, `Funds`) VALUES ('$TimeDay', '$WorldId', '$AccountId', '$ScorePoints', '$CountBases', '$CountSup', '$PlayerRank', '$PlayerEventRank', '$ProductionTiberium', '$ProductionCrystal', '$ProductionPower', '$ProductionCredits', '$ResearchPoints', '$Credits', '$Shoot', '$PvP', '$PvE', '$LvLHighestOff', '$AverageBase', '$AverageOff', '$AverageDef', '$AverageDF', '$AverageSup', '$PlayerVeteranPoints', '$LegacyPoints', '$RepMax', '$CPMax', '$CPCur', '$Funds') ON DUPLICATE KEY UPDATE Zeit = VALUES(Zeit), WorldId = VALUES(WorldId), AccountId = VALUES(AccountId), ScorePoints = VALUES(ScorePoints), CountBases = VALUES(CountBases), CountSup = VALUES(CountSup), OverallRank = VALUES(OverallRank), EventRank = VALUES(EventRank), GesamtTiberium = VALUES(GesamtTiberium), GesamtCrystal = VALUES(GesamtCrystal), GesamtPower = VALUES(GesamtPower), GesamtCredits = VALUES(GesamtCredits), ResearchPoints = VALUES(ResearchPoints), Credits = VALUES(Credits), Shoot = VALUES(Shoot), PvP = VALUES(PvP), PvE = VALUES(PvE), LvLOff = VALUES(LvLOff), BaseD = VALUES(BaseD), OffD = VALUES(OffD), DefD = VALUES(DefD), DFD = VALUES(DFD), SupD = VALUES(SupD), VP = VALUES(VP), LP = VALUES(LP), RepMax = VALUES(RepMax), CPMax = VALUES(CPMax), CPCur = VALUES(CPCur), Funds = VALUES(Funds);";
            // Substitution
            $strQuery .= "DELETE FROM `substitution` WHERE WorldId='$WorldId' AND PlayerNameGet='$PlayerName';";
            $strQuery .= "DELETE FROM `substitution` WHERE WorldId='$WorldId' AND PlayerNameSet='$PlayerName';";
            $NameOut = $ObjectSubstitution['outgoing'];
            if ($NameOut)
            {
                $strQuery .= "INSERT INTO `substitution`(`WorldId`, `PlayerNameSet`, `PlayerNameGet`, `active`) VALUES ('$WorldId', '$PlayerName', '$NameOut', false);";
            }
            if (count($ObjectSubstitution['incoming']))
            {
                $strQuery .= "INSERT INTO `substitution`(`WorldId`, `PlayerNameSet`, `PlayerNameGet`, `active`) VALUES ";
                foreach ($ObjectSubstitution['incoming'] as $key => $NameIn)
                {
                    if ($key != count($ObjectSubstitution['incoming']) - 1)
                    {
                        $strQuery .= "('$WorldId', '$NameIn', '$PlayerName', false),";
                    }
                    else
                    {
                        $strQuery .= "('$WorldId', '$NameIn', '$PlayerName', false);";
                    }
                }
            }
            if (count($ObjectSubstitution['active']))
            {
                $strQuery .= "INSERT INTO `substitution`(`WorldId`, `PlayerNameSet`, `PlayerNameGet`, `active`) VALUES ";
                foreach ($ObjectSubstitution['active'] as $key => $NameIn)
                {
                    if ($key != count($ObjectSubstitution['active']) - 1)
                    {
                        $strQuery .= "('$WorldId', '$NameIn', '$PlayerName', true),";
                    }
                    else
                    {
                        $strQuery .= "('$WorldId', '$NameIn', '$PlayerName', true);";
                    }
                }
            }
            $conn->multi_query($strQuery);
            echo json_encode($UserAnswer);
			break;
        }
        case 'login':
        {
            $UserAnswer = [];
            $UserName = $_post['UserName'];
            $PasswordMd5 = md5($_post['Password']);
            $PasswordSha512 = hash('sha512', $_post['Password']);
            $AccountId = 0;
            $result = $conn->query("SELECT `AccountId` FROM `login` WHERE `UserName`='$UserName' AND (`Password`='$PasswordMd5' OR `Password`='$PasswordSha512');");
            while ($zeile = $result->fetch_assoc())
            {
                $_SESSION['leoStats_AccountId'] = $AccountId = $zeile['AccountId'];
                $_SESSION['leoStats_IsAdmin'] = false;
                if (in_array($AccountId, $ArrayAdminAccounts))
                {
                    $_SESSION['leoStats_IsAdmin'] = true;
                }
            }
            if ($AccountId > 0)
            {
                $UserAnswer[0] = 1;
                $UserAnswer[1] = 'UserInDb';
            }
            else
            {
                $UserAnswer[0] = 0;
                $UserAnswer[1] = 'UserNotInDb';
                $Time = date("Y-m-d H:i:s");
                $conn->query("INSERT INTO `adminlog`(`Zeit`, `Initiator`, `Description`, `Show`) VALUES ('$Time', '$UserName', 'Login fehlgeschlagen', true);");
            }
            echo json_encode($UserAnswer);
            break;
        }
        case 'getSessionVariables':
        {
            echo json_encode($_SESSION);
            break;
        }
        case 'getSeasonServerIds':
        {
            $UserAnswer = [];
            $result = $conn->query("SELECT WorldId FROM relation_server WHERE SeasonServer='1'");
            while ($zeile = $result->fetch_assoc())
            {
                array_push($UserAnswer, $zeile['WorldId']);
            }
            echo json_encode($UserAnswer);
            break;
        }
        case 'getDropDownListData':
        {
            $UserAnswer = [];
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                $strQuery = '';
                if (!in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $strQuery =
                        "SELECT s.WorldId, s.ServerName, a.AllianceId, a.AllianceName, p.AccountId, l.UserName, b.BaseId, b.Name
                        FROM relation_server s
                        JOIN relation_alliance a ON a.WorldId=s.WorldId
                        JOIN relation_player p ON p.WorldId=s.WorldId AND p.AllianceId=a.AllianceId
                        JOIN login l ON l.AccountId=p.AccountId
                        JOIN relation_bases b ON b.AccountId=p.AccountId AND b.WorldId=s.WorldId
                        WHERE
                        s.WorldId IN
                        (
                            SELECT p.WorldId FROM relation_player p WHERE p.AccountId='$OwnAccountId'
                        )
                        AND
                        a.AllianceId =
                        (
                            SELECT p.AllianceId FROM relation_player p WHERE p.AccountId='$OwnAccountId' AND p.WorldId=s.WorldId
                        )
                        AND
                        IF
                        (
                            p.MemberRole<=a.MemberRole,
                            true,
                            p.AccountId='$OwnAccountId'
                        )
                        ORDER BY s.ServerName, a.AllianceName, l.UserName, b.BaseId ASC;";
                }
                else
                {
                    $strQuery =
                        "SELECT s.WorldId, s.ServerName, a.AllianceId, a.AllianceName, p.AccountId, l.UserName, b.BaseId, b.Name
                        FROM relation_server s
                        JOIN relation_alliance a ON a.WorldId=s.WorldId
                        JOIN relation_player p ON p.WorldId=s.WorldId AND p.AllianceId=a.AllianceId
                        JOIN login l ON l.AccountId=p.AccountId
                        JOIN relation_bases b ON b.AccountId=p.AccountId AND b.WorldId=s.WorldId
                        ORDER BY s.ServerName, a.AllianceName, l.UserName, b.BaseId ASC;";
                }
                $result = $conn->query($strQuery);
                $UserAnswer[0] = [];
                $UserAnswer[1] = [];
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer[0], $zeile);
                }
                $strQuery =
                    "SELECT p.WorldId, p.AllianceId, p.AccountId, a.MemberRole AS NeededMemberRole, p.MemberRole FROM relation_player p
                    JOIN relation_alliance a ON a.WorldId=p.WorldId AND a.AllianceId=p.AllianceId
                    WHERE p.AccountId='$OwnAccountId'
                    ORDER BY p.WorldId;";
                $result = $conn->query($strQuery);
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer[1], $zeile);
                }
            }
            echo json_encode($UserAnswer);
            break;
        }
        case 'getAlliancePlayerData':
        {
            $UserAnswer = [];
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $WorldId = $_post['WorldId'];
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                $strQuery = '';
                if (!in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $strQuery .=
                        "SELECT l.AccountId, l.UserName, pl.Zeit, pl.ScorePoints, pl.CountBases, pl.CountSup, pl.OverallRank, pl.EventRank, pl.GesamtTiberium, pl.GesamtCrystal, pl.GesamtPower, pl.GesamtCredits, pl.ResearchPoints, pl.Credits, pl.Shoot, pl.PvP, pl.PvE, pl.LvLOff, pl.BaseD, pl.OffD, pl.DefD, pl.DFD, pl.SupD, pl.VP, pl.LP, pl.RepMax, pl.CPMax, pl.CPCur, pl.Funds FROM relation_player p
                        JOIN login l ON l.AccountId=p.AccountId
                        JOIN player pl ON pl.WorldId=p.WorldId AND pl.AccountId=p.AccountId
                        WHERE
                        p.WorldId='$WorldId'
                        AND
                        p.AllianceId=
                        (
                            SELECT p.AllianceId FROM relation_player p WHERE p.WorldId='$WorldId' AND p.AccountId='$OwnAccountId'
                        )
                        AND
                        pl.Zeit=
                        (
                            SELECT pl.Zeit FROM player pl WHERE pl.WorldId=p.WorldId AND pl.AccountId=p.AccountId ORDER BY pl.Zeit DESC LIMIT 1
                        )
                        ORDER BY l.UserName;";
                }
                else
                {
                    $AllianceId = $_post['AllianceId'];
                    $strQuery .=
                        "SELECT l.AccountId, l.UserName, pl.Zeit, pl.ScorePoints, pl.CountBases, pl.CountSup, pl.OverallRank, pl.EventRank, pl.GesamtTiberium, pl.GesamtCrystal, pl.GesamtPower, pl.GesamtCredits, pl.ResearchPoints, pl.Credits, pl.Shoot, pl.PvP, pl.PvE, pl.LvLOff, pl.BaseD, pl.OffD, pl.DefD, pl.DFD, pl.SupD, pl.VP, pl.LP, pl.RepMax, pl.CPMax, pl.CPCur, pl.Funds FROM relation_player p
                        JOIN login l ON l.AccountId=p.AccountId
                        JOIN player pl ON pl.WorldId=p.WorldId AND pl.AccountId=p.AccountId
                        WHERE p.WorldId='$WorldId'
                        AND p.AllianceId='$AllianceId'
                        AND
                        pl.Zeit=
                        (
                            SELECT pl.Zeit FROM player pl WHERE pl.WorldId=p.WorldId AND pl.AccountId=p.AccountId ORDER BY pl.Zeit DESC LIMIT 1
                        )
                        ORDER BY l.UserName;";
                }
                $result = $conn->query($strQuery);
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer, $zeile);
                }
            }
            echo json_encode($UserAnswer);
            break;
        }
        case 'getAllianceData':
        {
            $UserAnswer = [];
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $WorldId = $_post['WorldId'];
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                $strQuery = '';
                if (!in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $strQuery .=
                        "SELECT DISTINCT a.Zeit, a.AllianceRank, a.EventRank, a.TotalScore, a.AverageScore, a.VP, a.VPh, a.BonusTiberium, a.BonusCrystal, a.BonusPower, a.BonusInfantrie, a.BonusVehicle, a.BonusAir, a.BonusDef, a.ScoreTib, a.ScoreCry, a.ScorePow, a.ScoreInf, a.ScoreVeh, a.ScoreAir, a.ScoreDef, a.RankTib, a.RankCry, a.RankPow, a.RankInf, a.RankVeh, a.RankAir, a.RankDef FROM relation_player p
                        JOIN alliance a ON a.WorldId=p.WorldId AND a.AllianceId=p.AllianceId
                        WHERE
                        p.WorldId='$WorldId'
                        AND
                        p.AllianceId=
                        (
                            SELECT p.AllianceId FROM relation_player p WHERE p.WorldId='$WorldId' AND p.AccountId='$OwnAccountId'
                        )
                        AND
                        p.AccountId='$OwnAccountId'
                        ORDER BY a.Zeit ASC";
                }
                else
                {
                    $AllianceId = $_post['AllianceId'];
                    $strQuery .=
                        "SELECT DISTINCT a.Zeit, a.AllianceRank, a.EventRank, a.TotalScore, a.AverageScore, a.VP, a.VPh, a.BonusTiberium, a.BonusCrystal, a.BonusPower, a.BonusInfantrie, a.BonusVehicle, a.BonusAir, a.BonusDef, a.ScoreTib, a.ScoreCry, a.ScorePow, a.ScoreInf, a.ScoreVeh, a.ScoreAir, a.ScoreDef, a.RankTib, a.RankCry, a.RankPow, a.RankInf, a.RankVeh, a.RankAir, a.RankDef FROM relation_player p
                        JOIN alliance a ON a.WorldId=p.WorldId AND a.AllianceId=p.AllianceId
                        WHERE p.WorldId='$WorldId'
                        AND p.AllianceId='$AllianceId'
                        ORDER BY a.Zeit ASC;";

                }
                $result = $conn->query($strQuery);
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer, $zeile);
                }
            }
            echo json_encode($UserAnswer);
            break;
        }
        case 'getPlayerBaseData':
        {
            $UserAnswer = [];
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $WorldId = $_post['WorldId'];
                $AccountId = $_post['AccountId'];
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                $strQuery = '';
                if (!in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $strQuery .=
                        "SELECT b.BaseId, b.Name, ba.LvLCY, ba.LvLBase, ba.LvLOff, ba.LvLDef, ba.LvLDF, ba.LvLSup, ba.SupArt, ba.Tib, ba.Cry, ba.Pow, ba.Cre, ba.Rep, ba.CnCOpt FROM relation_bases b
                        JOIN bases ba ON ba.WorldId=b.WorldId AND ba.ID=b.BaseId
                        WHERE
                        b.WorldId='$WorldId'
                        AND
                        b.AccountId='$AccountId'
                        AND
                        '$AccountId' IN
                        (
                            SELECT DISTINCT p.AccountId FROM relation_player p
                            JOIN relation_alliance a ON a.WorldId=p.WorldId AND a.AllianceId=p.AllianceId
                            WHERE
                            p.WorldId='$WorldId'
                            AND
                            a.AllianceId =
                            (
                                SELECT p.AllianceId FROM relation_player p WHERE p.WorldId='$WorldId' AND p.AccountId='$OwnAccountId'
                            )
                            AND
                            IF
                            (
                                p.MemberRole<=a.MemberRole,
                                true,
                                p.AccountId='$OwnAccountId'
                            )
                        )
                        AND
                        ba.Zeit=
                        (
                            SELECT ba.Zeit FROM bases ba WHERE ba.WorldId=b.WorldId AND ba.ID=b.BaseId ORDER BY ba.Zeit DESC LIMIT 1
                        )
                        ORDER BY b.BaseId;";
                }
                else
                {
                    $strQuery .=
                        "SELECT b.BaseId, b.Name, ba.LvLCY, ba.LvLBase, ba.LvLOff, ba.LvLDef, ba.LvLDF, ba.LvLSup, ba.SupArt, ba.Tib, ba.Cry, ba.Pow, ba.Cre, ba.Rep, ba.CnCOpt FROM relation_bases b
                        JOIN bases ba ON ba.WorldId=b.WorldId AND ba.ID=b.BaseId
                        WHERE b.WorldId='$WorldId'
                        AND b.AccountId='$AccountId'
                        AND
                        ba.Zeit=
                        (
                            SELECT ba.Zeit FROM bases ba WHERE ba.WorldId=b.WorldId AND ba.ID=b.BaseId ORDER BY ba.Zeit DESC LIMIT 1
                        )
                        ORDER BY b.BaseId;";
                }
                $result = $conn->query($strQuery);
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer, $zeile);
                }
            }
            echo json_encode($UserAnswer);
            break;
        }
        case 'getPlayerData':
        {
            $UserAnswer = [];
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $WorldId = $_post['WorldId'];
                $AccountId = $_post['AccountId'];
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                $strQuery = '';
                if (!in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $strQuery .=
                        "SELECT pl.Zeit, pl.ScorePoints,
                        IFNULL(a.AverageScore, 0) AS AverageScore,
                        pl.OverallRank, pl.EventRank, pl.GesamtTiberium, pl.GesamtCrystal, pl.GesamtPower, pl.GesamtCredits, pl.ResearchPoints, pl.Credits, pl.Shoot, pl.PvP, pl.PvE, pl.LvLOff, pl.BaseD, pl.OffD, pl.DefD, pl.DFD, pl.SupD, pl.VP, pl.LP, pl.RepMax, pl.CPMax, pl.CPCur, pl.Funds FROM player pl
                        JOIN relation_player p ON p.WorldId=pl.WorldId AND p.AccountId=pl.AccountId
                        LEFT JOIN alliance a ON a.WorldId=pl.WorldId AND a.AllianceId=p.AllianceId AND a.Zeit=pl.Zeit
                        WHERE
                        pl.WorldId='$WorldId'
                        AND
                        p.AllianceId IN
                        (
                            SELECT p.AllianceId FROM relation_player p WHERE p.WorldId='$WorldId' AND p.AccountId='$OwnAccountId'
                        )
                        AND
                        pl.AccountId='$AccountId'
                        AND
                        '$AccountId' IN
                        (
                            SELECT DISTINCT p.AccountId FROM relation_player p
                            JOIN relation_alliance a ON a.WorldId=p.WorldId AND a.AllianceId=p.AllianceId
                            WHERE
                            p.WorldId='$WorldId'
                            AND
                            a.AllianceId =
                            (
                                SELECT p.AllianceId FROM relation_player p WHERE p.WorldId='$WorldId' AND p.AccountId='$OwnAccountId'
                            )
                            AND
                            IF
                            (
                                p.MemberRole<=a.MemberRole,
                                true,
                                p.AccountId='$OwnAccountId'
                            )
                        )
                        ORDER BY pl.Zeit ASC;";
                }
                else
                {
                    $strQuery .=
                        "SELECT pl.Zeit, pl.ScorePoints,
                        IFNULL(a.AverageScore, 0) AS AverageScore,
                        pl.OverallRank, pl.EventRank, pl.GesamtTiberium, pl.GesamtCrystal, pl.GesamtPower, pl.GesamtCredits, pl.ResearchPoints, pl.Credits, pl.Shoot, pl.PvP, pl.PvE, pl.LvLOff, pl.BaseD, pl.OffD, pl.DefD, pl.DFD, pl.SupD, pl.VP, pl.LP, pl.RepMax, pl.CPMax, pl.CPCur, pl.Funds FROM player pl
                        JOIN relation_player p ON p.WorldId=pl.WorldId AND p.AccountId=pl.AccountId
                        LEFT JOIN alliance a ON a.WorldId=pl.WorldId AND a.AllianceId=p.AllianceId AND a.Zeit=pl.Zeit
                        WHERE pl.WorldId='$WorldId'
                        AND pl.AccountId='$AccountId'
                        ORDER BY pl.Zeit ASC;";
                }
                $result = $conn->query($strQuery);
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer, $zeile);
                }
            }
            echo json_encode($UserAnswer);
            break;
        }
        case 'getBaseData':
        {
            $UserAnswer = [];
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $WorldId = $_post['WorldId'];
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                $BaseId = $_post['BaseId'];
                $strQuery = '';
                if (!in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $strQuery .=
                        "SELECT ba.Zeit, b.Name, ba.LvLCY, ba.LvLBase, ba.LvLOff, ba.LvLDef, ba.LvLDF, ba.LvLSup, ba.SupArt, ba.Tib, ba.Cry, ba.Pow, ba.Cre, ba.Rep, p.RepMax, ba.CnCOpt FROM relation_bases b
                        JOIN bases ba ON ba.WorldId=b.WorldId AND ba.ID=b.BaseId
                        JOIN player p ON p.WorldId=ba.WorldId AND p.AccountId=b.AccountId AND p.Zeit=ba.Zeit
                        WHERE
                        b.WorldId='$WorldId'
                        AND
                        b.BaseId='$BaseId'
                        AND
                        '$BaseId' IN
                        (
                            SELECT b.BaseId FROM relation_bases b
                            JOIN relation_alliance a ON a.WorldId=b.WorldId
                            JOIN relation_player p ON p.WorldId=b.WorldId AND p.AllianceId=a.AllianceId
                            WHERE
                            b.WorldId IN
                            (
                                SELECT p.WorldId FROM relation_player p WHERE p.AccountId='$OwnAccountId'
                            )
                            AND
                            a.AllianceId =
                            (
                                SELECT p.AllianceId FROM relation_player p WHERE p.AccountId='$OwnAccountId' AND p.WorldId=b.WorldId
                            )
                            AND
                            IF
                            (
                                p.MemberRole<=a.MemberRole,
                                true,
                                p.AccountId='$OwnAccountId'
                            )
                        )
                        ORDER BY ba.Zeit ASC";
                }
                else
                {
                    $strQuery .=
                        "SELECT ba.Zeit, b.Name, ba.LvLCY, ba.LvLBase, ba.LvLOff, ba.LvLDef, ba.LvLDF, ba.LvLSup, ba.SupArt, ba.Tib, ba.Cry, ba.Pow, ba.Cre, ba.Rep, p.RepMax, ba.CnCOpt FROM relation_bases b
                        JOIN bases ba ON ba.WorldId=b.WorldId AND ba.ID=b.BaseId
                        JOIN player p ON p.WorldId=ba.WorldId AND p.AccountId=b.AccountId AND p.Zeit=ba.Zeit
                        WHERE
                        b.WorldId='$WorldId'
                        AND
                        b.BaseId='$BaseId'
                        ORDER BY ba.Zeit ASC";
                }
                $result = $conn->query($strQuery);
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer, $zeile);
                }
            }
            echo json_encode($UserAnswer);
            break;
        }
        case 'getAllianceOverviewData':
        {
            $UserAnswer = [];
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $WorldId = $_post['WorldId'];
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                if (!in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $result = $conn->query(prepareSelectStringOverviewAlliance('LvLOff', $WorldId, $OwnAccountId));
                    while ($zeile = $result->fetch_assoc())
                    {
                        array_push($UserAnswer, $zeile);
                    }
                    $result = $conn->query(prepareSelectStringOverviewAlliance('LvLDef', $WorldId, $OwnAccountId));
                    while ($zeile = $result->fetch_assoc())
                    {
                        array_push($UserAnswer, $zeile);
                    }
                    $result = $conn->query(prepareSelectStringOverviewAlliance('LvLSup', $WorldId, $OwnAccountId));
                    while ($zeile = $result->fetch_assoc())
                    {
                        array_push($UserAnswer, $zeile);
                    }
                }
                else
                {
                    $AllianceId = $_post['AllianceId'];
                    $result = $conn->query(prepareSelectStringOverviewAllianceAdmin('LvLOff', $WorldId, $AllianceId));
                    while ($zeile = $result->fetch_assoc())
                    {
                        array_push($UserAnswer, $zeile);
                    }
                    $result = $conn->query(prepareSelectStringOverviewAllianceAdmin('LvLDef', $WorldId, $AllianceId));
                    while ($zeile = $result->fetch_assoc())
                    {
                        array_push($UserAnswer, $zeile);
                    }
                    $result = $conn->query(prepareSelectStringOverviewAllianceAdmin('LvLSup', $WorldId, $AllianceId));
                    while ($zeile = $result->fetch_assoc())
                    {
                        array_push($UserAnswer, $zeile);
                    }
                }
            }
            echo json_encode($UserAnswer);
            break;
        }
        case 'getWorldOverviewData':
        {
            $UserAnswer = [];
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $WorldId = $_post['WorldId'];
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                if (in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $result = $conn->query(prepareSelectStringOverviewWorld('LvLOff', $WorldId));
                    while ($zeile = $result->fetch_assoc())
                    {
                        array_push($UserAnswer, $zeile);
                    }
                    $result = $conn->query(prepareSelectStringOverviewWorld('LvLDef', $WorldId));
                    while ($zeile = $result->fetch_assoc())
                    {
                        array_push($UserAnswer, $zeile);
                    }
                    $result = $conn->query(prepareSelectStringOverviewWorld('LvLSup', $WorldId));
                    while ($zeile = $result->fetch_assoc())
                    {
                        array_push($UserAnswer, $zeile);
                    }
                }
            }
            echo json_encode($UserAnswer);
            break;
        }
        // Administration & settings
        case 'changePassword':
        {
            $UserAnswer = [];
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                $AccountId = $_post['AccountId'];
                $oldPwMd5 = md5($_post['InputOldPassword']);
                $oldPwSha512 = hash('sha512', $_post['InputOldPassword']);
                $newPw = hash('sha512', $_post['InputNewPassword']);
                $confNewPw = $_post['InputConfirmNewPassword'];
                if ($OwnAccountId == $AccountId)
                {
                    $conn->query("UPDATE `login` SET `Password`='$newPw' WHERE AccountId='$AccountId' AND (`Password`='$oldPwMd5' OR `Password`='$oldPwSha512');");
                }
                else if (in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $conn->query("UPDATE `login` SET `Password`='$newPw' WHERE AccountId='$AccountId';");
                }
                if ($conn->affected_rows > 0)
                {
                    $UserAnswer[0] = 1;
                    $UserAnswer[1] = 'Success';
                }
                else
                {
                    $UserAnswer[0] = 0;
                    $UserAnswer[1] = 'Fail';
                }
            }
            echo json_encode($UserAnswer);
            break;
        }
        case 'resetPlayer':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                if (in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $Id = $_post['Id'];
                    $PlayerName = $_post['PlayerName'];
                    $password = hash('sha512', $PlayerName . '_' . $Id);
                    $conn->query("UPDATE `login` SET `Password`='$password' WHERE AccountId='$Id';");
                }
            }
            break;
        }
        case 'deletePlayer':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                if (in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $Id = $_post['Id'];
                    $conn->query("DELETE FROM `login` WHERE AccountId='$Id';");
                }
            }
            break;
        }
        case 'getNeededMemberRoles':
        {
            $UserAnswer = [];
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                if (in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $WorldId = $_post['WorldId'];
                    $AllianceId = $_post['AllianceId'];
                    $result = $conn->query("SELECT a.WorldId, a.AllianceId, a.MemberRole FROM relation_alliance a WHERE WorldId='$WorldId' AND AllianceId='$AllianceId';");
                    while ($zeile = $result->fetch_assoc())
                    {
                        array_push($UserAnswer, $zeile);
                    }
                }
            }
            echo json_encode($UserAnswer[0]);
            break;
        }
        case 'changeNeededMemberRole':
        {
            $UserAnswer = [];
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $WorldId = $_post['WorldId'];
                $AllianceId = $_post['AllianceId'];
                $MemberRole = $_post['MemberRole'];
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                if (!in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $strQuery =
                        "SELECT p.AllianceId FROM relation_player p
                        WHERE p.WorldId='$WorldId'
                        AND p.AccountId='$OwnAccountId'
                        AND
                        (
                            IF
                            (
                                p.MemberRole=1,
                                true,
                                false
                            )
                        );";
                    $result = $conn->query($strQuery);
                    $OwnAllianceId = 0;
                    while ($zeile = $result->fetch_assoc())
                    {
                        $OwnAllianceId = $zeile['AllianceId'];
                    }
                    if ($OwnAllianceId == $AllianceId)
                    {
                        $strQuery =
                            "UPDATE relation_alliance SET MemberRole='$MemberRole'
                            WHERE WorldId='$WorldId'
                            AND AllianceId='$AllianceId';";
                        $conn->query($strQuery);
                    }
                }
                else
                {
                    $strQuery =
                        "UPDATE relation_alliance SET MemberRole='$MemberRole'
                        WHERE WorldId='$WorldId'
                        AND AllianceId='$AllianceId';";
                    $conn->query($strQuery);
                }
                if ($conn->affected_rows > 0)
                {
                    $UserAnswer[0] = 1;
                    $UserAnswer[1] = 'Success';
                }
                else
                {
                    $UserAnswer[0] = 0;
                    $UserAnswer[1] = 'Fail';
                }
            }
            echo json_encode($UserAnswer);
            break;
        }
        case 'deletePlayerFromAlliance':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $WorldId = $_post['WorldId'];
                $AllianceId = $_post['AllianceId'];
                $AccountId = $_post['AccountId'];
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                if (!in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $strQuery =
                        "SELECT p.AllianceId FROM relation_player p
                        WHERE p.WorldId='$WorldId'
                        AND p.AccountId='$OwnAccountId'
                        AND
                        (
                            IF
                            (
                                p.MemberRole=1,
                                true,
                                false
                            )
                        );";
                    $result = $conn->query($strQuery);
                    $OwnAllianceId = 0;
                    while ($zeile = $result->fetch_assoc())
                    {
                        $OwnAllianceId = $zeile['AllianceId'];
                    }
                    if ($OwnAllianceId == $AllianceId)
                    {
                        $strQuery =
                            "DELETE FROM relation_player
                            WHERE WorldId='$WorldId'
                            AND AllianceId='$AllianceId'
                            AND AccountId='$AccountId';";
                        $conn->query($strQuery);
                    }
                }
                else
                {
                    $strQuery =
                        "DELETE FROM relation_player
                        WHERE WorldId='$WorldId'
                        AND AllianceId='$AllianceId'
                        AND AccountId='$AccountId';";
                    $conn->query($strQuery);
                    echo $strQuery;
                }
            }
            break;
        }
        case 'deleteServer':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                if (in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $Id = $_post['Id'];
                    $conn->query("DELETE FROM `relation_server` WHERE WorldId='$Id';");
                }
            }
            break;
        }
        case 'optimizeAllTables':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                if (in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $conn->query("OPTIMIZE TABLES adminlog, alliance, bases, contact, login, player, relation_alliance, relation_bases, relation_player, relation_server, substitution;");
                }
            }
            break;
        }
        case 'getAdminLog':
        {
            $UserAnswer = [];
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                if (in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $result = $conn->query("SELECT ID, `Zeit`, `Initiator`, `Description` FROM adminlog WHERE `SHOW`=TRUE ORDER BY ID DESC;");
                    while ($zeile = $result->fetch_assoc())
                    {
                        array_push($UserAnswer, $zeile);
                    }
                }
            }
            echo json_encode($UserAnswer);
            break;
        }
        case 'deleteElementAdminLog':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                if (in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $Id = $_post['Id'];
                    $conn->query("UPDATE adminlog SET `Show`=FALSE WHERE ID='$Id';");
                }
            }
            break;
        }
		default:
		{
			echo 'no Action';
			break;
		}
	}
}
else
{
    $UserAnswer = [];
    $UserAnswer[0] = 0;
    $UserAnswer[1] = 'noDb';
    echo json_encode($UserAnswer);
}

function prepareSelectStringOverviewAlliance($typeOfPlayerData, $WorldId, $OwnAccountId)
{
    $strQuery = "SELECT ";
    for ($i = 0; $i <= 66; $i++)
    {
        $strQuery .= "SUM(CASE WHEN ba.$typeOfPlayerData BETWEEN $i AND $i.99 THEN 1 ELSE 0 END) AS $typeOfPlayerData$i, ";
    }
    $strQuery .= "SUM(CASE WHEN ba.$typeOfPlayerData BETWEEN 67 AND 67.99 THEN 1 ELSE 0 END) AS " . $typeOfPlayerData . "67 ";
    $strQuery .=
        "FROM relation_bases b
        JOIN relation_alliance a ON a.WorldId=b.WorldId
        JOIN relation_player p ON p.WorldId=b.WorldId and p.AllianceId=a.AllianceId AND p.AccountId=b.AccountId
        JOIN bases ba ON ba.WorldId=b.WorldId AND ba.ID=b.BaseId
        WHERE b.WorldId='$WorldId'
        AND a.AllianceId=
        (
            SELECT p.AllianceId FROM relation_player p WHERE p.AccountId='$OwnAccountId' AND p.WorldId=b.WorldId
        )
        AND
        ba.Zeit=
        (
            SELECT ba.Zeit FROM bases ba WHERE ba.WorldId=b.WorldId AND ba.ID=b.BaseId ORDER BY ba.Zeit DESC LIMIT 1
        );";
    return $strQuery;
}

function prepareSelectStringOverviewAllianceAdmin($typeOfPlayerData, $WorldId, $AllianceId)
{
    $strQuery = "SELECT ";
    for ($i = 0; $i <= 66; $i++)
    {
        $strQuery .= "SUM(CASE WHEN ba.$typeOfPlayerData BETWEEN $i AND $i.99 THEN 1 ELSE 0 END) AS $typeOfPlayerData$i, ";
    }
    $strQuery .= "SUM(CASE WHEN ba.$typeOfPlayerData BETWEEN 67 AND 67.99 THEN 1 ELSE 0 END) AS " . $typeOfPlayerData . "67 ";
    $strQuery .=
        "FROM relation_bases b
        JOIN relation_alliance a ON a.WorldId=b.WorldId
        JOIN relation_player p ON p.WorldId=b.WorldId and p.AllianceId=a.AllianceId AND p.AccountId=b.AccountId
        JOIN bases ba ON ba.WorldId=b.WorldId AND ba.ID=b.BaseId
        WHERE b.WorldId='$WorldId'
        AND a.AllianceId='$AllianceId'
        AND
        ba.Zeit=
        (
            SELECT ba.Zeit FROM bases ba WHERE ba.WorldId=b.WorldId AND ba.ID=b.BaseId ORDER BY ba.Zeit DESC LIMIT 1
        );";
    return $strQuery;
}

function prepareSelectStringOverviewWorld($typeOfPlayerData, $WorldId)
{
    $strQuery = "SELECT ";
    for ($i = 0; $i <= 66; $i++)
    {
        $strQuery .= "SUM(CASE WHEN ba.$typeOfPlayerData BETWEEN $i AND $i.99 THEN 1 ELSE 0 END) AS $typeOfPlayerData$i, ";
    }
    $strQuery .= "SUM(CASE WHEN ba.$typeOfPlayerData BETWEEN 67 AND 67.99 THEN 1 ELSE 0 END) AS " . $typeOfPlayerData . "67 ";
    $strQuery .=
        "FROM relation_bases b
        JOIN relation_alliance a ON a.WorldId=b.WorldId
        JOIN relation_player p ON p.WorldId=b.WorldId and p.AllianceId=a.AllianceId AND p.AccountId=b.AccountId
        JOIN bases ba ON ba.WorldId=b.WorldId AND ba.ID=b.BaseId
        WHERE b.WorldId='$WorldId'
        AND
        ba.Zeit=
        (
            SELECT ba.Zeit FROM bases ba WHERE ba.WorldId=b.WorldId AND ba.ID=b.BaseId ORDER BY ba.Zeit DESC LIMIT 1
        );";
    return $strQuery;
}

// ersetzt Sonderzeichen (für schreiben in DB)
function replaceChars($str)
{
	$str = str_replace("\\", "&#92;", $str); // Backslash
	$str = str_replace("'", "&#39;", $str); // einfaches Anführungszeichen
	$str = str_replace("`", "&#96;", $str); // schräges eInfaches Anführungszeichen links (gravis)
	return $str;
}
?>