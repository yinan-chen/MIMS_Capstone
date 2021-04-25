var countDownTimeInSec = 60 * 10;

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    refreshIntervalId = setInterval(function () {
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
    display = document.querySelector('#time');
    startTimer(countDownTimeInSec, display);
};