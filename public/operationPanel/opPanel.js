if(sessionStorage.getItem("user")===null){
    window.location.replace("../index.html")
}
function loadUsers(){
    var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', 'http://localhost:8080/ws/entities.wsdl', true);
        // build SOAP request
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var response = xmlhttp.responseXML;
                    generateUsers(response);

                }
            }
        }

        sr =
            '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">' +
               '<soapenv:Header/>'+
               '<soapenv:Body>'+
                  '<gs:getUserRequest>'+
                     '<gs:from>'+sessionStorage.getItem("user")+'</gs:from>' +
                  '</gs:getUserRequest>' +
               '</soapenv:Body>' +
            '</soapenv:Envelope>';


        // Send the POST request
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.send(sr);
}

function generateUsers(response){
    var i=0;
    var table = document.getElementById("usersTable");
    while(response.getElementsByTagName("username")[i]!=null){
        var username=response.getElementsByTagName("username")[i].innerHTML;
        var password=response.getElementsByTagName("password")[i].innerHTML;
        var email=response.getElementsByTagName("email")[i].innerHTML;
        var gender=response.getElementsByTagName("gender")[i].innerHTML;
        var address=response.getElementsByTagName("address")[i].innerHTML;
        var authority=response.getElementsByTagName("authority")[i].innerHTML;
        i++;
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);

        cell1.innerHTML = username;
        cell2.innerHTML = password;
        cell3.innerHTML = email;
        cell4.innerHTML = gender;
        cell5.innerHTML = address;
        cell6.innerHTML = authority;
        cell7.innerHTML =   "<button type='button' onclick='deleteRow(this)'>Delete </button>"+
                            '<input type="text" id="newProperty">'+
                            '<div class="input-group mb-3">'+
                              '<div class="input-group-prepend">'+
                                '<button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Update</button>'+
                                '<div class="dropdown-menu">'+
                                  '<a class="dropdown-item" href="#" onclick="updateUser(this)">username</a>'+
                                  '<div role="separator" class="dropdown-divider"></div>'+

                                  '<a class="dropdown-item" href="#" onclick="updateUser(this)">password</a>'+
                                  '<div role="separator" class="dropdown-divider"></div>'+
                                  '<a class="dropdown-item" href="#" onclick="updateUser(this)">email</a>'+

                                  '<div role="separator" class="dropdown-divider"></div>'+

                                  '<a class="dropdown-item" href="#" onclick="updateUser(this)">gender</a>'+
                                  '<div role="separator" class="dropdown-divider"></div>'+

                                  '<a class="dropdown-item" href="#" onclick="updateUser(this)">address</a>'+

                                  '<div role="separator" class="dropdown-divider"></div>'+

                                  '<a class="dropdown-item" href="#" onclick="updateUser(this)">authority</a>'+

                                '</div>'+
                              '</div>'+
                            '</div>';
    }
    var row = table.insertRow(0);
    var cell1=row.insertCell(0);
    var cell2=row.insertCell(1);
    var cell3=row.insertCell(2);
    var cell4=row.insertCell(3);
    var cell5=row.insertCell(4);
    var cell6=row.insertCell(5);
    var cell7=row.insertCell(6);

    cell1.innerHTML = "<input type='text' id='username'>";
    cell2.innerHTML = "<input type='text' id='password'>";
    cell3.innerHTML = "<input type='text' id='email'>";
    cell4.innerHTML = "<input type='text' id='gender'>";
    cell5.innerHTML = "<input type='text' id='address'>";
    cell6.innerHTML = "<input type='text' id='authority'>";
    cell7.innerHTML = "<button type='button' id='addButton' onclick='addUser()'>Add</button>";
}

