/* Developer: leo7044 (https://github.com/leo7044) */
var lastLangPage = null;
var lastLangModal = null;

function prepareTranslation(_sourcePage)
{
    ObjectLanguages = getLanguages();
    prepareLanguageSelection(ObjectLanguages);
    if (_sourcePage == 'login')
    {
        prepareLanguageSelection(ObjectLanguages, 'DropDownLanguageModal');
    }
}

function getLanguages()
{
	var returnValue = null;
	$.ajaxSetup({async: false});
	$.getJSON
	(
		"js/languages.json",
		function(data)
		{
			returnValue = data;
		}
	)
	$.ajaxSetup({async: true});
	return returnValue;
}

function prepareLanguageSelection(_ObjectLanguages, _modalId)
{
    var ddLanguage = $('#DropDownLanguage').data('select');
    var ddLanguageModal = $('#DropDownLanguageModal').data('select');
    if (_modalId)
    {
        ddLanguageModal.data({"en": "English", "de": "Deutsch"});
    }
    else
    {
        ddLanguage.data({"en": "English", "de": "Deutsch"});
    }
}

function changeLanguage(_langIndex, _langValue, _source, _sourcePage)
{
    if (!_langValue)
    {
        _langIndex = 0;
        _langValue = 'en';
    }
    if (_sourcePage == 'login')
    {
        var ddLanguage = $('#DropDownLanguage').data('select');
        var ddLanguageModal = $('#DropDownLanguageModal').data('select');
        if (_source == 'page' && lastLangPage != _langValue)
        {
            lastLangPage = _langValue;
            lastLangModal = _langValue;
            ddLanguageModal.val(_langValue);
            changeLanguageFurther(_langIndex, _langValue);
        }
        else if (_source == 'modal' && lastLangModal != _langValue)
        {
            lastLangPage = _langValue;
            lastLangModal = _langValue;
            ddLanguage.val(_langValue);
            changeLanguageFurther(_langIndex, _langValue);
        }
        else if (_source == 'start' && lastLangPage != _langValue && lastLangModal != _langValue)
        {
            lastLangPage = _langValue;
            lastLangModal = _langValue;
            ddLanguage.val(_langValue);
            ddLanguageModal.val(_langValue);
            changeLanguageFurther(_langIndex, _langValue);
        }
    }
    else
    {
        if (_source == 'start' && lastLangPage != _langValue)
        {
            lastLangPage = _langValue;
            var ddLanguage = $('#DropDownLanguage').data('select');
            ddLanguage.val(_langValue);
            setCookiesLang(_langIndex, _langValue);
        }
        else
        {
            setCookiesLang(_langIndex, _langValue);
        }
    }
}

function changeLanguageFurther(_langIndex, _langValue)
{
    if (_langIndex == 0)
    {
        $('#InformationEnglish').removeClass('d-none');
        $('#InformationGerman').addClass('d-none');
    }
    else
    {
        $('#InformationEnglish').addClass('d-none');
        $('#InformationGerman').removeClass('d-none');
    }
    setCookiesLang(_langIndex, _langValue)
}

function setCookiesLang(_langIndex, _langValue)
{
    setCookie('langIndex', _langIndex);
    setCookie('langValue', _langValue);
    translateEachElement(_langIndex);
}

function translateEachElement(_langIndex)
{
    for (var i = 0; i < $('.trans-innerHTML').length; i++)
    {
        $('.trans-innerHTML')[i].innerHTML = ObjectLanguages[$('.trans-innerHTML')[i].id][_langIndex];
    }
    for (var i = 0; i < $('.trans-placeholder').length; i++)
    {
        $('.trans-placeholder').children('input')[i].placeholder = ObjectLanguages[$('.trans-placeholder').children('input')[i].id][_langIndex];
    }
    for (var i = 0; i < $('.trans-checkbox').length; i++)
    {
        $($('.trans-checkbox')[i]).children('span.caption')[0].innerHTML = ObjectLanguages[$($('.trans-checkbox')[i]).children('input')[0].id][_langIndex];
    }
}