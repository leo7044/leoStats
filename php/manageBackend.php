<?php
/* Developer: leo7044 (https://github.com/leo7044) */
header("Access-Control-Allow-Origin: *"); // von einer anderen Website drauf zugreifen
header("Content-Type: application/json; charset=utf-8"); // JSON-Antwort
include_once('config.php'); // Datenbankanbindung
session_start(); // starten der PHP-Session
$_post = filter_input_array(INPUT_POST); // es werden nur POST-Variablen akzeptiert, damit nicht mittels Link (get-vars) Anderungen an DB vorgenommen werden können
$_post = replaceChars($_post);
$action = $_post['action'];
$UserAnswer = [];
if (!$conn->connect_error)
{
	switch ($action)
	{
        // InGame - leoStats
		case 'sendDataFromInGame':
		{
            $ScriptLocalVersion = time();
            if (isset($_post['ScriptVersionLocal']))
            {
                $ScriptLocalVersion = $_post['ScriptVersionLocal'] . '.' . time();
            }
            $ObjectData = $_post['ObjectData'];
            $ObjectServer = $ObjectData['server'];
            $ObjectAlliance = $ObjectData['alliance'];
            $ObjectPlayer = $ObjectData['player'];
            $ObjectBases = $ObjectData['bases'];
            $ObjectSubstitution = $ObjectData['substitution'];
            // Login
            $AccountId = $ObjectPlayer['AccountId'];
            $PlayerName = $ObjectPlayer['PlayerName'];
            $PasswordStandard = hash('sha512', $PlayerName . '_' . $AccountId);
            $result = $conn->query("SELECT `AccountId`, `UserName`, `Password` FROM `login` WHERE `AccountId`='$AccountId';");
            $oldPlayerName = '';
            $password = '';
            $accountExists = false;
            // $strQuery = '';
            while ($zeile = $result->fetch_assoc())
            {
                $accountExists = true;
                $oldPlayerName = $zeile['UserName'];
                $password = $zeile['Password'];
            }
            if (!$accountExists)
            {
                $strQuery = "INSERT INTO `login`(`AccountId`, `UserName`, `Password`) VALUES ('$AccountId', '$PlayerName', '$PasswordStandard');";
                $conn->query($strQuery);
                $Time = date("Y-m-d H:i:s");
                $strQuery = "INSERT INTO `adminlog`(`Zeit`, `Initiator`, `Description`, `ShowRow`) VALUES ('$Time', '$PlayerName', 'Spieler angelegt', true);";
                $conn->query($strQuery);
                $UserAnswer = [0, 'UserDidNotChangedPassword'];
            }
            else
            {
                if ($PlayerName != $oldPlayerName)
                {
                    $strQuery = "UPDATE `login` SET `UserName`='$PlayerName' WHERE `AccountId`='$AccountId';";
                    $conn->query($strQuery);
                    $Time = date("Y-m-d H:i:s");
                    $strQuery = "INSERT INTO `adminlog`(`Zeit`, `Initiator`, `Description`, `ShowRow`) VALUES ('$Time', '$PlayerName', 'Spieler umbenannt (alter Name: " . $oldPlayerName . ")', true);";
                    $conn->query($strQuery);
                }
            }
            $strQuery = "UPDATE login SET ScriptLocalVersion='$ScriptLocalVersion' WHERE AccountId='$AccountId';";
            $conn->query($strQuery);
            if (!$password || $password == $PasswordStandard)
            {
                $UserAnswer = [0, 'UserDidNotChangedPassword'];
            }
            else
            {
                $UserAnswer = [1, 'UserChangedPassword'];
            }
            // RelationServer
            $WorldId = $ObjectServer['WorldId'];
            $ServerName = $ObjectServer['ServerName'];
            $SeasonServer = $ObjectServer['SeasonServer'];
            $strQuery = "INSERT INTO `relation_server` (WorldId, ServerName, SeasonServer) VALUES ('$WorldId', '$ServerName', $SeasonServer) ON DUPLICATE KEY UPDATE WorldId = VALUES(WorldId), ServerName = VALUES(ServerName), SeasonServer = VALUES(SeasonServer);";
            $conn->query($strQuery);
            // RelationAlliance
            $AllianceId = $ObjectAlliance['AllianceId'];
            if ($ObjectAlliance['AllianceId'] > 0)
            {
                $AllianceName = $ObjectAlliance['AllianceName'];
                $strQuery = "INSERT INTO `relation_alliance` (WorldId, AllianceId, AllianceName) VALUES ('$WorldId', '$AllianceId', '$AllianceName') ON DUPLICATE KEY UPDATE WorldId = VALUES(WorldId), AllianceId = VALUES(AllianceId), AllianceName = VALUES(AllianceName);";
            }
            else
            {
                $strQuery = "INSERT INTO `relation_alliance` (WorldId, AllianceId, AllianceName) VALUES ('$WorldId', '$AllianceId', '') ON DUPLICATE KEY UPDATE WorldId = VALUES(WorldId), AllianceId = VALUES(AllianceId), AllianceName = VALUES(AllianceName);";
            }
            $conn->query($strQuery);
            // RelationPlayer
			$Faction = $ObjectPlayer['Faction'];
            $MemberRole = $ObjectPlayer['MemberRole'];
            $strQuery = "INSERT INTO `relation_player` (WorldId, AllianceId, AccountId, Faction, MemberRole) VALUES ('$WorldId', '$AllianceId', '$AccountId', '$Faction', '$MemberRole') ON DUPLICATE KEY UPDATE WorldId = VALUES(WorldId), AllianceId = VALUES(AllianceId), AccountId = VALUES(AccountId), Faction = VALUES(Faction), MemberRole = VALUES(MemberRole);";
            $conn->query($strQuery);
            // RelationBases and Bases
            $strQueryBasesRelation = "INSERT INTO `relation_bases` (WorldId, AccountId, BaseId, `BaseName`) VALUES ";
            $strQueryBases = "INSERT INTO `bases`(`Zeit`, `WorldId`, `BaseId`, `BasePoints`, `LvLCY`, `LvLBase`, `LvLOff`, `LvLDef`, `LvLDF`, `LvLSup`, `SupArt`, `Tib`, `Cry`, `Pow`, `Cre`, `Rep`, `CnCOpt`) VALUES ";
            $TimeDay = date("Y-m-d");
            foreach ($ObjectBases as $key => $ObjectBase)
            {
                $BaseId = $ObjectBase['BaseId'];
                $BaseName = '';
                if (isset($ObjectBase['Name'])) // old
                {
                    $BaseName = $ObjectBase['Name'];
                }
                else if (isset($ObjectBase['BaseName'])) // new
                {
                    $BaseName = $ObjectBase['BaseName'];
                }
                $BasePoints = $ObjectBase['BasePoints'];
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
                    $strQueryBasesRelation .= "('$WorldId', '$AccountId', '$BaseId', '$BaseName'),";
                    $strQueryBases .= "('$TimeDay', '$WorldId', '$BaseId', '$BasePoints', '$LvLCY', '$LvLBase', '$LvLOff', '$LvLDef', '$LvLDF', '$LvLSup', '$SupArt', '$Tib', '$Cry', '$Pow', '$Cre', '$Rep', '$CnCOpt'),";
                }
                else
                {
                    $strQueryBasesRelation .= "('$WorldId', '$AccountId', '$BaseId', '$BaseName')";
                    $strQueryBases .= "('$TimeDay', '$WorldId', '$BaseId', '$BasePoints', '$LvLCY', '$LvLBase', '$LvLOff', '$LvLDef', '$LvLDF', '$LvLSup', '$SupArt', '$Tib', '$Cry', '$Pow', '$Cre', '$Rep', '$CnCOpt')";
                }
            }
            $strQueryBasesRelation .= " ON DUPLICATE KEY UPDATE WorldId = VALUES(WorldId), AccountId = VALUES(AccountId), BaseId = VALUES(BaseId), BaseName = VALUES(BaseName);";
            $strQueryBases .= " ON DUPLICATE KEY UPDATE Zeit = VALUES(Zeit), WorldId = VALUES(WorldId), BaseId = VALUES(BaseId), BasePoints = VALUES(BasePoints), LvLCY = VALUES(LvLCY), LvLBase = VALUES(LvLBase), LvLOff = VALUES(LvLOff), LvLDef = VALUES(LvLDef), LvLDF = VALUES(LvLDF), LvLSup = VALUES(LvLSup), SupArt = VALUES(SupArt), Tib = VALUES(Tib), Cry = VALUES(Cry), Pow = VALUES(Pow), Cre = VALUES(Cre), Rep = VALUES(Rep), CnCOpt = VALUES(CnCOpt);";
            $conn->query($strQueryBasesRelation);
            $conn->query($strQueryBases);
            // $strQuery .= $strQueryBasesRelation;
            // $strQuery .= $strQueryBases;
            // Alliance
            if ($ObjectAlliance['AllianceId'] > 0)
            {
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
                $strQuery = "INSERT INTO `alliance`(`Zeit`, `WorldId`, `AllianceId`, `AllianceRank`, `EventRank`, `TotalScore`, `AverageScore`, `VP`, `VPh`, `BonusTiberium`, `BonusCrystal`, `BonusPower`, `BonusInfantrie`, `BonusVehicle`, `BonusAir`, `BonusDef`, `ScoreTib`, `ScoreCry`, `ScorePow`, `ScoreInf`, `ScoreVeh`, `ScoreAir`, `ScoreDef`, `RankTib`, `RankCry`, `RankPow`, `RankInf`, `RankVeh`, `RankAir`, `RankDef`) VALUES ('$TimeDay', '$WorldId', '$AllianceId', '$AllianceRank', '$AllianceEventRank', '$AllianceTotalScore', '$AllianceAverageScore', '$AllianceVeteranPoints', '$AllianceProdVetPoints', '$BonusTiberium', '$BonusCrystal', '$BonusPower', '$BonusInfantrie', '$BonusVehicle', '$BonusAir', '$BonusDef', '$ScoreTib', '$ScoreCry', '$ScorePow', '$ScoreInf', '$ScoreVeh', '$ScoreAir', '$ScoreDef', '$RankTib', '$RankCry', '$RankPow', '$RankInf', '$RankVeh', '$RankAir', '$RankDef') ON DUPLICATE KEY UPDATE Zeit = VALUES(Zeit), WorldId = VALUES(WorldId), AllianceId = VALUES(AllianceId), AllianceRank = VALUES(AllianceRank), EventRank = VALUES(EventRank), TotalScore = VALUES(TotalScore), AverageScore = VALUES(AverageScore), VP = VALUES(VP), VPh = VALUES(VPh), BonusTiberium = VALUES(BonusTiberium), BonusCrystal = VALUES(BonusCrystal), BonusPower = VALUES(BonusPower), BonusInfantrie = VALUES(BonusInfantrie), BonusVehicle = VALUES(BonusVehicle), BonusAir = VALUES(BonusAir), BonusDef = VALUES(BonusDef), ScoreTib = VALUES(ScoreTib), ScoreCry = VALUES(ScoreCry), ScorePow = VALUES(ScorePow), ScoreInf = VALUES(ScoreInf), ScoreVeh = VALUES(ScoreVeh), ScoreAir = VALUES(ScoreAir), ScoreDef = VALUES(ScoreDef), RankTib = VALUES(RankTib), RankCry = VALUES(RankCry), RankPow = VALUES(RankPow), RankInf = VALUES(RankInf), RankVeh = VALUES(RankVeh), RankAir = VALUES(RankAir), RankDef = VALUES(RankDef);";
                $conn->query($strQuery);
            }
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
            $LvLHighestDef = $ObjectPlayer['LvLHighestDef'];
            $ProductionTiberium = $ObjectPlayer['ProductionTiberium'];
            $ProductionCrystal = $ObjectPlayer['ProductionCrystal'];
            $ProductionPower = $ObjectPlayer['ProductionPower'];
            $ProductionCredits = $ObjectPlayer['ProductionCredits'];
            $AverageBase = $ObjectPlayer['AverageBase'];
            $AverageOff = $ObjectPlayer['AverageOff'];
            $AverageDef = $ObjectPlayer['AverageDef'];
            $AverageDF = $ObjectPlayer['AverageDF'];
            $AverageSup = $ObjectPlayer['AverageSup'];
            $strQuery = "INSERT INTO `player`(`Zeit`, `WorldId`, `AccountId`, `ScorePoints`, `CountBases`, `CountSup`, `OverallRank`, `EventRank`, `GesamtTiberium`, `GesamtCrystal`, `GesamtPower`, `GesamtCredits`, `ResearchPoints`, `Credits`, `Shoot`, `PvP`, `PvE`, `LvLOff`, `LvLDef`, `BaseD`, `OffD`, `DefD`, `DFD`, `SupD`, `VP`, `LP`, `RepMax`, `CPMax`, `CPCur`, `Funds`) VALUES ('$TimeDay', '$WorldId', '$AccountId', '$ScorePoints', '$CountBases', '$CountSup', '$PlayerRank', '$PlayerEventRank', '$ProductionTiberium', '$ProductionCrystal', '$ProductionPower', '$ProductionCredits', '$ResearchPoints', '$Credits', '$Shoot', '$PvP', '$PvE', '$LvLHighestOff', '$LvLHighestDef', '$AverageBase', '$AverageOff', '$AverageDef', '$AverageDF', '$AverageSup', '$PlayerVeteranPoints', '$LegacyPoints', '$RepMax', '$CPMax', '$CPCur', '$Funds') ON DUPLICATE KEY UPDATE Zeit = VALUES(Zeit), WorldId = VALUES(WorldId), AccountId = VALUES(AccountId), ScorePoints = VALUES(ScorePoints), CountBases = VALUES(CountBases), CountSup = VALUES(CountSup), OverallRank = VALUES(OverallRank), EventRank = VALUES(EventRank), GesamtTiberium = VALUES(GesamtTiberium), GesamtCrystal = VALUES(GesamtCrystal), GesamtPower = VALUES(GesamtPower), GesamtCredits = VALUES(GesamtCredits), ResearchPoints = VALUES(ResearchPoints), Credits = VALUES(Credits), Shoot = VALUES(Shoot), PvP = VALUES(PvP), PvE = VALUES(PvE), LvLOff = VALUES(LvLOff), LvLDef = VALUES(LvLDef), BaseD = VALUES(BaseD), OffD = VALUES(OffD), DefD = VALUES(DefD), DFD = VALUES(DFD), SupD = VALUES(SupD), VP = VALUES(VP), LP = VALUES(LP), RepMax = VALUES(RepMax), CPMax = VALUES(CPMax), CPCur = VALUES(CPCur), Funds = VALUES(Funds);";
            $conn->query($strQuery);
            // Substitution
            $strQuery = "DELETE FROM substitution WHERE WorldId='$WorldId' AND (PlayerNameSet='$PlayerName' OR PlayerNameGet='$PlayerName')";
            $conn->query($strQuery);
            $NameOut = $ObjectSubstitution['outgoing'];
            if ($NameOut)
            {
                $strQuery = "INSERT INTO `substitution`(`WorldId`, `PlayerNameSet`, `PlayerNameGet`, `active`) VALUES ('$WorldId', '$PlayerName', '$NameOut', false);";
                $conn->query($strQuery);
            }
            if (count($ObjectSubstitution['incoming']))
            {
                $strQuery = "INSERT INTO `substitution`(`WorldId`, `PlayerNameSet`, `PlayerNameGet`, `active`) VALUES ";
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
                $conn->query($strQuery);
            }
            if (count($ObjectSubstitution['active']))
            {
                $strQuery = "INSERT INTO `substitution`(`WorldId`, `PlayerNameSet`, `PlayerNameGet`, `active`) VALUES ";
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
                $conn->query($strQuery);
            }
            // $conn->multi_query($strQuery);
			break;
        }
        // InGame - BaseScanner
        case 'sendDataFromInGameBaseScanner':
        {
            $strQueryLayouts = "INSERT INTO layouts (WorldId, Zeit, AccountId, PlayerName, PosX, PosY, FieldsTib, FieldsCry, Layout, CncOpt, Tiberium6, Tiberium5, Tiberium4, Tiberium3, Tiberium2, Tiberium1, Crystal6, Crystal5, Crystal4, Crystal3, Crystal2, Crystal1, Mixed6, Mixed5, Mixed4, Mixed3, Mixed2, Mixed1, Power8, Power7, Power6, Power5, Power4, Power3, Power2) VALUES ";
            $WorldId = $_post['WorldId'];
            $AccountId = 0;
            if (isset($_post['AccountId']))
            {
                $AccountId = $_post['AccountId'];
            }
            $PlayerName = $_post['PlayerName'];
            $ObjectData = $_post['ObjectData'];
            foreach ($ObjectData as $key => $value)
            {
                $Zeit = date('Y-m-d H-i-s', intval($value['Zeit'] /= 1000));
                $PosX = $value['PosX'];
                $PosY = $value['PosY'];
                $FieldsTib = $value['FieldsTib'];
                $FieldsCry = $value['FieldsCry'];
                $Layout = $value['Layout'];
                $EvaluatedFields = $value['EvaluatedFields'];
                $Tiberium6 = $EvaluatedFields[0];
                $Tiberium5 = $EvaluatedFields[1];
                $Tiberium4 = $EvaluatedFields[2];
                $Tiberium3 = $EvaluatedFields[3];
                $Tiberium2 = $EvaluatedFields[4];
                $Tiberium1 = $EvaluatedFields[5];
                $Crystal6 = $EvaluatedFields[6];
                $Crystal5 = $EvaluatedFields[7];
                $Crystal4 = $EvaluatedFields[8];
                $Crystal3 = $EvaluatedFields[9];
                $Crystal2 = $EvaluatedFields[10];
                $Crystal1 = $EvaluatedFields[11];
                $Mixed6 = $EvaluatedFields[12];
                $Mixed5 = $EvaluatedFields[13];
                $Mixed4 = $EvaluatedFields[14];
                $Mixed3 = $EvaluatedFields[15];
                $Mixed2 = $EvaluatedFields[16];
                $Mixed1 = $EvaluatedFields[17];
                $Power8 = $EvaluatedFields[18];
                $Power7 = $EvaluatedFields[19];
                $Power6 = $EvaluatedFields[20];
                $Power5 = $EvaluatedFields[21];
                $Power4 = $EvaluatedFields[22];
                $Power3 = $EvaluatedFields[23];
                $Power2 = $EvaluatedFields[24];
                $strLayout = $Layout;
                $strCncOpt = 'http://cncopt.com/?map=2|N|N|' . $PosX . '_' . $PosY . '|';
                $strLayout = str_replace('[[', '', $strLayout);
                $strLayout = str_replace(']]', '', $strLayout);
                $tmpArrayLayout = explode('],[', $strLayout);
                $arrayLayout = array();
                foreach ($tmpArrayLayout as $k => $v)
                {
                    $arrayLayout[] = explode(',', $v);
                }
                foreach ($arrayLayout as $key1 => $arrayLayoutRow)
                {
                    foreach ($arrayLayoutRow as $key2 => $arrayLayoutCol)
                    {
                        // echo $arrayLayoutCol . '<br/>';
                        $letterForCncOpt = '.';
                        if ($arrayLayoutCol == '1')
                        {
                            $letterForCncOpt = 'c';
                        }
                        else if ($arrayLayoutCol == '2')
                        {
                            $letterForCncOpt = 't';
                        }
                        else if ($arrayLayoutCol == '4')
                        {
                            $letterForCncOpt = 'j';
                        }
                        else if ($arrayLayoutCol == '5')
                        {
                            $letterForCncOpt = 'h';
                        }
                        else if ($arrayLayoutCol == '6')
                        {
                            $letterForCncOpt = 'l';
                        }
                        else if ($arrayLayoutCol == '7')
                        {
                            $letterForCncOpt = 'k';
                        }
                        $strCncOpt .= $letterForCncOpt;
                    }
                }
                if (strlen($strLayout) == 431) // new
                {
                    $strCncOpt .= '....................................|newEconomy';
                }
                else // old
                {
                    $strCncOpt .= '............................................................................................................|newEconomy';
                }
                if ($key != count($ObjectData) - 1)
                {
                    $strQueryLayouts .= "('$WorldId', '$Zeit', '$AccountId', '$PlayerName', '$PosX', '$PosY', '$FieldsTib', '$FieldsCry', '$Layout', '$strCncOpt', '$Tiberium6', '$Tiberium5', '$Tiberium4', '$Tiberium3', '$Tiberium2', '$Tiberium1', '$Crystal6', '$Crystal5', '$Crystal4', '$Crystal3', '$Crystal2', '$Crystal1', '$Mixed6', '$Mixed5', '$Mixed4', '$Mixed3', '$Mixed2', '$Mixed1', '$Power8', '$Power7', '$Power6', '$Power5', '$Power4', '$Power3', '$Power2'),";
                }
                else
                {
                    $strQueryLayouts .= "('$WorldId', '$Zeit', '$AccountId', '$PlayerName', '$PosX', '$PosY', '$FieldsTib', '$FieldsCry', '$Layout', '$strCncOpt', '$Tiberium6', '$Tiberium5', '$Tiberium4', '$Tiberium3', '$Tiberium2', '$Tiberium1', '$Crystal6', '$Crystal5', '$Crystal4', '$Crystal3', '$Crystal2', '$Crystal1', '$Mixed6', '$Mixed5', '$Mixed4', '$Mixed3', '$Mixed2', '$Mixed1', '$Power8', '$Power7', '$Power6', '$Power5', '$Power4', '$Power3', '$Power2')";
                }
            }
            $strQueryLayouts .= " ON DUPLICATE KEY UPDATE Zeit = VALUES(Zeit), AccountId = VALUES(AccountId), PlayerName = VALUES(PlayerName), FieldsTib = VALUES(FieldsTib), FieldsCry = VALUES(FieldsCry), Layout = VALUES(Layout), CncOpt = VALUES(CncOpt), Tiberium6 = VALUES(Tiberium6), Tiberium5 = VALUES(Tiberium5), Tiberium4 = VALUES(Tiberium4), Tiberium3 = VALUES(Tiberium3), Tiberium2 = VALUES(Tiberium2), Crystal6 = VALUES(Crystal6), Crystal5 = VALUES(Crystal5), Crystal4 = VALUES(Crystal4), Crystal3 = VALUES(Crystal3), Crystal2 = VALUES(Crystal2), Mixed6 = VALUES(Mixed6), Mixed5 = VALUES(Mixed5), Mixed4 = VALUES(Mixed4), Mixed3 = VALUES(Mixed3), Mixed2 = VALUES(Mixed2), Power8 = VALUES(Power8), Power7 = VALUES(Power7), Power6 = VALUES(Power6), Power5 = VALUES(Power5), Power4 = VALUES(Power4), Power3 = VALUES(Power3), Power2 = VALUES(Power2);";
            $conn->multi_query($strQueryLayouts);
            $UserAnswer = [1, 'BaseScanner-Data successfull transmitted'];
            break;
        }
        // InGame - Reports
        case 'sendDataFromInGameReport':
        {
            $ObjectData = $_post['ObjectData'];
            $strQueryReports = "INSERT INTO reports (WorldId, AccountId, ReportId, OwnBaseId, AttackTime, TargetLevel, TargetFaction, BattleStatus, GainTib, GainCry, GainCre, GainRp, CostCry, CostRep) VALUES ";
            foreach ($ObjectData as $key => $value)
            {
                $WorldId = $value['WorldId'];
                $AccountId = $value['AccountId'];
                $ReportId = $value['ReportId'];
                $OwnBaseId = $value['OwnBaseId'];
                $AttackTime = date('Y-m-d H-i-s', intval($value['AttackTime'] /= 1000));
                $TargetLevel = $value['TargetLevel'];
                $TargetFaction = $value['TargetFaction'];
                $BattleStatus = $value['BattleStatus'];
                $GainTib = $value['GainTib'];
                $GainCry = $value['GainCry'];
                $GainCre = $value['GainCre'];
                $GainRp = $value['GainRp'];
                $CostCry = $value['CostCry'];
                $CostRep = $value['CostRep'];
                if ($key != count($ObjectData) - 1)
                {
                    $strQueryReports .= "('$WorldId', '$AccountId', '$ReportId', '$OwnBaseId', '$AttackTime', '$TargetLevel', '$TargetFaction', '$BattleStatus', '$GainTib', '$GainCry', '$GainCre', '$GainRp', '$CostCry', '$CostRep'),";
                }
                else
                {
                    $strQueryReports .= "('$WorldId', '$AccountId', '$ReportId', '$OwnBaseId', '$AttackTime', '$TargetLevel', '$TargetFaction', '$BattleStatus', '$GainTib', '$GainCry', '$GainCre', '$GainRp', '$CostCry', '$CostRep')";
                }
            }
            $strQueryReports .= " ON DUPLICATE KEY UPDATE AccountId = VALUES(AccountId), OwnBaseId = VALUES(OwnBaseId), AttackTime = VALUES(AttackTime), TargetLevel = VALUES(TargetLevel), TargetFaction = VALUES(TargetFaction), BattleStatus = VALUES(BattleStatus), GainTib = VALUES(GainTib), GainCry = VALUES(GainCry), GainCre = VALUES(GainCre), GainRp = VALUES(GainRp), CostCry = VALUES(CostCry), CostRep = VALUES(CostRep);";
            $conn->multi_query($strQueryReports);
            $UserAnswer = [1, 'Report-Data successfull transmitted'];
            break;
        }
        case 'getExistingReportIds':
        {
            $WorldId = $_post['WorldId'];
            $AccountId = $_post['AccountId'];
            $sqlQuery = "SELECT r.ReportId FROM reports r WHERE r.WorldId='$WorldId' AND r.AccountId='$AccountId' ORDER BY r.ReportId DESC LIMIT 1000;";
            $result = $conn->query($sqlQuery);
            while ($zeile = $result->fetch_assoc())
            {
                array_push($UserAnswer, $zeile);
            }
            break;
        }
        // InGame - Update-Service (für ältere Versionen als 2020.02.02.2)
        case 'getCurrentVersionOfLeoStats':
        {
            $UserAnswer = [1, '2020.02.02.2'];
            break;
        }
        // WebSite - Allgemein
        case 'login':
        {
            $UserName = $_post['UserName'];
            $Password = hash('sha512', $_post['Password']);
            $AccountId = 0;
            $result = $conn->query("SELECT `AccountId` FROM `login` WHERE `UserName`='$UserName' AND `Password`='$Password';");
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
                $UserAnswer = [1, 'UserInDb'];
                $Time = date("Y-m-d H:i:s");
                $conn->query("INSERT INTO `adminlog` (`Zeit`, `Initiator`, `Description`, `ShowRow`) VALUES ('$Time', '$UserName', 'Login erfolgreich', true);");
            }
            else
            {
                $UserAnswer = [0, 'UserNotInDb'];
                $Time = date("Y-m-d H:i:s");
                $conn->query("INSERT INTO `adminlog` (`Zeit`, `Initiator`, `Description`, `ShowRow`) VALUES ('$Time', '$UserName', 'Login fehlgeschlagen', true);");
            }
            break;
        }
        case 'getSessionVariables':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $UserAnswer = [$_SESSION];
            }
            break;
        }
        case 'getSeasonServerIds':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $result = $conn->query("SELECT WorldId FROM relation_server WHERE SeasonServer='1';");
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer, $zeile['WorldId']);
                }
            }
            break;
        }
        case 'getDropDownListData':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                $strQuery = '';
                if (!in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $strQuery .= "CALL getDropDownListDataAsUser('$OwnAccountId');";
                }
                else
                {
                    $strQuery .= "CALL getDropDownListDataAsAdmin();";
                }
                $result = $conn->query($strQuery);
                $UserAnswer = [[],[]];
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer[0], $zeile);
                }
                mysqli_next_result($conn);
                $strQuery = "CALL getDropDownListDataMemberRoles('$OwnAccountId');";
                $result = $conn->query($strQuery);
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer[1], $zeile);
                }
            }
            break;
        }
        case 'getAlliancePlayerData':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $WorldId = $_post['WorldId'];
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                $strQuery = '';
                if (!in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $strQuery .= "CALL getAlliancePlayerDataAsUser('$WorldId', '$OwnAccountId');";
                }
                else
                {
                    $AllianceId = $_post['AllianceId'];
                    $strQuery .= "CALL getAlliancePlayerDataAsAdmin('$WorldId', '$AllianceId');";
                }
                $result = $conn->query($strQuery);
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer, $zeile);
                }
            }
            break;
        }
        case 'getAllianceDataHistory':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $WorldId = $_post['WorldId'];
                $AllianceId = $_post['AllianceId'];
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                $strQuery = "CALL getAllianceDataHistory('$WorldId', '$AllianceId', '$OwnAccountId');";
                $result = $conn->query($strQuery);
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer, $zeile);
                }
            }
            break;
        }
        case 'getPlayerBaseData':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $WorldId = $_post['WorldId'];
                $AccountId = $_post['AccountId'];
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                $strQuery = '';
                if (!in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $strQuery .= "CALL getPlayerBaseDataAsUser('$WorldId', '$AccountId', '$OwnAccountId');";
                }
                else
                {
                    $strQuery .= "CALL getPlayerBaseDataAsAdmin('$WorldId', '$AccountId');";
                }
                $result = $conn->query($strQuery);
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer, $zeile);
                }
            }
            break;
        }
        case 'getPlayerData':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $WorldId = $_post['WorldId'];
                $AccountId = $_post['AccountId'];
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                $strQuery = '';
                if (!in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $strQuery .= "CALL getPlayerDataAsUser('$WorldId', '$AccountId', '$OwnAccountId');";
                }
                else
                {
                    $strQuery .= "CALL getPlayerDataAsAdmin('$WorldId', '$AccountId');";
                }
                $result = $conn->query($strQuery);
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer, $zeile);
                }
            }
            break;
        }
        case 'getBaseData':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $WorldId = $_post['WorldId'];
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                $BaseId = $_post['BaseId'];
                $strQuery = '';
                if (!in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $strQuery .= "CALL getBaseDataAsUser('$WorldId', '$BaseId', '$OwnAccountId');";
                }
                else
                {
                    $strQuery .= "CALL getBaseDataAsAdmin('$WorldId', '$BaseId');";
                }
                $result = $conn->query($strQuery);
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer, $zeile);
                }
            }
            break;
        }
        case 'getAllianceOverviewData':
        {
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
            break;
        }
        case 'getWorldOverviewData':
        {
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
            break;
        }
        case 'getAllianceBaseData':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $WorldId = $_post['WorldId'];
                $AllianceId = $_post['AllianceId'];
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                $strQuery = "CALL getAllianceBaseData('$WorldId', '$AllianceId', '$OwnAccountId');";
                $result = $conn->query($strQuery);
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer, $zeile);
                }
            }
            break;
        }
        // WebSite - Administration & settings
        case 'changePassword':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                $AccountId = $_post['AccountId'];
                $oldPw = hash('sha512', $_post['InputOldPassword']);
                $newPw = hash('sha512', $_post['InputNewPassword']);
                $confNewPw = $_post['InputConfirmNewPassword'];
                if ($OwnAccountId == $AccountId)
                {
                    $conn->query("UPDATE `login` SET `Password`='$newPw' WHERE AccountId='$AccountId' AND `Password`='$oldPw';");
                }
                else if (in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $conn->query("UPDATE `login` SET `Password`='$newPw' WHERE AccountId='$AccountId';");
                }
                if ($conn->affected_rows > 0)
                {
                    $UserAnswer = [1, 'Success'];
                }
                else
                {
                    $UserAnswer = [0, 'Fail'];
                }
            }
            break;
        }
        case 'resetPlayer':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                if (in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $AccountId = $_post['AccountId'];
                    $PlayerName = $_post['PlayerName'];
                    $password = hash('sha512', $PlayerName . '_' . $AccountId);
                    $conn->query("UPDATE `login` SET `Password`='$password' WHERE AccountId='$AccountId';");
                }
            }
            $UserAnswer = [1, 'done'];
            break;
        }
        case 'deletePlayer':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                if (in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $AccountId = $_post['AccountId'];
                    $conn->query("DELETE FROM `login` WHERE AccountId='$AccountId';");
                }
            }
            $UserAnswer = [1, 'done'];
            break;
        }
        case 'getNeededMemberRoles':
        {
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
            break;
        }
        case 'changeNeededMemberRole':
        {
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
                    $UserAnswer = [1, 'Success'];
                }
                else
                {
                    $UserAnswer = [0, 'Fail'];
                }
            }
            break;
        }
        case 'removePlayerFromAlliance':
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
                    $OwnAllianceId = -1;
                    while ($zeile = $result->fetch_assoc())
                    {
                        $OwnAllianceId = $zeile['AllianceId'];
                    }
                    if ($OwnAllianceId == $AllianceId)
                    {
                        $strQuery =
                            "UPDATE relation_player SET AllianceId=0, MemberRole=0
                            WHERE WorldId='$WorldId'
                            AND AccountId='$AccountId';";
                        $conn->query($strQuery);
                    }
                }
                else
                {
                    $strQuery =
                        "UPDATE relation_player SET AllianceId=0, MemberRole=0
                        WHERE WorldId='$WorldId'
                        AND AccountId='$AccountId';";
                    $conn->query($strQuery);
                    echo $strQuery;
                }
            }
            $UserAnswer = [1, 'done'];
            break;
        }
        case 'deleteServer':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                if (in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $WorldId = $_post['WorldId'];
                    $conn->query("DELETE FROM `relation_server` WHERE WorldId='$WorldId';");
                }
            }
            $UserAnswer = [1, 'done'];
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
            $UserAnswer = [1, 'done'];
            break;
        }
        case 'getAdminLog':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $OwnAccountId = $_SESSION['leoStats_AccountId'];
                if (in_array($OwnAccountId, $ArrayAdminAccounts))
                {
                    $result = $conn->query("SELECT Id, `Zeit`, `Initiator`, `Description` FROM adminlog WHERE `ShowRow`=TRUE ORDER BY Id DESC;");
                    while ($zeile = $result->fetch_assoc())
                    {
                        array_push($UserAnswer, $zeile);
                    }
                }
            }
            $UserAnswer = [1, 'done'];
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
                    $conn->query("UPDATE adminlog SET `ShowRow`=FALSE WHERE Id='$Id';");
                }
            }
            $UserAnswer = [1, 'done'];
            break;
        }
        case 'getLoginStatus':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $UserAnswer = [1, 'login'];
            }
            else
            {
                $UserAnswer = [0, 'logout'];
            }
            break;
        }
        // Website - BaseScanner
        case 'getLayoutsByWorldIdAndProcedureName':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                    $worldId = $_post['worldId'];
                    $procedureName = $_post['procedureName'];
                    $minX = $_post['minX'];
                    $maxX = $_post['maxX'];
                    $minY = $_post['minY'];
                    $maxY = $_post['maxY'];
                    $MinDate = $_post['MinDate'];
                    $PlayerName = $_post['PlayerName'];
                    $FieldsTib = $_post['FieldsTib'];
                    $sqlQuery = "CALL $procedureName($worldId, $minX, $maxX, $minY, $maxY, '$MinDate', '$PlayerName', $FieldsTib);";
                    $result = $conn->query($sqlQuery);
                    while ($zeile = $result->fetch_assoc())
                    {
                        array_push($UserAnswer, $zeile);
                    }
                /*}
                else
                {
                    $UserAnswer = [0, 'notAuthorized'];
                }*/
            }
            else
            {
                $UserAnswer = [0, 'noLogin'];
            }
            break;
        }
        case 'getAlianceNamesByWorldId':
        {
            if (isset($_SESSION['leoStats_AccountId']))
            {
                $worldId = $_post['worldId'];
                $sqlQuery = "CALL getAlianceNamesByWorldId('$worldId');";
                $result = $conn->query($sqlQuery);
                while ($zeile = $result->fetch_assoc())
                {
                    array_push($UserAnswer, $zeile);
                }
            }
            else
            {
                $UserAnswer = [0, 'noLogin'];
            }
            break;
        }
		default:
		{
			$UserAnswer = [0, 'no action'];
			break;
		}
	}
}
else
{
    $UserAnswer = [0, 'noDb'];
}
if (isset($_SESSION['leoStats_AccountId']) && count($UserAnswer) == 0)
{
	$UserAnswer = [1, 'login'];
}
echo json_encode($UserAnswer);

