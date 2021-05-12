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
const people = ['sri', 'cinta', 'susanto', 'sinta'];
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
    $('#cameras img').each((index, img) => {
        const img_path = isVideoScreen ? screen_path + 'screen.png' : screen_path + people[index] + ".png";
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
let goals = [""]; // initialize one for default one input
let goals_completion = [false];
let numOfGoals = 1;
let isEditTDL = false;

function updateSessionGoalInput(input) {
    let task_index = parseInt(input.id.split("_")[1]);
    goals[task_index] = input.value;
    console.log(goals[task_index]);
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

function addOneMoreSessionGoalTextInputBelow(icon){
    const session_id = "sessionGoal_" + numOfGoals;

    numOfGoals += 1;
    goals.push("");
    goals_completion.push(false);

    if(numOfGoals === MAX_GOALS)
        $(icon).addClass("icon-disabled");

    const additionalToDoInput =
        `<div class="row mt-2">` +
            `<div class="col-7 offset-3">` +
                `<input type="text" id="${session_id}" class="form-control" aria-describedby="sessionGoalTextInput"  onkeyup="checkEmptyOrNot(this)"/>` +
            `</div>` +
        `</div>`;

    newSessionForm.append(additionalToDoInput);

    //initialize the oninput listen event
    $('#' + session_id).on('input', function() {
        updateSessionGoalInput(this);
    });
}

function joinSession() {
    // update Sri's TDL
    const name = "sri";
    let popover = $('#popover-sri');
    let indicator = $('#i_sri');
    let content_str = '', indicator_str = '';

    console.log(goals);


    goals.forEach((goal_str, index) => {
        content_str += getTaskStr(index, name, goal_str);
        indicator_str += getIndicatorStr(index, name)
    });

    if(isEditTDL) {
        // discard the old popover
       popover.popover('dispose');
    } else {
        //start timer
        let publicDisplay = document.querySelector('#tomatoTimer1');
        let largeTimer = document.querySelector('#largeTimer');
        startPublicTimer(countDownTimeInSec, publicDisplay, largeTimer);

        isEditTDL = true;
    }

    //initialize TDL popover
    popover.popover({
        html: true,
        title: "SRI'S GOALS",
        content: content_str
    });

    //initialize indicators shown on camera
    indicator.html(indicator_str);
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