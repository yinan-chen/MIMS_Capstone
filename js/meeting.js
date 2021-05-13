// click events
$(document).on("click", ".tdl-check", function() {
    checkTask(this);
});

$('#screenModeBtnGroup button').on("click", function() {
    let id = this.id;
    $(this).addClass('checked').siblings().removeClass('checked');
    updateContent(id);
});

$('#videoControlBtnGroup button').on("click", function() {
    let id = this.id;
    let btn = $(this);
    let btn_icon = btn.children('i');

    if(id === 'camera') updateCamera(btn, btn_icon);
    if(id === 'mic') updateMic(btn, btn_icon);
});

$('#sessionGoal_0').on('input', function() {
    updateSessionGoalInput(this);
});

// Screen Control Update
const screen_path = "./img/";
const screenImg = $('#screenImg');
const largeTimer = $('#largeTimer');
const camera = $('#camera');
const mic = $('#mic');
const quiteModeWarning = $('#quiteModeWarning');
let isVideoScreen = false; //check if videos currently show are screens or not

function updateContent(mode) {
    //update screen
    if(mode === 'focus_mode') {
        screenImg.addClass('hidden') ;
        largeTimer.removeClass('hidden');
    }else{
        screenImg.removeClass('hidden') ;
        largeTimer.addClass('hidden');

        screenImg.attr('src', screen_path + mode + ".png");
    }

    //update others
    camera.prop('disabled', false);
    mic.prop('disabled', false);

    if(mode !== 'interactive_mode') {
        mic.prop('disabled', true);

        //enable quite mode warning
        quiteModeWarning.addClass('show');
    }else {
        dismissQuiteModeWarning();
    }

    if(mode === 'pressure_mode'){
        camera.prop('disabled', true);

        //update video pic to screens
        isVideoScreen = true;
        updateCameraImg();
    } else if(isVideoScreen) {
        isVideoScreen = false;
        updateCameraImg();
    }
}

function dismissQuiteModeWarning() {
    quiteModeWarning.removeClass('show');
}