function addUser(){
    var username=document.getElementById("username").value;
    var password=document.getElementById("password").value;
    var email=document.getElementById("email").value;
    var gender=document.getElementById("gender").value;
    var address=document.getElementById("address").value;
    var authority=document.getElementById("authority").value;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws/entities.wsdl', true);
    // build SOAP request
    sr =
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">' +
            '<soapenv:Header/>'+
                '<soapenv:Body>'+
                    '<gs:getCreateRequest>'+
                         '<gs:currentUser>' + sessionStorage.getItem("user") + '</gs:currentUser>' +
                         '<gs:token>' + sessionStorage.getItem("token")+'</gs:token>' +
                         '<gs:username>'+username+'</gs:username>' +
                         '<gs:password>'+password+'</gs:password>' +
                         '<gs:email>'+email+'</gs:email>' +
                         '<gs:gender>'+gender+'</gs:gender>' +
                         '<gs:address>'+address+'</gs:address>' +
                         '<gs:authority>'+authority+'</gs:authority>' +
                    '</gs:getCreateRequest>' +
                '</soapenv:Body>' +
            '</soapenv:Envelope>';

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var response = xmlhttp.responseXML;
                 var tableRef = document.getElementById('usersTable');
                 while ( tableRef.rows.length > 0 ){
                    tableRef.deleteRow(0);
                 }
                 loadUsers();
            }
        }
    }

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);

}

function deleteRow(button){
    var username=button.parentNode.parentNode.cells[0].innerHTML;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws/entities.wsdl', true);
    // build SOAP request
    sr =
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">' +
            '<soapenv:Header/>'+
                '<soapenv:Body>'+
                    '<gs:getDeleteRequest>'+
                         '<gs:currentUser>' + sessionStorage.getItem("user") + '</gs:currentUser>' +
                         '<gs:token>' + sessionStorage.getItem("token")+'</gs:token>' +
                         '<gs:username>'+username+'</gs:username>' +
                    '</gs:getDeleteRequest>' +
                '</soapenv:Body>' +
            '</soapenv:Envelope>';

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var response = xmlhttp.responseXML;
                var tableRef = document.getElementById('usersTable');
                for(var i=0 ; i<button.parentNode.parentNode.parentNode.rows.length ; i++){
                    if(button.parentNode.parentNode.parentNode.rows[i].cells[0].innerHTML===username){
                        var tableRef=document.getElementById("usersTable");
                        tableRef.deleteRow(i);
                        break;
                    }
                }
            }
        }
    }
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
}

function updateUser(a){
    var property=a.innerHTML;
    var newProperty=a.parentNode.parentNode.parentNode.parentNode.childNodes[2].value;
    var username=a.parentNode.parentNode.parentNode.parentNode.parentNode.cells[0].innerHTML;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws/entities.wsdl', true);
    // build SOAP request
    sr =
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gs="http://spring.io/guides/gs-producing-web-service">'+
           '<soapenv:Header/>'+
           '<soapenv:Body>'+
              '<gs:getUpdateRequest>'+
                 '<gs:currentUser>' + sessionStorage.getItem("user") + '</gs:currentUser>' +
                 '<gs:token>' + sessionStorage.getItem("token")+'</gs:token>' +
                 '<gs:username>'+username+'</gs:username>'+
                 '<gs:identity>'+property+'</gs:identity>'+
                 '<gs:newIdentity>'+newProperty+'</gs:newIdentity>'+
              '</gs:getUpdateRequest>'+
           '</soapenv:Body>'+
        '</soapenv:Envelope>';

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var response = xmlhttp.responseXML;
                var tableRef = document.getElementById('usersTable');
                     while ( tableRef.rows.length > 0 ){
                        tableRef.deleteRow(0);
                     }
                     loadUsers();
                     window.location.replace("opPanel.html");
            }
        }
    }
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
}

function goBack(){
    window.location.replace("../home/home.html");
}

function sort(a) {
  var sorted=0;
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("usersTable");
  switching = true;

  while (switching) {

    switching = false;
    rows = table.getElementsByTagName("TR");

    for (i = 1; i < (rows.length - 1); i++) {
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
  table = document.getElementById("usersTable");
  switching = true;

  while (switching) {

    switching = false;
    rows = table.getElementsByTagName("TR");

    for (i = 1; i < (rows.length - 1); i++) {
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

