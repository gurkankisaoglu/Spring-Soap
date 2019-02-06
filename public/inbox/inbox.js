if(sessionStorage.getItem("user")===null){
    window.location.replace("index.html")
}
function loadMessages(){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', 'http://localhost:8080/ws/entities.wsdl', true);
        // build SOAP request
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var response = xmlhttp.responseXML;
                    generateMessages(response);

                }
            }
        }
        sr =
            '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">' +
               '<soapenv:Header/>'+
               '<soapenv:Body>'+
                  '<gs:getInboxRequest>'+
                     '<gs:currentUser>' + sessionStorage.getItem("user") + '</gs:currentUser>' +
                     '<gs:token>' + sessionStorage.getItem("token")+'</gs:token>' +
                     '<gs:to>'+sessionStorage.getItem("user")+'</gs:to>' +
                  '</gs:getInboxRequest>' +
               '</soapenv:Body>' +
            '</soapenv:Envelope>';
        // Send the POST request
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.send(sr);
}

function generateMessages(response){
    var i=0;
    var table = document.getElementById("inboxTable");
    while(response.getElementsByTagName("text")[i]!=null){
        var from=response.getElementsByTagName("from")[i].innerHTML;
        var date=response.getElementsByTagName("date")[i].innerHTML;
        var text=response.getElementsByTagName("text")[i].innerHTML;
        i++;
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        cell1.innerHTML = from;
        cell2.innerHTML = sessionStorage.getItem("user");
        cell3.innerHTML = date;
        cell4.innerHTML = text;
    }
}


function goBack(){
    window.location.replace("../home/home.html");
}

