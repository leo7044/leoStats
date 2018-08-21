/* Developer: leo7044 (https://github.com/leo7044) */

function drawTable(_objectToUse, _columns, _TableId)
{
    var ArrayItems = [];
    var ArrayColsAlignRight = [];
    if (_TableId == 'TablePlayerBase')
    {
        for (var i = 0; i < _objectToUse.length; i++)
        {
            var tmpArrayRow = [];
            for (var j = 0; j < _columns.length; j++)
            {
                if (_columns[j] == 'CnCOpt')
                {
                    tmpArrayRow.push('<a href="' + _objectToUse[i][_columns[j]] + '" target="_blank">' + _objectToUse[i]['Name'] + '</a>');
                }
                else if (_columns[j] == 'Rep')
                {
                    tmpArrayRow.push((_objectToUse[i][_columns[j]]).toTimeFormat());
                }
                /*else if (_columns[j] == 'Tib' || _columns[j] == 'Cry' || _columns[j] == 'Pow' || _columns[j] == 'Cre')
                {
                    tmpArrayRow.push(Intl.NumberFormat('en-US').format(parseInt(_objectToUse[i][_columns[j]])));
                }*/
                else
                {
                    tmpArrayRow.push(_objectToUse[i][_columns[j]]);
                }
            }
            ArrayItems.push(tmpArrayRow);
        }
        ArrayColsAlignRight = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12];
    }
    else
    {
        for (var i = 0; i < _objectToUse.length; i++)
        {
            var tmpArrayRow = [];
            for (var j = 0; j < _columns.length; j++)
            {
                tmpArrayRow.push(_objectToUse[i][_columns[j]]);
            }
            ArrayItems.push(tmpArrayRow);
        }
    }
    var table = $('#' + _TableId).data('table');
    table.items = ArrayItems;
    for (var i = 0; i < ArrayColsAlignRight.length; i++)
    {
        table.heads[ArrayColsAlignRight[i]].clsColumn = 'text-right';
    }
    table.draw();
}