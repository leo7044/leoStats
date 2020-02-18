/* Developer: leo7044 (https://github.com/leo7044) */
var ObjectSessionVariables = null;
var ArraySeasonServerIds = null;
// DropDown
var ArrayDropDownListData = null;
var ArrayDropDownDefaultOwn = null;
var ObjectNeededMemberRoles = {};
// Tabs
var ObjectPlayerData = {};
var ObjectPlayerBaseData = {};
var ObjectAlliancePlayerData = {};
var ObjectAllianceData = {};
var ObjectAllianceBaseData = {};
var ObjectAllianceOverviewData = {};
var ObjectBaseData = {};
var ObjectWorldOverviewData = {};
// DiagramData
var ObjectDiagramData = {};
var indexWorldId = 0;
var ArrayAdminLog = null;
var ObjectCncOptPics =
{ // Link:
    // https://eaassets-a.akamaihd.net/cncalliancesgame/cdn/data/*.png
    // https://up.picr.de/*.png
    "1":
    { // GDI
        "build":
        {
            "a": "bed291af87f3df1debd710bceb93339b",
            "b": "7fffa929ca0e9638af471e7a253a48f0",
            "c": "5425f9b3b2c406e1517d1bf3daaa1b80",
            "d": "5030a7b96710ace8403d93bc4be3cb0a",
            "e": "ff511429bde455769635de5c8c0331ba",
            "f": "63c4221b2884a410478e42ae891c9edf",
            "h": "",
            "i": "8a1f3c4733a038c05390deb2efb254f7",
            "n": "",
            "p": "45ee74e3da3af2cb20d3fa8507dddd77",
            "q": "068e7c9d022c4760d9c14b7caa26b31f",
            "r": "96a293c753b08a31f29cdd75691330d3",
            "s": "a222bf5074076084bb930a242423c324",
            "t": "4bc5605149c6f6330630e31706b2975d",
            "w": "6445fff4b183a735ca5028eeade06dca",
            "x": "48d1286bac495eb7fb1cee71a3c1a172",
            "y": "064f39ada6c95ed8a60c12c0ee53032d",
            "z": "e1cb3016a04055a51378f6bbbee09c06"
        },
        "def":
        {
            "a": "c7747482bc35b977f4bc743f9f0e681f",
            "b": "ac1a3216145582cb122ad0444305744a",
            "c": "cc9b27f83c30256c4541f414d5a5eff9",
            "d": "2efe3af60d7ad225a163338a13934eff",
            "e": "ef3699386f7a1a8a189da12fde642bb5",
            "f": "2ce93c21bf26af3eb040379291acfbe7",
            "g": "004559af92de104d638c5e4187ab2f68",
            "h": "d83af3ba4bd3c3cced272d16a714afeb",
            "k": "b78f10062ea7d5e1b621165bc98f9aba",
            "j": "7ecdf5416e6de57831e8e096e8445392",
            "l": "af0f04fa7c5f45d7fe72cc14049c141f",
            "m": "7ca2faeeb34e0bbe267ef985c5e7d47a",
            "p": "af49b884f9b1bf86f6a74c6dba93f70e",
            "q": "4c58dc7231d3db8bf162669b41471394",
            "r": "bc9190a6a17aa8ea380ccf9c6d56270d",
            "s": "c02ec23b12cdc627f2df0b50c7d1bcdd",
            "t": "ac1a3216145582cb122ad0444305744a",
            "w": "073528f52ec8cabaf5921a0d9a7da2eb",
            "z": "0de460bca1916337a234fc05e9984b28"
        },
        "off":
        {
            "a": "3aec54985dcbf4b45ff84e1289d46a93",
            "c": "9d0c409eb58a5fb8247cf6882fd31bfa",
            "d": "fd4ffe3334d171c8d960d32fc9e05f80",
            "f": "ecceb58e0ca3f150d85cb224bc345b9f",
            "g": "004559af92de104d638c5e4187ab2f68",
            "j": "aa4f4158569b0bd5255b1471f57a8a2c",
            "k": "d96466153f645ba08707553b700869a2",
            "m": "fe4e67d1d787bae0afb88625545f28a2",
            "o": "42842f77387dbf0be9a0da05d09ea2e7",
            "p": "3ca40f1ad54544ca6cc5b8053b09bfa3",
            "q": "4c58dc7231d3db8bf162669b41471394",
            "r": "b1c0d437f5be0deb9d8ec30d064596c5",
            "s": "c02ec23b12cdc627f2df0b50c7d1bcdd",
            "z": "0de460bca1916337a234fc05e9984b28"
        }
    },
    "2":
    { // NOD
        "build":
        {
            "a": "fd45303e6de92356ff2631f0d89b18c6",
            "b": "1f57aad9607fd714d869d56a2dd06f21",
            "c": "5425f9b3b2c406e1517d1bf3daaa1b80",
            "d": "68689144e5d27c3f5bd9be5078bebce8",
            "e": "7b6edd4d58121a564fd702d152f89011",
            "f": "4451b3a877eeee0e5b1c2a7a5d357b7e",
            "h": "",
            "i": "a46088f246aaedde74f7e6c0dd902a7a",
            "n": "",
            "p": "30c77e68b4e50d9633f969835afc84ec",
            "q": "a0f7eaeb290b20f4dcba75289f9ee429",
            "r": "6c8ee0f7603c621bbaef0e4b6563313e",
            "s": "1ab36789d1dfbf749ddf7ffd9b013dbf",
            "t": "4bc5605149c6f6330630e31706b2975d",
            "w": "f6a0bb2a70d8b05e4cb4db827d9050a4",
            "x": "370675edbcf691b67e1ae874e6efb783",
            "y": "1124d44ed88596a9bf3025250665c218",
            "z": "1f06c9c71a46c1902ff6a91dffed99e0"
        },
        "def":
        {
            "a": "97d5f7a66d9baa65453c2b142eeae3a4",
            "b": "c45676344ea89bc56b291fe6216579a2",
            "c": "5393c7f1282d25cba597e13ad634f1f7",
            "d": "b97c04e08be8d479d54b3ca8262b0e2a",
            "e": "5ee5c7b61f713dbde4602c998ed5e473",
            "f": "53a600e31563975d611a7b5049fe9827",
            "g": "ac5b7596bab3d1b919d7ec9d569f3cb4",
            "h": "d83af3ba4bd3c3cced272d16a714afeb",
            "k": "b78f10062ea7d5e1b621165bc98f9aba",
            "j": "7ecdf5416e6de57831e8e096e8445392",
            "l": "af0f04fa7c5f45d7fe72cc14049c141f",
            "m": "d437cd22189d1c676c016de17170d2e9",
            "p": "e022847fb155ce802c1e38a4cc627ee7",
            "q": "939e53aef324e39bb0048b2c3dfb7988",
            "r": "fb872bf7567447e2ca99eb27c67db685",
            "s": "32eacc57fb7197ec96058a39c8d10aa2",
            "t": "0c7e2d6bf5410cd368020bfb5106a84c",
            "w": "7b144c4394665390eff687baad9bd01a",
            "z": "1d76141c36ce7fb5d9b058481e5265fc"
        },
        "off":
        {
            "a": "88cf8ac7cfb2fdddb9f2acf70f22f1c1",
            "b": "e022847fb155ce802c1e38a4cc627ee7",
            "c": "e1e461f40c3611626243a516ac420fdf",
            "k": "ac5b7596bab3d1b919d7ec9d569f3cb4",
            "l": "c95af3da04ac7a0a490090498c90630d",
            "m": "0a5ea3cdf78d1b773fd97e827b34376e",
            "o": "b97c04e08be8d479d54b3ca8262b0e2a",
            "p": "9910093e404ebf00259ac356609a0943",
            "q": "939e53aef324e39bb0048b2c3dfb7988",
            "r": "7836069122aac3e22c5b7fba07761274",
            "s": "32eacc57fb7197ec96058a39c8d10aa2",
            "t": "77316566179c7cab19bb6546f1389deb",
            "v": "2a9522cbdb67b87d96443ec38ee0cdb9",
            "z": "1d76141c36ce7fb5d9b058481e5265fc"
        }
    }
};

$(document).ready(function()
{
    initializeStart();
});

function getLoginStatus()
{
    var data =
    {
        action: "getLoginStatus"
    };
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', data)
    .always(function(data)
    {
        if (!data[0])
        {
            location.href='?logout';
        }
    });
    $.ajaxSetup({async: true});
}

function initializeStart()
{
    getSessionVariables();
    getSeasonServerIds();
    getDropDownListData();
    prepareandFillDropDownListDataWorld();
    if (getCookie('TabId'))
    {
        $('#' + getCookie('TabId')).click();
    }
    else
    {
        setCookie('TabId', 'TabPlayer');
    }
}

