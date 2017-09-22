/* global localStorage, $ */
// tables
let tableSearch = document.getElementById('tableSearch')
let tableDelete = document.getElementById('tableDelete')
let tableEdit = document.getElementById('tableEdit')
let formAddContact = document.querySelector('#section2 form')

// modal
let feedback = document.getElementById('feedback')
let feedTitle = document.getElementById('feedback-title')
let mainContactsArray = downloadContact(localStorage)
let isCheckbox = true

// regExp
const validEmail = /\S+@\S+\.\S+/
const validPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
const validName = /\D/

// object constructor
function Contact (name, phone, email) {
  this.name = name
  this.phone = phone
  this.email = email
  this.date = function () {
    let userDate = new Date()
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return days[userDate.getDay()] + ' ' + month[userDate.getMonth()] + ' ' + userDate.getFullYear()
  }
};

function addContact (e) {
  e.preventDefault()
  let inputName = formAddContact.elements[0].value
  let inputPhone = formAddContact.elements[1].value
  let inputEmail = formAddContact.elements[2].value
  let message = ''
  let title = 'Try again!'
  // test input with regExp, if passes will create contact
  if (!validName.test(inputName)) message += 'name is wrong <br>'
  if (!validPhone.test(inputPhone)) message += 'phone is wrong <br>'
  if (!validEmail.test(inputEmail)) message += 'email is wrong <br>'
  if (message === '') {
    title = 'Done!'
    message = `The contact ${inputName} was added successfully`
    mainContactsArray.push(new Contact(inputName, inputPhone, inputEmail))
    updateContactStorage(mainContactsArray)
    updateAllTables()
    resetInputValue()
  }
  showModal(title, message)
}

function showModal (title, body) {
  feedTitle.innerHTML = title
  feedback.innerHTML = body
  $('#modalPop').modal('show')
}

function resetInputValue () {
  formAddContact.elements[0].value = ''
  formAddContact.elements[1].value = ''
  formAddContact.elements[2].value = ''
}

function saveEdit (e) {
  e.preventDefault()
  let tableRowData = tableEdit.querySelectorAll('tr')
  tableRowData = Array.from(tableRowData)
  let contactsArrayEdited = tableRowData.map((item) => {
    return {
      name: item.cells[0].innerText,
      phone: item.cells[1].innerText,
      email: item.cells[2].innerText
    }
  })
  mainContactsArray = contactsArrayEdited
  updateContactStorage(mainContactsArray)
  updateAllTables()
}

// convert object contact to JSON string and storage it
function updateContactStorage (arr) {
  localStorage.clear()
  arr.forEach((item, index) => {
    localStorage.setItem(index, JSON.stringify(item))
  })
}

// gets users data from local storage and returns an array of objects
function downloadContact (storage) {
  let arr = []
  if (storage.length !== 0) {
    for (var item in storage) {
      arr.push(JSON.parse(storage[item]))
    }

  }
  return arr
}

function getTableRowUser (obj, checkbox, index) {
  let row = '<tr>'
  if (checkbox) row += `<td> <input type="checkbox" value="${index}"> </td>`
  row += `<td>${obj['name']}</td>
          <td>${obj['phone']}</td>
          <td>${obj['email']}</td></tr>`
  return row
}

function deleteContact (e) {
  e.preventDefault()
  let checkbox = tableDelete.querySelectorAll('input')
  checkbox.forEach((item) => {
    if (item.checked) {
      delete mainContactsArray[item.value]
    }
  })
  updateContactStorage(mainContactsArray)
  updateAllTables()
}

function enableEdit (e) {
  e.target.contentEditable = true
}

function getMainTable (acc, user) {
  acc += getTableRowUser(user)
  return acc
}

function getCheckboxTable (acc, user, index) {
  acc += getTableRowUser(user, isCheckbox, index)
  return acc
}

function updateAllTables () {
  let mainTable = mainContactsArray.reduce(getMainTable, '')
  tableSearch.innerHTML = mainTable
  tableEdit.innerHTML = mainTable
  tableDelete.innerHTML = mainContactsArray.reduce(getCheckboxTable, '')
}

// edit table and buttons listeners
tableEdit.addEventListener('click', enableEdit)
document.getElementById('btnAdd').addEventListener('click', addContact)
document.getElementById('btnSave').addEventListener('click', saveEdit)
document.getElementById('btnDelete').addEventListener('click', deleteContact)

updateAllTables()
