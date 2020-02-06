<?php
/* Developer: leo7044 */
header("Access-Control-Allow-Origin: *"); // von einer anderen Website drauf zugreifen
// header("Content-Type: application/json; charset=utf-8"); // JSON-Antwort
include_once('config.php'); // Datenbankanbindung
session_start(); // starten der PHP-Session
// $_post = filter_input_array(INPUT_POST); // es werden nur POST-Variablen akzeptiert, damit nicht mittels Link (get-vars) Anderungen an DB vorgenommen werden können
$_get = filter_input_array(INPUT_GET); // es werden nur GET-Variablen akzeptiert
// $_post = replaceChars($_post);
$_get = replaceChars($_get);
$action = $_post['action'];
$action = $_get['action'];
$UserAnswer = [];
if (!$conn->connect_error)
{
    switch ($action)
    {
        case 'replaceInfoThroughCom':
        {
            $result = $conn->query("SELECT WorldId, ID, CnCOpt FROM bases WHERE CnCOpt LIKE '%http://cncopt.info%';");
            while ($zeile = $result->fetch_assoc())
            {
                $worldId = $zeile['WorldId'];
                $curId = $zeile['ID'];
                $strCncOpt = $zeile['CnCOpt'];
                $strCncOpt = str_replace('cncopt.info', 'cncopt.com', $strCncOpt);
                $strQuery = "UPDATE bases SET CnCOpt='$strCncOpt' WHERE WorldId='$worldId' AND ID='$curId';";
                echo $strQuery;
                $conn->query($strQuery);
            }
            $UserAnswer = [1, 'done'];
            break;
        }
        case 'addFieldsTibAndCry':
        {
            $result = $conn->query("SELECT Id, Layout, PlayerName FROM layouts WHERE (FieldsTib=0 OR FieldsCry=0);");
            while ($zeile = $result->fetch_assoc())
            {
                $curId = $zeile['Id'];
                $curLayout = $zeile['Layout'];
                $curPlayerName = $zeile['PlayerName'];
                $ObjectLayout = json_decode($curLayout);
                $counterTib = 0;
                $counterCry = 0;
                foreach ($ObjectLayout as $keyY => $valueY)
                {
                    foreach ($valueY as $keyX => $valueX)
                    {
                        if ($valueX == 2)
                        {
                            $counterTib++;
                        }
                        else if ($valueX == 1)
                        {
                            $counterCry++;
                        }
                    }
                }
                $strQuery = "UPDATE layouts SET FieldsTib='$counterTib', FieldsCry='$counterCry' WHERE Id='$curId';";
                echo $curPlayerName . ': ' . $strQuery . '<br/>';
                $conn->query($strQuery);
            }
            $UserAnswer = [1, 'done'];
            break;
        }
        case 'resetLayoutIds':
        {
            $strQuery = "SET @counter = 0; UPDATE layouts SET Id=(@counter:=@counter+1) WHERE 1; SELECT @counter + 1 FROM dual;";
            $conn->multi_query($strQuery);
            while ($conn->more_results() && $conn->next_result())
            {
                if ($res = $conn->store_result())
                {
                    $res->free();
                }
            }
            $result = $conn->query("SELECT MAX(Id) AS MaxId FROM layouts;");
            while ($zeile = $result->fetch_assoc())
            {
                $oldId = $zeile['MaxId'];
                $newId = $oldId + 1;
                $strQuery = "ALTER TABLE layouts MODIFY Id int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=$newId;";
                echo $strQuery;
                $conn->query($strQuery);
            }
            $UserAnswer = [1, 'done'];
            break;
        }
        case 'optimizeTables':
        {
            $strQuery = "OPTIMIZE TABLE adminlog, alliance, bases, layouts, login, player, relation_alliance, relation_alliance_share, relation_bases, relation_player, relation_server, substitution;";
            $conn->query($strQuery);
            $UserAnswer = [1, 'done'];
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
    $UserAnswer = [0, 'no database'];
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