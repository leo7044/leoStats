/* Developer: leo7044 (https://github.com/leo7044) */
var OriginalHeads =
{
    "TablePlayerBase": null,
    "TableAllianceMembers": null
};

function drawTable(_arrayToUse, _columns, _TableId, _BoxId)
{
    var ArrayItems = [];
    var ArrayColsAlignRight = [];
    if (_TableId == 'TablePlayerBase')
    {
        var ArrayNumbers = ['Tib', 'Cry', 'Pow', 'Cre'];
        for (var i = 0; i < _arrayToUse.length; i++)
        {
            var tmpArrayRow = [];
            for (var j = 0; j < _columns.length; j++)
            {
                if (_columns[j] == 'Name')
                {
                    tmpArrayRow.push('<a class="own-cursor-pointer" onclick="prepareContentBaseFromTablePlayer(' + _arrayToUse[i]['BaseId'] + ')">' + _arrayToUse[i][_columns[j]] + '</a>');
                }
                else if (_columns[j] == 'CnCOpt')
                {
                    tmpArrayRow.push('<a href="' + _arrayToUse[i][_columns[j]] + '" target="_blank">' + _arrayToUse[i]['Name'] + '</a>');
                }
                else if (_columns[j] == 'Rep')
                {
                    tmpArrayRow.push((_arrayToUse[i][_columns[j]]).toTimeFormat());
                }
                else if (ArrayNumbers.indexOf(_columns[j]) != -1)
                {
                    tmpArrayRow.push(parseInt(_arrayToUse[i][_columns[j]]).toLocaleString('de-DE'));
                }
                else
                {
                    tmpArrayRow.push(_arrayToUse[i][_columns[j]]);
                }
            }
            ArrayItems.push(tmpArrayRow);
        }
        ArrayColsAlignRight = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12];
    }
    else if (_TableId == 'TableAllianceMembers')
    {
        var ArrayNumbers = ['ScorePoints', 'OverallRank', 'GesamtTiberium', 'GesamtCrystal', 'GesamtPower', 'GesamtCredits', 'ResearchPoints', 'Credits', 'Shoot', 'PvP', 'PvE', 'CPMax', 'CPCur', 'Funds'];
        for (var i = 0; i < _arrayToUse.length; i++)
        {
            var tmpArrayRow = [];
            for (var j = 0; j < _columns.length; j++)
            {
                if (_columns[j] == 'UserName')
                {
                    tmpArrayRow.push('<a class="own-cursor-pointer" onclick="prepareContentPlayerFromTableAlliance(' + _arrayToUse[i]['AccountId'] + ')">' + _arrayToUse[i][_columns[j]] + '</a>');
                }
                else if (_columns[j] == 'Faction')
                {
                    tmpArrayRow.push('<img src="img/faction_' + _arrayToUse[i][_columns[j]] + '.png" width="20px" height="20px"></img>');
                }
                else if (_columns[j] == 'RepMax')
                {
                    tmpArrayRow.push((_arrayToUse[i][_columns[j]]).toTimeFormat());
                }
                else if (_columns[j] == 'PlayerNameGet')
                {
                    if (_arrayToUse[i]['PlayerNameGet'] && parseInt(_arrayToUse[i]['active']))
                    {
                        tmpArrayRow.push('<b><font color="#009900">' + _arrayToUse[i][_columns[j]] + '</font></b>');
                    }
                    else if (_arrayToUse[i]['PlayerNameGet'])
                    {
                        tmpArrayRow.push('<b>' + _arrayToUse[i][_columns[j]] + '</b>');
                    }
                    else
                    {
                        tmpArrayRow.push('<b><font color="red">None</font></b>');
                    }
                }
                else if (ArrayNumbers.indexOf(_columns[j]) != -1)
                {
                    tmpArrayRow.push(parseInt(_arrayToUse[i][_columns[j]]).toLocaleString('de-DE'));
                }
                else
                {
                    tmpArrayRow.push(_arrayToUse[i][_columns[j]]);
                }
            }
            ArrayItems.push(tmpArrayRow);
        }
        ArrayColsAlignRight = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    }
    /*else
    {
        for (var i = 0; i < _arrayToUse.length; i++)
        {
            var tmpArrayRow = [];
            for (var j = 0; j < _columns.length; j++)
            {
                tmpArrayRow.push(_arrayToUse[i][_columns[j]]);
            }
            ArrayItems.push(tmpArrayRow);
        }
    }*/
    // begin: throw not wanted columns out
    ArrayBoxChecked = [];
    for (var i = 0; i < $('#' + _BoxId).children('.checkbox').length; i++)
    {
        var boxIsChecked = $('#' + _BoxId).children('.checkbox')[i].children[0].checked;
        if (boxIsChecked)
        {
            ArrayBoxChecked.push(i);
        }
    }
    for (var i = 0; i < ArrayItems.length; i++)
    {
        for (var j = ArrayItems[i].length - 1; j >= 0; j--)
        {
            if (ArrayBoxChecked.indexOf(j) == -1)
            {
                ArrayItems[i].splice(j, 1);
            }
        }
    }
    // end: throw not wanted columns out
    var table = $('#' + _TableId).data('table');
    table.items = ArrayItems;
    if (OriginalHeads[_TableId] == null)
    {
        for (var i = 0; i < ArrayColsAlignRight.length; i++)
        {
            table.heads[ArrayColsAlignRight[i]].clsColumn = 'text-right';
        }
        OriginalHeads[_TableId] = table.heads;
    }
    var tmpObjectHeads = OriginalHeads[_TableId].clone();
    for (var i = tmpObjectHeads.length - 1; i >= 0; i--)
    {
        if (ArrayBoxChecked.indexOf(i) == -1)
        {
            tmpObjectHeads.splice(i, 1);
        }
    }
    table.heads = tmpObjectHeads;
    table.resetView();
}

function drawTableAdminLog(_arrayToUse, _columns, _TableId)
{
    var ArrayColsAlignRight = [0, 4];
    var ArrayItems = [];
    var table = $('#' + _TableId).data('table');
    for (var i = 0; i < _arrayToUse.length; i++)
    {
        var tmpArrayRow = [];
        for (var j = 0; j < _columns.length; j++)
        {
            if (_columns[j] == 'ID')
            {
                tmpArrayRow.push(parseInt(_arrayToUse[i][_columns[j]]).toLocaleString('de-DE'));
            }
            else if (_columns[j] == 'Delete')
            {
                tmpArrayRow.push(
                    '<button class="button light" onclick="deleteElementAdminLog(\'' + _arrayToUse[i].ID + '\')">' +
                        '<font color="#FF0000;">' +
                            '<i class="fas fa-times"></i>' +
                        '</font>' +
                    '</button>'
                );
            }
            else
            {
                tmpArrayRow.push(_arrayToUse[i][_columns[j]]);
            }
        }
        ArrayItems.push(tmpArrayRow);
    }
    for (var i = 0; i < ArrayColsAlignRight.length; i++)
    {
        table.heads[ArrayColsAlignRight[i]].clsColumn = 'text-right';
    }
    table.items = ArrayItems;
    table.draw();
}

function prepareContentPlayerFromTableAlliance(_AccountId)
{
    var DropDownListPlayer = $('#DropDownListPlayer').data('select');
    DropDownListPlayer.val(_AccountId);
    $('#TabPlayerBase').click();
}

function prepareContentBaseFromTablePlayer(_BaseId)
{
    var DropDownListBase = $('#DropDownListBase').data('select');
    DropDownListBase.val(_BaseId);
    $('#TabBase').click();
}