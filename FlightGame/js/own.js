/* Developer: leo7044 (https://github.com/leo7044) */
var planeSize = 80;
var keyObject = {};
var accelerationType = null;
var accelerationType2 = null;
var speedOfPlane = 0;
var speedOfPlane2 = 0;
var degreeOfPlane = 90;
var degreeOfPlane2 = 270;
var degreeRotationType = null;
var degreeRotationType2 = null;
var topOfPlane = 0;
var topOfPlane2 = 0;
var leftOfPlane = 0;
var leftOfPlane2 = 0;
var pointsOfPlane = 0;
var pointsOfPlane2 = 0;
var winsOfPlane = 0;
var winsOfPlane2 = 0;
var multiplayer = false;
var gameMode = null;

$(document).ready(function(){
    initializeIntervals();
    document.addEventListener('keydown', manageMultipleKeyPresses, false);
    document.addEventListener('keyup', manageMultipleKeyPresses, false);
    setHeartToRandomPosition();
})

function initializeIntervals()
{
    intervalCalculatePositionOfPlane = setInterval(calculatePositionOfPlane, 10); // 100 frames per second
    intervalCalculateSpeedOfPlane = setInterval(calculateSpeedOfPlane, 20);
    intervalCalculateDegreeRotationOfPlane = setInterval(calculateDegreeRotationOfPlane, 25);
}

//help
function showHideDivHelp()
{
    $('#DivHelp').toggleClass('d-none');
}

// options
function showHideDivOptions()
{
    $('#DivOptions').toggleClass('d-none');
}

function manageOptions(_id)
{
    if (_id == 'SinglePlayer')
    {
        multiplayer = false;
        $('#SpanPoints').removeClass('d-none');
        $('#SpanWins').addClass('d-none');
        $('#DivImgPlane2').addClass('d-none');
        $('#TableTdTachoPlane2').addClass('d-none');
        $('#DivGameMode').addClass('d-none');
        document.getElementById('DivTacho').style.width = '150px';
    }
    else if (_id == 'MultiPlayer')
    {
        multiplayer = true;
        $('#SpanWins').removeClass('d-none');
        $('#DivImgPlane2').removeClass('d-none');
        $('#TableTdTachoPlane2').removeClass('d-none');
        $('#DivGameMode').removeClass('d-none');
        document.getElementById('DivTacho').style.width = '300px';
        setStartPositionOfPlane();
        $('#HeartMode').click();
    }
    if (_id == 'HeartMode')
    {
        gameMode = 'HeartMode';
        $('#DivImgHeart').removeClass('d-none');
        $('#SpanPoints').removeClass('d-none');
        $('#SpanPoints2').removeClass('d-none');
        $('#DivWinnerHeartMode').removeClass('d-none');
        $('#DivWinnerCrashMode').addClass('d-none');
    }
    else if (_id == 'CrashMode')
    {
        gameMode = 'CrashMode';
        $('#DivImgHeart').addClass('d-none');
        $('#SpanPoints').addClass('d-none');
        $('#SpanPoints2').addClass('d-none');
        $('#DivWinnerHeartMode').addClass('d-none');
        $('#DivWinnerCrashMode').removeClass('d-none');
    }
    /*if (_id == 'ColorBlack')
    {
        document.getElementById('ImgPlane').src = 'img/plane_black.png';
    }
    else if (_id == 'ColorRed')
    {
        document.getElementById('ImgPlane').src = 'img/plane_red.png';
    }*/
}

// interact after control-keys
function changePlayerName(_id)
{
    if (_id == 'SpanPlayerName' || _id == 'InputPlayerName')
    {
        $('#DivPlayerNameOutput').toggleClass('d-none');
        $('#DivPlayerNameInput').toggleClass('d-none');
        document.getElementById('InputPlayerName').value = document.getElementById('SpanPlayerName').innerHTML;
        $('#InputPlayerName').focus();
    }
    else if (_id == 'SpanPlayerName2' || _id == 'InputPlayerName2')
    {
        $('#DivPlayerNameOutput2').toggleClass('d-none');
        $('#DivPlayerNameInput2').toggleClass('d-none');
        document.getElementById('InputPlayerName2').value = document.getElementById('SpanPlayerName2').innerHTML;
        $('#InputPlayerName2').focus();
    }
}

