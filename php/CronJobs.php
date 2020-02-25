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
// $action = $_post['action'];
$action = $_get['action'];
$UserAnswer = [];
if (!$conn->connect_error)
{
    switch ($action)
    {
        case 'activeCronJobs':
        {
            // array_push($UserAnswer, replaceInfoThroughCom($conn));
            array_push($UserAnswer, addFieldsTibAndCry($conn));
            array_push($UserAnswer, replaceNullThroughEmptyString($conn));
            // array_push($UserAnswer, fillMissingLvLDefInTablePlayer($conn));
            // array_push($UserAnswer, updateWrongLvLOffInTablePlayer($conn));
            array_push($UserAnswer, optimizeTables($conn));
            break;
        }
        case 'replaceInfoThroughCom':
        {
            $UserAnswer = replaceInfoThroughCom($conn);
            break;
        }
        case 'addFieldsTibAndCry':
        {
            $UserAnswer = addFieldsTibAndCry($conn);
            break;
        }
        case 'replaceNullThroughEmptyString':
        {
            $UserAnswer = replaceNullThroughEmptyString($conn);
            break;
        }
        case 'fillMissingLvLDefInTablePlayer':
        {
            $UserAnswer = fillMissingLvLDefInTablePlayer($conn);
            break;
        }
        case 'updateWrongLvLOffInTablePlayer':
        {
            $UserAnswer = updateWrongLvLOffInTablePlayer($conn);
            break;
        }
        case 'optimizeTables':
        {
            $UserAnswer = optimizeTables($conn);
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

function replaceInfoThroughCom($conn)
{
    $result = $conn->query("SELECT WorldId, BaseId, CnCOpt FROM bases WHERE CnCOpt LIKE '%http://cncopt.info%';");
    while ($zeile = $result->fetch_assoc())
    {
        $worldId = $zeile['WorldId'];
        $curId = $zeile['BaseId'];
        $strCncOpt = $zeile['CnCOpt'];
        $strCncOpt = str_replace('cncopt.info', 'cncopt.com', $strCncOpt);
        $strQuery = "UPDATE bases SET CnCOpt='$strCncOpt' WHERE WorldId='$worldId' AND BaseId='$curId';";
        echo $strQuery;
        $conn->query($strQuery);
    }
    return [1, 'done'];
}

function addFieldsTibAndCry($conn)
{
    $result = $conn->query("SELECT WorldId, PosX, PosY, Layout, PlayerName FROM layouts WHERE (FieldsTib=0 OR FieldsCry=0);");
    while ($zeile = $result->fetch_assoc())
    {
        $WorldId = $zeile['WorldId'];
        $PosX = $zeile['PosX'];
        $PosY = $zeile['PosY'];
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
        $strQuery = "UPDATE layouts SET FieldsTib='$counterTib', FieldsCry='$counterCry' WHERE WorldId='$WorldId' AND PosX='$PosX' AND PosY='$PosY';";
        echo $curPlayerName . ': ' . $strQuery . '<br/>';
        $conn->query($strQuery);
    }
    return [1, 'done'];
}

function replaceNullThroughEmptyString($conn)
{
    $strQuery = "SELECT WorldId, PosX, PosY, Layout, PlayerName FROM layouts WHERE Layout LIKE '%null%';";
    $result = $conn->query($strQuery);
    while ($zeile = $result->fetch_assoc())
    {
        $WorldId = $zeile['WorldId'];
        $PosX = $zeile['PosX'];
        $PosY = $zeile['PosY'];
        $curLayout = $zeile['Layout'];
        $curPlayerName = $zeile['PlayerName'];
        $strLayout = str_replace('null', '""', $curLayout);
        $strQueryUpdate = "UPDATE layouts SET Layout='$strLayout' WHERE WorldId='$WorldId' AND PosX='$PosX' AND PosY='$PosY';";
        echo $curPlayerName . ': ' . $strQueryUpdate . '<br/>';
        $conn->query($strQueryUpdate);
    }
    return [1, 'done'];
}

function fillMissingLvLDefInTablePlayer($conn)
{
    $strQuery = "SELECT ba.Zeit, ba.WorldId, b.AccountId, ba.LvLDef FROM bases ba
    JOIN relation_bases b ON b.WorldId=ba.WorldId AND b.BaseId=ba.BaseId
    WHERE ba.BaseId=
    (
        SELECT ba2.BaseId FROM bases ba2
        JOIN relation_bases b2 ON b2.WorldId=ba2.WorldId AND b2.BaseId=ba2.BaseId
        WHERE ba2.Zeit=ba.Zeit AND ba2.WorldId=ba.WorldId AND b2.AccountId=b.AccountId
        ORDER BY ba2.LvLDef DESC, ba2.BaseId ASC LIMIT 1
    )
    AND ba.LvLDef=0
    ORDER BY ba.Zeit ASC, ba.WorldId ASC, b.AccountId ASC;";
    $result = $conn->query($strQuery);
    while ($zeile = $result->fetch_assoc())
    {
        $Zeit = $zeile['Zeit'];
        $WorldId = $zeile['WorldId'];
        $AccountId = $zeile['AccountId'];
        $LvLDef = $zeile['LvLDef'];
        $strQueryUpdate = "UPDATE player SET LvLDef='$LvLDef' WHERE Zeit='$Zeit' AND WorldId='$WorldId' AND AccountId='$AccountId';";
        echo $strQueryUpdate . '<br/>';
        $conn->query($strQueryUpdate);
    }
    return [1, 'done'];
}

function updateWrongLvLOffInTablePlayer($conn)
{
    $strQuery = "SELECT ba.Zeit, ba.WorldId, b.AccountId, ba.LvLOff FROM bases ba
        JOIN relation_bases b ON b.WorldId=ba.WorldId AND b.BaseId=ba.BaseId
        WHERE ba.BaseId=
        (
            SELECT ba2.BaseId FROM bases ba2
            JOIN relation_bases b2 ON b2.WorldId=ba2.WorldId AND b2.BaseId=ba2.BaseId
            WHERE ba2.Zeit=ba.Zeit AND ba2.WorldId=ba.WorldId AND b2.AccountId=b.AccountId
            ORDER BY ba2.LvLOff DESC, ba2.BaseId ASC LIMIT 1
        )
        ORDER BY ba.Zeit ASC, ba.WorldId ASC, b.AccountId ASC;";
    $result = $conn->query($strQuery);
    while ($zeile = $result->fetch_assoc())
    {
        $Zeit = $zeile['Zeit'];
        $WorldId = $zeile['WorldId'];
        $AccountId = $zeile['AccountId'];
        $LvLOff = $zeile['LvLOff'];
        $strQueryUpdate = "UPDATE player SET LvLOff='$LvLOff' WHERE Zeit='$Zeit' AND WorldId='$WorldId' AND AccountId='$AccountId';";
        echo $strQueryUpdate . '<br/>';
        $conn->query($strQueryUpdate);
    }
    return [1, 'done'];
}

function optimizeTables($conn)
{
    $strQuery = "OPTIMIZE TABLE adminlog, alliance, bases, layouts, login, player, relation_alliance, relation_alliance_share, relation_bases, relation_player, relation_server, reports, substitution;";
    $conn->query($strQuery);
    return [1, 'done'];
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