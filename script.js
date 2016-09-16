// inputs
var inputName = document.getElementById('inputName');
var inputPhone = document.getElementById('inputPhone');
var inputEmail = document.getElementById('inputEmail');

var btnAdd = document.getElementById('btnAdd');
var btnDelete = document.getElementById('btnDelete');

// tables
var tableSearch = document.getElementById('tableSearch');
var tableDelete = document.getElementById('tableDelete');
var tableEdit = document.getElementById('tableEdit');


var arrayContact = [];
var check;

//local storage setup
var myStorage = localStorage;
var contactNum = myStorage.length;
var xhr = new XMLHttpRequest();

function updateContact() {

  for (var i = 0; i < myStorage.length; i++) {
    var newItem = myStorage.getItem(i);
    newItem = JSON.parse(newItem);
    console.log(newItem, myStorage);
    arrayContact[i] = newItem;
    console.log(arrayContact[i]);
    createRow(tableSearch, i, arrayContact[i].name, arrayContact[i].phone, arrayContact[i].email);
    deleteTable(tableDelete, i, arrayContact[i].name, arrayContact[i].phone, arrayContact[i].email);
    createRow(tableEdit, i, arrayContact[i].name, arrayContact[i].phone, arrayContact[i].email);
  }
}

//convert object contact to JSON string and storage it
function arrToStr(key, value) {
  var contactStr = JSON.stringify(value);
  myStorage.setItem(key, contactStr);
  console.log("JSON = " + contactStr);
}

// object constructor
function contact(name, phone, email, id) {
  this.id = id;
  this.name = name;
  this.phone = phone;
  this.email = email;
  this.date = function () {
    var userDate = new Date();
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November","December"];
    return days[userDate.getDay()] + " " + month[userDate.getMonth()] + " " + userDate.getFullYear();
  };
  this.delete = false;
};

//input listener
btnAdd.addEventListener('click', function() {
  if(inputName.value != "" || inputPhone.value != "" || inputEmail.value != "") {

      inputName = inputName.value;
      inputPhone = inputPhone.value;
      inputEmail = inputEmail.value;

      var newContact = new contact(inputName, inputPhone, inputEmail, contactNum);
      arrayContact[contactNum] = newContact;

      //log the new contact
      arrayContact[contactNum].date = arrayContact[contactNum].date();
      console.log(arrayContact[contactNum].date);
      arrToStr(contactNum, arrayContact[contactNum]);

      //change contact num and resets input box;
      contactNum += 1;

      inputName = ' ';
      inputPhone.value;
      inputEmail.value;
  } else {
    alert("try again");
  }
});
// create rows and checkbox listener
function createRow(tableName, num, name, phone, email) {
  //create the row and add data
  var tr = document.createElement('tr');
  var td = tr.appendChild(document.createElement('td'));
  td.innerHTML = name;
  tableName.appendChild(tr);
  var td = tr.appendChild(document.createElement('td'));
  td.innerHTML = phone;
  tableName.appendChild(tr);
  var td = tr.appendChild(document.createElement('td'));
  td.innerHTML = email;
  tableName.appendChild(tr);
}


function deleteTable(tableName, num, name, phone, email) {
  //create the checkbox
  var checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.id = "check" + num;
  checkbox.checked = arrayContact[num].delete;

    //create the row and add data
    var tr = document.createElement('tr');
    var td = tr.appendChild(document.createElement('td'));
    td.innerHTML = name;
    tableName.appendChild(tr);
    var td = tr.appendChild(document.createElement('td'));
    td.innerHTML = phone;
    tableName.appendChild(tr);
    var td = tr.appendChild(document.createElement('td'));
    td.innerHTML = email;
    tableName.appendChild(tr);
    //create row
    var td = tr.appendChild(document.createElement('td'));
    // add checkbox;
    td.appendChild(checkbox);
    // calls checkbox listener
    callListener(checkbox, arrayContact[num].delete, num);
}

// see if checkbox is clicked and updates contact
function callListener(checkName, comp, num) {
    checkName.addEventListener('click', function() {
    comp = !comp;
    arrayContact[num].delete = comp;
//    console.log(arrayContact[num].name + ' delete: ' + arrayContact[num].delete);
  });
}


function resetContact() {
    for (var i = 0; i < arrayContact.length; i++) {
      arrToStr(i, arrayContact[i]);
    }
};

btnDelete.addEventListener('click', function() {
  for (var i = 0; i < arrayContact.length; i++) {
    if (arrayContact[i].delete) {
      console.log("delete " + arrayContact[i]);
      arrayContact.splice(i, 1);
       localStorage.clear();
    }
  }
  resetContact();
});

window.onload = updateContact();
