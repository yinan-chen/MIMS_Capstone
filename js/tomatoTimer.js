var countDownTimeInSec = 60 * 25;

function startPublicTimer(duration, display, largeTimer) {
    var timer = duration, minutes, seconds;
    var refreshIntervalId = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        largeTimer.textContent = minutes + ":" + seconds;
        var progressBar1 = document.querySelector("#progressBar1");
        var width = 100 * (1 - (timer / countDownTimeInSec));
        var widthStr = width.toString();
        var style = "width: " + widthStr + "%;";
        progressBar1.setAttribute("style", style);
        if (--timer < 0) {
            clearInterval(refreshIntervalId);
        }
    }, 1000);
}

// window.onload = function () {
//     publicDisplay = document.querySelector('#tomatoTimer1');
//     startPublicTimer(countDownTimeInSec, publicDisplay);
// };