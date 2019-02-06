var user;
var pass;
var sr;

function soap(){

    var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', 'http://localhost:8080/ws/entities.wsdl', true);

        // build SOAP request
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var response = xmlhttp.responseXML;
                    var oSerializer = new XMLSerializer();
                    var sXML = oSerializer.serializeToString(response);
                    if(sXML.includes("failed")){
                        alert("invalid login");
                    }else{
                        alert("valid login");
                        var tmp=sXML.split("token>");
                        var tmp2=tmp[1].split("<");
                        sessionStorage.setItem("token",tmp2[0]);
                        window.location.replace("home/home.html");
                    }
                }
            }
        }

    sessionStorage.setItem("user",document.getElementById("username").value);
    sessionStorage.setItem("pass",document.getElementById("password").value);

    sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soapenv:Envelope ' +
        'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">'+
            '<soapenv:Header/>' +
            '<soapenv:Body>'+
               '<gs:sendLoginRequest>'+
                  '<gs:loginInfo>'+sessionStorage.getItem("user")+' '+sessionStorage.getItem("pass")+'</gs:loginInfo>'+
               '</gs:sendLoginRequest>'+
            '</soapenv:Body>'+
         '</soapenv:Envelope>';


    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
}
