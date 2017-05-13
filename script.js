/* global localStorage */
// inputs
var inputName = document.getElementById('inputName')
var inputPhone = document.getElementById('inputPhone')
var inputEmail = document.getElementById('inputEmail')
var feedback = document.getElementById('feedback')

// buttons
var btnAdd = document.getElementById('btnAdd')
var btnDelete = document.getElementById('btnDelete')
var btnSave = document.getElementById('btnSave')

// tables
var tableSearch = document.getElementById('tableSearch')
var tableDelete = document.getElementById('tableDelete')
var tableEdit = document.getElementById('tableEdit')

var arrayContact = []

// local storage setup
var myStorage = localStorage
var contactNum = myStorage.length

// convert object contact to JSON string and storage it
function uploadContact (key, value) {
  var contactStr = JSON.stringify(value)
  myStorage.setItem(key, contactStr)
}

// object constructor
function Contact (name, phone, email, id) {
  this.name = name
  this.phone = phone
  this.email = email
  this.date = function () {
    var userDate = new Date()
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return days[userDate.getDay()] + ' ' + month[userDate.getMonth()] + ' ' + userDate.getFullYear()
  }
};

function resetContact () {
  for (var i = 0; i < arrayContact.length; i++) {
    uploadContact(i, arrayContact[i])
  }
};

// input listener
btnAdd.addEventListener('click', function (e) {
  var validEmail = /\S+@\S+\.\S+/
  var validPhone = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/
  var validName = /\D/

  if (validName.test(inputName.value) && validPhone.test(inputPhone.value) && validEmail.test(inputEmail.value)) {
    var newContact = new Contact(inputName.value, inputPhone.value, inputEmail.value, contactNum)
    arrayContact[contactNum] = newContact

    // log the new contact
    arrayContact[contactNum].date = arrayContact[contactNum].date()
    uploadContact(contactNum, arrayContact[contactNum])

    // change contact num and resets input box;
    contactNum += 1
  } else {
    e.preventDefault()
    $('#modalPop').modal('show')

    var msgName = ''
    var msgPhone = ''
    var msgEmail = ''
    var finalMsg

    if (!validName.test(inputName.value)) {
      msgName = 'name is wrong'
    }
    if (!validPhone.test(inputPhone.value)) {
      msgPhone = 'phone is wrong'
    }
    if (!validEmail.test(inputEmail.value)) {
      msgEmail = 'email is wrong'
    }

    finalMsg = msgName + '<br>' + msgPhone + '<br>' + msgEmail
    feedback.innerHTML = finalMsg
  }
})

btnDelete.addEventListener('click', function () {
  var allCheckBoxes = tableDelete.querySelectorAll('input')
  for (var i = allCheckBoxes.length; i > 0; i--) {
    if (allCheckBoxes[i - 1].checked) {
      arrayContact.splice(i - 1, 1)
    }
  }
  localStorage.clear()
  resetContact()
})

btnSave.addEventListener('click', function (e) {
  var nameX
  var dataX
  var data = tableEdit.querySelectorAll('tr')

  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].children.length; j++) {
      nameX = data[i].children[j].id
      dataX = data[i].children[j].innerHTML
      arrayContact[i][nameX] = dataX; 8
    }
  }
  localStorage.clear()
  resetContact()
})

// window.onload

// ------------------------------------------ //

let usersArr = downloadContact(localStorage)
let checkbox = '<input type="checkbox" id="check1">'

// gets users data from local storage and returns an array of objects
function downloadContact (storage) {
  let arr = []
  for (var item in storage) {
    arr.push(JSON.parse(storage[item]))
  }
  return arr
}

function getTableRowUser (obj, checkbox) {
  let row = '<tr>'
  if (checkbox) row += '<td>' + checkbox + '</td>'
  row += '<td>' + obj['name'] + '</td>' +
    '<td>' + obj['phone'] + '</td>' +
    '<td>' + obj['email'] + '</td>' +
    '</tr>'
  return row
}

function enableEdit (e) {
  e.target.contentEditable = true
}

let table = usersArr.reduce((acc, user) => {
  acc += getTableRowUser(user)
  return acc
}, '')

let tableCheckbox = usersArr.reduce((acc, user) => {
  acc += getTableRowUser(user, checkbox)
  return acc
}, '')

tableSearch.innerHTML = table
tableEdit.innerHTML = table
tableDelete.innerHTML = tableCheckbox

tableEdit.addEventListener('click', enableEdit)