function getSessionVariables()
{
    var data =
    {
        action: "getSessionVariables"
    };
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', data)
    .always(function(_data)
    {
        if (_data[0])
        {
            ObjectSessionVariables = _data[0];
            if (ObjectSessionVariables.leoStats_IsAdmin)
            {
                $('#LiTabWorldOverview').removeClass('d-none');
            }
        }
        else
        {
            location.href='?logout';
        }
    });
    $.ajaxSetup({async: true});
}

function getSeasonServerIds()
{
    var data =
    {
        action: "getSeasonServerIds"
    };
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', data)
    .always(function(_data)
    {
        if (_data[0])
        {
            ArraySeasonServerIds = _data;
        }
        else
        {
            location.href='?logout';
        }
    });
    $.ajaxSetup({async: true});
}

//==================================================
// Allgemeine Hilfsfunktionen
//==================================================
function countLength(obj)
{
    var count = 0;
    for(var prop in obj)
    {
        if(obj.hasOwnProperty(prop))
        {
            count++;
        }
    }
    return count;
}

String.prototype.toTimeFormat = function()
{
    var secs = parseInt(this);
    var hours   = Math.floor(secs / 3600);
    var minutes = ((0).toString() + Math.floor((secs - (hours * 3600)) / 60)).slice(-2);
    var seconds = ((0).toString() + (secs - (hours * 3600) - (minutes * 60))).slice(-2);
    if (hours < 10)
    {
        hours = '0' + hours
    }
    return hours + ':' + minutes + ':' + seconds;
}

$(window).resize(function()
{
    if($('#TabAlliance.active')[0])
    {
        for (var keyDiagramType in ObjectDiagramData.Alliance)
        {
            drawGoogleChartLine(ObjectDiagramData.Alliance[keyDiagramType][1], ObjectDiagramData.Alliance[keyDiagramType][0]);
        }
    }
    else if ($('#TabBase.active')[0])
    {
        for (var keyDiagramType in ObjectDiagramData.Base)
        {
            drawGoogleChartLine(ObjectDiagramData.Base[keyDiagramType][1], ObjectDiagramData.Base[keyDiagramType][0]);
        }
    }
    else if ($('#TabPlayer.active')[0])
    {
        for (var keyDiagramType in ObjectDiagramData.Player)
        {
            drawGoogleChartLine(ObjectDiagramData.Player[keyDiagramType][1], ObjectDiagramData.Player[keyDiagramType][0]);
        }
    }
    else if ($('#TabAllianceOverview.active')[0])
    {
        for (var keyDiagramType in ObjectDiagramData.OverviewAlliance)
        {
            drawGoogleChartColumn(ObjectDiagramData.OverviewAlliance[keyDiagramType][1], ObjectDiagramData.OverviewAlliance[keyDiagramType][0]);
        }
    }
    else if ($('#TabWorldOverview.active')[0])
    {
        for (var keyDiagramType in ObjectDiagramData.OverviewWorld)
        {
            drawGoogleChartColumn(ObjectDiagramData.OverviewWorld[keyDiagramType][1], ObjectDiagramData.OverviewWorld[keyDiagramType][0]);
        }
    }
});

//==================================================
// manage DropDownLists
//==================================================
function getDropDownListData()
{
    var data =
    {
        action: "getDropDownListData"
    };
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', data)
    .always(function(_data)
    {
        if (_data[0])
        {
            ArrayDropDownListData = _data[0];
            ArrayDropDownDefaultOwn = _data[1];
        }
        else
        {
            location.href='?logout';
        }
    });
    $.ajaxSetup({async: true});
}

function prepareandFillDropDownListDataWorld()
{
    var ArrayDropDownListWorld = alasql('SELECT DISTINCT WorldId, ServerName FROM ?',[ArrayDropDownListData]);
    var strHtml = '';
    for (var key in ArrayDropDownListWorld)
    {
        strHtml += '<option value="' + ArrayDropDownListWorld[key].WorldId + '">' + ArrayDropDownListWorld[key].ServerName + '</option>';
    }
    $('#DropDownListWorld')[0].innerHTML = strHtml;
    if (getCookie('WorldId'))
    {
        $('#DropDownListWorld')[0].value = getCookie('WorldId');
    }
    prepareandFillDropDownListDataAlliance();
}

function prepareandFillDropDownListDataAlliance(_activeChanged)
{
    var WorldId = $('#DropDownListWorld')[0].value;
    $('#TabBaseScanner')[0].href = 'BaseScanner/?WorldId=' + WorldId;
    setCookie('WorldId', WorldId);
    var ArrayDropDownListAlliance = alasql('SELECT DISTINCT AllianceId, AllianceName FROM ? WHERE WorldId="' + WorldId + '"' ,[ArrayDropDownListData]);
    var strHtml = '';
    for (var key in ArrayDropDownListAlliance)
    {
        strHtml += '<option value="' + ArrayDropDownListAlliance[key].AllianceId + '">' + ArrayDropDownListAlliance[key].AllianceName + '</option>';
    }
    $('#DropDownListAlliance')[0].innerHTML = strHtml;
    var AllianceValue = alasql('SELECT DISTINCT AllianceId FROM ? WHERE WorldId="' + WorldId + '"' ,[ArrayDropDownDefaultOwn])[0];
    if (AllianceValue)
    {
        $('#DropDownListAlliance')[0].value = AllianceValue.AllianceId;
    }
    if (_activeChanged)
    {
        prepareandFillDropDownListDataPlayer(_activeChanged);
    }
    else
    {
        if (getCookie('AllianceId'))
        {
            $('#DropDownListAlliance')[0].value = getCookie('AllianceId');
        }
        prepareandFillDropDownListDataPlayer();
    }
    if($('#TabWorldOverview.active')[0])
    {
        manageContentWorldOverview();
    }
}

function prepareandFillDropDownListDataPlayer(_activeChanged)
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    setCookie('AllianceId', AllianceId);
    var ArrayDropDownListPlayer = alasql('SELECT DISTINCT AccountId, UserName FROM ? WHERE WorldId="' + WorldId + '" AND AllianceId="' + AllianceId + '"' ,[ArrayDropDownListData]);
    var strHtml = '';
    for (var key in ArrayDropDownListPlayer)
    {
        strHtml += '<option value="' + ArrayDropDownListPlayer[key].AccountId + '">' + ArrayDropDownListPlayer[key].UserName + '</option>';
    }
    $('#DropDownListPlayer')[0].innerHTML = strHtml;
    var PlayerValue = alasql('SELECT DISTINCT AccountId FROM ? WHERE WorldId="' + WorldId + '" AND AllianceId="' + AllianceId +'"' ,[ArrayDropDownDefaultOwn])[0];
    if (PlayerValue)
    {
        $('#DropDownListPlayer')[0].value = PlayerValue.AccountId;
    }
    if (_activeChanged)
    {
        prepareandFillDropDownListDataBase(_activeChanged);
        resetViewSettingsTabs();
    }
    else
    {
        if (getCookie('AccountId'))
        {
            $('#DropDownListPlayer')[0].value = getCookie('AccountId');
        }
        prepareandFillDropDownListDataBase();
    }
    if($('#TabAllianceMembers.active')[0])
    {
        manageContentAllianceMembers();
    }
    if($('#TabAlliance.active')[0])
    {
        manageContentAlliance();
    }
    if($('#TabAllianceBase.active')[0])
    {
        manageContentAllianceBase();
    }
    if($('#TabAllianceOverview.active')[0])
    {
        manageContentAllianceOverview();
    }
}

function prepareandFillDropDownListDataBase(_activeChanged)
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    var AccountId = $('#DropDownListPlayer')[0].value;
    setCookie('AccountId', AccountId);
    var ArrayDropDownListBase = alasql('SELECT DISTINCT BaseId, BaseName FROM ? WHERE WorldId="' + WorldId + '" AND AllianceId="' + AllianceId + '" AND AccountId="' + AccountId + '"' ,[ArrayDropDownListData]);
    var strHtml = '';
    for (var key in ArrayDropDownListBase)
    {
        strHtml += '<option value="' + ArrayDropDownListBase[key].BaseId + '">' + ArrayDropDownListBase[key].BaseName + '</option>';
    }
    $('#DropDownListBase')[0].innerHTML = strHtml;
    if (_activeChanged)
    {
        HelpFunctionForChangedBase(_activeChanged);
    }
    else
    {
        if (getCookie('BaseId'))
        {
            $('#DropDownListBase')[0].value = getCookie('BaseId');
        }
        HelpFunctionForChangedBase();
    }
    if($('#TabPlayer.active')[0])
    {
        manageContentPlayer();
    }
    if($('#TabPlayerBase.active')[0])
    {
        manageContentPlayerBase();
    }
    if($('#TabSettings.active')[0])
    {
        manageContentSettings();
    }
}

