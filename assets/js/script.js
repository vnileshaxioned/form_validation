var firstName = document.querySelector('#firsrt-name'),
  lastName = document.querySelector('#last-name'),
  female = document.querySelector('#female'),
  male = document.querySelector('#male'),
  phoneNumber = document.querySelector('#phone-number'),
  address = document.querySelector('#address'),
  userInput = document.querySelectorAll('.form-content'),
  genderError = document.querySelector('.gender-error'),
  submit = document.querySelector('.submit-btn'),
  cancel = document.querySelector('.cancel-btn'),
  userDetail = JSON.parse(localStorage.getItem('userData')),
  patternString = /^[A-Za-z]+$/,
  patternNumber = /^[6-9]\d{9}$/,
  id = 'no';

showData();
var arr = getUserData() ? getUserData() : [];

// for submit
submit.addEventListener('click', function (e) {
  e.preventDefault();
  var errors = document.querySelectorAll('.error-active');
  if (firstName.value && lastName.value && (female.checked || male.checked) && phoneNumber.value && address.value && (errors.length == 0)) {
    var gender = female.checked ? female.value : male.value,
      data = {
        'firstName' : firstName.value,
        'lastName' : lastName.value,
        'gender' : gender,
        'phoneNumber' : phoneNumber.value,
        'address' : address.value,
      }

    if (id == 'no') {
      arr.push(data);
    } else {
      arr[id] = data;
    }
    setUserData(arr);
    showData();
    empty();
  } else {
    if ((female.checked != true) && (male.checked != true)) {
      showError(male, male.checked);
    } else {
      genderError.classList.remove('error-active');
    }
    showError(firstName, firstName.value, patternString, 'Only characters are allowed', 8);
    showError(lastName, lastName.value, patternString, 'Only characters are allowed', 10);
    showError(phoneNumber, phoneNumber.value, patternNumber, 'Only digits are allowed', 10, 'number');
    showError(address, address.value);
  }
});

// for cancel
cancel.addEventListener('click', function () {
  errorRemove();
})

// for empty all field
function empty() {
  firstName.value = '';
  lastName.value = '';
  female.checked = false;
  male.checked = false;
  phoneNumber.value = '';
  address.value = '';
}

// for blur all field
blur(firstName, patternString, 'Only characters are allowed', 8);
blur(lastName, patternString, 'Only characters are allowed', 10);
blur(phoneNumber, patternNumber, 'Only digits are allowed', 10, 'number');
blur(address);

function blur(input, pattern = '', message = '', limit = '', type = '') {
  input.addEventListener('blur', function () {
    showError(input, input.value, pattern, message, limit, type);
  });
}

// for show errors
function showError(input, value, pattern = '', message = '', limit = '', type = '') {
  var element = input.parentElement.children;
  for (var i = 0; i < element.length; i++) {
    if (element[i].classList.contains('error')) {
      if (value) {
        if (type == 'number') {
          if (isNaN(value)) {
            element[i].innerText = message;
            element[i].classList.add('error-active');
          } else {
            if (value.length < limit || value.length > limit) {
              element[i].innerText = `Only ${limit} digits are allowed`;
              element[i].classList.add('error-active');
            } else {
              if (value.match(pattern)) {
                element[i].classList.remove('error-active');
              } else {
                element[i].innerText = 'Digit start form 6 to 9 only';
                element[i].classList.add('error-active');
              }
            }
          }
        } else if (value.match(pattern)) {
          if ((value.length < limit) || (limit == '')) {
            element[i].classList.remove('error-active');
          } else {
            element[i].innerText = `Less than ${limit} characters are allowed`;
            element[i].classList.add('error-active');
          }
        } else {
          element[i].innerText = message;
          element[i].classList.add('error-active');
        }
      } else {
        element[i].innerText = 'Field is required';
        element[i].classList.add('error-active');
      }
    }
  }
}

// for show data
function showData() {
  var arr = getUserData(),
    table = document.querySelector('.table-body');
  table.innerHTML = '';

  if (arr != null) {
    for (var i = 0; i < arr.length; i++) {
      var li = document.createElement('li'),
        dataElement = `<span class="td id">${i + 1}</span>`;
      dataElement += `<span class="td">${arr[i].firstName}</span>`;
      dataElement += `<span class="td">${arr[i].lastName}</span>`;
      dataElement += `<span class="td">${arr[i].gender}</span>`;
      dataElement += `<span class="td">${arr[i].phoneNumber}</span>`;
      dataElement += `<span class="td">${arr[i].address}</span>`;
      dataElement += `<span class="td">`;
      dataElement += `<a href="${i}" class="edit" title="Edit">Edit</a>`;
      dataElement += `<a href="${i}" class="delete" title="Delete">Delete</a>`;
      dataElement += `</span>`;

      li.className = 'tbody';
      li.innerHTML = dataElement;
      table.appendChild(li);
    }
  }

  // for edit data
  var edits = document.querySelectorAll('.edit'),
    deletes = document.querySelectorAll('.delete');

  edits.forEach(function (editBtn) {
    editBtn.addEventListener('click', function (e) {
      e.preventDefault();
      errorRemove();
      (id = editBtn.getAttribute('href')), (arr = getUserData());

      firstName.value = arr[id].firstName;
      lastName.value = arr[id].lastName;
      phoneNumber.value = arr[id].phoneNumber;
      address.value = arr[id].address;
      if (arr[id].gender == 'female') {
        female.checked = true;
      } else {
        male.checked = true;
      }
    });
  });

  // for delete data
  deletes.forEach(function (deleteBtn) {
    deleteBtn.addEventListener('click', function (e) {
      e.preventDefault();
      errorRemove();
      (id = deleteBtn.getAttribute('href')), (arr = getUserData());

      arr.splice(id, 1);
      setUserData(arr);
      showData();
    });
  });
}

// for remove active errors
function errorRemove() {
  var errors = document.querySelectorAll('.error-active');

  errors.forEach(function (error) {
    error.classList.remove('error-active');
  })
}

// for get data from localStorage
function getUserData() {
  var arr = JSON.parse(localStorage.getItem('userData'));
  return arr;
}

// for set data to localStorage
function setUserData(arr) {
  localStorage.setItem('userData', JSON.stringify(arr));
}