// ==UserScript==
// @name        BaseScanner
// @version     2020.01.16
// @author      leo7044 (https://github.com/leo7044)
// @homepage    https://cnc.indyserver.info/BaseScanner/
// @downloadURL https://cnc.indyserver.info/BaseScanner/js/BaseScanner.user.js
// @updateURL   https://cnc.indyserver.info/BaseScanner/js/BaseScanner.user.js
// @require		https://code.jquery.com/jquery-3.3.1.min.js
// @description BaseScanner
// @include     https://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @grant       none
// ==/UserScript==
 
(function () {
    var BaseScannerMain = function ()
    {
        function BaseScannerCreate()
        {
            // ==================================================
            // scan Layouts
            // ==================================================
            var ArrayLayouts = [];
            var ArrayScannedIds = [];

            function setButton()
            {
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
                            this.app = qx.core.Init.getApplication();
                            this.app.getDesktop().add(this.buttonBaseScanner,
                            {
                                right: 125,
                                top: 0
                            });
                        },
                        startBaseScan: function()
                        {
                            this.ScriptIsRunning = true;
                            this.buttonBaseScanner.setLabel('Stop BaseScanner...');
                            startScan();
                        },
                        stopBaseScan: function()
                        {
                            this.ScriptIsRunning = false;
                            this.buttonBaseScanner.setLabel('Start BaseScanner...');
                            stopScan();
                        },
                        setLabel: function(_numberAlreadyScanned, _numberHasToScan)
                        {
                            this.buttonBaseScanner.setLabel('Scan Base... (' + _numberAlreadyScanned + ' / ' + _numberHasToScan + ')');
                        },
                        getArrayLayouts: function()
                        {
                            return ArrayLayouts;
                        },
                        getArrayScannedIds: function()
                        {
                            return ArrayScannedIds;
                        }
                    }
                });
                BaseScanner.getInstance().initialize();
            }

            function initializeDefaultValues()
            {
                attRange = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxAttackDistance();
                ArrayPrototypeGameObjectType2 = [];
                ArrayPrototypeGameObjectType3 = [];
                ArrayIdsForScan = [];
                errorCounter = 0;
            }

            function getArrayPrototypeGameObject()
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
                    ArrayPrototypeGameObjectType2.push(key);
                }
                for (var key in ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(goalXType3, goalYType3))
                {
                    ArrayPrototypeGameObjectType3.push(key);
                }
            }

            function returnLayoutOfCurBaseAndEvaluateIt()
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
            }

            function scanFirstLayout()
            {
                for (var key in ArrayIdsForScan)
                {
                    var curScanId = ArrayIdsForScan[key];
                    ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(curScanId);
                    setTimeout(function()
                    {
                        if (ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity())
                        {
                            if (ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity().get_Buildings().c && ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity().get_OwnerId() < 0)
                            {
                                errorCounter = 0
                                ArrayLayouts.push(returnLayoutOfCurBaseAndEvaluateIt());
                                ArrayScannedIds.push(curScanId);
                                ArrayIdsForScan.splice(0,1);
                                console.log(ArrayLayouts.length + ' / ' + ArrayIdsForScan.length);
                                BaseScanner.getInstance().setLabel(ArrayLayouts.length, ArrayLayouts.length + ArrayIdsForScan.length)
                                // sendData();
                                scanFirstLayout();
                            }
                            else if (errorCounter < 5)
                            {
                                errorCounter++;
                                console.log('Layout not found (' + errorCounter + ')');
                                scanFirstLayout();
                            }
                            else
                            {
                                console.log('Layout not found (' + errorCounter + '), removing it from scan');
                                ArrayIdsForScan.splice(0,1);
                                errorCounter = 0;
                                scanFirstLayout();
                            }
                        }
                        else if (errorCounter < 5)
                        {
                            errorCounter += 1;
                        }
                        else
                        {
                            console.log('Layout not found (' + errorCounter + '), removing it from scan');
                            ArrayIdsForScan.splice(0,1);
                            errorCounter = 0;
                            scanFirstLayout();
                        }
                    }, 1000);
                    break;
                }
                if (!ArrayIdsForScan.length)
                {
                    sendData();
                    setTimeout(function(){BaseScanner.getInstance().stopBaseScan();}, 1000);
                }
            }

            function scanAroundOwnBase(_ownBaseId)
            {
                var x = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d[_ownBaseId].get_PosX();
                var y = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d[_ownBaseId].get_PosY();
                for (var i = parseInt(x - attRange); i <= parseInt(x + attRange); i++)
                {
                    for (var j = parseInt(y - attRange); j <= parseInt(y + attRange); j++)
                    {
                        var distance = Math.sqrt(Math.pow((i - x), 2) + Math.pow((j - y), 2));
                        if (distance <= attRange)
                        {
                            var curObject = ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(i,j);
                            if (curObject)
                            {
                                // if (curObject.Type == 2 || curObject.Type == 3) // Basen oder Camps/Vorposten
                                // curObject[ArrayPrototypeGameObjectType3[9]] == 2 // Camp
                                // curObject[ArrayPrototypeGameObjectType3[9]] == 3 // Vorposten
                                if (curObject.Type == 3 && (curObject[ArrayPrototypeGameObjectType3[10]] > 0 || curObject[ArrayPrototypeGameObjectType3[11]] > 0)) // Camps/Vorposten, (health)
                                {
                                    var curBaseId = curObject[ArrayPrototypeGameObjectType3[12]];
                                    if (ArrayIdsForScan.indexOf(curBaseId) == -1 && ArrayScannedIds.indexOf(curBaseId) == -1)
                                    {
                                        ArrayIdsForScan.push(curBaseId);
                                    }
                                }
                                else if (curObject.Type == 2) // Basen
                                {
                                    var curBaseId = curObject[ArrayPrototypeGameObjectType2[12]];
                                    if (ArrayIdsForScan.indexOf(curBaseId) == -1 && ArrayScannedIds.indexOf(curBaseId) == -1)
                                    {
                                        ArrayIdsForScan.push(curBaseId);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            function iterateThroughOwnBases()
            {
                var ownBases = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
                for (var key in ownBases)
                {
                    var ownBase = ownBases[key];
                    var ownBaseId = ownBase.get_Id();
                    scanAroundOwnBase(ownBaseId);
                }
            }

            function sendData()
            {
                var WorldId = ClientLib.Data.MainData.GetInstance().get_Server().get_WorldId();
                var PlayerName = ClientLib.Data.MainData.GetInstance().get_Player().get_Name();
                var packageSize = 30;
                // $.ajaxSetup({async: false});
                for (var packageNumber = 0; packageNumber < Math.ceil(ArrayLayouts.length / packageSize); packageNumber++)
                {
                    var arrayPackageLayouts = [];
                    if (packageNumber == Math.ceil(ArrayLayouts.length / packageSize) - 1) // last round / letztes Paket
                    {
                        for (var layoutNumber = (packageNumber * packageSize); layoutNumber < ArrayLayouts.length; layoutNumber++)
                        {
                            arrayPackageLayouts.push(ArrayLayouts[layoutNumber]);
                        }
                    }
                    else
                    {
                        for (var layoutNumber = (packageNumber * packageSize); layoutNumber < ((packageNumber + 1) * packageSize); layoutNumber++)
                        {
                            arrayPackageLayouts.push(ArrayLayouts[layoutNumber]);
                        }
                    }
                    var ObjectSend = {action:"sendDataFromInGame", ObjectData:arrayPackageLayouts, WorldId: WorldId, PlayerName: PlayerName};
                    $.post('https://cnc.indyserver.info/BaseScanner/php/manageBackend.php', ObjectSend)
                    .always(function(data)
                    {
                        console.log(data);
                    });
                }
                // $.ajaxSetup({async: true});
                /*var ObjectSend = {action:"sendDataFromInGame", ObjectData:ArrayLayouts, WorldId: WorldId};
                $.post('https://leostats.000webhostapp.com/BaseScanner/php/manageBackend.php', ObjectSend)
                .always(function(data)
                {
                    console.log(data);
                });*/
            }

            function stopScan()
            {
                initializeDefaultValues();
            }

            function startScan()
            {
                console.log('Start...');
                initializeDefaultValues();
                getArrayPrototypeGameObject();
                iterateThroughOwnBases();
                scanFirstLayout();
            }
            setButton();
        }
        function LoadExtension()
        {
            try
            {
                if (typeof(qx)!='undefined')
                {
                    if (!!qx.core.Init.getApplication().getMenuBar())
                    {
                        BaseScannerCreate();
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
        Script.innerHTML = "(" + BaseScannerMain.toString() + ")();";
        Script.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(Script);
    }
    Inject();
})();