function HelpFunctionForChangedBase()
{
    var BaseId = $('#DropDownListBase')[0].value;
    setCookie('BaseId', BaseId);
    if($('#TabBase.active')[0])
    {
        manageContentBase();
    }
}

function changePlayerWithTableRowOnclick(_AccountId)
{
    $('#DropDownListPlayer')[0].value = _AccountId;
    $('#TabPlayerBase').click();
    prepareandFillDropDownListDataBase(true);
}

function changeBaseWithTableRowOnclick(_BaseId)
{
    $('#DropDownListBase')[0].value = _BaseId;
    $('#TabBase').click();
    HelpFunctionForChangedBase();
}

//==================================================
// Navigation with Tabs
//==================================================
function prepareTabPlayer()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').removeClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    manageContentPlayer();
    setCookie('TabId', 'TabPlayer');
}

function prepareTabPlayerBase()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').removeClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    manageContentPlayerBase();
    setCookie('TabId', 'TabPlayerBase');
}

function prepareTabAllianceMembers()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').addClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    manageContentAllianceMembers();
    setCookie('TabId', 'TabAllianceMembers');
}

function prepareTabAlliance()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').addClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    manageContentAlliance();
    setCookie('TabId', 'TabAlliance');
}

function prepareTabAllianceBase()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').addClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    manageContentAllianceBase();
    setCookie('TabId', 'TabAllianceBase');
}

function prepareTabAllianceOverview()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').addClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    manageContentAllianceOverview();
    setCookie('TabId', 'TabAllianceOverview');
}

function prepareTabBase()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    $('#DivDropDownListPlayer').removeClass('d-none');
    $('#DivDropDownListBase').removeClass('d-none');
    manageContentBase();
    setCookie('TabId', 'TabBase');
}

function prepareTabWorldOverview()
{
    $('#DivDropDownListAlliance').addClass('d-none');
    $('#DivDropDownListPlayer').addClass('d-none');
    $('#DivDropDownListBase').addClass('d-none');
    manageContentWorldOverview();
    setCookie('TabId', 'TabWorldOverview');
}

function prepareTabSettings()
{
    $('#DivDropDownListAlliance').removeClass('d-none');
    if (ObjectSessionVariables.leoStats_IsAdmin)
    {
        $('#DivDropDownListPlayer').removeClass('d-none');
    }
    else
    {
        $('#DivDropDownListPlayer').addClass('d-none');
        // setzt den eigenen Account als ausgewählt, damit im eigenen Spieler rumgefuhrwerkt wird
        // theoretisch ist das egal, aber für die Admin-Verwaltung ist es leichter, wenn auf die AccountId zugegriffen wird des derzeit ausgewählten Spielers
        $('#DropDownListPlayer')[0].value = ObjectSessionVariables.leoStats_AccountId;
    }
    $('#DivDropDownListBase').addClass('d-none');
    manageContentSettings();
    setCookie('TabId', 'TabSettings');
}

function updateCurrentDatasInView()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    var AccountId = $('#DropDownListPlayer')[0].value;
    var BaseId = $('#DropDownListBase')[0].value;
    switch(getCookie('TabId'))
    {
        case 'TabPlayer':
        {
            delete ObjectPlayerData[WorldId + '_' + AccountId];
            manageContentPlayer();
            break;
        }
        case 'TabPlayerBase':
        {
            delete ObjectPlayerBaseData[WorldId + '_' + AccountId];
            manageContentPlayerBase();
            break;
        }
        case 'TabAllianceMembers':
        {
            delete ObjectAlliancePlayerData[WorldId + '_' + AllianceId];
            manageContentAllianceMembers();
            break;
        }
        case 'TabAlliance':
        {
            delete ObjectAllianceData[WorldId + '_' + AllianceId];
            manageContentAlliance();
            break;
        }
        case 'TabAllianceBase':
        {
            delete ObjectAllianceBaseData[WorldId + '_' + AllianceId];
            manageContentAllianceBase();
            break;
        }
        case 'TabAllianceOverview':
        {
            delete ObjectAllianceOverviewData[WorldId + '_' + AllianceId];
            manageContentAllianceOverview();
            break;
        }
        case 'TabBase':
        {
            delete ObjectBaseData[WorldId + '_' + BaseId];
            manageContentBase();
            break;
        }
        case 'TabWorldOverview':
        {
            delete ObjectWorldOverviewData[WorldId.toString()];
            manageContentWorldOverview();
            break;
        }
        default:
        {
            break;
        }
    }
}

//==================================================
// manage ContentOfTabs
//==================================================
function manageContentAllianceMembers()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    // if (!ObjectAlliancePlayerData[WorldId + '_' + AllianceId] || !ObjectAlliancePlayerData[WorldId + '_' + AllianceId][0])
    if (!ObjectAlliancePlayerData[WorldId + '_' + AllianceId])
    {
        var data =
        {
            action: "getAlliancePlayerData",
            WorldId: WorldId,
            AllianceId: AllianceId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(_data)
        {
            if (_data[0])
            {
                ObjectAlliancePlayerData[WorldId + '_' + AllianceId] = _data;
            }
            else
            {
                location.href='?logout';
            }
        });
        $.ajaxSetup({async: true});
    }
    ObjectAlliancePlayerCur = ObjectAlliancePlayerData[WorldId + '_' + AllianceId];
    var strHtml = '';
    for (var key in ObjectAlliancePlayerCur[0])
    {
        if (key != 'AccountId')
        {
            strHtml += '<th class="text-center">' + key + '</th>';
        }
    }
    if (!$('#TableAlliancePlayerTheadTr')[0].innerHTML)
    {
        $('#TableAlliancePlayerTheadTr')[0].innerHTML = strHtml;
    }
    $('#TableAlliancePlayerTheadTr')[0].children[1].style.minWidth = '64px';
    var ArrayAlliancePlayerCurIdsAndNames = [[], []];
    strHtml = '';
    var ArrayExcludedFieldsFromUsNumberFormat = ['UserName', 'Zeit', 'LvLOff', 'LvLDef', 'BaseD', 'OffD', 'DefD', 'DFD', 'SupD'];
    for (var keyPlayer in ObjectAlliancePlayerCur)
    {
        strHtml += '<tr>';
        for (var keyField in ObjectAlliancePlayerCur[keyPlayer])
        {
            if (keyField == 'AccountId')
            {
                ArrayAlliancePlayerCurIdsAndNames[0].push(ObjectAlliancePlayerCur[keyPlayer][keyField]);
                ArrayAlliancePlayerCurIdsAndNames[1].push(ObjectAlliancePlayerCur[keyPlayer]['UserName']);
                delete ObjectAlliancePlayerCur[keyPlayer][keyField];
            }
            else if (keyField == 'RepMax')
            {
                strHtml += '<td>' + ObjectAlliancePlayerCur[keyPlayer][keyField].toTimeFormat() + '</td>';
            }
            else if (!isNaN(parseInt(ObjectAlliancePlayerCur[keyPlayer][keyField])) && ArrayExcludedFieldsFromUsNumberFormat.indexOf(keyField) == -1)
            {
                strHtml += '<td>' + Intl.NumberFormat('en-US').format(parseInt(ObjectAlliancePlayerCur[keyPlayer][keyField])) + '</td>';
            }
            else
            {
                strHtml += '<td>' + ObjectAlliancePlayerCur[keyPlayer][keyField] + '</td>';
            }
        }
        strHtml += '</tr>';
    }
    var ArrayRows = buildArrayTableBody('TableAlliancePlayer', ObjectAlliancePlayerCur, strHtml);
    resetDataTable('TableAlliancePlayer', ArrayRows, ArrayAlliancePlayerCurIdsAndNames, true);
    for (var keyPlayer in ObjectAlliancePlayerCur)
    {
        ObjectAlliancePlayerCur[keyPlayer]['AccountId'] = ArrayAlliancePlayerCurIdsAndNames[0][keyPlayer];
    }
}

