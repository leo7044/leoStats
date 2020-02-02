// ==UserScript==
// @name        leoStats
// @version     2020.02.02.2
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
(function() {
    try
    {
        console.log("leoStats connect initialisation...");
        var scriptLeoStats = document.createElement('script');
        var curDateTime = new Date().getTime();
        scriptLeoStats.type = 'text/javascript';
        scriptLeoStats.Id = 'leoStats';
        scriptLeoStats.async = true;
        scriptLeoStats.src = 'https://cnc.indyserver.info/js/leostats_server.min.js?f=' + curDateTime;
        var scriptTag = document.getElementsByTagName('script')[0];
        scriptTag.parentNode.insertBefore(scriptLeoStats, scriptTag);
    }
    catch (e)
    {
        console.log("leoStats connect error : ", e);
    }
})();