function resetPlane()
{
    topOfPlane = 0;
    leftOfPlane = 0;
    setStartPositionOfPlane();
    degreeOfPlane = 90;
    degreeOfPlane2 = 270;
    speedOfPlane = 0;
    speedOfPlane2 = 0;
}

function resetGame()
{
    resetPlane();
    pointsOfPlane = 0;
    pointsOfPlane2 = 0;
    document.getElementById('PointsOfPlane').innerHTML = pointsOfPlane;
    document.getElementById('PointsOfPlane2').innerHTML = pointsOfPlane2;
}

// interact with keyboard
function manageMultipleKeyPresses(event)
{
    keyObject[event.key] = event.type == 'keydown';
    if (keyObject['ArrowLeft']) // links lenken
    {
        degreeRotationType = 'left';
    }
    else if (keyObject['ArrowRight']) // rechts lenken
    {
        degreeRotationType = 'right';
    }
    if (keyObject['a']) // links lenken
    {
        degreeRotationType2 = 'left';
    }
    else if (keyObject['d']) // rechts lenken
    {
        degreeRotationType2 = 'right';
    }
    if (!keyObject['ArrowLeft'] && !keyObject['ArrowRight'])
    {
        degreeRotationType = null;
    }
    if (!keyObject['a'] && !keyObject['d'])
    {
        degreeRotationType2 = null;
    }
    if (keyObject['ArrowUp']) // Beschleunigen
    {
        accelerationType = 'go';
    }
    else if (keyObject['ArrowDown']) // Bremsen
    {
        accelerationType = 'stop';
    }
    if (keyObject['w']) // Beschleunigen
    {
        accelerationType2 = 'go';
    }
    else if (keyObject['s']) // Bremsen
    {
        accelerationType2 = 'stop';
    }
    if (!keyObject['ArrowUp'] && !keyObject['ArrowDown'])
    {
        accelerationType = null;
    }
    if (!keyObject['w'] && !keyObject['s'])
    {
        accelerationType2 = null;
    }
    if (keyObject[' ']) // Handbremse (sofort stop für alle)
    {
        speedOfPlane = 0;
        speedOfPlane2 = 0;
    }
    if (keyObject['.'] && keyObject['o']) // show / hide Options
    {
        showHideDivOptions();
    }
    if (keyObject['.'] && keyObject['h']) // show / hide Options
    {
        showHideDivHelp();
    }
    if (keyObject['.'] && keyObject['r']) // reset Plane to home-position
    {
        resetPlane();
    }
    if (keyObject['.'] && keyObject['n']) // reset game
    {
        resetGame();
    }
    if (keyObject['Enter'])
    {
        if (!$('#DivPlayerNameInput').hasClass('d-none') || !$('#DivPlayerNameInput2').hasClass('d-none'))
        {
            var idActiveInput = $(':focus')[0].id;
            if (idActiveInput == 'InputPlayerName')
            {
                document.getElementById('SpanPlayerName').innerHTML = document.getElementById('InputPlayerName').value;
                changePlayerName(idActiveInput);
            }
            else if (idActiveInput == 'InputPlayerName2')
            {
                document.getElementById('SpanPlayerName2').innerHTML = document.getElementById('InputPlayerName2').value;
                changePlayerName(idActiveInput);
            }
        }
        if (!$('#DivCrashMessage').hasClass('d-none'))
        {
            restartGame();
        }
    }
    else if (keyObject['Escape'] && (!$('#DivPlayerNameInput').hasClass('d-none') || !$('#DivPlayerNameInput2').hasClass('d-none')))
    {
        var idActiveInput = $(':focus')[0].id;
        changePlayerName(idActiveInput);
    }
}

// moving plane
function calculateDegreeRotationOfPlane()
{
    if (degreeRotationType == 'left')
    {
        degreeOfPlane -= 1 + (speedOfPlane * 0.4);
    }
    else if (degreeRotationType == 'right')
    {
        degreeOfPlane += 1 + (speedOfPlane * 0.4);
    }
    if (degreeOfPlane >= 360)
    {
        degreeOfPlane -= 360;
    }
    else if (degreeOfPlane < 0)
    {
        degreeOfPlane += 360;
    }
    document.getElementById('DivImgPlane').style.transform = 'rotate(' + degreeOfPlane + 'deg)';
    document.getElementById('DirectionOfPlane').innerHTML = degreeOfPlane.toFixed(0) + '°';
    if (multiplayer)
        {
            if (degreeRotationType2 == 'left')
        {
            degreeOfPlane2 -= 1 + (speedOfPlane2 * 0.4);
        }
        else if (degreeRotationType2 == 'right')
        {
            degreeOfPlane2 += 1 + (speedOfPlane2 * 0.4);
        }
        if (degreeOfPlane2 >= 360)
        {
            degreeOfPlane2 -= 360;
        }
        else if (degreeOfPlane2 < 0)
        {
            degreeOfPlane2 += 360;
        }
        document.getElementById('DivImgPlane2').style.transform = 'rotate(' + degreeOfPlane2 + 'deg)';
        document.getElementById('DirectionOfPlane2').innerHTML = degreeOfPlane2.toFixed(0) + '°';
    }
}