function manageContentAlliance()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    if (!ObjectAllianceData[WorldId + '_' + AllianceId])
    {
        var data =
        {
            action: "getAllianceDataHistory",
            WorldId: WorldId,
            AllianceId: AllianceId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(_data)
        {
            if (_data[0])
            {
                ObjectAllianceData[WorldId + '_' + AllianceId] = _data;
            }
            else
            {
                location.href='?logout';
            }
        });
        $.ajaxSetup({async: true});
    }
    var ObjectAllianceCur = ObjectAllianceData[WorldId + '_' + AllianceId];
    ObjectDiagramData.Alliance = {};
    ObjectDiagramData.Alliance.Score = [[], ['Zeit', 'ScoreTib', 'ScoreCry', 'ScorePow', 'ScoreInf', 'ScoreVeh', 'ScoreAir', 'ScoreDef', 'AlliancePoints']];
    if (ArraySeasonServerIds.indexOf(WorldId) != -1)
    {
        ObjectDiagramData.Alliance.Rank = [[], ['Zeit', 'AllianceRank', 'EventRank', 'RankTib', 'RankCry', 'RankPow', 'RankInf', 'RankVeh', 'RankAir', 'RankDef', 'AllianceRank']];
    }
    else
    {
        ObjectDiagramData.Alliance.Rank = [[], ['Zeit', 'AllianceRank', 'RankTib', 'RankCry', 'RankPow', 'RankInf', 'RankVeh', 'RankAir', 'RankDef', 'AllianceRank']];
    }
    ObjectDiagramData.Alliance.BonusRes = [[], ['Zeit', 'BonusTiberium', 'BonusCrystal', 'BonusPower', 'AllianceBonus - Ressoucen']];
    ObjectDiagramData.Alliance.BonusFight = [[], ['Zeit', 'BonusInfantrie', 'BonusVehicle', 'BonusAir', 'BonusDef', 'AllianceBonus - Fight']];
    drawDiagrams(ObjectAllianceCur, 'Alliance');
}

function manageContentAllianceBase()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    var type = $('#DropDownAllianceBaseType')[0].value;
    if (!ObjectAllianceBaseData[WorldId + '_' + AllianceId])
    {
        var data =
        {
            action: "getAllianceBaseData",
            WorldId: WorldId,
            AllianceId: AllianceId,
            type: type
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(_data)
        {
            if (_data[0])
            {
                ObjectAllianceBaseData[WorldId + '_' + AllianceId] = _data;
            }
            else
            {
                location.href='?logout';
            }
        });
        $.ajaxSetup({async: true});
    }
    var curObjectAllianceBaseData = ObjectAllianceBaseData[WorldId + '_' + AllianceId];
    var maxBaseCount = 0;
    var curBaseCount = 0;
    var lastName = '';
    for (key in curObjectAllianceBaseData)
    {
        if (curObjectAllianceBaseData[key]['UserName'] != lastName)
        {
            curBaseCount = 0;
        }
        lastName = curObjectAllianceBaseData[key]['UserName'];
        curBaseCount++;
        if (curBaseCount > maxBaseCount)
        {
            maxBaseCount = curBaseCount;
        }
    }
    var strHtml =
        '<th onclick="sortTable(0, \'TableAllianceBase\', \'asc\')">PlayerName</th>' +
        '<th onclick="sortTable(1, \'TableAllianceBase\', \'asc\')">Faction</th>';
    for (var i = 1; i <= maxBaseCount; i++)
    {
        strHtml += '<th style="text-align: center;" onclick="sortTable(' + (i + 1) + ', \'TableAllianceBase\', \'desc\')">Base ' + i + '</th>';
    }
    $('#TableAllianceBaseTheadTr')[0].innerHTML = strHtml;
    lastName = '';
    curBaseCount = 1;
    for (var i = 0; i < curObjectAllianceBaseData.length; i++)
    {
        curObjectAllianceBaseData[i][type] = parseFloat(curObjectAllianceBaseData[i][type]);
    }
    var maxLvL = alasql('SELECT MAX(' + type + ') FROM ?',[curObjectAllianceBaseData])[0]['MAX(' + type + ')'];
    var ArrayColors =
    [
        '#33CC33', '#44CC33', '#55CC33', '#66CC33', '#77CC33',
        '#88CC33', '#99CC33', '#AACC33', '#BBCC33', '#CCCC33',
        '#CCBB33', '#CCAA33', '#CC9933', '#CC8833', '#CC7733',
        '#CC6633', '#CC5533', '#CC4433', '#CC3333'
    ];
    var curColor = '';
    strHtml = '';
    for (var key in curObjectAllianceBaseData)
    {
        if (curObjectAllianceBaseData[key]['UserName'] != lastName)
        {
            if (key != 0)
            {
                while (curBaseCount <= maxBaseCount)
                {
                    strHtml += '<td></td>';
                    curBaseCount ++;
                }
                curBaseCount = 1;
                strHtml += '</tr><tr>' +
                    '<td>' + curObjectAllianceBaseData[key]['UserName'] + '</td>' +
                    '<td style="text-align: center;"><img src="img/faction_' + curObjectAllianceBaseData[key]['Faction'] + '.png" width="20px" height="20px"></td>';
            }
            else
            {
                strHtml +=
                    '<td>' + curObjectAllianceBaseData[key]['UserName'] + '</td>' +
                    '<td style="text-align: center;"><img src="img/faction_' + curObjectAllianceBaseData[key]['Faction'] + '.png" width="20px" height="20px"></td>';
            }
        }
        var procentLvLOff = parseFloat(curObjectAllianceBaseData[key][type]) / parseFloat(maxLvL);
        if (procentLvLOff >= 0.99){curColor = ArrayColors[0];}
        else if (procentLvLOff >= 0.98){curColor = ArrayColors[1];}
        else if (procentLvLOff >= 0.97){curColor = ArrayColors[2];}
        else if (procentLvLOff >= 0.96){curColor = ArrayColors[3];}
        else if (procentLvLOff >= 0.95){curColor = ArrayColors[4];}
        else if (procentLvLOff >= 0.94){curColor = ArrayColors[5];}
        else if (procentLvLOff >= 0.93){curColor = ArrayColors[6];}
        else if (procentLvLOff >= 0.92){curColor = ArrayColors[7];}
        else if (procentLvLOff >= 0.91){curColor = ArrayColors[8];}
        else if (procentLvLOff >= 0.90){curColor = ArrayColors[9];}
        else if (procentLvLOff >= 0.80){curColor = ArrayColors[10];}
        else if (procentLvLOff >= 0.70){curColor = ArrayColors[11];}
        else if (procentLvLOff >= 0.60){curColor = ArrayColors[12];}
        else if (procentLvLOff >= 0.50){curColor = ArrayColors[13];}
        else if (procentLvLOff >= 0.40){curColor = ArrayColors[14];}
        else if (procentLvLOff >= 0.30){curColor = ArrayColors[15];}
        else if (procentLvLOff >= 0.20){curColor = ArrayColors[16];}
        else if (procentLvLOff >= 0.10){curColor = ArrayColors[17];}
        else if (procentLvLOff >= 0.00){curColor = ArrayColors[18];}
        else {curColor = '';}
        strHtml += '<td style="text-align: right; background-color: ' + curColor + '; cursor: pointer;" onclick="convertCncOptToArray(\'' + curObjectAllianceBaseData[key]['CnCOpt'] + '\', \'' + curObjectAllianceBaseData[key]['UserName'] + '\', ' + curBaseCount + ');">';
        if (type == 'LvLBase' || type == 'LvLOff' || type == 'LvLDef')
        {
            strHtml += Intl.NumberFormat('en-US', {minimumFractionDigits: 2}).format(curObjectAllianceBaseData[key][type]) + '</td>';
        }
        else if (type == 'LvLCY' || type == 'LvLSup' || type == 'LvLDF')
		{
			strHtml += curObjectAllianceBaseData[key][type] + '</td>';
        }
        else if (type == 'Rep')
        {
            strHtml += String(curObjectAllianceBaseData[key][type]).toTimeFormat() + '</td>';
        }
		else
		{
			strHtml += Intl.NumberFormat('en-US').format(curObjectAllianceBaseData[key][type]) + '</td>';
		}
        lastName = curObjectAllianceBaseData[key]['UserName'];
        curBaseCount++;
        if (key == curObjectAllianceBaseData.length -1)
        {
            while (curBaseCount <= maxBaseCount)
            {
                strHtml += '<td></td>';
                curBaseCount ++;
            }
        }
    }
    strHtml += '</tr>';
    $('#TableAllianceBaseTbody')[0].innerHTML = strHtml;
}

