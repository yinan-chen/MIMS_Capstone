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
                                    "<div class='card-body left-card'>";

    session_str += privateSwitch == false ? "<h6 >Session Info</h2>": "<h6 >Private Session Info</h2>";
    session_str += "<h5 class='card-title'>" + topic + "</h5>";
    session_str += "<h6>Description</h6>";
    session_str += "<p class='card-text'>" + description + "</p>";

    session_str += "</div></div>" +
                        "<div class='col-md-6'>" +
                            "<div class='card-body'>" +
                                "<h5 class='card-title'>Members</h5>" +
                                `<div class="countDownTimer">` +
                                    `<img class="rounded-circle clockImg" src="./img/icon/Clock Icon.png">` +
                                    `<p class="card-text"><small class="text-muted">Ends in <span>--:--</span></small></p>` +
                                `</div>` +
                                "<p class='card-text'></p>" +
                                `<div class="sessionMembers">
                                     <img class="rounded-circle sessionMembersPicture" src="./img/profilePicture.png">
                                     <img class="rounded-circle sessionMembersPicture" src="./img/profilePicture.png">
                                     <img class="rounded-circle sessionMembersPicture" src="./img/profilePicture.png">
                                     <br>
                                     <img class="rounded-circle sessionMembersPicture" src="./img/profilePicture.png">
                                     <img class="rounded-circle sessionMembersPicture" src="./img/profilePicture.png">
                                     <img class="rounded-circle sessionMembersPicture" src="./img/moreProfilePicture.png">
                                 </div>`;
    if (privateSwitch == false){
        session_str +=          `<div class="d-grid gap-2 col-1.5 mx-auto join-btn">` + 
                                    `<button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#joinFormModal">Join</button>` +
                                `</div>`;
    }                       
    else {
        session_str +=          `<div class="opaqueLayer">
                                 </div>
                                 <div class="d-grid gap-2 col-1.5 mx-auto askPermission">
                                    <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#joinFormModal">Ask for permission</button>
                                 </div>`;
    }
    session_str += "</div></div></div></div>";

    return session_str;
}
