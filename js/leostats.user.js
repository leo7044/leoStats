// ==UserScript==
// @name        leoStats
// @version     2020.01.28
// @author      leo7044 (https://github.com/leo7044)
// @homepage    https://cnc.indyserver.info/
// @downloadURL https://cnc.indyserver.info/js/leostats.user.js
// @updateURL   https://cnc.indyserver.info/js/leostats.user.js
// @description leoStats und BaseScanner vereint
// @include     https://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @require		https://code.jquery.com/jquery-3.3.1.min.js
// @icon        https://cnc.indyserver.info/img/icon_32.png
// @grant       none
// ==/UserScript==

// Hinweise:
// Dieses Script befindet sich in einer Umbauphase
// Dieses Script ist für alle Welten freigeschaltet.
// Wenn ihr mit mir Kontakt aufnehmen wollt, schreibt mir eine Email: cc.ta.leo7044@gmail.com
// Das Script ist verschlüsselt, da ich Scriptmanipulationen ausschließen möchte. Wer der Sache misstraut: Es steht euch frei, mit mir Kontakt aufzunehmen.
// Ansonsten bleibt mir nur zu sagen: Viel Spaß!
(function () {
    var leoStatsMain = function ()
    {
        function leoStatsCreate()
        {
            function setButtons()
            {
                var linkToRoot = "https://cnc.indyserver.info/";
                qx.Class.define('leoStats',
                {
                    type: 'singleton',
                    extend: qx.core.Object,
                    construct: function ()
                    {
                        console.log('create leoStats...');
                    },
                    members:
                    {
                        initialize: function()
                        {
                            // bitte daran denken, die Client-Version und Server-Version upzudaten (Client ist zwingend wichtig)
                            this.scriptVersionLocal = '2020.01.28';
                            this.scriptVersionServer = '';
                            this.newVersionAvailable = false;
                            this.sendChatInfoStatus = true;
                            this.ObjectData = {};
                            this.linkBase = '';
                            this.app = qx.core.Init.getApplication();
                            this.buttonLeoStats = new qx.ui.form.Button('leoStats').set(
                            {
                                center: true,
                                rich: true
                            });
                            this.buttonLeoStats.addListener('click', function()
                            {
                                if (this.newVersionAvailable)
                                {
                                    qx.core.Init.getApplication().showExternal(linkToRoot + 'js/leostats.min.user.js');
                                }
                                else
                                {
                                    console.log('open leoStats-Window');
                                    qx.core.Init.getApplication().showExternal(linkToRoot);
                                }
                            }, this);
                            this.app.getDesktop().add(this.buttonLeoStats,
                            {
                                right: 125,
                                top: 0
                            });
                            this.checkForNewVersion();
                            this.setCncOptVars();
                            this.collectStats();
                        },
                        checkForNewVersion: function()
                        {
                            var ObjectSend =
                            {
                                action: 'getCurrentVersionOfLeoStats'
                            }
                            var _self = this;
                            $.ajaxSetup({async: false});
                            $.post(linkToRoot + 'php/manageBackend.php', ObjectSend)
                            .always(function(_data)
                            {
                                _self.scriptVersionServer = _data[1];
                            });
                            $.ajaxSetup({async: true});
                            if (this.scriptVersionServer > this.scriptVersionLocal)
                            {
                                this.newVersionAvailable = true;
                                this.buttonLeoStats.setLabel('new version for leoStats, click here');
                            }
                        },
                        setCncOptVars: function()
                        {
                            this.Defense_unit_map = {
                                /* GDI Defense Units */
                                "GDI_Wall": "w",
                                "GDI_Cannon": "c",
                                "GDI_Antitank Barrier": "t",
                                "GDI_Barbwire": "b",
                                "GDI_Turret": "m",
                                "GDI_Flak": "f",
                                "GDI_Art Inf": "r",
                                "GDI_Art Air": "e",
                                "GDI_Art Tank": "a",
                                "GDI_Def_APC Guardian": "g",
                                "GDI_Def_Missile Squad": "q",
                                "GDI_Def_Pitbull": "p",
                                "GDI_Def_Predator": "d",
                                "GDI_Def_Sniper": "s",
                                "GDI_Def_Zone Trooper": "z",
                
                                /* Nod Defense Units */
                                "NOD_Def_Antitank Barrier": "t",
                                "NOD_Def_Art Air": "e",
                                "NOD_Def_Art Inf": "r",
                                "NOD_Def_Art Tank": "a",
                                "NOD_Def_Attack Bike": "p",
                                "NOD_Def_Barbwire": "b",
                                "NOD_Def_Black Hand": "z",
                                "NOD_Def_Cannon": "c",
                                "NOD_Def_Confessor": "s",
                                "NOD_Def_Flak": "f",
                                "NOD_Def_MG Nest": "m",
                                "NOD_Def_Militant Rocket Soldiers": "q",
                                "NOD_Def_Reckoner": "g",
                                "NOD_Def_Scorpion Tank": "d",
                                "NOD_Def_Wall": "w",
                                "": ""
                            };
                            this.offense_unit_map = {
                                /* GDI Offense Units */
                                "GDI_APC Guardian": "g",
                                "GDI_Commando": "c",
                                "GDI_Firehawk": "f",
                                "GDI_Juggernaut": "j",
                                "GDI_Kodiak": "k",
                                "GDI_Mammoth": "m",
                                "GDI_Missile Squad": "q",
                                "GDI_Orca": "o",
                                "GDI_Paladin": "a",
                                "GDI_Pitbull": "p",
                                "GDI_Predator": "d",
                                "GDI_Riflemen": "r",
                                "GDI_Sniper Team": "s",
                                "GDI_Zone Trooper": "z",
                
                                /* Nod Offense Units */
                                "NOD_Attack Bike": "b",
                                "NOD_Avatar": "a",
                                "NOD_Black Hand": "z",
                                "NOD_Cobra": "r",
                                "NOD_Commando": "c",
                                "NOD_Confessor": "s",
                                "NOD_Militant Rocket Soldiers": "q",
                                "NOD_Militants": "m",
                                "NOD_Reckoner": "k",
                                "NOD_Salamander": "l",
                                "NOD_Scorpion Tank": "o",
                                "NOD_Specter Artilery": "p",
                                "NOD_Venom": "v",
                                "NOD_Vertigo": "t",
                                "": ""
                            };
                        },
                        findTechLayout: function(_city) {
                            for (var k in _city) {
                                //console.log(typeof(_city[k]), "1._city[", k, "]", _city[k])
                                if ((typeof (_city[k]) == "object") && _city[k] && 0 in _city[k] && 8 in _city[k]) {
                                    if ((typeof (_city[k][0]) == "object") && _city[k][0] && _city[k][0] && 0 in _city[k][0] && 15 in _city[k][0]) {
                                        if ((typeof (_city[k][0][0]) == "object") && _city[k][0][0] && "BuildingIndex" in _city[k][0][0]) {
                                            return _city[k];
                                        }
                                    }
                                }
                            }
                            return null;
                        },
                        findBuildings: function(_city) {
                            var cityBuildings = _city.get_CityBuildingsData();
                            for (var k in cityBuildings) {
                                if (PerforceChangelist >= 376877) {
                                    if ((typeof (cityBuildings[k]) === "object") && cityBuildings[k] && "d" in cityBuildings[k] && "c" in cityBuildings[k] && cityBuildings[k].c > 0) {
                                        return cityBuildings[k].d;
                                    }
                                } else {
                                    if ((typeof (cityBuildings[k]) === "object") && cityBuildings[k] && "l" in cityBuildings[k]) {
                                        return cityBuildings[k].l;
                                    }
                                }
                            }
                        },
                        isOffenseUnit: function(_unit) {
                            return (_unit.get_UnitGameData_Obj().n in this.offense_unit_map);
                        },
                        isDefenseUnit: function(_unit) {
                            return (_unit.get_UnitGameData_Obj().n in this.Defense_unit_map);
                        },
                        getUnitArrays: function(_city) {
                            var ret = [];
                            for (var k in _city) {
                                if ((typeof (_city[k]) == "object") && _city[k]) {
                                    for (var k2 in _city[k]) {
                                        if (PerforceChangelist >= 376877) {
                                            if ((typeof (_city[k][k2]) == "object") && _city[k][k2] && "d" in _city[k][k2]) {
                                                var lst = _city[k][k2].d;
                                                if ((typeof (lst) == "object") && lst) {
                                                    for (var i in lst) {
                                                        if (typeof (lst[i]) == "object" && lst[i] && "get_CurrentLevel" in lst[i]) {
                                                            ret.push(lst);
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            if ((typeof (_city[k][k2]) == "object") && _city[k][k2] && "l" in _city[k][k2]) {
                                                var lst = _city[k][k2].l;
                                                if ((typeof (lst) == "object") && lst) {
                                                    for (var i in lst) {
                                                        if (typeof (lst[i]) == "object" && lst[i] && "get_CurrentLevel" in lst[i]) {
                                                            ret.push(lst);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            return ret;
                        },
                        getDefenseUnits: function(_city) {
                            var arr = this.getUnitArrays(_city);
                            for (var i = 0; i < arr.length; ++i) {
                                for (var j in arr[i]) {
                                    if (this.isDefenseUnit(arr[i][j])) {
                                        return arr[i];
                                    }
                                }
                            }
                            return [];
                        },
                        getOffenseUnits: function(_city) {
                            var arr = this.getUnitArrays(_city);
                            for (var i = 0; i < arr.length; ++i) {
                                for (var j in arr[i]) {
                                    if (this.isOffenseUnit(arr[i][j])) {
                                        return arr[i];
                                    }
                                }
                            }
                            return [];
                        },
                        CnCOpt: function(_baseId, _baseName, _faction)
                        {
                            var _self = this;
                            var cncopt = {
                                keymap: {
                                    /* GDI Buildings */
                                    "GDI_Accumulator": "a",
                                    "GDI_Refinery": "r",
                                    "GDI_Trade Center": "u",
                                    "GDI_Silo": "s",
                                    "GDI_Power Plant": "p",
                                    "GDI_Construction Yard": "y",
                                    "GDI_Airport": "d",
                                    "GDI_Barracks": "b",
                                    "GDI_Factory": "f",
                                    "GDI_Defense HQ": "q",
                                    "GDI_Defense Facility": "w",
                                    "GDI_Command Center": "e",
                                    "GDI_Support_Art": "z",
                                    "GDI_Support_Air": "x",
                                    "GDI_Support_Ion": "i",
            
                                    /* Forgotten Buildings */
                                    "FOR_Silo": "s",
                                    "FOR_Refinery": "r",
                                    "FOR_Tiberium Booster": "b",
                                    "FOR_Crystal Booster": "v",
                                    "FOR_Trade Center": "u",
                                    "FOR_Defense Facility": "w",
                                    "FOR_Construction Yard": "y",
                                    "FOR_EVENT_Construction Yard": "y",
                                    "FOR_Harvester_Tiberium": "h",
                                    "FOR_Defense HQ": "q",
                                    "FOR_Harvester_Crystal": "n",
            
                                    /* Nod Buildings */
                                    "NOD_Refinery": "r",
                                    "NOD_Power Plant": "p",
                                    "NOD_Harvester": "h",
                                    "NOD_Construction Yard": "y",
                                    "NOD_Airport": "d",
                                    "NOD_Trade Center": "u",
                                    "NOD_Defense HQ": "q",
                                    "NOD_Barracks": "b",
                                    "NOD_Silo": "s",
                                    "NOD_Factory": "f",
                                    "NOD_Harvester_Crystal": "n",
                                    "NOD_Command Post": "e",
                                    "NOD_Support_Art": "z",
                                    "NOD_Support_Ion": "i",
                                    "NOD_Accumulator": "a",
                                    "NOD_Support_Air": "x",
                                    "NOD_Defense Facility": "w",
                                    //"NOD_Tech Lab": "",
                                    //"NOD_Recruitment Hub": "X",
                                    //"NOD_Temple of Nod": "X",
            
                                    /* GDI Defense Units */
                                    "GDI_Wall": "w",
                                    "GDI_Cannon": "c",
                                    "GDI_Antitank Barrier": "t",
                                    "GDI_Barbwire": "b",
                                    "GDI_Turret": "m",
                                    "GDI_Flak": "f",
                                    "GDI_Art Inf": "r",
                                    "GDI_Art Air": "e",
                                    "GDI_Art Tank": "a",
                                    "GDI_Def_APC Guardian": "g",
                                    "GDI_Def_Missile Squad": "q",
                                    "GDI_Def_Pitbull": "p",
                                    "GDI_Def_Predator": "d",
                                    "GDI_Def_Sniper": "s",
                                    "GDI_Def_Zone Trooper": "z",
            
                                    /* Nod Defense Units */
                                    "NOD_Def_Antitank Barrier": "t",
                                    "NOD_Def_Art Air": "e",
                                    "NOD_Def_Art Inf": "r",
                                    "NOD_Def_Art Tank": "a",
                                    "NOD_Def_Attack Bike": "p",
                                    "NOD_Def_Barbwire": "b",
                                    "NOD_Def_Black Hand": "z",
                                    "NOD_Def_Cannon": "c",
                                    "NOD_Def_Confessor": "s",
                                    "NOD_Def_Flak": "f",
                                    "NOD_Def_MG Nest": "m",
                                    "NOD_Def_Militant Rocket Soldiers": "q",
                                    "NOD_Def_Reckoner": "g",
                                    "NOD_Def_Scorpion Tank": "d",
                                    "NOD_Def_Wall": "w",
            
                                    /* GDI Offense Units */
                                    "GDI_APC Guardian": "g",
                                    "GDI_Commando": "c",
                                    "GDI_Firehawk": "f",
                                    "GDI_Juggernaut": "j",
                                    "GDI_Kodiak": "k",
                                    "GDI_Mammoth": "m",
                                    "GDI_Missile Squad": "q",
                                    "GDI_Orca": "o",
                                    "GDI_Paladin": "a",
                                    "GDI_Pitbull": "p",
                                    "GDI_Predator": "d",
                                    "GDI_Riflemen": "r",
                                    "GDI_Sniper Team": "s",
                                    "GDI_Zone Trooper": "z",
            
                                    /* Nod Offense Units */
                                    "NOD_Attack Bike": "b",
                                    "NOD_Avatar": "a",
                                    "NOD_Black Hand": "z",
                                    "NOD_Cobra": "r",
                                    "NOD_Commando": "c",
                                    "NOD_Confessor": "s",
                                    "NOD_Militant Rocket Soldiers": "q",
                                    "NOD_Militants": "m",
                                    "NOD_Reckoner": "k",
                                    "NOD_Salamander": "l",
                                    "NOD_Scorpion Tank": "o",
                                    "NOD_Specter Artilery": "p",
                                    "NOD_Venom": "v",
                                    "NOD_Vertigo": "t",
            
                                    "<last>": "."
                                },
                                make_sharelink: function (_baseId, _baseName, _faction) {
                                    try {
                                        var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(_baseId);
                                        var own_city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                        var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                                        var server = ClientLib.Data.MainData.GetInstance().get_Server();
                                        // var tbase = base;
                                        // var tcity = city;
                                        // var scity = own_city;
                                        var link = "http://cncopt.com/?map=3|";
                                        switch(_faction)
                                        {
                                            case 1:
                                                /* GDI */
                                                link += "G|G|";
                                                break;
                                            case 2:
                                                /* NOD */
                                                link += "N|N|";
                                                break;
                                        }
                                        link += _baseName + "|";
                                        var Defense_units = [];
                                        for (var i = 0; i < 20; ++i) {
                                            var col = [];
                                            for (var j = 0; j < 9; ++j) {
                                                col.push(null);
                                            }
                                            Defense_units.push(col);
                                        }
                                        var Defense_unit_list = _self.getDefenseUnits(city);
                                        if (PerforceChangelist >= 376877) {
                                            for (var i in Defense_unit_list) {
                                                var unit = Defense_unit_list[i];
                                                Defense_units[unit.get_CoordX()][unit.get_CoordY() + 8] = unit;
                                            }
                                        } else {
                                            for (var i = 0; i < Defense_unit_list.length; ++i) {
                                                var unit = Defense_unit_list[i];
                                                Defense_units[unit.get_CoordX()][unit.get_CoordY() + 8] = unit;
                                            }
                                        }
            
                                        var offense_units = [];
                                        for (var i = 0; i < 20; ++i) {
                                            var col = [];
                                            for (var j = 0; j < 9; ++j) {
                                                col.push(null);
                                            }
                                            offense_units.push(col);
                                        }
            
                                        if (city.get_CityFaction() == 1 || city.get_CityFaction() == 2) {
                                            var offense_unit_list = _self.getOffenseUnits(city);
                                        }
                                        else {
                                            var offense_unit_list = _self.getOffenseUnits(own_city);
                                        }
                                        if (PerforceChangelist >= 376877) {
                                            for (var i in offense_unit_list) {
                                                var unit = offense_unit_list[i];
                                                offense_units[unit.get_CoordX()][unit.get_CoordY() + 16] = unit;
                                            }
                                        } else {
                                            for (var i = 0; i < offense_unit_list.length; ++i) {
                                                var unit = offense_unit_list[i];
                                                offense_units[unit.get_CoordX()][unit.get_CoordY() + 16] = unit;
                                            }
                                        }
            
                                        var techLayout = _self.findTechLayout(city);
                                        var buildings = _self.findBuildings(city);
                                        for (var i = 0; i < 20; ++i) {
                                            // row = [];
                                            for (var j = 0; j < 9; ++j) {
                                                var spot = i > 16 ? null : techLayout[j][i];
                                                var level = 0;
                                                var building = null;
                                                if (spot && spot.BuildingIndex >= 0) {
                                                    building = buildings[spot.BuildingIndex];
                                                    level = building.get_CurrentLevel();
                                                }
                                                var Defense_unit = Defense_units[j][i];
                                                if (Defense_unit) {
                                                    level = Defense_unit.get_CurrentLevel();
                                                }
                                                var offense_unit = offense_units[j][i];
                                                if (offense_unit) {
                                                    level = offense_unit.get_CurrentLevel();
                                                }
                                                if (level > 1) {
                                                    link += level;
                                                }
            
                                                switch (i > 16 ? 0 : city.GetResourceType(j, i)) {
                                                    case 0:
                                                        if (building) {
                                                            var techId = building.get_MdbBuildingId();
                                                            if (GAMEDATA.Tech[techId].n in cncopt.keymap) {
                                                                link += cncopt.keymap[GAMEDATA.Tech[techId].n];
                                                            } else {
                                                                console.log("cncopt [5]: Unhandled building: " + techId, building);
                                                                link += ".";
                                                            }
                                                        } else if (Defense_unit) {
                                                            if (Defense_unit.get_UnitGameData_Obj().n in cncopt.keymap) {
                                                                link += cncopt.keymap[Defense_unit.get_UnitGameData_Obj().n];
                                                            } else {
                                                                console.log("cncopt [5]: Unhandled unit: " + Defense_unit.get_UnitGameData_Obj().n);
                                                                link += ".";
                                                            }
                                                        } else if (offense_unit) {
                                                            if (offense_unit.get_UnitGameData_Obj().n in cncopt.keymap) {
                                                                link += cncopt.keymap[offense_unit.get_UnitGameData_Obj().n];
                                                            } else {
                                                                console.log("cncopt [5]: Unhandled unit: " + offense_unit.get_UnitGameData_Obj().n);
                                                                link += ".";
                                                            }
                                                        } else {
                                                            link += ".";
                                                        }
                                                        break;
                                                    case 1:
                                                        /* Crystal */
                                                        if (spot.BuildingIndex < 0) link += "c";
                                                        else link += "n";
                                                        break;
                                                    case 2:
                                                        /* Tiberium */
                                                        if (spot.BuildingIndex < 0) link += "t";
                                                        else link += "h";
                                                        break;
                                                    case 4:
                                                        /* Woods */
                                                        link += "j";
                                                        break;
                                                    case 5:
                                                        /* Scrub */
                                                        link += "h";
                                                        break;
                                                    case 6:
                                                        /* Oil */
                                                        link += "l";
                                                        break;
                                                    case 7:
                                                        /* Swamp */
                                                        link += "k";
                                                        break;
                                                    Default:
                                                        console.log("cncopt [4]: Unhandled resource type: " + city.GetResourceType(j, i));
                                                        link += ".";
                                                        break;
                                                }
                                            }
                                        }
                                        /* Tack on our alliance bonuses */
                                        if (alliance && own_city.get_AllianceId() == city.get_AllianceId()) {
                                            link += "|" + alliance.get_POITiberiumBonus();
                                            link += "|" + alliance.get_POICrystalBonus();
                                            link += "|" + alliance.get_POIPowerBonus();
                                            link += "|" + alliance.get_POIInfantryBonus();
                                            link += "|" + alliance.get_POIVehicleBonus();
                                            link += "|" + alliance.get_POIAirBonus();
                                            link += "|" + alliance.get_POIDefenseBonus();
                                        }
                                        if (server.get_TechLevelUpgradeFactorBonusAmount() != 1.20) {
                                            link += "|newEconomy";
                                        }
                                        _self.linkBase = link;
                                    } catch (e) {
                                        console.log("cncopt [1]: ", e);
                                    }
                                }
                            };
                            cncopt.make_sharelink(_baseId, _baseName, _faction);
                        },
                        collectStats: function()
                        {
                            try
                            {
                                var AllianceId = ClientLib.Data.MainData.GetInstance().get_Alliance().get_Id();
                                if (AllianceId > 0)
                                {
                                    this.ObjectData.server = {};
                                    this.ObjectData.alliance = {};
                                    this.ObjectData.player = {};
                                    this.ObjectData.bases = [];
                                    this.ObjectData.substitution = {};
                                    this.ObjectData.substitution.incoming = [];
                                    this.ObjectData.substitution.outgoing = '';
                                    this.ObjectData.substitution.active = [];
                                    var WorldId = ClientLib.Data.MainData.GetInstance().get_Server().get_WorldId();
                                    var ServerName = ClientLib.Data.MainData.GetInstance().get_Server().get_Name().trim();
                                    var SeasonServer = ClientLib.Data.MainData.GetInstance().get_Server().get_IsSeasonServer();
                                    // Alliance
                                    var AllianceName = ClientLib.Data.MainData.GetInstance().get_Alliance().get_Name();
                                    var AllianceRank = ClientLib.Data.MainData.GetInstance().get_Alliance().get_Rank();
                                    var AllianceEventRank = ClientLib.Data.MainData.GetInstance().get_Alliance().get_EventRank();
                                    var AllianceTotalScore = ClientLib.Data.MainData.GetInstance().get_Alliance().get_TotalScore();
                                    var AllianceAverageScore = ClientLib.Data.MainData.GetInstance().get_Alliance().get_AverageScore();
                                    var AllianceVeteranPoints = ClientLib.Data.MainData.GetInstance().get_Alliance().get_EventScore();
                                    var AllianceProdVetPoints = 0;
                                    try
                                    {
                                        for (i = 0; i < ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnShieldHubs().length; i++)
                                        {
                                            AllianceProdVetPoints += ClientLib.Data.MainData.GetInstance().get_Server().GetControlHubVeteranPointsProduction(ClientLib.Data.MainData.GetInstance().get_Alliance().get_OwnShieldHubs()[i].l);
                                        }
                                    }
                                    catch(e){}
                                    // Bonus
                                    var BonusTiberium = ClientLib.Data.MainData.GetInstance().get_Alliance().GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Tiberium);
                                    var BonusCrystal = ClientLib.Data.MainData.GetInstance().get_Alliance().GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Crystal);
                                    var BonusPower = ClientLib.Data.MainData.GetInstance().get_Alliance().GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Power);
                                    var BonusInfantrie = ClientLib.Data.MainData.GetInstance().get_Alliance().get_POIInfantryBonus();
                                    var BonusVehicle = ClientLib.Data.MainData.GetInstance().get_Alliance().get_POIVehicleBonus();
                                    var BonusAir = ClientLib.Data.MainData.GetInstance().get_Alliance().get_POIAirBonus();
                                    var BonusDef = ClientLib.Data.MainData.GetInstance().get_Alliance().get_POIDefenseBonus();
                                    var Ranks = ClientLib.Data.MainData.GetInstance().get_Alliance().get_POIRankScore();
                                    var RankTib = Ranks[0].r;
                                    var RankCry = Ranks[1].r;
                                    var RankPow = Ranks[2].r;
                                    var RankInf = Ranks[3].r;
                                    var RankVeh = Ranks[4].r;
                                    var RankAir = Ranks[5].r;
                                    var RankDef = Ranks[6].r;
                                    var ScoreTib = Ranks[0].s;
                                    var ScoreCry = Ranks[1].s;
                                    var ScorePow = Ranks[2].s;
                                    var ScoreInf = Ranks[3].s;
                                    var ScoreVeh = Ranks[4].s;
                                    var ScoreAir = Ranks[5].s;
                                    var ScoreDef = Ranks[6].s;
                                    // Player
                                    var AccountId = ClientLib.Data.MainData.GetInstance().get_Player().get_AccountId();
                                    var PlayerName = ClientLib.Data.MainData.GetInstance().get_Player().get_Name();
                                    var PlayerScorePoints = ClientLib.Data.MainData.GetInstance().get_Player().get_ScorePoints();
                                    var PlayerRank = ClientLib.Data.MainData.GetInstance().get_Player().get_OverallRank();
                                    var PlayerEventRank = ClientLib.Data.MainData.GetInstance().get_Player().get_EventRank();
                                    var PlayerVeteranPoints = ClientLib.Data.MainData.GetInstance().get_Player().get_EventScore();
                                    var ResearchPoints = ClientLib.Data.MainData.GetInstance().get_Player().get_ResearchPoints();
                                    var Credits = ClientLib.Data.MainData.GetInstance().get_Player().get_Credits().Base;
                                    var Funds = ClientLib.Data.MainData.GetInstance().get_Inventory().get_PlayerFunds();
                                    var LegacyPoints = ClientLib.Data.MainData.GetInstance().get_Player().get_LegacyPoints();
                                    var CommandPointsMaxStorage = ClientLib.Data.MainData.GetInstance().get_Player().GetCommandPointMaxStorage();
                                    var CommandPointsCurrent = ClientLib.Data.MainData.GetInstance().get_Player().GetCommandPointCount();
                                    var Faction = ClientLib.Data.MainData.GetInstance().get_Player().get_Faction();
                                    var MemberRole = ClientLib.Data.MainData.GetInstance().get_Alliance().get_CurrentMemberRoleInfo().SortOrder;
                                    // Basen
                                    var bases = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
                                    var CountBases = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().c;
                                    var LvLSumBase = 0;
                                    var LvLSumOff = 0;
                                    var LvLSumDef = 0;
                                    var LvLHighestOff = 0;
                                    var LvLHighestDef = 0;
                                    var LvLSumDF = 0;
                                    var LvLSumSup = 0;
                                    var CountSup = 0;
                                    var ProductionTiberium = 0;
                                    var ProductionCrystal = 0;
                                    var ProductionPower = 0;
                                    var ProductionCredits = 0;
                                    var repairMaxTime = 0;
                                    for (var key in bases)
                                    {
                                        var base = bases[key];
                                        var LvLDF = 0;
                                        var BaseId = base.get_Id();
                                        var Name = base.get_Name();
                                        var LvLCY = base.get_ConstructionYardLevel();
                                        var LvLBase = base.get_LvlBase();
                                        var LvLOffense = base.get_LvlOffense();
                                        var LvLDefense = base.get_LvlDefense();
                                        if (base.GetResourceMaxStorage(ClientLib.Base.EResourceType.RepairChargeInf) > repairMaxTime)
                                        {
                                            repairMaxTime = base.GetResourceMaxStorage(ClientLib.Base.EResourceType.RepairChargeInf);
                                        }
                                        var repairCurrentTime = base.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf);
                                        var unitData = base.get_CityBuildingsData();
                                        var df = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Defense_Facility);
                                        if (df !== null)
                                        {
                                            LvLDF = df.get_CurrentLevel();
                                            LvLSumDF += df.get_CurrentLevel();
                                        }
                                        LvLSumBase += base.get_LvlBase();
                                        LvLSumOff += base.get_LvlOffense();
                                        LvLSumDef += base.get_LvlDefense();
                                        if (base.get_LvlOffense() > LvLHighestOff)
                                        {
                                            LvLHighestOff = base.get_LvlOffense();
                                        }
                                        if (base.get_LvlDefense() > LvLHighestDef)
                                        {
                                            LvLHighestDef = base.get_LvlDefense();
                                        }
                                        var LvLSupport = 0;
                                        var SupArt = "";
                                        if (base.get_SupportData() !== null)
                                        {
                                            LvLSupport = base.get_SupportData().get_Level();
                                            SupArt = base.get_SupportWeapon().n.replace(/NOD_SUPPORT_/gi,"").replace(/GDI_SUPPORT_/gi,"").replace(/FOR_SUPPORT_/gi,"");
                                            LvLSumSup += base.get_SupportData().get_Level();
                                            CountSup++;
                                        }
                                        var TiberiumPerHour = parseInt(base.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false) + base.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Tiberium) + ClientLib.Data.MainData.GetInstance().get_Alliance().GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Tiberium));
                                        var CrystalPerHour = parseInt(base.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false) + base.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Crystal) + ClientLib.Data.MainData.GetInstance().get_Alliance().GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Crystal));
                                        var PowerPerHour = parseInt(base.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false) + base.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power) + ClientLib.Data.MainData.GetInstance().get_Alliance().GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Power));
                                        var CreditsPerHour = parseInt(ClientLib.Base.Resource.GetResourceGrowPerHour(base.get_CityCreditsProduction(), false) + ClientLib.Base.Resource.GetResourceBonusGrowPerHour(base.get_CityCreditsProduction(), false));
                                        ProductionTiberium += TiberiumPerHour;
                                        ProductionCrystal += CrystalPerHour;
                                        ProductionPower += PowerPerHour;
                                        ProductionCredits += CreditsPerHour;
                                        // Basen
                                        var ObjectBase = {};
                                        ObjectBase.BaseId = BaseId;
                                        ObjectBase.Name = Name;
                                        ObjectBase.LvLCY = LvLCY;
                                        ObjectBase.LvLBase = LvLBase;
                                        ObjectBase.LvLOffense = LvLOffense;
                                        ObjectBase.LvLDefense = LvLDefense;
                                        ObjectBase.LvLDF = LvLDF;
                                        ObjectBase.LvLSupport = LvLSupport;
                                        ObjectBase.SupArt = SupArt;
                                        ObjectBase.TiberiumPerHour = TiberiumPerHour;
                                        ObjectBase.CrystalPerHour = CrystalPerHour;
                                        ObjectBase.PowerPerHour = PowerPerHour;
                                        ObjectBase.CreditsPerHour = CreditsPerHour;
                                        ObjectBase.CurrentRepairTime = repairCurrentTime;
                                        this.CnCOpt(BaseId, Name, Faction);
                                        ObjectBase.CnCOpt = this.linkBase;
                                        this.ObjectData.bases.push(ObjectBase);
                                        this.linkBase = '';
                                    }
                                    var AverageBase = LvLSumBase / CountBases;
                                    var AverageOff = LvLSumOff / CountBases;
                                    var AverageDef = LvLSumDef / CountBases;
                                    var AverageDF = LvLSumDF / CountBases;
                                    var AverageSup = LvLSumSup / CountBases;
                                    // Server
                                    this.ObjectData.server.WorldId = WorldId;
                                    this.ObjectData.server.ServerName = ServerName;
                                    this.ObjectData.server.SeasonServer = SeasonServer;
                                    // Alliance
                                    this.ObjectData.alliance.AllianceId = AllianceId;
                                    this.ObjectData.alliance.AllianceName = AllianceName;
                                    this.ObjectData.alliance.AllianceRank = AllianceRank;
                                    this.ObjectData.alliance.AllianceEventRank = AllianceEventRank;
                                    this.ObjectData.alliance.AllianceTotalScore = AllianceTotalScore;
                                    this.ObjectData.alliance.AllianceAverageScore = AllianceAverageScore;
                                    this.ObjectData.alliance.AllianceVeteranPoints = AllianceVeteranPoints;
                                    this.ObjectData.alliance.AllianceProdVetPoints = AllianceProdVetPoints;
                                    this.ObjectData.alliance.BonusTiberium = BonusTiberium;
                                    this.ObjectData.alliance.BonusCrystal = BonusCrystal;
                                    this.ObjectData.alliance.BonusPower = BonusPower;
                                    this.ObjectData.alliance.BonusInfantrie = BonusInfantrie;
                                    this.ObjectData.alliance.BonusVehicle = BonusVehicle;
                                    this.ObjectData.alliance.BonusAir = BonusAir;
                                    this.ObjectData.alliance.BonusDef = BonusDef;
                                    this.ObjectData.alliance.RankTib = RankTib;
                                    this.ObjectData.alliance.RankCry = RankCry;
                                    this.ObjectData.alliance.RankPow = RankPow;
                                    this.ObjectData.alliance.RankInf = RankInf;
                                    this.ObjectData.alliance.RankVeh = RankVeh;
                                    this.ObjectData.alliance.RankAir = RankAir;
                                    this.ObjectData.alliance.RankDef = RankDef;
                                    this.ObjectData.alliance.ScoreTib = ScoreTib;
                                    this.ObjectData.alliance.ScoreCry = ScoreCry;
                                    this.ObjectData.alliance.ScorePow = ScorePow;
                                    this.ObjectData.alliance.ScoreInf = ScoreInf;
                                    this.ObjectData.alliance.ScoreVeh = ScoreVeh;
                                    this.ObjectData.alliance.ScoreAir = ScoreAir;
                                    this.ObjectData.alliance.ScoreDef = ScoreDef;
                                    // Player
                                    this.ObjectData.player.AccountId = AccountId;
                                    this.ObjectData.player.PlayerName = PlayerName;
                                    this.ObjectData.player.PlayerScorePoints = PlayerScorePoints;
                                    this.ObjectData.player.CountBases = CountBases;
                                    this.ObjectData.player.CountSup = CountSup;
                                    this.ObjectData.player.PlayerRank = PlayerRank;
                                    this.ObjectData.player.PlayerEventRank = PlayerEventRank;
                                    this.ObjectData.player.PlayerVeteranPoints = PlayerVeteranPoints;
                                    this.ObjectData.player.ResearchPoints = ResearchPoints;
                                    this.ObjectData.player.Credits = Credits;
                                    this.ObjectData.player.Funds = Funds;
                                    this.ObjectData.player.LegacyPoints = LegacyPoints;
                                    this.ObjectData.player.CommandPointsMaxStorage = CommandPointsMaxStorage;
                                    this.ObjectData.player.CommandPointsCurrent = CommandPointsCurrent;
                                    this.ObjectData.player.Faction = Faction;
                                    this.ObjectData.player.MemberRole = MemberRole;
                                    this.ObjectData.player.LvLHighestOff = LvLHighestOff;
                                    this.ObjectData.player.LvLHighestDef = LvLHighestDef;
                                    this.ObjectData.player.AverageBase = AverageBase;
                                    this.ObjectData.player.AverageOff = AverageOff;
                                    this.ObjectData.player.AverageDef = AverageDef;
                                    this.ObjectData.player.AverageDF = AverageDF;
                                    this.ObjectData.player.AverageSup = AverageSup;
                                    this.ObjectData.player.ProductionTiberium = ProductionTiberium;
                                    this.ObjectData.player.ProductionCrystal = ProductionCrystal;
                                    this.ObjectData.player.ProductionPower = ProductionPower;
                                    this.ObjectData.player.ProductionCredits = ProductionCredits;
                                    this.ObjectData.player.MaxRepairTime = repairMaxTime;
                                    // Vertretung
                                    if (ClientLib.Data.MainData.GetInstance().get_PlayerSubstitution().getOutgoing())
                                    {
                                        this.ObjectData.substitution.outgoing = ClientLib.Data.MainData.GetInstance().get_PlayerSubstitution().getOutgoing().n;
                                    }
                                    var incomingSubs = ClientLib.Data.MainData.GetInstance().get_PlayerSubstitution().getIncoming();
                                    for (var i = 0; i < incomingSubs.length; i++)
                                    {
                                        this.ObjectData.substitution.incoming.push(incomingSubs[i].n);
                                    }
                                    var activeSubs = ClientLib.Data.MainData.GetInstance().get_PlayerSubstitution().getSubstitution();
                                    for (var i = 0; i < activeSubs.length; i++)
                                    {
                                        this.ObjectData.substitution.active.push(activeSubs[i].n);
                                    }
                                    // Abschüsse für Player
                                    var _self = this;
                                    ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("GetPublicPlayerInfoByName", {
                                        name : PlayerName
                                    }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, _self.Shoots), null);
                                    // Anfrage absenden
                                    this.sendDataFromInGame();
                                    var _self = this;
                                    window.setTimeout(function()
                                    {
                                        _self.collectStats();
                                    }, 3600000);
                                }
                                else
                                {
                                    var _self = this;
                                    window.setTimeout(function()
                                    {
                                        _self.collectStats();
                                    }, 1000);
                                }
                            }
                            catch(e)
                            {
                                console.log(e);
                            }
                        },
                        Shoots: function(_context, _data)
                        {
                            this.ObjectData.player.Shoot = _data.bd;
                            this.ObjectData.player.PvP = _data.bd - _data.bde;
                            this.ObjectData.player.PvE = _data.bde;
                        },
                        sendChatInfo: function(_dataAnswer)
                        {
                            var stringChat = '';
                            if (_dataAnswer[0] == 0 && !ClientLib.Data.MainData.GetInstance().get_Player().get_IsSubstituted())
                            {
                                stringChat = "/w " + this.ObjectData.player.PlayerName + " Hallo " + this.ObjectData.player.PlayerName + ", um zu leoStats zu gelangen, klicke auf [url]" + linkToRoot + "[/url]. Dein Benutzername ist \"" + this.ObjectData.player.PlayerName + "\" und dein Standardpasswort: \"" + this.ObjectData.player.PlayerName + "_" + this.ObjectData.player.AccountId + "\"";
                            }
                            else
                            {
                                stringChat = "/w " + this.ObjectData.player.PlayerName + " Hallo " + this.ObjectData.player.PlayerName + ", um zu leoStats zu gelangen, klicke auf [url]" + linkToRoot + "[/url].";
                            }
                            qx.core.Init.getApplication().getChat().getChatWidget().send(stringChat);
                        },
                        sendDataFromInGame: function()
                        {
                            if (this.ObjectData != undefined)
                            {
                                var ObjectSend = {action:"sendDataFromInGame", ObjectData:this.ObjectData};
                                var _self = this;
                                $.post(linkToRoot + 'php/manageBackend.php', ObjectSend)
                                .always(function(_data)
                                {
                                    if (_self.sendChatInfoStatus)
                                    {
                                        _self.sendChatInfo(_data);
                                        _self.sendChatInfoStatus = false;
                                    }
                                });
                            }
                            else
                            {
                                setTimeout(this.sendDataFromInGame, 1000);
                            }
                        }
                    }
                });
                leoStats.getInstance().initialize();
                qx.Class.define('BaseScanner',
                {
                    type: 'singleton',
                    extend: qx.core.Object,
                    construct: function ()
                    {
                        console.log('create BaseScanner...');
                    },
                    members:
                    {
                        initialize: function()
                        {
                            this.app = qx.core.Init.getApplication();
                            // BaseScanner
                            this.ArrayLayouts = [];
                            this.ArrayScannedIds = [];
                            this.ScriptIsRunning = false;
                            this.buttonBaseScanner = new qx.ui.form.Button('Start BaseScanner...').set(
                            {
                                center: true,
                                rich: true
                            });
                            this.buttonBaseScanner.addListener('click', function()
                            {
                                if (this.ScriptIsRunning)
                                {
                                    this.stopBaseScan();
                                }
                                else
                                {
                                    this.startBaseScan();
                                }
                            }, this);
                            this.app.getDesktop().add(this.buttonBaseScanner,
                            {
                                right: 125,
                                top: 24
                            });
                        },
                        startBaseScan: function()
                        {
                            this.ScriptIsRunning = true;
                            this.buttonBaseScanner.setLabel('Stop BaseScanner...');
                            this.startScan();
                        },
                        stopBaseScan: function()
                        {
                            this.ScriptIsRunning = false;
                            this.buttonBaseScanner.setLabel('Start BaseScanner...');
                            this.stopScan();
                        },
                        initializeDefaultValues: function()
                        {
                            this.attRange = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxAttackDistance();
                            this.ArrayPrototypeGameObjectType2 = [];
                            this.ArrayPrototypeGameObjectType3 = [];
                            this.ArrayIdsForScan = [];
                            this.errorCounter = 0;
                        },
                        getArrayPrototypeGameObject: function()
                        {
                            var bases = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
                            for (var key in bases)
                            {
                                var baseX = bases[key].get_X();
                                var baseY = bases[key].get_Y();
                                var goalXType2 = 0;
                                var goalYType2 = 0;
                                var goalXType3 = 0;
                                var goalYType3 = 0;
                                for (var x = baseX - 10; x < baseX + 10; x++)
                                {
                                    for (var y = baseY - 10; y < baseY + 10; y++)
                                    {
                                        var curObject = ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(x, y);
                                        if (curObject != null)
                                        {
                                            if (curObject.Type == 2 && !goalXType2 && !goalYType2)
                                            {
                                                goalXType2 = x;
                                                goalYType2 = y;
                                            }
                                            else if (curObject.Type == 3 && !goalXType3 && !goalYType3)
                                            {
                                                goalXType3 = x;
                                                goalYType3 = y;
                                            }
                                            else if (goalXType2 && goalYType2 && goalXType3 && goalYType3)
                                            {
                                                break;
                                            }
                                        }
                                    }
                                    if (goalXType2 && goalYType2 && goalXType3 && goalYType3)
                                    {
                                        break;
                                    }
                                }
                                if (goalXType2 && goalYType2 && goalXType3 && goalYType3)
                                {
                                    break;
                                }
                            }
                            for (var key in ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(goalXType2, goalYType2))
                            {
                                this.ArrayPrototypeGameObjectType2.push(key);
                            }
                            for (var key in ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(goalXType3, goalYType3))
                            {
                                this.ArrayPrototypeGameObjectType3.push(key);
                            }
                        },
                        returnLayoutOfCurBaseAndEvaluateIt: function()
                        {
                            var ArrayBaseResourceFields = new Array(8).fill().map(x => new Array(9).fill());
                            var curCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity();
                            for (var y = 0; y < 8; y++)
                            {
                                for (var x = 0; x < 9; x++)
                                {
                                    if (curCity.GetResourceType(x, y))
                                    {
                                        // 1 = Crystal
                                        // 2 = Tiberium
                                        ArrayBaseResourceFields[y][x] = curCity.GetResourceType(x, y);
                                    }
                                }
                            }
                            var posX = curCity.get_X();
                            var posY = curCity.get_Y();
                            var Tiberium6 = 0;
                            var Tiberium5 = 0;
                            var Tiberium4 = 0;
                            var Tiberium3 = 0;
                            var Tiberium2 = 0;
                            var Tiberium1 = 0;
                            var Crystal6 = 0;
                            var Crystal5 = 0;
                            var Crystal4 = 0;
                            var Crystal3 = 0;
                            var Crystal2 = 0;
                            var Crystal1 = 0;
                            var Mixed6 = 0;
                            var Mixed5 = 0;
                            var Mixed4 = 0;
                            var Mixed3 = 0;
                            var Mixed2 = 0;
                            var Mixed1 = 0;
                            var Power8 = 0;
                            var Power7 = 0;
                            var Power6 = 0;
                            var Power5 = 0;
                            var Power4 = 0;
                            var Power3 = 0;
                            var Power2 = 0;
                            for (var y = 0; y < 8; y++)
                            {
                                for (var x = 0; x < 9; x++)
                                {
                                    if (ArrayBaseResourceFields[y][x] == undefined) // das Feld darf nicht belegt sein - schließlich kann man auf belegte Felder nichts stellen
                                    {
                                        var curTibConn = 0;
                                        var curCryConn = 0;
                                        var curMixConn = 0;
                                        var curPowConn = 0;
                                        // Feld links oben
                                        if (x == 0 && y == 0)
                                        {
                                            // Feld rechts
                                            if (ArrayBaseResourceFields[y][x + 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y][x + 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld rechts unten
                                            if (ArrayBaseResourceFields[y + 1][x + 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y + 1][x + 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld unten
                                            if (ArrayBaseResourceFields[y + 1][x] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y + 1][x] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                        }
                                        // Feld rechts oben
                                        else if (x == 8 && y == 0)
                                        {
                                            // Feld links
                                            if (ArrayBaseResourceFields[y][x - 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y][x - 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld links unten
                                            if (ArrayBaseResourceFields[y + 1][x - 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y + 1][x - 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld unten
                                            if (ArrayBaseResourceFields[y + 1][x] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y + 1][x] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                        }
                                        // Felder oben
                                        else if (y == 0)
                                        {
                                            // Feld links
                                            if (ArrayBaseResourceFields[y][x - 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y][x - 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld links unten
                                            if (ArrayBaseResourceFields[y + 1][x - 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y + 1][x - 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld unten
                                            if (ArrayBaseResourceFields[y + 1][x] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y + 1][x] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld rechts unten
                                            if (ArrayBaseResourceFields[y + 1][x + 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y + 1][x + 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld rechts
                                            if (ArrayBaseResourceFields[y][x + 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y][x + 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                        }
                                        // Feld links unten
                                        else if (x == 0 && y == 7)
                                        {
                                            // Feld oben
                                            if (ArrayBaseResourceFields[y - 1][x] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y - 1][x] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld rechts oben
                                            if (ArrayBaseResourceFields[y - 1][x + 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y - 1][x + 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld rechts
                                            if (ArrayBaseResourceFields[y][x + 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y][x + 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                        }
                                        // Felder links
                                        else if (x == 0)
                                        {
                                            // Feld oben
                                            if (ArrayBaseResourceFields[y - 1][x] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y - 1][x] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld rechts oben
                                            if (ArrayBaseResourceFields[y - 1][x + 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y - 1][x + 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld rechts
                                            if (ArrayBaseResourceFields[y][x + 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y][x + 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld rechts unten
                                            if (ArrayBaseResourceFields[y + 1][x + 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y + 1][x + 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld unten
                                            if (ArrayBaseResourceFields[y + 1][x] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y + 1][x] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                        }
                                        // Feld rechts unten
                                        else if (x == 8 && y == 7)
                                        {
                                            // Feld links
                                            if (ArrayBaseResourceFields[y][x - 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y][x - 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld links oben
                                            if (ArrayBaseResourceFields[y - 1][x - 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y - 1][x - 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld oben
                                            if (ArrayBaseResourceFields[y - 1][x] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y - 1][x] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                        }
                                        // Felder unten
                                        else if (y == 7)
                                        {
                                            // Feld links
                                            if (ArrayBaseResourceFields[y][x - 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y][x - 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld links oben
                                            if (ArrayBaseResourceFields[y - 1][x - 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y - 1][x - 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld oben
                                            if (ArrayBaseResourceFields[y - 1][x] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y - 1][x] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld rechts oben
                                            if (ArrayBaseResourceFields[y - 1][x + 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y - 1][x + 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld rechts
                                            if (ArrayBaseResourceFields[y][x + 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y][x + 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                        }
                                        // Felder rechts
                                        else if (x == 8)
                                        {
                                            // Feld oben
                                            if (ArrayBaseResourceFields[y - 1][x] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y - 1][x] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld links oben
                                            if (ArrayBaseResourceFields[y - 1][x - 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y - 1][x - 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld links
                                            if (ArrayBaseResourceFields[y][x - 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y][x - 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld links unten
                                            if (ArrayBaseResourceFields[y + 1][x - 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y + 1][x - 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld unten
                                            if (ArrayBaseResourceFields[y + 1][x] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y + 1][x] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                        }
                                        // Felder Mitte
                                        else
                                        {
                                            // Feld oben
                                            if (ArrayBaseResourceFields[y - 1][x] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y - 1][x] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld rechts oben
                                            if (ArrayBaseResourceFields[y - 1][x + 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y - 1][x + 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld rechts
                                            if (ArrayBaseResourceFields[y][x + 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y][x + 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }// Feld rechts unten
                                            if (ArrayBaseResourceFields[y + 1][x + 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y + 1][x + 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld unten
                                            if (ArrayBaseResourceFields[y + 1][x] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y + 1][x] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld links unten
                                            if (ArrayBaseResourceFields[y + 1][x - 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y + 1][x - 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld links
                                            if (ArrayBaseResourceFields[y][x - 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y][x - 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                            // Feld links oben
                                            if (ArrayBaseResourceFields[y - 1][x - 1] == 1)
                                            {
                                                curCryConn++;
                                                curMixConn++;
                                            }
                                            else if (ArrayBaseResourceFields[y - 1][x - 1] == 2)
                                            {
                                                curTibConn++;
                                                curMixConn++;
                                            }
                                            else
                                            {
                                                curPowConn++;
                                            }
                                        }
                                        switch(curTibConn)
                                        {
                                            case 6:
                                            {
                                                Tiberium6++;
                                                break;
                                            }
                                            case 5:
                                            {
                                                Tiberium5++;
                                                break;
                                            }
                                            case 4:
                                            {
                                                Tiberium4++;
                                                break;
                                            }
                                            case 3:
                                            {
                                                Tiberium3++;
                                                break;
                                            }
                                            case 2:
                                            {
                                                Tiberium2++;
                                                break;
                                            }
                                            case 1:
                                            {
                                                Tiberium1++;
                                                break;
                                            }
                                            default:
                                            {
                                                break;
                                            }
                                        }
                                        switch(curCryConn)
                                        {
                                            case 6:
                                            {
                                                Crystal6++;
                                                break;
                                            }
                                            case 5:
                                            {
                                                Crystal5++;
                                                break;
                                            }
                                            case 4:
                                            {
                                                Crystal4++;
                                                break;
                                            }
                                            case 3:
                                            {
                                                Crystal3++;
                                                break;
                                            }
                                            case 2:
                                            {
                                                Crystal2++;
                                                break;
                                            }
                                            case 1:
                                            {
                                                Crystal1++;
                                                break;
                                            }
                                            default:
                                            {
                                                break;
                                            }
                                        }
                                        switch(curMixConn)
                                        {
                                            case 6:
                                            {
                                                Mixed6++;
                                                break;
                                            }
                                            case 5:
                                            {
                                                Mixed5++;
                                                break;
                                            }
                                            case 4:
                                            {
                                                Mixed4++;
                                                break;
                                            }
                                            case 3:
                                            {
                                                Mixed3++;
                                                break;
                                            }
                                            case 2:
                                            {
                                                Mixed2++;
                                                break;
                                            }
                                            case 1:
                                            {
                                                Mixed1++;
                                                break;
                                            }
                                            default:
                                            {
                                                break;
                                            }
                                        }
                                        switch(curPowConn)
                                        {
                                            case 8:
                                            {
                                                Power8++;
                                                break;
                                            }
                                            case 7:
                                            {
                                                Power7++;
                                                break;
                                            }
                                            case 6:
                                            {
                                                Power6++;
                                                break;
                                            }
                                            case 5:
                                            {
                                                Power5++;
                                                break;
                                            }
                                            case 4:
                                            {
                                                Power4++;
                                                break;
                                            }
                                            case 3:
                                            {
                                                Power3++;
                                                break;
                                            }
                                            case 2:
                                            {
                                                Power2++;
                                                break;
                                            }
                                            default:
                                            {
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            return {
                                'Zeit': Date.now(),
                                'PosX': posX,
                                'PosY': posY,
                                'Layout': JSON.stringify(ArrayBaseResourceFields),
                                'EvaluatedFields': [Tiberium6, Tiberium5, Tiberium4, Tiberium3, Tiberium2, Tiberium1, Crystal6, Crystal5, Crystal4, Crystal3, Crystal2, Crystal1, Mixed6, Mixed5, Mixed4, Mixed3, Mixed2, Mixed1, Power8, Power7, Power6, Power5, Power4, Power3, Power2]
                            };
                        },
                        scanFirstLayout: function()
                        {
                            for (var key in this.ArrayIdsForScan)
                            {
                                var curScanId = this.ArrayIdsForScan[key];
                                ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(curScanId);
                                var _self = this;
                                setTimeout(function()
                                {
                                    if (ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity())
                                    {
                                        if (ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity().get_Buildings().c && ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity().get_OwnerId() < 0)
                                        {
                                            _self.errorCounter = 0
                                            _self.ArrayLayouts.push(_self.returnLayoutOfCurBaseAndEvaluateIt());
                                            _self.ArrayScannedIds.push(curScanId);
                                            _self.ArrayIdsForScan.splice(0,1);
                                            console.log(_self.ArrayLayouts.length + ' / ' + _self.ArrayIdsForScan.length);
                                            var numberHasToScan = _self.ArrayLayouts.length + _self.ArrayIdsForScan.length;
                                            _self.buttonBaseScanner.setLabel('Scan Base... (' + _self.ArrayLayouts.length + ' / ' + numberHasToScan + ')');
                                            // _self.sendData();
                                            _self.scanFirstLayout();
                                        }
                                        else if (_self.errorCounter < 5)
                                        {
                                            _self.errorCounter++;
                                            console.log('Layout not found (' + _self.errorCounter + ')');
                                            _self.scanFirstLayout();
                                        }
                                        else
                                        {
                                            console.log('Layout not found (' + _self.errorCounter + '), removing it from scan');
                                            _self.ArrayIdsForScan.splice(0,1);
                                            _self.errorCounter = 0;
                                            _self.scanFirstLayout();
                                        }
                                    }
                                    else if (_self.errorCounter < 5)
                                    {
                                        _self.errorCounter += 1;
                                    }
                                    else
                                    {
                                        console.log('Layout not found (' + _self.errorCounter + '), removing it from scan');
                                        _self.ArrayIdsForScan.splice(0,1);
                                        _self.errorCounter = 0;
                                        _self.scanFirstLayout();
                                    }
                                }, 1000);
                                break;
                            }
                            if (!this.ArrayIdsForScan.length)
                            {
                                this.sendData();
                                var _self = this;
                                setTimeout(function(){_self.stopBaseScan();}, 1000);
                            }
                        },
                        scanAroundOwnBase: function(_ownBaseId)
                        {
                            var x = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d[_ownBaseId].get_PosX();
                            var y = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d[_ownBaseId].get_PosY();
                            for (var i = parseInt(x - this.attRange); i <= parseInt(x + this.attRange); i++)
                            {
                                for (var j = parseInt(y - this.attRange); j <= parseInt(y + this.attRange); j++)
                                {
                                    var distance = Math.sqrt(Math.pow((i - x), 2) + Math.pow((j - y), 2));
                                    if (distance <= this.attRange)
                                    {
                                        var curObject = ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(i,j);
                                        if (curObject)
                                        {
                                            // if (curObject.Type == 2 || curObject.Type == 3) // Basen oder Camps/Vorposten
                                            // curObject[this.ArrayPrototypeGameObjectType3[9]] == 2 // Camp
                                            // curObject[this.ArrayPrototypeGameObjectType3[9]] == 3 // Vorposten
                                            if (curObject.Type == 3 && (curObject[this.ArrayPrototypeGameObjectType3[10]] > 0 || curObject[this.ArrayPrototypeGameObjectType3[11]] > 0)) // Camps/Vorposten, (health)
                                            {
                                                var curBaseId = curObject[this.ArrayPrototypeGameObjectType3[12]];
                                                if (this.ArrayIdsForScan.indexOf(curBaseId) == -1 && this.ArrayScannedIds.indexOf(curBaseId) == -1)
                                                {
                                                    this.ArrayIdsForScan.push(curBaseId);
                                                }
                                            }
                                            else if (curObject.Type == 2) // Basen
                                            {
                                                var curBaseId = curObject[this.ArrayPrototypeGameObjectType2[12]];
                                                if (this.ArrayIdsForScan.indexOf(curBaseId) == -1 && this.ArrayScannedIds.indexOf(curBaseId) == -1)
                                                {
                                                    this.ArrayIdsForScan.push(curBaseId);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        iterateThroughOwnBases: function()
                        {
                            var ownBases = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
                            for (var key in ownBases)
                            {
                                var ownBase = ownBases[key];
                                var ownBaseId = ownBase.get_Id();
                                this.scanAroundOwnBase(ownBaseId);
                            }
                        },
                        sendData: function()
                        {
                            var WorldId = ClientLib.Data.MainData.GetInstance().get_Server().get_WorldId();
                            var PlayerName = ClientLib.Data.MainData.GetInstance().get_Player().get_Name();
                            var packageSize = 30;
                            // $.ajaxSetup({async: false});
                            for (var packageNumber = 0; packageNumber < Math.ceil(this.ArrayLayouts.length / packageSize); packageNumber++)
                            {
                                var arrayPackageLayouts = [];
                                if (packageNumber == Math.ceil(this.ArrayLayouts.length / packageSize) - 1) // last round / letztes Paket
                                {
                                    for (var layoutNumber = (packageNumber * packageSize); layoutNumber < this.ArrayLayouts.length; layoutNumber++)
                                    {
                                        arrayPackageLayouts.push(this.ArrayLayouts[layoutNumber]);
                                    }
                                }
                                else
                                {
                                    for (var layoutNumber = (packageNumber * packageSize); layoutNumber < ((packageNumber + 1) * packageSize); layoutNumber++)
                                    {
                                        arrayPackageLayouts.push(this.ArrayLayouts[layoutNumber]);
                                    }
                                }
                                var ObjectSend = {action:"sendDataFromInGameBaseScanner", ObjectData:arrayPackageLayouts, WorldId: WorldId, PlayerName: PlayerName};
                                $.post(linkToRoot + 'php/manageBackend.php', ObjectSend)
                                .always(function(_data)
                                {
                                    console.log(_data);
                                });
                            }
                            // $.ajaxSetup({async: true});
                            /*var ObjectSend = {action:"sendDataFromInGame", ObjectData:this.ArrayLayouts, WorldId: WorldId};
                            $.post('https://leostats.000webhostapp.com/BaseScanner/php/manageBackend.php', ObjectSend)
                            .always(function(_data)
                            {
                                console.log(_data);
                            });*/
                        },
                        stopScan: function()
                        {
                            this.initializeDefaultValues();
                        },
                        startScan: function()
                        {
                            console.log('Start...');
                            this.initializeDefaultValues();
                            this.getArrayPrototypeGameObject();
                            this.iterateThroughOwnBases();
                            this.scanFirstLayout();
                        }
                    }
                });
                BaseScanner.getInstance().initialize();
            }
            setButtons();
        }
        function LoadExtension()
        {
            try
            {
                if (typeof(qx)!='undefined')
                {
                    if (!!qx.core.Init.getApplication().getMenuBar())
                    {
                        leoStatsCreate();
                        return;
                    }
                }
            }
            catch (e)
            {
                if (console !== undefined) console.log(e);
                else if (window.opera) opera.postError(e);
                else GM_log(e);
            }
            window.setTimeout(LoadExtension, 1000);
        }
        LoadExtension();
    };
    function Inject()
    {
        var Script = document.createElement("script");
        Script.innerHTML = "(" + leoStatsMain.toString() + ")();";
        Script.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(Script);
    }
    Inject();
})();