function calculateSpeedOfPlane()
{
    if (accelerationType == 'go')
    {
        speedOfPlane++;
    }
    else if (accelerationType)
    {
        if (speedOfPlane > 0) // kein Rückwärtsgang
        {
            speedOfPlane--;
        }
    }
    if (multiplayer)
    {
        if (accelerationType2 == 'go')
        {
            speedOfPlane2++;
        }
        else if (accelerationType2)
        {
            if (speedOfPlane2 > 0) // kein Rückwärtsgang
            {
                speedOfPlane2--;
            }
        }
    }
}

function calculatePositionOfPlane()
{
    var angle = degreeOfPlane * Math.PI / 180;
    var deltaX = Math.sin(angle) * (50 * speedOfPlane) / 100;
    var deltaY = Math.cos(angle) * (50 * speedOfPlane) / 100;
    leftOfPlane += deltaX;
    topOfPlane -= deltaY;
    catchPlaneOnScreen('Plane1');
    document.getElementById('DivImgPlane').style.left = leftOfPlane + 'px';
    document.getElementById('DivImgPlane').style.top = topOfPlane + 'px';
    proveForCrashWithHeart('DivImgHeart', 'DivImgPlane');
    document.getElementById('PositionLeftOfPlane').innerHTML = leftOfPlane.toFixed(0);
    document.getElementById('PositionTopOfPlane').innerHTML = topOfPlane.toFixed(0);
    document.getElementById('SpeedOfPlane').innerHTML = speedOfPlane;
    if (multiplayer)
    {
        var angle = degreeOfPlane2 * Math.PI / 180;
        var deltaX = Math.sin(angle) * (50 * speedOfPlane2) / 100;
        var deltaY = Math.cos(angle) * (50 * speedOfPlane2) / 100;
        leftOfPlane2 += deltaX;
        topOfPlane2 -= deltaY;
        catchPlaneOnScreen('Plane2');
        document.getElementById('DivImgPlane2').style.left = leftOfPlane2 + 'px';
        document.getElementById('DivImgPlane2').style.top = topOfPlane2 + 'px';
        proveForCrashWithHeart('DivImgHeart', 'DivImgPlane2');
        document.getElementById('PositionLeftOfPlane2').innerHTML = leftOfPlane2.toFixed(0);
        document.getElementById('PositionTopOfPlane2').innerHTML = topOfPlane2.toFixed(0);
        document.getElementById('SpeedOfPlane2').innerHTML = speedOfPlane2;
        proveForCrashBetweenPlanes();
    }
}

function catchPlaneOnScreen(_plane)
{
    if (_plane == 'Plane1')
    {
        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;
        if (leftOfPlane > screenWidth)
        {
            leftOfPlane -= (screenWidth + planeSize);
        }
        else if (leftOfPlane < -planeSize)
        {
            leftOfPlane += (screenWidth + planeSize);
        }
        if (topOfPlane > screenHeight)
        {
            topOfPlane -= (screenHeight + planeSize);
        }
        else if (topOfPlane < -planeSize)
        {
            topOfPlane += (screenHeight + planeSize);
        }
    }
    else if (_plane == 'Plane2')
    {
        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;
        if (leftOfPlane2 > screenWidth)
        {
            leftOfPlane2 -= (screenWidth + planeSize);
        }
        else if (leftOfPlane2 < -planeSize)
        {
            leftOfPlane2 += (screenWidth + planeSize);
        }
        if (topOfPlane2 > screenHeight)
        {
            topOfPlane2 -= (screenHeight + planeSize);
        }
        else if (topOfPlane2 < -planeSize)
        {
            topOfPlane2 += (screenHeight + planeSize);
        }
    }
}

