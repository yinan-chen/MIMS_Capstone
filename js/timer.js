var countDownTimeInSec = 60 * 10;
var privateCountDownTimeInSec = 60 * 45;

function startPublicTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var refreshIntervalId = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(refreshIntervalId);
        }
    }, 1000);
}

function startPrivateTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var refreshIntervalId = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(refreshIntervalId);
        }
    }, 1000);
}

window.onload = function () {
    publicDisplay = document.querySelector('#time');
    startPublicTimer(countDownTimeInSec, publicDisplay);
    privateDisplay = document.querySelector('#privateTime');
    startPrivateTimer(privateCountDownTimeInSec, privateDisplay)
};