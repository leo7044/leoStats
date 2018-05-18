var strCncOpt = 'http://cncopt.com/?map=3|N|N|AgainABase|30p30p31p31p31p30p30p30p30y30p42acc39ac38at.30p30p31p31p32p32p32p30p30p.t.t34acc42a30p...t30p31p32p31p30p.c..34a30p42ac30a...t30p30p30p30p30p......30q.31e30m30m30m30m30m30m30m30mh.30m30m30m30m30m30m30m30m.kk30mk30m30m30mhh.....30m30m30m.ll...30m30mlk...hh.30m30m..j....30m30mh.j.kk.30ml.31r31r31r31r31r31r31r31r.31l31l31l31l31l31l31l31l..................|5800000|7200000|7200000|164|168|156|164|newEconomy';
var arrayCncOpt = strCncOpt.split('|');
var strBuildings = arrayCncOpt[4]
var arrBuildings = $.grep(strBuildings.replace(/\./g, "|.|").replace(/([a-z])/g, function(n){return n + '|'}).replace(/\|\|/g, '|').split('|'), function(n){return n;});
var x = 0;
var y = 0;
var arrBase = [[]];
for (var key in arrBuildings)
{
	arrBase[y][x] = arrBuildings[key].replace(/[a-z|\.]/g, function(n){return '|' + n}).split('|');
	x++;
	if (x % 9 == 0)
	{
		x = 0;
		y++;
		if (key != arrBuildings.length - 1)
		{
			arrBase[y] = [];
		}
	}
}