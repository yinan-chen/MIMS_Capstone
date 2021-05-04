// To do List
const MAX_GOALS = 5;
let goals = [], goals_completion = [];
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
        }
    }

}

function updateGoalPreviewListHtmlStr(goal_str) {
    let exist_list_str = goalsPreviewList.html();
    let new_goal_str = '<li>' + goal_str + '</li>';

    goalsPreviewList.html(exist_list_str + new_goal_str);
}

function joinSession() {
    // update Clinta's TDL
    const name = "clinta";
    let popover = $('#popover-clinta');
    let indicator = $('#i_clinta');
    let content_str = '', indicator_str = '';


    goals.forEach((goal_str, index) => {
        content_str += getTaskStr(index, name, goal_str);
        indicator_str += getIndicatorStr(index, name)
    });

    //update popover
    popover.popover({
        html: true,
        title: "CLINTA'S GOALS",
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
    return '<i class="bi bi-circle-fill ms-1" id="' + i_id + '"></i>'
}


function checkTask(element) {
    // update TDL icon
    updateIcon($(element));

    // update associated indicator icon
    let task_index = element.id.split("_")[1];
    console.log(task_index);
    let indicator_id = "#i_clinta_" + task_index;
    updateIcon($(indicator_id));
}

function updateIcon(element) {
    element.removeClass('bi-circle-fill');
    element.addClass('bi-check-circle-fill');
}