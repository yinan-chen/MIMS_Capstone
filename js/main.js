function newSessionFormSubmit() {
    let sessionTopic = $('#sessionTopic').val();
    let sessionDescription = $('#sessionDescription').val();
    let privateSwitch = $('#privateSwitch').prop('checked');

    let session = $('#sessions');
    let sessions_str = session.html();
    sessions_str = createNewSessionHTML(sessionTopic, sessionDescription, privateSwitch) + sessions_str;
    session.html(sessions_str);

    //clear form entries
    $("#newSessionForm")[0].reset();
}

function createNewSessionHTML(topic, description, privateSwitch) {
    let session_str = "<div class='card' style='margin:10px'>" +
                            "<div class='row g-0'>" +
                                "<div class='col-md-6'>" +
                                    "<div class='card-body'>";

    session_str += "<h5 class='card-title'>" + topic + "</h5>";
    session_str += "<p class='card-text'>" + description + "</p>";
    session_str += "<p class='card-text'><small class='text-muted'>" + "Private Switch: " + privateSwitch + "</small></p>";

    session_str += "</div></div>" +
                        "<div class='col-md-6'>" +
                            "<div class='card-body'>" +
                                "<h5 class='card-title'>Card title</h5>" +
                                "<p class='card-text'>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>" +
                                "<p class='card-text'><small class=\"text-muted\">Last updated 3 hours ago</small></p>" +
                            "</div></div></div></div>";

    return session_str;
}