function prepareSelectStringOverviewAlliance($typeOfPlayerData, $WorldId, $OwnAccountId)
{
    $strQuery = "SELECT ";
    for ($i = 0; $i <= 81; $i++)
    {
        $strQuery .= "SUM(CASE WHEN ba.$typeOfPlayerData BETWEEN $i AND $i.99 THEN 1 ELSE 0 END) AS $typeOfPlayerData$i, ";
    }
    $strQuery .= "SUM(CASE WHEN ba.$typeOfPlayerData BETWEEN 82 AND 82.99 THEN 1 ELSE 0 END) AS " . $typeOfPlayerData . "82 ";
    $strQuery .=
        "FROM relation_bases b
        JOIN relation_alliance a ON a.WorldId=b.WorldId
        JOIN relation_player p ON p.WorldId=b.WorldId and p.AllianceId=a.AllianceId AND p.AccountId=b.AccountId
        JOIN bases ba ON ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId
        WHERE b.WorldId='$WorldId'
        AND a.AllianceId=
        (
            SELECT p.AllianceId FROM relation_player p WHERE p.AccountId='$OwnAccountId' AND p.WorldId=b.WorldId
        )
        AND
        ba.Zeit=
        (
            SELECT ba.Zeit FROM bases ba WHERE ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId ORDER BY ba.Zeit DESC LIMIT 1
        );";
    return $strQuery;
}

