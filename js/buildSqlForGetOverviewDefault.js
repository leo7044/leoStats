var strQuery = 'SELECT ';
var maxLevel = 82;
for (var i = 0; i <= maxLevel; i++)
{
    strQuery += 'SUM(CASE WHEN ba.LvLBase BETWEEN ' + i + ' AND ' + i + '.99 THEN 1 ELSE 0 END) AS LvLBase' + i + ',\n';
    strQuery += 'SUM(CASE WHEN ba.LvLOff BETWEEN ' + i + ' AND ' + i + '.99 THEN 1 ELSE 0 END) AS LvLOff' + i + ',\n';
    strQuery += 'SUM(CASE WHEN ba.LvLDef BETWEEN ' + i + ' AND ' + i + '.99 THEN 1 ELSE 0 END) AS LvLDef' + i + ',\n';
    strQuery += 'SUM(CASE WHEN ba.LvLSup=' + i + ' THEN 1 ELSE 0 END) AS LvLSup' + i + ',\n';
}
strQuery = strQuery.substr(0, strQuery.length - 2) + '\n';
strQuery += 'FROM relation_bases b JOIN relation_alliance a ON a.WorldId=b.WorldId\n';
strQuery += 'JOIN relation_player p ON p.WorldId=b.WorldId and p.AllianceId=a.AllianceId AND p.AccountId=b.AccountId\n';
strQuery += 'JOIN bases ba ON ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId\n';
strQuery += 'AND ba.Zeit=';
strQuery += '(SELECT ba.Zeit FROM bases ba WHERE ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId ORDER BY ba.Zeit DESC LIMIT 1)\n';
strQuery += 'WHERE b.WorldId=320;';