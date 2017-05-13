/* global localStorage, $ */
// inputs
var inputName = document.getElementById('inputName')
var inputPhone = document.getElementById('inputPhone')
var inputEmail = document.getElementById('inputEmail')
var feedback = document.getElementById('feedback')

// buttons
var btnAddContact = document.getElementById('btnAdd')
var btnSaveEdit = document.getElementById('btnSave')

// tables
var tableSearch = document.getElementById('tableSearch')
var tableDelete = document.getElementById('tableDelete')
var tableEdit = document.getElementById('tableEdit')

// local storage setup
var myStorage = localStorage

let arrayContact = downloadContact(localStorage)
let isCheckbox = true

// object constructor
function Contact (name, phone, email) {
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

function addContact (e) {
  var validEmail = /\S+@\S+\.\S+/
  var validPhone = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\]{0,1}[0-9]{3}[-\s\]{0,1}[0-9]{4}$/
  var validName = /\D/

  if (validName.test(inputName.value) && validPhone.test(inputPhone.value) && validEmail.test(inputEmail.value)) {
    var newContact = new Contact(inputName.value, inputPhone.value, inputEmail.value)
    arrayContact.push(newContact)
    updateContactStorage(arrayContact)
  } else {
    e.preventDefault()
    var str = ''
    if (!validName.test(inputName.value)) str += 'name is wrong <br>'
    if (!validPhone.test(inputPhone.value)) str += 'phone is wrong <br>'
    if (!validEmail.test(inputEmail.value)) str += 'email is wrong <br>'
    feedback.innerHTML = str
    $('#modalPop').modal('show')
  }
}

function saveEdit () {
  // var nameX
  // var dataX
  // var data = tableEdit.querySelectorAll('tr')
  //
  // for (var i = 0; i < data.length; i++) {
  //   for (var j = 0; j < data[i].children.length; j++) {
  //     nameX = data[i].children[j].id
  //     dataX = data[i].children[j].innerHTML
  //     arrayContact[i][nameX] = dataX; 8
  //   }
  // }
  // localStorage.clear()
  // resetContact()

}

// convert object contact to JSON string and storage it
function updateContactStorage (arr) {
  localStorage.clear()
  arr.forEach((item, index) => {
    myStorage.setItem(index, JSON.stringify(item))
  })
}

// gets users data from local storage and returns an array of objects
function downloadContact (storage) {
  let arr = []
  for (var item in storage) {
    arr.push(JSON.parse(storage[item]))
  }
  return arr
}

function getTableRowUser (obj, checkbox, index) {
  let row = '<tr>'
  if (checkbox) row += '<td>' + '<input type="checkbox" value="' + index + '">' + '</td>'
  row += '<td>' + obj['name'] + '</td>' +
    '<td>' + obj['phone'] + '</td>' +
    '<td>' + obj['email'] + '</td>' +
    '</tr>'
  return row
}

function enableEdit (e) {
  e.target.contentEditable = true
}

let mainTable = arrayContact.reduce((acc, user) => {
  acc += getTableRowUser(user)
  return acc
}, '')

let tableCheckbox = arrayContact.reduce((acc, user, index) => {
  acc += getTableRowUser(user, isCheckbox, index)
  return acc
}, '')

function checkboxHandler (e) {
  if (e.target.type === 'checkbox' && e.target.checked) {
    console.log(e.target.value)
  }
}

// update DOM tables
tableSearch.innerHTML = mainTable
tableEdit.innerHTML = mainTable
tableDelete.innerHTML = tableCheckbox

// tables listeners
tableEdit.addEventListener('click', enableEdit)
tableDelete.addEventListener('click', checkboxHandler)

// buttons listeners
btnAddContact.addEventListener('click', addContact)
btnSaveEdit.addEventListener('click', saveEdit)