function manageContentPlayer()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AccountId = $('#DropDownListPlayer')[0].value;
    if (!ObjectPlayerData[WorldId + '_' + AccountId])
    {
        var data =
        {
            action: "getPlayerData",
            WorldId: WorldId,
            AccountId: AccountId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(_data)
        {
            if (_data[0])
            {
                ObjectPlayerData[WorldId + '_' + AccountId] = _data;
            }
            else
            {
                location.href='?logout';
            }
        });
        $.ajaxSetup({async: true});
    }
    var ObjectPlayerCur = ObjectPlayerData[WorldId + '_' + AccountId];
    ObjectDiagramData.Player = {};
    ObjectDiagramData.Player.ScorePoints = [[0], ['Zeit', 'ScorePoints', 'AverageScore', 'Player - ScorePoints']];
    if (ArraySeasonServerIds.indexOf(WorldId) != -1)
    {
        ObjectDiagramData.Player.Rank = [[0], ['Zeit', 'OverallRank', 'EventRank', 'Player - Ranking']];
    }
    else
    {
        ObjectDiagramData.Player.Rank = [[0], ['Zeit', 'OverallRank', 'Player - Ranking']];
    }
    ObjectDiagramData.Player.Production = [[0], ['Zeit', 'GesamtTiberium', 'GesamtCrystal', 'GesamtPower', 'GesamtCredits', 'Player - Production']];
    ObjectDiagramData.Player.RpsCred = [[0], ['Zeit', 'ResearchPoints', 'Credits', 'Player - RPs / Credits']];
    ObjectDiagramData.Player.Shoots = [[0], ['Zeit', 'Shoot', 'PvP', 'PvE', 'Player - Shoots']];
    ObjectDiagramData.Player.Values = [[0], ['Zeit', 'BaseD', 'LvLOff', 'LvLDef', 'OffD', 'DefD', 'DFD', 'SupD', 'Player - Values']];
    if (ArraySeasonServerIds.indexOf(WorldId) != -1)
    {
        document.getElementById('GoogleChartLinePlayer - VPs').className = 'divGoogleChart';
        document.getElementById('GoogleChartLinePlayer - LPs').className = 'divGoogleChart';
        ObjectDiagramData.Player.Vps = [[0], ['Zeit', 'VP', 'Player - VPs']];
        ObjectDiagramData.Player.Lps = [[0], ['Zeit', 'LP', 'Player - LPs']];
    }
    else
    {
        document.getElementById('GoogleChartLinePlayer - VPs').className = 'd-none';
        document.getElementById('GoogleChartLinePlayer - LPs').className = 'd-none';
    }
    ObjectDiagramData.Player.Cps = [[0], ['Zeit', 'CPMax', 'CPCur', 'Player - CPs']];
    ObjectDiagramData.Player.Funds = [[0], ['Zeit', 'Funds', 'Player - Funds']];
    drawDiagrams(ObjectPlayerCur, 'Player');
}

function manageContentPlayerBase()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AccountId = $('#DropDownListPlayer')[0].value;
    if (!ObjectPlayerBaseData[WorldId + '_' + AccountId])
    {
        var data =
        {
            action: "getPlayerBaseData",
            WorldId: WorldId,
            AccountId: AccountId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(_data)
        {
            if (_data[0])
            {
                ObjectPlayerBaseData[WorldId + '_' + AccountId] = _data;
            }
            else
            {
                location.href='?logout';
            }
        });
        $.ajaxSetup({async: true});
    }
    var ObjectPlayerBaseCur = ObjectPlayerBaseData[WorldId + '_' + AccountId];
    var strHtml = '';
    for (var key in ObjectPlayerBaseCur[0])
    {
        if (key != 'BaseId')
        {
            strHtml += '<th class="text-center">' + key + '</th>';
        }
    }
    if (!$('#TablePlayerBaseTheadTr')[0].innerHTML)
    {
        $('#TablePlayerBaseTheadTr')[0].innerHTML = strHtml;
    }
    var ArrayPlayerBaseCurIdsAndNames = [[], []];
    strHtml = '';
    for (var keyBase in ObjectPlayerBaseCur)
    {
        strHtml += '<tr id="' + ObjectPlayerBaseCur[keyBase]['BaseId'] + '">';
        for (var keyField in ObjectPlayerBaseCur[keyBase])
        {
            if (keyField == 'Rep')
            {
                strHtml += '<td>' + ObjectPlayerBaseCur[keyBase][keyField].toTimeFormat() + '</td>';
            }
            else if (keyField == 'Tib' || keyField == 'Cry' || keyField == 'Pow' || keyField == 'Cre')
            {
                strHtml += '<td>' + Intl.NumberFormat('en-US').format(parseInt(ObjectPlayerBaseCur[keyBase][keyField])) + '</td>';
            }
            else if (keyField == 'CnCOpt')
            {
                strHtml += '<td><a href="' + ObjectPlayerBaseCur[keyBase][keyField] + '" target="_blank">' + ObjectPlayerBaseCur[keyBase]['BaseName'] + '</a></td>';
            }
            else if (keyField == 'BaseId')
            {
                ArrayPlayerBaseCurIdsAndNames[0].push(ObjectPlayerBaseCur[keyBase][keyField]);
                ArrayPlayerBaseCurIdsAndNames[1].push(ObjectPlayerBaseCur[keyBase]['BaseName']);
                delete ObjectPlayerBaseCur[keyBase][keyField];
            }
            else
            {
                strHtml += '<td>' + ObjectPlayerBaseCur[keyBase][keyField] + '</td>';
            }
        }
        strHtml += '</tr>';
    }
    var ArrayRows = buildArrayTableBody('TablePlayerBase', ObjectPlayerBaseCur, strHtml);
    resetDataTable('TablePlayerBase', ArrayRows, ArrayPlayerBaseCurIdsAndNames);
    for (var keyBase in ObjectPlayerBaseCur)
    {
        ObjectPlayerBaseCur[keyBase]['BaseId'] = ArrayPlayerBaseCurIdsAndNames[0][keyBase];
    }
}

function manageContentAllianceOverview()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    if (!ObjectAllianceOverviewData[WorldId + '_' + AllianceId])
    {
        var data =
        {
            action: "getAllianceOverviewData",
            WorldId: WorldId,
            AllianceId: AllianceId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(_data)
        {
            if (_data[0])
            {
                ObjectAllianceOverviewData[WorldId + '_' + AllianceId] = _data;
            }
            else
            {
                location.href='?logout';
            }
        });
        $.ajaxSetup({async: true});
    }
    var ObjectAllianceOverviewCurOff = ObjectAllianceOverviewData[WorldId + '_' + AllianceId][0];
    var ObjectAllianceOverviewCurDef = ObjectAllianceOverviewData[WorldId + '_' + AllianceId][1];
    var ObjectAllianceOverviewCurSup = ObjectAllianceOverviewData[WorldId + '_' + AllianceId][2];
    createOverviews(ObjectAllianceOverviewCurOff, 'OverviewAlliance', 'Alliance', 'Offense');
    createOverviews(ObjectAllianceOverviewCurDef, 'OverviewAlliance', 'Alliance', 'Defense');
    createOverviews(ObjectAllianceOverviewCurSup, 'OverviewAlliance', 'Alliance', 'Support');
    drawOverviews('OverviewAlliance');
}

function manageContentBase()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    var BaseId = $('#DropDownListBase')[0].value;
    if (!ObjectBaseData[WorldId + '_' + BaseId])
    {
        var data =
        {
            action: "getBaseData",
            WorldId: WorldId,
            BaseId: BaseId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(_data)
        {
            if (_data[0])
            {
                ObjectBaseData[WorldId + '_' + BaseId] = _data;
            }
            else
            {
                location.href='?logout';
            }
        });
        $.ajaxSetup({async: true});
    }
    var ObjectBaseCur = ObjectBaseData[WorldId + '_' + BaseId];
    ObjectDiagramData.Base = {};
    ObjectDiagramData.Base.Production = [[], ['Zeit', 'Tib', 'Cry', 'Pow', 'Cre', 'Base - Production']];
    ObjectDiagramData.Base.Values = [[], ['Zeit', 'LvLCY', 'LvLBase', 'LvLOff', 'LvLDef', 'LvLDF', 'LvLSup', 'Base - Values']];
    ObjectDiagramData.Base.RepairTime = [[], ['Zeit', 'Rep', 'RepMax', 'Base - RepairTime']];
    var tmpArrayForRep = [];
    for (var key in ObjectBaseCur)
    {
        tmpArrayForRep[key] = [];
        tmpArrayForRep[key][0] = ObjectBaseCur[key].Rep;
        tmpArrayForRep[key][1] = ObjectBaseCur[key].RepMax;
        ObjectBaseCur[key].Rep = ObjectBaseCur[key].Rep / 3600;
        ObjectBaseCur[key].RepMax = ObjectBaseCur[key].RepMax / 3600;
    }
    drawDiagrams(ObjectBaseCur, 'Base');
    for (var key in ObjectBaseCur)
    {
        ObjectBaseCur[key].Rep = tmpArrayForRep[key][0];
        ObjectBaseCur[key].RepMax = tmpArrayForRep[key][1];
    }
    $('#LinkCncOpt')[0].href = ObjectBaseCur[countLength(ObjectBaseCur) - 1].CnCOpt;
}

