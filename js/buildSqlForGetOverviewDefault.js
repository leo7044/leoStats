var strQuery = 'SELECT ';
for (var i = 0; i <= 81; i++)
{
    strQuery += 'SUM(CASE WHEN ba.LvLOff BETWEEN ' + i + ' AND ' + i + '.99 THEN 1 ELSE 0 END) AS LvLOff' + i + ',\n';
}
strQuery += 'SUM(CASE WHEN ba.LvLOff BETWEEN 82 AND 82.99 THEN 1 ELSE 0 END) AS LvLOff82\n';
strQuery += 'FROM relation_bases b JOIN relation_alliance a ON a.WorldId=b.WorldId\n';
strQuery += 'JOIN relation_player p ON p.WorldId=b.WorldId and p.AllianceId=a.AllianceId AND p.AccountId=b.AccountId\n';
strQuery += 'JOIN bases ba ON ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId\n';
strQuery += 'AND ba.Zeit=';
strQuery += '(SELECT ba.Zeit FROM bases ba WHERE ba.WorldId=b.WorldId AND ba.BaseId=b.BaseId ORDER BY ba.Zeit DESC LIMIT 1)\n';
strQuery += 'WHERE b.WorldId=320;';