function prepareSelectStringOverviewAllianceAdmin($typeOfPlayerData, $WorldId, $AllianceId)
{
    $strQuery = "SELECT ";
    for ($i = 0; $i <= 81; $i++)
    {
        $strQuery .= "SUM(CASE WHEN ba.$typeOfPlayerData BETWEEN $i AND $i.99 THEN 1 ELSE 0 END) AS $typeOfPlayerData$i, ";
    }
    $strQuery .= "SUM(CASE WHEN ba.$typeOfPlayerData BETWEEN 82 AND 82.99 THEN 1 ELSE 0 END) AS " . $typeOfPlayerData . "82 ";
    $strQuery .=
        "FROM relation_bases b
        JOIN relation_alliance a ON a.WorldId=b.WorldId
        JOIN relation_player p ON p.WorldId=b.WorldId and p.AllianceId=a.AllianceId AND p.AccountId=b.AccountId
        JOIN bases ba ON ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId
        WHERE b.WorldId='$WorldId'
        AND a.AllianceId='$AllianceId'
        AND
        ba.Zeit=
        (
            SELECT ba.Zeit FROM bases ba WHERE ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId ORDER BY ba.Zeit DESC LIMIT 1
        );";
    return $strQuery;
}

function prepareSelectStringOverviewWorld($typeOfPlayerData, $WorldId)
{
    $strQuery = "SELECT ";
    for ($i = 0; $i <= 81; $i++)
    {
        $strQuery .= "SUM(CASE WHEN ba.$typeOfPlayerData BETWEEN $i AND $i.99 THEN 1 ELSE 0 END) AS $typeOfPlayerData$i, ";
    }
    $strQuery .= "SUM(CASE WHEN ba.$typeOfPlayerData BETWEEN 82 AND 82.99 THEN 1 ELSE 0 END) AS " . $typeOfPlayerData . "82 ";
    $strQuery .=
        "FROM relation_bases b
        JOIN relation_alliance a ON a.WorldId=b.WorldId
        JOIN relation_player p ON p.WorldId=b.WorldId and p.AllianceId=a.AllianceId AND p.AccountId=b.AccountId
        JOIN bases ba ON ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId
        WHERE b.WorldId='$WorldId'
        AND
        ba.Zeit=
        (
            SELECT ba.Zeit FROM bases ba WHERE ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId ORDER BY ba.Zeit DESC LIMIT 1
        );";
    return $strQuery;
}

function putStuffIntoTableTmpLogs($conn, $stringOld, $stringNew)
{
    $TmpLogString = "INSERT INTO tmp_logs (StringValueOld, StringValueNew) VALUES ('$stringOld', '$stringNew')";
    $conn->query($TmpLogString);
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