function manageContentWorldOverview()
{
    var WorldId = $('#DropDownListWorld')[0].value;
    if (!ObjectWorldOverviewData[WorldId.toString()])
    {
        var data =
        {
            action: "getWorldOverviewData",
            WorldId: WorldId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(_data)
        {
            if (_data[0])
            {
                ObjectWorldOverviewData[WorldId.toString()] = _data;
            }
            else
            {
                location.href='?logout';
            }
        });
        $.ajaxSetup({async: true});
    }
    var ObjectWorldOverviewCurOff = ObjectWorldOverviewData[WorldId.toString()][0];
    var ObjectWorldOverviewCurDef = ObjectWorldOverviewData[WorldId.toString()][1];
    var ObjectWorldOverviewCurSup = ObjectWorldOverviewData[WorldId.toString()][2];
    createOverviews(ObjectWorldOverviewCurOff, 'OverviewWorld', 'World', 'Offense');
    createOverviews(ObjectWorldOverviewCurDef, 'OverviewWorld', 'World', 'Defense');
    createOverviews(ObjectWorldOverviewCurSup, 'OverviewWorld', 'World', 'Support');
    drawOverviews('OverviewWorld');
}

//==================================================
// Administration & settings
//==================================================

function manageContentSettings()
{
    if (!ObjectSessionVariables.leoStats_IsAdmin)
    {
        for (var i = 0; i < ArrayDropDownDefaultOwn.length; i++)
        {
            if (ArrayDropDownDefaultOwn[i].WorldId == $('#DropDownListWorld')[0].value)
            {
                indexWorldId = i;
                break;
            }
        }
    }
    if (ObjectSessionVariables.leoStats_IsAdmin)
    {
        $('#v-pills-alliance-tab').removeClass('d-none');
        $('#v-pills-server-tab').removeClass('d-none');
        $('#AdminButtonsPlayer').removeClass('d-none');
    }
    else if (ArrayDropDownDefaultOwn[indexWorldId].MemberRole == 1)
    {
        $('#v-pills-alliance-tab').removeClass('d-none');
    }
    else
    {
        $('#v-pills-alliance-tab').addClass('d-none');
    }
    resetFormChangePassword(true);
}

function resetViewSettingsTabs()
{
    $('#v-pills-player-tab').addClass('active show');
    $('#v-pills-alliance-tab').removeClass('active show');
    $('#v-pills-server-tab').removeClass('active show');
    $('#v-pills-player').addClass('active show');
    $('#v-pills-alliance').removeClass('active show');
    $('#v-pills-server').removeClass('active show');
}

function changePassword()
{
    getLoginStatus();
    var ownAccountId = ObjectSessionVariables.leoStats_AccountId;
    var dataUrl = 'action=changePassword&AccountId=' + ownAccountId + '&' + $('#FormChangePassword').serialize();
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', dataUrl)
    .always(function(data)
    {
        if (data[0])
        {
            $('#PasswordChangeFail').addClass('d-none');
            $('#PasswordChangeSuccess').removeClass('d-none');
            resetFormChangePassword();
        }
        else
        {
            $('#PasswordChangeFail').removeClass('d-none');
            $('#PasswordChangeSuccess').addClass('d-none');
        }
    });
    $.ajaxSetup({async: true});
    return false;
}

function resetFormChangePassword(_activeClicked)
{
    document.forms.FormChangePassword.reset();
    if (_activeClicked)
    {
        $('#PasswordChangeFail').addClass('d-none');
        $('#PasswordChangeSuccess').addClass('d-none');
    }
    $('#InputUserName')[0].value = $('#DropDownListPlayer')[0][$('#DropDownListPlayer')[0].selectedIndex].innerHTML
}

function validatePassword()
{
    if ($('#InputNewPassword')[0].value != $('#InputConfirmNewPassword')[0].value)
    {
        $('#InputConfirmNewPassword')[0].setCustomValidity("Passwords do not match");
    }
    else
    {
        $('#InputConfirmNewPassword')[0].setCustomValidity('');
    }
}

function resetPlayer()
{
    getLoginStatus();
    var playerName = $('#DropDownListPlayer')[0][$('#DropDownListPlayer')[0].selectedIndex].innerHTML
    if (confirm('Do you want reset player ' + playerName + '?'))
    {
        var AccountId = $('#DropDownListPlayer')[0].value;
        var data =
        {
            action: "resetPlayer",
            AccountId: AccountId,
            PlayerName: playerName
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data);
        $.ajaxSetup({async: true});
    }
}

function deletePlayer()
{
    getLoginStatus();
    var playerName = $('#DropDownListPlayer')[0][$('#DropDownListPlayer')[0].selectedIndex].innerHTML
    if (confirm('Do you want to delete player ' + playerName + ' from database?'))
    {
        var AccountId = $('#DropDownListPlayer')[0].value;
        var data =
        {
            action: "deletePlayer",
            AccountId: AccountId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data);
        $.ajaxSetup({async: true});
        initializeStart();
    }
}

function prepareSettingsAlliance()
{
    if (ObjectSessionVariables.leoStats_IsAdmin)
    {
        var WorldId = $('#DropDownListWorld')[0].value;
        var AllianceId = $('#DropDownListAlliance')[0].value;
        getNeededMemberRoles(WorldId, AllianceId);
        $('#DropDownListMemberRole')[0].selectedIndex = ObjectNeededMemberRoles[WorldId + '_' + AllianceId].MemberRole - 1;
    }
    else
    {
        $('#DropDownListMemberRole')[0].selectedIndex = ArrayDropDownDefaultOwn[indexWorldId].NeededMemberRole - 1;
    }
    var strHtml = '<tr>';
    for (var i = 0; i < $('#DropDownListPlayer')[0].length; i++)
    {
        strHtml +=
            '<td id="TableCell_' + $('#DropDownListPlayer')[0].options[i].value + '">' +
                '<span id="TableCellName_' + $('#DropDownListPlayer')[0].options[i].value + '">' +
                    $('#DropDownListPlayer')[0].options[i].innerHTML +
                '</span>' +
                '<button class="btn btn-light float-right" onclick="deletePlayerTableCell(\'TableCell_' + $('#DropDownListPlayer')[0].options[i].value + '\');">' +
                    '<font color="#FF0000;">' +
                        '<i class="fas fa-times"></i>' +
                    '</font>' +
                '</button>' +
            '</td>';
        if (!((i + 1) % 5))
        {
            strHtml += '</tr><tr>';
        }
    }
    strHtml += '</tr>';
    $('#TableSettingsAlliancePlayerTBody')[0].innerHTML = strHtml;
    $('#MemberRoleChangeFail').addClass('d-none');
    $('#MemberRoleChangeSuccess').addClass('d-none');
}

function prepareSettingsServer()
{
    $('#TableAdminLog').DataTable().destroy();
    getAdminLog();
    prepareAdminLogTable();
}

function saveChangeNeededMemberRole()
{
    getLoginStatus();
    var WorldId = $('#DropDownListWorld')[0].value;
    var AllianceId = $('#DropDownListAlliance')[0].value;
    var MemberRole = $('#DropDownListMemberRole')[0].value;
    var data =
    {
        action: "changeNeededMemberRole",
        WorldId: WorldId,
        AllianceId: AllianceId,
        MemberRole: MemberRole
    }
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', data)
    .always(function(data)
    {
        if (data[0])
        {
            $('#MemberRoleChangeFail').addClass('d-none');
            $('#MemberRoleChangeSuccess').removeClass('d-none');
            if (ObjectSessionVariables.leoStats_IsAdmin)
            {
                ObjectNeededMemberRoles[WorldId + '_' + AllianceId].MemberRole = $('#DropDownListMemberRole')[0].selectedIndex + 1;
            }
            else
            {
                ArrayDropDownDefaultOwn[indexWorldId].NeededMemberRole = $('#DropDownListMemberRole')[0].value;
            }
        }
        else
        {
            $('#MemberRoleChangeFail').removeClass('d-none');
            $('#MemberRoleChangeSuccess').addClass('d-none');
        }
    });
    $.ajaxSetup({async: true});
}

