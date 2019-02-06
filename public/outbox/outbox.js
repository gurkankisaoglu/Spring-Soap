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
                    console.log(response);
                    generateMessages(response);


                }
            }
        }

        sr =
            '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">' +
               '<soapenv:Header/>'+
               '<soapenv:Body>'+
                  '<gs:getOutboxRequest>'+
                     '<gs:currentUser>' + sessionStorage.getItem("user") + '</gs:currentUser>' +
                     '<gs:token>' + sessionStorage.getItem("token")+'</gs:token>' +
                     '<gs:from>'+sessionStorage.getItem("user")+'</gs:from>' +
                  '</gs:getOutboxRequest>' +
               '</soapenv:Body>' +
            '</soapenv:Envelope>';


        // Send the POST request
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.send(sr);
}

function generateMessages(response){
    var i=0;
    var table = document.getElementById("outboxTable");
    while(response.getElementsByTagName("text")[i]!=null){
        var to=response.getElementsByTagName("to")[i].innerHTML;
        var date=response.getElementsByTagName("date")[i].innerHTML;
        var text=response.getElementsByTagName("text")[i].innerHTML;
        i++;
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        cell1.innerHTML = sessionStorage.getItem("user");
        cell2.innerHTML = to;
        cell3.innerHTML = date;
        cell4.innerHTML = text;
    }
}


function goBack(){
    window.location.replace("../home/home.html");
}

function sort(a) {
  var sorted=0;
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("outboxTable");
  switching = true;
  while (switching) {

    switching = false;
    rows = table.getElementsByTagName("TR");

    for (i = 0; i < (rows.length - 1); i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("TD")[a];
      y = rows[i + 1].getElementsByTagName("TD")[a];
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      sorted++;
      switching = true;
    }
  }
  if(sorted==0){
    sort2(a);
  }
}
function sort2(a) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("outboxTable");
  switching = true;

  while (switching) {

    switching = false;
    rows = table.getElementsByTagName("TR");

    for (i = 0; i < (rows.length - 1); i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("TD")[a];
      y = rows[i + 1].getElementsByTagName("TD")[a];
      if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}