// heart
function setHeartToRandomPosition()
{
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    var minX = 0;
    var minY = 0;
    var maxX = screenWidth - document.getElementById('DivImgHeart').offsetWidth * 1.5; // * 1.5, damit nicht zu weit am Rand rechts und unten
    var maxY = screenHeight - document.getElementById('DivImgHeart').offsetHeight * 1.5; // * 1.5, damit nicht zu weit am Rand rechts und unten
    var newX = Math.floor(Math.random() * (maxX  - minX + 1)) + minX;
    var newY = Math.floor(Math.random() * (maxY  - minY + 1)) + minY;
    document.getElementById('DivImgHeart').style.left = newX + 'px';
    document.getElementById('DivImgHeart').style.top = newY + 'px';
}

function proveForCrashWithHeart(_divHeart, _divPlane) // create rects around objects
{
    var rectHeart = document.getElementById(_divHeart).getBoundingClientRect();
    var rectPlane = document.getElementById(_divPlane).getBoundingClientRect();
    var planeCenterX = (rectPlane.left + rectPlane.right) / 2;
    var planeCenterY = (rectPlane.bottom + rectPlane.top) / 2;
    if // crash (simple rect acound objects)
    /*(!
        (rectHeart.top > rectPlane.bottom ||
        rectHeart.bottom < rectPlane.top ||
        rectHeart.left > rectPlane.right ||
        rectHeart.right < rectPlane.left)
    )*/
    ( // genau treffen und rüberfliegen
        rectHeart.top < planeCenterY &&
        rectHeart.left < planeCenterX &&
        rectHeart.bottom > planeCenterY &&
        rectHeart.right > planeCenterX
    )
    {
        setHeartToRandomPosition();
        if (_divPlane == 'DivImgPlane')
        {
            pointsOfPlane++;
            document.getElementById('PointsOfPlane').innerHTML = pointsOfPlane;
        }
        else if (_divPlane == 'DivImgPlane2')
        {
            pointsOfPlane2++;
            document.getElementById('PointsOfPlane2').innerHTML = pointsOfPlane2;
        }
    }
}

function proveForCrashBetweenPlanes()
{
    var rectPlane = document.getElementById('DivImgPlane').getBoundingClientRect();
    var rectPlane2 = document.getElementById('DivImgPlane2').getBoundingClientRect();
    var planeCenterX = (rectPlane.left + rectPlane.right) / 2;
    var planeCenterY = (rectPlane.bottom + rectPlane.top) / 2;
    var plane2CenterX = (rectPlane2.left + rectPlane2.right) / 2;
    var plane2CenterY = (rectPlane2.bottom + rectPlane2.top) / 2;
    var distanceBetweenCenters = Math.sqrt(Math.pow((plane2CenterX - planeCenterX), 2) + Math.pow((plane2CenterY - planeCenterY), 2));
    if (distanceBetweenCenters < planeSize)
    {
        handleCrash();
    }
}
function handleCrash()
{
    clearInterval(intervalCalculatePositionOfPlane);
    clearInterval(intervalCalculateSpeedOfPlane);
    clearInterval(intervalCalculateDegreeRotationOfPlane);
    if (gameMode == 'HeartMode')
    {
        $('#DivImgHeart').addClass('d-none');
    }
    createWinnerMessage();
}

