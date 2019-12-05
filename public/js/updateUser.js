function updateStatus(username) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", `/status/${username}`, true);
    xmlHttp.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            location.reload();
        }
    };
    xmlHttp.send();
}

function updateAdminStatus(username) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", `/admin-status/${username}`, true);
    xmlHttp.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            location.reload();
        }
    };
    xmlHttp.send();
}