function getNeededMemberRoles(_WorldId, _AllianceId)
{
    if (!ObjectNeededMemberRoles[_WorldId + '_' + _AllianceId])
    {
        var data =
        {
            action: "getNeededMemberRoles",
            WorldId: _WorldId,
            AllianceId: _AllianceId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data)
        .always(function(_data)
        {
            if (_data[0])
            {
                ObjectNeededMemberRoles[_WorldId + '_' + _AllianceId] = _data[0];
            }
            else
            {
                location.href='?logout';
            }
        });
        $.ajaxSetup({async: true});
    }
}

function deletePlayerTableCell(_cellId)
{
    getLoginStatus();
    var AccountId = _cellId.substr(10, _cellId.length - 10);
    var playerName = $('#TableCellName_' + AccountId)[0].innerHTML;
    if (confirm('Do you want to remove ' + playerName + ' from alliance?'))
    {
        var WorldId = $('#DropDownListWorld')[0].value;
        var AllianceId = $('#DropDownListAlliance')[0].value;
        var data =
        {
            action: "removePlayerFromAlliance",
            WorldId: WorldId,
            AllianceId: AllianceId,
            AccountId: AccountId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data);
        $.ajaxSetup({async: true});
        initializeStart();
        prepareSettingsAlliance();
    }
}

function optimizeAllTables()
{
    $('#LoadingSymbol').removeClass('d-none');
    setTimeout(function()
    {
        getLoginStatus();
        var data =
        {
            action: "optimizeAllTables"
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data);
        $.ajaxSetup({async: true});
        $('#LoadingSymbol').addClass('d-none');
    }, 50);
}

function deleteServer()
{
    getLoginStatus();
    var serverName = $('#DropDownListWorld')[0][$('#DropDownListWorld')[0].selectedIndex].innerHTML;
    if (confirm('Do you want to delete server ' + serverName + ' from database?'))
    {
        var worldId = $('#DropDownListWorld')[0].value;
        var data =
        {
            action: "deleteServer",
            WorldId: worldId
        }
        $.ajaxSetup({async: false});
        $.post('php/manageBackend.php', data);
        $.ajaxSetup({async: true});
        initializeStart();
    }
}

function getAdminLog()
{
    getLoginStatus();
    var data=
    {
        action: "getAdminLog"
    }
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', data)
    .always(function(data)
    {
        ArrayAdminLog = data;
    });
    $.ajaxSetup({async: true});
}

function prepareAdminLogTable()
{
    var strHtml = '';
    for (var key in ArrayAdminLog)
    {
        ArrayAdminLog[key].Delete =
            '<button class="btn btn-light float-right" onclick="deleteElementAdminLog(\'' + ArrayAdminLog[key].Id + '\')">' +
                '<font color="#FF0000;">' +
                    '<i class="fas fa-times"></i>' +
                '</font>' +
            '</button>';
        strHtml += '<tr>' +
            '<td>' + ArrayAdminLog[key].Id + '</td>' +
            '<td>' + ArrayAdminLog[key].Zeit + '</td>' +
            '<td>' + ArrayAdminLog[key].Initiator + '</td>' +
            '<td>' + ArrayAdminLog[key].Description + '</td>' +
            '<td>' + ArrayAdminLog[key].Delete + '</td>' +
        '</tr>';
    }
    $('#TableAdminLogTbody')[0].innerHTML = strHtml;
    $('#TableAdminLog').DataTable(
        {"order":
            [
                [ 0, "desc" ]
            ]
        }
    );
}

function deleteElementAdminLog(_Id)
{
    getLoginStatus();
    $('#TableAdminLog').DataTable().destroy();
    var data=
    {
        action: "deleteElementAdminLog",
        Id: _Id
    }
    $.ajaxSetup({async: false});
    $.post('php/manageBackend.php', data);
    $.ajaxSetup({async: true});
    getAdminLog();
    prepareAdminLogTable();
}

//==================================================
// optische Darstellungsmittel
//==================================================
function buildArrayTableBody(_Id, _Object, _strHtml)
{
    $('#' + _Id + 'Tbody')[0].innerHTML = _strHtml;
    var ArrayRows = [];
    for (var i = 0; i < countLength(_Object); i++)
    {
        var ArrayRow = [];
        for (var j = 0; j < countLength(_Object[i]); j++)
        {
            ArrayRow.push($('#' + _Id + 'Tbody')[0].children[i].children[j].innerHTML);
        }
        ArrayRows.push(ArrayRow);
    }
    return ArrayRows;
}

function resetDataTable(_Id, _ArrayRows, _ArrayIdsAndNames, _sort)
{
    if (!$('#' + _Id + '.dataTable')[0])
    {
        if (_sort)
        {
            $('#' + _Id).DataTable({paging: false, order: [[0, "asc"]]});
        }
        else
        {
            $('#' + _Id).DataTable({paging: false, order:[[1]]});
        }
        $('.dataTables_info').parents()[1].remove();
        $('#' + _Id + '_wrapper').children()[1].style['overflow-x'] = 'auto';
        if (_Id == 'TablePlayerBase')
        {
            $('#TablePlayerBase_filter')[0].children[0].children[0].onkeyup = function(){prepareTabPlayerBase();}
        }
        else if (_Id == 'TableAlliancePlayer')
        {
            $('#TableAlliancePlayer_filter')[0].children[0].children[0].onkeyup = function(){prepareTabPlayer();}
        }
    }
    $('#' + _Id).DataTable().clear();
    $('#' + _Id).DataTable().rows.add(_ArrayRows);
    $('#' + _Id).DataTable().draw();
    for (var i = 0; i < $('#' + _Id + 'Tbody')[0].children.length; i++)
    {
        if (_Id == 'TablePlayerBase')
        {
            for (var j = 1; j < $('#' + _Id + 'Tbody')[0].children[i].children.length - 1; j++)
            {
                $($('#' + _Id + 'Tbody')[0].children[i].children[j]).addClass('text-right');
            }
        }
        else if (_Id == 'TableAlliancePlayer')
        {
            for (var j = 1; j < $('#' + _Id + 'Tbody')[0].children[i].children.length; j++)
            {
                $($('#' + _Id + 'Tbody')[0].children[i].children[j]).addClass('text-right');
            }
        }
        var Name = $('#' + _Id + 'Tbody')[0].children[i].children[0].innerHTML;
        var NameIndex = _ArrayIdsAndNames[1].indexOf(Name);
        $('#' + _Id + 'Tbody')[0].children[i].id = _ArrayIdsAndNames[0][NameIndex];
        $('#' + _Id + 'Tbody')[0].children[i].style.cursor = 'pointer';
        if (_Id == 'TablePlayerBase')
        {
            $('#' + _Id + 'Tbody')[0].children[i].onclick = function(data){changeBaseWithTableRowOnclick(data.path[1].id);};
        }
        else if (_Id == 'TableAlliancePlayer')
        {
            $('#' + _Id + 'Tbody')[0].children[i].onclick = function(data){changePlayerWithTableRowOnclick(data.path[1].id);};
        }
    }
}

function drawDiagrams(_ObjectCur, _NameOfSubObject)
{
    for (var key in _ObjectCur)
    {
        for (var keyDiagramType in ObjectDiagramData[_NameOfSubObject])
        {
            ObjectDiagramData[_NameOfSubObject][keyDiagramType][0][key] = [];
            ObjectDiagramData[_NameOfSubObject][keyDiagramType][0][key].push(_ObjectCur[key][ObjectDiagramData[_NameOfSubObject][keyDiagramType][1][0]]);
            for (var i = 1; i < ObjectDiagramData[_NameOfSubObject][keyDiagramType][1].length - 1 ; i++)
            {
                ObjectDiagramData[_NameOfSubObject][keyDiagramType][0][key].push(parseInt(_ObjectCur[key][ObjectDiagramData[_NameOfSubObject][keyDiagramType][1][i]] * 100) / 100);
            }
        }
    }
    setTimeout(function()
    {
        for (var keyDiagramType in ObjectDiagramData[_NameOfSubObject])
        {
            drawGoogleChartLine(ObjectDiagramData[_NameOfSubObject][keyDiagramType][1], ObjectDiagramData[_NameOfSubObject][keyDiagramType][0]);
        }
    });
}

function createOverviews(_ObjectCur, _nameOfSubObject, _typeOfOverview, _typeOfPlayerData)
{
    if (!ObjectDiagramData[_nameOfSubObject])
    {
        ObjectDiagramData[_nameOfSubObject] = {};
    }
    ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData] = [[], []];
    for (var i = 0; i <= 82; i++)
    {
        ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][1].push(i);
    }
    ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][1].push(_typeOfOverview + ' - ' + _typeOfPlayerData);
    var i = j = 0;
    for (var key in _ObjectCur)
    {
        if (parseInt(_ObjectCur[key]))
        {
            ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][0][j] = [];
            ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][0][j].push(parseInt(ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][1][i]));
            ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][0][j].push(parseInt(_ObjectCur[key]));
            ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][0].push(ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][0][j]);
            j++;
        }
        i++;
    }
    ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][0].pop();
    ObjectDiagramData[_nameOfSubObject][_typeOfPlayerData][0].unshift(["Level", "Count"]);
}