function getWinnerAndHandleDivs()
{
    var winner = null;
    if (gameMode == 'HeartMode')
    {
        if (pointsOfPlane > pointsOfPlane2)
        {
            winner = document.getElementById('SpanPlayerName').innerHTML;
            winsOfPlane++;
            $('#DivWinnerExistsHeartMode').removeClass('d-none');
            $('#DivWinnerNotExistsHeartMode').addClass('d-none');
        }
        else if (pointsOfPlane < pointsOfPlane2)
        {
            winner = document.getElementById('SpanPlayerName2').innerHTML;
            winsOfPlane2++;
            $('#DivWinnerExistsHeartMode').removeClass('d-none');
            $('#DivWinnerNotExistsHeartMode').addClass('d-none');
        }
        else
        {
            $('#DivWinnerExistsHeartMode').addClass('d-none');
            $('#DivWinnerNotExistsHeartMode').removeClass('d-none');
        }
    }
    else if (gameMode == 'CrashMode')
    {
        var rectPlane = document.getElementById('DivImgPlane').getBoundingClientRect();
        var rectPlane2 = document.getElementById('DivImgPlane2').getBoundingClientRect();
        var planeCenterX = (rectPlane.left + rectPlane.right) / 2;
        var planeCenterY = (rectPlane.bottom + rectPlane.top) / 2;
        var plane2CenterX = (rectPlane2.left + rectPlane2.right) / 2;
        var plane2CenterY = (rectPlane2.bottom + rectPlane2.top) / 2;
        var crashPointX = (planeCenterX + plane2CenterX) / 2;
        var crashPointY = (planeCenterY + plane2CenterY) / 2;
        // Plane 1
        var angle = degreeOfPlane * Math.PI / 180;
        var deltaX = Math.sin(angle) * planeSize / 2;
        var deltaY = Math.cos(angle) * planeSize / 2;
        var bugOfPlaneX = planeCenterX + deltaX;
        var bugOfPlaneY = planeCenterY - deltaY;
        var distanceBetweenCrashCenterAndPlane = Math.sqrt(Math.pow((bugOfPlaneX - crashPointX), 2) + Math.pow((bugOfPlaneY - crashPointY), 2));
        // Plane 2
        var angle2 = degreeOfPlane2 * Math.PI / 180;
        var deltaX2 = Math.sin(angle2) * planeSize / 2;
        var deltaY2 = Math.cos(angle2) * planeSize / 2;
        var bugOfPlane2X = plane2CenterX + deltaX2;
        var bugOfPlane2Y = plane2CenterY - deltaY2;
        var distanceBetweenCrashCenterAndPlane2 = Math.sqrt(Math.pow((bugOfPlane2X - crashPointX), 2) + Math.pow((bugOfPlane2Y - crashPointY), 2));
        if (distanceBetweenCrashCenterAndPlane < distanceBetweenCrashCenterAndPlane2)
        {
            winner = document.getElementById('SpanPlayerName').innerHTML;
            winsOfPlane++;
            $('#DivWinnerExistsCrashMode').removeClass('d-none');
            $('#DivWinnerNotExistsCrashMode').addClass('d-none');
        }
        else if (distanceBetweenCrashCenterAndPlane > distanceBetweenCrashCenterAndPlane2)
        {
            winner = document.getElementById('SpanPlayerName2').innerHTML;
            winsOfPlane2++;
            $('#DivWinnerExistsCrashMode').removeClass('d-none');
            $('#DivWinnerNotExistsCrashMode').addClass('d-none');
        }
        else
        {
            $('#DivWinnerExistsCrashMode').addClass('d-none');
            $('#DivWinnerNotExistsCrashMode').removeClass('d-none');
        }
    }
    return winner;
}

function createWinnerMessage()
{
    if (gameMode == 'HeartMode')
    {
        document.getElementById('SpanWinnerHeartMode').innerHTML = getWinnerAndHandleDivs();
    }
    else if (gameMode == 'CrashMode')
    {
        document.getElementById('SpanWinnerCrashMode').innerHTML = getWinnerAndHandleDivs();
    }
    $('#DivCrashMessage').removeClass('d-none');
}

// 2nd plane
function setStartPositionOfPlane()
{
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    leftOfPlane2 = screenWidth - planeSize;
    topOfPlane2 = screenHeight - planeSize;
    document.getElementById('DivImgPlane2').style.left = leftOfPlane2 + 'px';
    document.getElementById('DivImgPlane2').style.top = topOfPlane2 + 'px';
}

function restartGame()
{
    $('#DivCrashMessage').addClass('d-none');
    resetGame();
    document.getElementById('WinsOfPlane').innerHTML = winsOfPlane;
    document.getElementById('WinsOfPlane2').innerHTML = winsOfPlane2;
    initializeIntervals();
    if (gameMode == 'HeartMode')
    {
        $('#DivImgHeart').removeClass('d-none');
    }
}


// https://keycode.info/
// https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript
// https://stackoverflow.com/questions/30833869/how-can-i-move-a-div-with-direction-in-javascript
// https://stackoverflow.com/questions/12066870/how-to-check-if-an-element-is-overlapping-other-elements
// https://stackoverflow.com/questions/5012111/how-to-position-a-div-in-the-middle-of-the-screen-when-the-page-is-bigger-than-t
// https://onlinepngtools.com/create-transparent-png
// dean.edwards.name/packer/