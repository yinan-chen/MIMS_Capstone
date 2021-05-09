// click events

$(document).on("click", ".tdl-check", function() {
    checkTask(this);
});

$('#screenModeBtnGroup button').on("click", function() {
    let id = this.id;
    $(this).addClass('checked').siblings().removeClass('checked');
    console.log(id);
    updateContent(id);
});

$('#videoControlBtnGroup button').on("click", function() {
    let id = this.id;
    let btn = $(this);
    let btn_icon = btn.children('i');

    if(id === 'camera') updateCamera(btn, btn_icon);
    if(id === 'mic') updateMic(btn, btn_icon);
});


// Screen Control Update
let screenImg = $('#screenImg');
let camera = $('#camera');
let mic = $('#mic');

function updateContent(mode) {
    //update screen
    const screen_path = "./img/";
    screenImg.attr('src', screen_path + mode + ".png");

    //update others
    camera.prop('disabled', false);
    mic.prop('disabled', false);

    if(mode !== 'interactive_mode') {
        mic.prop('disabled', true);

        //TODO: show yellow alert
    }

    if(mode === 'pressure_mode'){
        camera.prop('disabled', true);

        //TODO: update video pic to screens
    }
}

// Video Control Update

let isCameraOn = true, isMicOn = true;

function updateCamera(btn, icon) {
    isCameraOn = !isCameraOn;

    if(isCameraOn) {
        btn.removeClass('checked');
        icon.removeClass('bi-camera-video-off');
        icon.addClass('bi-camera-video');
    } else {
        btn.addClass('checked');
        icon.removeClass('bi-camera-video');
        icon.addClass('bi-camera-video-off');
    }
}

function updateMic(btn, icon) {
    isMicOn = !isMicOn;

    if(isMicOn) {
        btn.removeClass('checked');
        icon.removeClass('bi-mic-mute');
        icon.addClass('bi-mic');
    } else {
        btn.addClass('checked');
        icon.removeClass('bi-mic');
        icon.addClass('bi-mic-mute');
    }
}

// To do List
const MAX_GOALS = 5;
let goals = [];
let goals_completion = [];
let warning = $('#warning');
let goalsPreviewList = $('#goalsPreviewList');

function addSessionGoalToList() {
    let goal_str = $('#sessionGoal').val();

    if(goal_str === '') {
        warning.html("Please only add non-empty goal!");
    }else{
        if(goals.length >= MAX_GOALS) {
            warning.html("Please only enter at maximum 5 goals per session!");
        } else {
            warning.html("");
            $('#sessionGoal').val('');
            updateGoalPreviewListHtmlStr(goal_str);
            goals.push(goal_str);
            goals_completion.push(false);

            // enable the join button
            if(goals.length === 1)
                $('#joinBtn').prop("disabled", false);
        }
    }

}

function updateGoalPreviewListHtmlStr(goal_str) {
    let exist_list_str = goalsPreviewList.html();
    let new_goal_str = '<li>' + goal_str + '</li>';

    goalsPreviewList.html(exist_list_str + new_goal_str);
}

function joinSession() {
    // update Sri's TDL
    const name = "sri";
    let popover = $('#popover-sri');
    let indicator = $('#i_sri');
    let content_str = '', indicator_str = '';


    goals.forEach((goal_str, index) => {
        content_str += getTaskStr(index, name, goal_str);
        indicator_str += getIndicatorStr(index, name)
    });

    //update popover
    popover.popover({
        html: true,
        title: "SRI'S GOALS",
        content: content_str
    });

    //update indicators shown on camera
    indicator.html(indicator_str);

    //start timer
    let publicDisplay = document.querySelector('#tomatoTimer1');
    let largeTimer = document.querySelector('#largeTimer');
    startPublicTimer(countDownTimeInSec, publicDisplay, largeTimer);
}

function getTaskStr(index, name, goal_str) {
    let task_id = name + "_" + index;
    return '<div class="row">' +
            '<div class="col-1">' +
                '<i class="bi bi-circle-fill tdl-check" id="' + task_id + '"></i>' +
            '</div>' +
            '<div class="col-10 offset-custom">' +
                '<p>' + goal_str + '</p>' +
            '</div>' +
           '</div>'
}

function getIndicatorStr(index, name) {
    let i_id = "i_" + name + "_" + index;
    return '<i class="bi bi-circle-fill ms-2" id="' + i_id + '"></i>'
}


function checkTask(element) {
    let index = parseInt(element.id.split("_")[1]);

    // flip the task status
    goals_completion[index] = !goals_completion[index];

    // update TDL icon
    updateTDLIcon($(element), goals_completion[index]);

    // update associated indicator icon
    let indicator_id = "#i_sri_" + index;
    updateTDLIcon($(indicator_id), goals_completion[index]);
}

function updateTDLIcon(icon, isComplete) {
    if(isComplete) {
        icon.removeClass('bi-circle-fill');
        icon.addClass('bi-check-circle-fill');
    } else {
        icon.removeClass('bi-check-circle-fill');
        icon.addClass('bi-circle-fill');
    }
}


//////////////////// Prototype Input ///////////////////////////////////////////////////////////////////////////////////
function initializePrototypePopover() {
    const cinta = ["Review Lecture 1 and learn to write data structures", "Prepare for InfoViz presentation", "INFO206 group project", "Work on design prototype", "Doing usability testing"];
    const cinta_completion = [true, true, false, false, false];
    const susanto = ["Work on design prototype", "Doing usability testing"];
    const susanto_completion = [true, false];
    const sinta = ["Review Lecture 1 and learn to write data structures", "Prepare for InfoViz presentation", "INFO206 group project"];
    const sinta_completion = [false, false];

    initializeEachPrototype("cinta", cinta, cinta_completion);
    initializeEachPrototype("susanto", susanto, susanto_completion);
    initializeEachPrototype("sinta", sinta, sinta_completion);

}

function initializeEachPrototype(name, goals, completion) {
    let popover = $("#popover-" + name);
    let content_str = '';

    goals.forEach((goal_str, index) => {
        content_str += getReadOnlyStr(goal_str, completion[index]);
    });

    popover.popover({
        html: true,
        title: name.toUpperCase() + "'S GOALS",
        content: content_str
    });
}

function getReadOnlyStr(goal_str, ifComplete) {
    let icon = ifComplete ? "bi-check-circle-fill" : "bi-circle-fill";
    return '<div class="row">' +
        '<div class="col-1">' +
        '<i class="bi ' + icon +' tdl-readonly"></i>' +
        '</div>' +
        '<div class="col-10 offset-custom">' +
        '<p>' + goal_str + '</p>' +
        '</div>' +
        '</div>'
}



var timerModeBtn = document.querySelector("#timer_mode")
timerModeBtn.addEventListener("click", () => {
    let screenImage = document.querySelector("#screenImg")
    let largeTimer = document.querySelector("#largeTimer")
    screenImage.setAttribute("style", "display: none;") 
    largeTimer.setAttribute("style", "display: block;")
})