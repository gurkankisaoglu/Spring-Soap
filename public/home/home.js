if(sessionStorage.getItem("user")===null){
    window.location.replace("index.html")
}
function editList(){
    document.getElementById("disable1").classList.remove("hidden");
}
function isAdmin(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws/entities.wsdl', true);
    // build SOAP request
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var response = xmlhttp.responseXML;
                var oSerializer = new XMLSerializer();
                var sXML = oSerializer.serializeToString(response);
                if(!sXML.includes("Not")){
                    editList();
                }
            }
        }
    }

    sr =
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">' +
           '<soapenv:Header/>' +
           '<soapenv:Body>' +
              '<gs:sendAdminRequest>' +
                 '<gs:username>' + sessionStorage.getItem("user") + '</gs:username>' +
              '</gs:sendAdminRequest>' +
           '</soapenv:Body>' +
        '</soapenv:Envelope>';


    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
}

function loadInbox(){
    window.location.replace("../inbox/inbox.html");
}


function loadOutbox(){
    window.location.replace("../outbox/outbox.html");
}


function loadSendMail(){
    window.location.replace("../sendMail/sendMail.html");
}


function loadOpPanel(){
    window.location.replace("../operationPanel/opPanel.html");
}

function loadLoginScreen(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws/entities.wsdl', true);
    // build SOAP request
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var response = xmlhttp.responseXML;
                var oSerializer = new XMLSerializer();
                var sXML = oSerializer.serializeToString(response);
                if(sXML.includes("success")){
                    sessionStorage.clear();
                    window.location.replace("../index.html");
                }
            }
        }
    }

    sr =
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">' +
           '<soapenv:Header/>' +
           '<soapenv:Body>' +
              '<gs:sendLogoutRequest>' +
                 '<gs:logoutInfo>' + sessionStorage.getItem("user") + '</gs:logoutInfo>' +
              '</gs:sendLogoutRequest>' +
           '</soapenv:Body>' +
        '</soapenv:Envelope>';


    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
}