function drawOverviews(_nameOfSubObject)
{
    setTimeout(function()
    {
        drawGoogleChartColumn(ObjectDiagramData[_nameOfSubObject].Offense[1], ObjectDiagramData[_nameOfSubObject].Offense[0]);
        drawGoogleChartColumn(ObjectDiagramData[_nameOfSubObject].Defense[1], ObjectDiagramData[_nameOfSubObject].Defense[0]);
        drawGoogleChartColumn(ObjectDiagramData[_nameOfSubObject].Support[1], ObjectDiagramData[_nameOfSubObject].Support[0]);
    });
}

function drawGoogleChartLine(_ArrayIndexes, _ArrayCurChart)
{
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawCurveTypes);
    function drawCurveTypes()
    {
        var data = new google.visualization.DataTable();
        data.addColumn('string', _ArrayIndexes[i]);
        for (var i = 1; i < _ArrayIndexes.length - 1; i++)
        {
            data.addColumn('number', _ArrayIndexes[i]);
        }
        data.addRows(_ArrayCurChart);
        var options =
        {
            title: _ArrayIndexes[_ArrayIndexes.length - 1],
            hAxis:
            {
                title: 'Datum'
            },
            vAxis:
            {
                title: _ArrayIndexes[_ArrayIndexes.length - 1]
            }
        };
        var chart = new google.visualization.LineChart(document.getElementById('GoogleChartLine' + _ArrayIndexes[_ArrayIndexes.length - 1]));
        chart.draw(data, options);
    }
}

function drawGoogleChartColumn(_ArrayIndexes, _ArrayCurChart)
{
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart()
    {
        var data = google.visualization.arrayToDataTable(_ArrayCurChart);
        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1]);
        var options =
        {
            title: _ArrayIndexes[_ArrayIndexes.length - 1]
        };
        var chart = new google.visualization.ColumnChart(document.getElementById('GoogleChartColumn' + _ArrayIndexes[_ArrayIndexes.length - 1]));
        chart.draw(view, options);
    }
}

function sortTable(_rowId, _tableId, _order)
{
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById(_tableId);
    switching = true;
    dir = _order;
    while (switching)
    {
        switching = false;
        rows = table.getElementsByTagName("tr");
        for (i = 1; i < (rows.length - 1); i++)
        {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[_rowId];
            y = rows[i + 1].getElementsByTagName("td")[_rowId];
			if (isNaN(parseInt(x.innerHTML)) == false && isNaN(parseInt(y.innerHTML)) == false)
			{
				if (dir == "desc")
				{
					if (parseInt(x.innerHTML.replace(/,|\./g, '')) < parseInt(y.innerHTML.replace(/,|\./g, '')))
					{
						shouldSwitch= true;
						break;
					}
				}
				else if (dir == "asc")
				{
					if (parseInt(x.innerHTML.replace(/,|\./g, '')) > parseInt(y.innerHTML.replace(/,|\./g, '')))
					{
						shouldSwitch= true;
						break;
					}
				}
			}
			else
			{
				if (dir == "desc")
				{
					if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase())
					{
						shouldSwitch= true;
						break;
					}
				}
				else if (dir == "asc")
				{
					if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase())
					{
						shouldSwitch= true;
						break;
					}
				}
			}
        }
        if (shouldSwitch)
        {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++; 
        }
        else
        {
            if (switchcount == 0 && dir == "desc")
            {
                dir = "asc";
                switching = true;
            }
            else if (switchcount == 0 && dir == "asc")
            {
                dir = "desc";
                switching = true;
            }
            if (rows.length == 2)
            {
                break;
            }
        }
    }
}

function convertCncOptToArray(_strCncOpt, _UserName, _curBaseCount)
{
    var arrayCncOpt = _strCncOpt.split('|');
    var faction = arrayCncOpt[1];
    switch (faction)
    {
        case 'G':
        {
            faction = 1;
            break;
        }
        case 'N':
        {
            faction = 2;
            break;
        }
        default:
        {
            faction = 0;
            break;
        }
    }
    var strBuildings = arrayCncOpt[4];
    var arrayBuildings = $.grep(strBuildings.replace(/\./g, "|.|").replace(/([a-z])/g, function(n){return n + '|'}).replace(/\|\|/g, '|').split('|'), function(n){return n;});
    var x = 0;
    var y = 0;
    var arrayBase = [[]];
    for (var key in arrayBuildings)
    {
        arrayBase[y][x] = arrayBuildings[key].replace(/[a-z|\.]/g, function(n){return '|' + n}).split('|');
        x++;
        if (x % 9 == 0)
        {
            x = 0;
            y++;
            if (key != arrayBuildings.length - 1)
            {
                arrayBase[y] = [];
            }
        }
    }
    $('#HeaderCnCOptLink')[0].innerHTML = '<a href="' + _strCncOpt + '" target="_blank">CnCOpt (' + _UserName + ', Base ' + _curBaseCount + ')</a>';
    convertCncOptArrayToHtml(arrayBase, faction);
}

function convertCncOptArrayToHtml(_arrayBase, _faction)
{
    var arrayTypeName = ['Build', 'Def', 'Off'];
    var arrayTypeLength = [8, 8, 4];
    for (var i = 0; i < 3; i++)
    {
        var strHtml = '';
        var startY = 8 * i;
        for (var y = startY; y < (startY + arrayTypeLength[i]); y++)
        {
            strHtml += '<tr>';
            for (var x = 0; x < 9; x++)
            {
                if (_arrayBase[y][x][1] != '.')
                {
                    if (_arrayBase[y][x][1] != 'h' && _arrayBase[y][x][1] != 'n')
                    {
                        strHtml += '<td><img src="https://eaassets-a.akamaihd.net/cncalliancesgame/cdn/data/' + ObjectCncOptPics[_faction][arrayTypeName[i].toLowerCase()][_arrayBase[y][x][1]] + '.png" width="30px" height="30px" title="' + _arrayBase[y][x][0] + '"></td>';
                    }
                    else
                    {
                        strHtml += '<td><img src="img/game/faction_' + _faction + '/' + arrayTypeName[i].toLowerCase() + '/' + _arrayBase[y][x][1] + '.png" width="30px" height="30px" title="' + _arrayBase[y][x][0] + '"></td>';
                    }
                }
                else
                {
                    strHtml += '<td><div style="width: 30px; height: 30px;"></div></td>';
                }
            }
            strHtml += '</tr>';
        }
        $('#TableAllianceBase' + arrayTypeName[i] + 'CnCOptTbody')[0].innerHTML = strHtml;
    }
}

// Download
function manageDownloadOfTable(_this)
{
    var WorldId = $('#DropDownListWorld')[0].value;
    switch(_this.id)
    {
        case 'ButtonDownloadPlayerBaseData':
        {
            var PlayerId = $('#DropDownListPlayer')[0].value;
            alasql("SELECT * INTO XLSX('PlayerBaseData.xlsx',{headers:true}) FROM ? ",[ObjectPlayerBaseData[WorldId + '_' + PlayerId]]);
            break;
        }
        case 'ButtonDownloadAlliancePlayerData':
        {
            var AllianceId = $('#DropDownListAlliance')[0].value;
            alasql("SELECT * INTO XLSX('AlliancePlayerData.xlsx',{headers:true}) FROM ? ",[ObjectAlliancePlayerData[WorldId + '_' + AllianceId]]);
            break;
        }
        default:
        {
            break;
        }
    }
}

//==================================================
// Cookies for saving selected Ids
//==================================================
function setCookie(_name, _value)
{
    document.cookie = _name + '=' + _value + ';';
}

function getCookie(_name)
{
    var returnValue = '';
    var name = _name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ArrayDecodedCoocie = decodedCookie.split(';');
    for (var i = 0; i < ArrayDecodedCoocie.length; i++)
    {
        var cookieCur = ArrayDecodedCoocie[i];
        while (cookieCur.charAt(0) == ' ')
        {
            cookieCur = cookieCur.substring(1);
        }
        if (cookieCur.indexOf(name) == 0)
        {
            returnValue =  cookieCur.substring(name.length, cookieCur.length);
            break;
        }
    }
    return returnValue;
}