// Screen Control
let curr_mode = "interactive_mode";
let screenImg = $('#screenImg');

function updateScreen(element) {
    const screen_path = "./img/";
    const icon_path = "./img/icon/";
    let curr_mode_id = "#" + curr_mode;
    let new_mode = element.id;


    //update control button
    $(curr_mode_id).attr('src', icon_path + curr_mode + "_gray.png");
    element.src = icon_path + new_mode + ".png";

    //update screen
    screenImg.attr('src', screen_path + new_mode + ".png");

    curr_mode = new_mode;
}


// To do List
const MAX_GOALS = 5;
let goals = [];
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
    startPublicTimer(countDownTimeInSec, publicDisplay);
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
    // update TDL icon
    updateIcon($(element));

    // update associated indicator icon
    let task_index = element.id.split("_")[1];
    console.log(task_index);
    let indicator_id = "#i_sri_" + task_index;
    updateIcon($(indicator_id));
}

function updateIcon(element) {
    element.removeClass('bi-circle-fill');
    element.addClass('bi-check-circle-fill');
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