function updateCameraImg() {
    const camera_path = screen_path + 'camera/';

    $('#cameras img').each((index, img) => {
        let img_path = isVideoScreen ? camera_path + 'screen.png' : camera_path + people[index] + ".png";
        $(img).attr('src', img_path);
    })
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
const newSessionForm = $('#newSessionForm');
const badge1 = $('#badge1');
const badge2 = $('#badge2');
let goals = [""]; // initialize one for default one input
let goals_completion = [false];
let numOfGoals = 1;
let isEditTDL = false;

function updateSessionGoalInput(element) {
    let task_index = parseInt(element.id.split("_")[1]);
    goals[task_index] = element.value;
}

function checkEmptyOrNot(element) {
    let inputValue = element.value;
    if (inputValue !== "") {
        $('#joinBtn').prop("disabled", false);
    } else {
        let isAllInputEmpty = true;
        goals.forEach((goal) => {
            isAllInputEmpty = isAllInputEmpty && goal === "";
        });

        if(isAllInputEmpty) $('#joinBtn').prop("disabled", true);
    }
}

function addOneMoreSessionGoalTextInputBelow(element){
    const session_id = "sessionGoal_" + numOfGoals;

    numOfGoals += 1;
    goals.push("");
    goals_completion.push(false);

    if(numOfGoals === MAX_GOALS)
        $(element).addClass("icon-disabled");

    const additionalToDoInput =
        `<div class="row mt-2">` +
            `<div class="col-7 offset-3">` +
                `<input type="text" id="${session_id}" class="form-control" aria-describedby="sessionGoalTextInput"  onkeyup="checkEmptyOrNot(this)"/>` +
            `</div>` +
            `<div class="col-2 m-auto">` +
                `<i class="bi bi-dash-circle-fill" onclick="removeSessionGoalTextInput(this)"></i>` +
            `</div>` +
        `</div>`;

    newSessionForm.append(additionalToDoInput);

    //initialize the oninput listen event
    $('#' + session_id).on('input', function() {
        updateSessionGoalInput(this);
    });
}

function removeSessionGoalTextInput(element) {
    const parent_row = $(element).parents('.row');
    let task_index = parseInt(parent_row.find('input').attr('id').split("_")[1]);
    goals.splice(task_index, 1);
    goals_completion.splice(task_index, 1);
    numOfGoals--;
    parent_row.remove();
}

function joinSession() {
    // update Sri's TDL
    let popover = $('#popover_0');
    let dots = $('#progressDots');
    let content_str = '', indicator_str = '';

    goals.forEach((goal_str, index) => {
        content_str += getTaskStr(index, people[0], goal_str);
        indicator_str += getIndicatorStr(index, people[0])
    });

    if(isEditTDL) {
        // discard the old popover
       popover.popover('dispose');
    } else {
        if(!isTimerStart) {
            //start timer
            let publicDisplay = document.querySelector('#tomatoTimer1');
            let largeTimer = document.querySelector('#largeTimer');
            startPublicTimer(countDownTimeInSec, publicDisplay, largeTimer);
        }

        isEditTDL = true;
    }

    //initialize TDL popover
    popover.popover({
        html: true,
        title: people[0].toUpperCase() + "'S GOALS",
        content: content_str
    });

    //initialize indicators shown on camera
    dots.html(indicator_str);
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
    let indicator_id = "#i_" + people[0] + "_" + index;
    updateTDLIcon($(indicator_id), goals_completion[index]);

    // if complete at least one goal => activate badge
    let atLeastOneTaskComplete = false;
    goals_completion.forEach((isComplete) => {
        if(isComplete) {
            atLeastOneTaskComplete = true;
        }
    });

    if(atLeastOneTaskComplete) {
        badge1.attr('src', "./img/icon/badge_focusmaster.png");
        badge2.attr('src', "./img/icon/badge_grandmaster.png");
    } else {
        badge1.attr('src', "./img/icon/badge_focusmaster_gray.png");
        badge2.attr('src', "./img/icon/badge_grandmaster_gray.png");
    }
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

function modifySessionGoals() {
    document.querySelector("#joinBtn").innerHTML = "Save Changes";

    $('#joinFormModal').modal('show');
}

// Exit session
function initializeHostExitBtnPopover(exitBtn) {
    const html = '<a href="common.html"><button type="button" class="btn btn-secondary">Leave Meeting</button></a>' +
        '<button type="button" class="btn btn-danger ms-2" data-bs-toggle="modal" data-bs-target="#sessionSummaryModal">End Sessions for All</button>';

    exitBtn.popover({
        sanitize:false,
        trigger: 'focus',
        html: true,
        content : html
    })
}

//////////////////// Prototype Input ///////////////////////////////////////////////////////////////////////////////////
function initializePrototypePopover() {
    const names = ['tracy', 'tiffany', 'yinan'];
    const prototype1 = ["Review Lecture 1 and learn to write data structures", "Prepare for InfoViz presentation", "INFO206 group project", "Work on design prototype", "Doing usability testing"];
    const prototype1_completion = [true, true, false, false, false];
    const prototype2 = ["Work on design prototype", "Doing usability testing"];
    const prototype2_completion = [true, false];
    const prototype3 = ["Review Lecture 1 and learn to write data structures", "Prepare for InfoViz presentation", "INFO206 group project"];
    const prototype3_completion = [true, false];

    people = people.concat(names);

    initializeEachPrototype(1, prototype1, prototype1_completion);
    initializeEachPrototype(2, prototype2, prototype2_completion);
    initializeEachPrototype(3, prototype3, prototype3_completion);

}

function initializeEachPrototype(id, goals, completion) {
    let popover = $("#popover_" + id);
    let content_str = '';

    goals.forEach((goal_str, index) => {
        content_str += getReadOnlyStr(goal_str, completion[index]);
    });

    popover.popover({
        html: true,
        title: people[id].toUpperCase() + "'S GOALS",
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