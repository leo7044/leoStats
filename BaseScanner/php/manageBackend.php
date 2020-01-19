<?php
/* Developer: leo7044 (https://github.com/leo7044) */
header("Access-Control-Allow-Origin: *"); // von einer anderen Website drauf zugreifen
header("Content-Type: application/json; charset=utf-8"); // JSON-Antwort
include_once('../../php/config.php'); // Datenbankanbindung
session_start(); // starten der PHP-Session
$_post = filter_input_array(INPUT_POST); // es werden nur POST-Variablen akzeptiert, damit nicht mittels Link (get-vars) Anderungen an DB vorgenommen werden können
$_post = replaceChars($_post);
$action = $_post['action'];
$UserAnswer = [];
if (!$conn->connect_error)
{
    switch ($action)
    {
        case 'sendDataFromInGame':
        {
            $strQueryLayouts = "INSERT INTO layouts (WorldId, Zeit, PlayerName, PosX, PosY, Layout, CncOpt, Tiberium6, Tiberium5, Tiberium4, Tiberium3, Tiberium2, Tiberium1, Crystal6, Crystal5, Crystal4, Crystal3, Crystal2, Crystal1, Mixed6, Mixed5, Mixed4, Mixed3, Mixed2, Mixed1, Power8, Power7, Power6, Power5, Power4, Power3, Power2) VALUES ";
            $WorldId = $_post['WorldId'];
            $PlayerName = $_post['PlayerName'];
            $ObjectData = $_post['ObjectData'];
            foreach ($ObjectData as $key => $value)
            {
                $Zeit = date('Y-m-d H-i-s', intval($value['Zeit'] /= 1000));
                $PosX = $value['PosX'];
                $PosY = $value['PosY'];
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
                        $letterforCncOpt = '.';
                        if ($arrayLayoutCol == '1')
                        {
                            $letterforCncOpt = 'c';
                        }
                        else if ($arrayLayoutCol == '2')
                        {
                            $letterforCncOpt = 't';
                        }
                        $strCncOpt .= $letterforCncOpt;
                    }
                }
                $strCncOpt .= '............................................................................................................|newEconomy';
                if ($key != count($ObjectData) - 1)
                {
                    $strQueryLayouts .= "('$WorldId', '$Zeit', '$PlayerName', '$PosX', '$PosY', '$Layout', '$strCncOpt', '$Tiberium6', '$Tiberium5', '$Tiberium4', '$Tiberium3', '$Tiberium2', '$Tiberium1', '$Crystal6', '$Crystal5', '$Crystal4', '$Crystal3', '$Crystal2', '$Crystal1', '$Mixed6', '$Mixed5', '$Mixed4', '$Mixed3', '$Mixed2', '$Mixed1', '$Power8', '$Power7', '$Power6', '$Power5', '$Power4', '$Power3', '$Power2'),";
                }
                else
                {
                    $strQueryLayouts .= "('$WorldId', '$Zeit', '$PlayerName', '$PosX', '$PosY', '$Layout', '$strCncOpt', '$Tiberium6', '$Tiberium5', '$Tiberium4', '$Tiberium3', '$Tiberium2', '$Tiberium1', '$Crystal6', '$Crystal5', '$Crystal4', '$Crystal3', '$Crystal2', '$Crystal1', '$Mixed6', '$Mixed5', '$Mixed4', '$Mixed3', '$Mixed2', '$Mixed1', '$Power8', '$Power7', '$Power6', '$Power5', '$Power4', '$Power3', '$Power2')";
                }
            }
            $strQueryLayouts .= " ON DUPLICATE KEY UPDATE Zeit = VALUES(Zeit), PlayerName = VALUES(PlayerName), Layout = VALUES(Layout), CncOpt = VALUES(CncOpt), Tiberium6 = VALUES(Tiberium6), Tiberium5 = VALUES(Tiberium5), Tiberium4 = VALUES(Tiberium4), Tiberium3 = VALUES(Tiberium3), Tiberium2 = VALUES(Tiberium2), Crystal6 = VALUES(Crystal6), Crystal5 = VALUES(Crystal5), Crystal4 = VALUES(Crystal4), Crystal3 = VALUES(Crystal3), Crystal2 = VALUES(Crystal2), Mixed6 = VALUES(Mixed6), Mixed5 = VALUES(Mixed5), Mixed4 = VALUES(Mixed4), Mixed3 = VALUES(Mixed3), Mixed2 = VALUES(Mixed2), Power8 = VALUES(Power8), Power7 = VALUES(Power7), Power6 = VALUES(Power6), Power5 = VALUES(Power5), Power4 = VALUES(Power4), Power3 = VALUES(Power3), Power2 = VALUES(Power2);";
            $conn->multi_query($strQueryLayouts);
            $UserAnswer = [1, 'BaseScanner-Data successfull transmitted'];
            break;
        }
        case 'getLayoutsByWorldIdAndProcedureName':
        {
            /*$UserNamesAllowed =
            [
                'kOeGy', '0__Bio__0', 'MoonGuide', 'Uncle_J00', 'Mediv88', 'Techzhen', 'Kellut', 'effe3005', 'Xx_YEP_xX', 'RolSei', 'LeichenSack', 'Enni_2013', 'KaptainKanalie', 'Takman1979', 'tomwi_74', 'PITTY0203', 'SKEET0980', 'Daikyu80', 'Kaiser30', 'Mattse1977', 'lulupincky', 'saintsviewer', 'guppa123', 'ElDiago1405', 'chris19641964', 'EmperorFS30', 'willi19820723', 'condorsc13', 'I_Prestige_I', 'lvivjanyn1', 'nuubal', 'chertosha', 'SirPushAlot', 'Clix17', 'derstony23', 'kommerizialrat', 'maxweeds', '2208frank', 'Eichenhorst', 'pad3000', 'SUN_FCH_65', 'MICHELANGELLLO', 'qhoststylx', 'smOOter', 'xPrimeAlex', 'VaderRS4', 'Illuminationist2', 'LucifersWife666', 'Krumbeer', 'masterppc88',
                'maecki13', 'Psychosisti', 'vivida00', 'sasa26111984', 'viajes1969', '2201777', 'VanillaDaKilla', 'Pinzga76', 'Nacht-Eagle', 'chip4711', 'xGhosti66x', 'Basstronaut-88', 'iCr0NiiX', 'saebel74', 'Odinthoor', 'venga6', 'Conan1278', 'FerdinandMAX', 'daybumbum', 'stortebeker', 'LuckyIce1', 'dartrokker', 'Weip', 'CptApolloAdama', 'wolf200467', 'HAUDEGEN-BS01', 'striegler1', 'moori64', 'Findus1204', 'GEIL_Piccolo81', 'Father19691', 'Borg9876', 'Schiewawa', 'niCo_Bjk', 'Chucky130179', 'Spawnkiel', 'buktop1977', 'Krossfire68', 'Fusshocker', 'mersejens', 'E1drago', 'LEOxxxxx', 'Gaertner73', 'maodis', 'FelsnamroN', 'ScottBrannen', 'X-LiViNg--TaNk-X', 'DonRapa', 'xenergy27', 'Blackline20',
                'Kati806', 'waylander586', 'Borsch1978', 'Ospe3', 'EvilCom11', 'gaytiger', 'Lurido23', 'Killroy05', 'dummdidummdi', 'Voyager135', 'kykmnfluit', 'ErzengelRaphaela', 'popivoda1967', 'Nuttenpapa', '17blakeks', '1900liverpool', 'xFatherbullx', 'Roofdeert', 'thund99', 'Meister1Joda', 'DBF4b14n', 'deejaydanijel', 'Pat_FSK', 'DemisRussos', 'HaYaDa', 'KUME71dd', '9snake8', 'commanderic', 'Battadom', 'xp10theo', 'Schnuffii66', 'Devil2691', 'InDianaJones-x-x', 'LordofForge', 'Sandman2503', 'Kaos4712', 'RedSebbi', 'SunTzu1109', 'Pumababy1963', 'Madbeatings', 'braunfelserpc', 'RealSyndic', 'Ignitedfury', 'majiorpain', 'Nachtwanderer1', 'ertoja_01', 'xSokar', '0qHPp0',
                'DrBiwater', 'doctor_no_z', 'meggy6', 'TomDickenz', 'didsteel', 'Jofikat', 'grosseronkel1', 'HardestFighter', 'hanskanns78', 'rodeons', 'pkobow', '1ebb', 'rudolfosson', 'jetbomb2', 'bandishu', 'Dubloyr', 'kailichen', 'tannenblatt', 'LegolasX69', 'saibot46', 'MostDeath', 'xGraysonDeathx', 'Schneckenfloh', 'CommandTom2', 'Dark-Tiger90', 'HitChatcher', 'Tulloch3', 'digiconcept', 'Bliporama', 'gsgandhi', 'Devil-Sunstorm', 'panzfredy', 'Drobao', 'sine_faciem_tuam', 'Askari2525', 'Obi_Wahn0706', 'Lollo2012', 'LSMPort555', 'takacy2016', 'xX-S1mple-Xx', 'Kapt_Chaos1337', '1895FortunaDUS', 'MercedesGT', 'IIDevilOfDeathII', 'Keksi75', 'jarzihao', 'Schippi1977',
                'ouiouilol', 'KarlLaschnikoff', 'flash351', '06295160571', '88Horn', 'nh2712', 'Sral214', 'Typischjunx1', 'AzEruS128', 'zanoni1', 'janniselias', 'rodzloeffl', 'commandcharly', 'LegolasSun', 'RangerLuke', 'UKM17', 'VampirHamburg', 'AmigoII', 'MAMOUTH82', 'leo7044', 'Illuminationist', 'chemnitzer72', 'shinthegamer', 'achim56de', 'Fynn1966', 'broesel1976', 'brummi2011', 'MasterSYR', 'Winneworm', 'JHONE7', '19Asterix68', 'Nordstadtbube', 'herbertap', 'singlemaltII', 'rabauke11', 'lupoma1996', 'Flopwnz', 'Takar02', 'higgs122', 'michaelschmitt27', 'oernycoco', '7561894563917', 'alexs5', 'winter238', 'Xx-John59-xX', 'Creato1', 'nostradamus1188', 'callmerockstar2'
                //'leo7044'
            ];*/
            if (isset($_SESSION['leoStats_UserName']))
            {
                /*if (in_array($_SESSION['leoStats_UserName'], $UserNamesAllowed))
                {*/
                    $worldId = $_post['worldId'];
                    $procedureName = $_post['procedureName'];
                    $minX = $_post['minX'];
                    $maxX = $_post['maxX'];
                    $minY = $_post['minY'];
                    $maxY = $_post['maxY'];
                    $MinDate = $_post['MinDate'];
                    $PlayerName = $_post['PlayerName'];
                    $sqlQuery = "CALL $procedureName($worldId, $minX, $maxX, $minY, $maxY, '$MinDate', '$PlayerName');";
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
            if (isset($_SESSION['leoStats_UserName']))
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
    $UserAnswer = [0, 'no Database'];
}
echo json_encode($UserAnswer);

// ersetzt Sonderzeichen (für schreiben in DB)
function replaceChars($str)
{
	$str = str_replace("\\", "&#92;", $str); // Backslash
	$str = str_replace("'", "&#39;", $str); // einfaches Anführungszeichen
	$str = str_replace("`", "&#96;", $str); // schräges eInfaches Anführungszeichen links (gravis)
	return $str;
}
?>