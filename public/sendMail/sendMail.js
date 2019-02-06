if(sessionStorage.getItem("user")===null){
    window.location.replace("index.html")
}
function sendMessage(){
       var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', 'http://localhost:8080/ws/entities.wsdl', true);
        var to=document.getElementById("toSend").value;
        var text=document.getElementById("message").value;
         sr =
                   '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">' +
                      '<soapenv:Header/>'+
                      '<soapenv:Body>'+
                         '<gs:sendMailRequest>'+
                            '<gs:currentUser>' + sessionStorage.getItem("user") + '</gs:currentUser>' +
                            '<gs:token>' + sessionStorage.getItem("token")+'</gs:token>' +
                            '<gs:messageInfo>'+sessionStorage.getItem("user") +' '+to +' '+text+'</gs:messageInfo>' +
                         '</gs:sendMailRequest>' +
                      '</soapenv:Body>' +
                   '</soapenv:Envelope>';

        // build SOAP request
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var response = xmlhttp.responseXML;
                    alert("Mail Sent");
                    window.location.replace("../home.html");
                }
            }
        }



        // Send the POST request
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.send(sr);


}

function goBack(){
    window.location.replace("../home/home.html");
}