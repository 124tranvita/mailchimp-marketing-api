"use strict";
//Email RE:
const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const toastMsg = document.getElementById("toastMsg");
const responseMsg = document.getElementById("responseMsg");
const tbody = document.getElementById("tbody");

const addMemModal = document.getElementById("addMemModal");
const memInfoModal = document.getElementById("memInfoModal");
const subscribeModal = document.getElementById("subscribeModal");
const batchSubModal = document.getElementById("batchSubModal");

const listId = document.getElementById("listId");

function fetchData(data, endpoint, toastMessage) {
  fetch(`${window.origin}/${endpoint}`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      toastMessage(data);
      //console.log(data);
    })
    .catch((error) => console.log("Fetch error: " + error));
}

function toastMessage(data) {
  switch (data.status) {
    case 200:
      responseMsg.innerText = "Task completed successfully!";
      toastMsg.classList.add("show");
      break;
    case 400:
      responseMsg.innerHTML = `<h6>${data.title}</h6><p>${data.detail}</p><p>Status ${data.status}</p>`;
      toastMsg.classList.add("show");
      break;
    default:
      responseMsg.innerText = "Task completed successfully!";
      toastMsg.classList.add("show");
  }
}

function validateOnBlur(event) {
  if (!event.target.value) {
    document.getElementById(`${event.target.name}Error`).innerText = "Required.";
    return false;
  } else {
    document.getElementById(`${event.target.name}Error`).innerText = "";
    return true;
  }
}

function validateOnSubmit(element) {
  if (!element.value) {
    document.getElementById(`${element.getAttribute("name")}Error`).innerHTML = "Required."
    return false;
  } else {
    document.getElementById(`${element.getAttribute("name")}Error`).innerHTML = ""
    return true;
  }
}

function getModalInputEl([...restArr]) {
  return restArr.map((value) => {
    const valueEl = document.getElementById(value);
    return valueEl;
  })
}

function addBlurEvent([...restArr]) {
  restArr.forEach((value) => {
    value.addEventListener('blur', (event) => validateOnBlur(event));
  })
}

function showRequiredAll([...restArr]) {
  restArr.forEach((value) => {
    if (!value.value) {
      document.getElementById(`${value.getAttribute("name")}Error`).innerHTML = "Required.";
    }
  })
}

function clearInput([...restArr]) {
  restArr.forEach((value) => {
    value.value = "";
  })
}

function removeTextOnSpan() {
  document.querySelectorAll(`span[id*='Error']`).forEach(span => {
    span.innerText = "";
  })
}

function closeModal(event) {
  const targetName = event.getAttribute("name");

  switch (targetName) {
    case "memInfoModal":
      clearInput([
        emailInfo,
        statusInfo,
        firstNameInfo,
        lastNameInfo,
        addressInfo,
        stateInfo,
        cityInfo,
        zipInfo,
        countryInfo,
        phoneInfo,
        birthdayInfo,
        emailTypeInfo,
        languageInfo,
        vipInfo
      ]);
      removeTextOnSpan();
      break;
    case "subscribeModal":
      clearInput([
        emailSub,
        firstNameSub,
        lastNameSub,
        addressSub,
        stateSub,
        citySub,
        zipSub,
        countrySub,
        phoneSub,
        birthdaySub,
        vipSub
      ]);
      removeTextOnSpan();
      break;
    case "addMemModal":
      clearInput([emailNew]);
      removeTextOnSpan();
      break;
    case "batchSubModal":
      clearInput([formFile]);
      removeTextOnSpan();
      break;
    default:
      return;
  }
}

addMemModal.addEventListener('hide.bs.modal', (event) => {
  closeModal(event.target);
})

memInfoModal.addEventListener('hide.bs.modal', (event) => {
  closeModal(event.target);
})

subscribeModal.addEventListener('hide.bs.modal', (event) => {
  closeModal(event.target);
})

batchSubModal.addEventListener('hide.bs.modal', (event) => {
  closeModal(event.target);
})

const emailNew = document.getElementById("emailNew");
const statusNew = document.getElementById("statusNew");

function submitNewMember() {

  if (!emailNew.value) {
    document.getElementById("emailNewError").innerHTML = "Input required"
    return;
  } else if (!re.test(emailNew.value)) {
    document.getElementById("emailNewError").innerHTML = "Invalid email"
    return;
  }

  const data = {
    list_id: listId.value,
    email: emailNew.value,
    status: statusNew.value,
  };

  fetchData(data, "add", toastMessage);

  addMemModal.classList.remove("show");
  document.querySelector(".modal-backdrop").classList.remove("modal-backdrop");
}

/** Member Info Modal */
const updateModalInputEL = getModalInputEl([
  'contactId',
  'emailInfo',
  'statusInfo',
  'firstNameInfo',
  'lastNameInfo',
  'addressInfo',
  'stateInfo',
  'cityInfo',
  'zipInfo',
  'countryInfo',
  'phoneInfo',
  'birthdayInfo',
  'emailTypeInfo',
  'languageInfo',
  'vipInfo'
])

const [
  contactId,
  emailInfo,
  statusInfo,
  firstNameInfo,
  lastNameInfo,
  addressInfo,
  stateInfo,
  cityInfo,
  zipInfo,
  countryInfo,
  phoneInfo,
  birthdayInfo,
  emailTypeInfo,
  languageInfo,
  vipInfo
] = updateModalInputEL


function addValidateOnOpenUpdateModal() {
  addBlurEvent([
    emailInfo,
    statusInfo,
    firstNameInfo,
    lastNameInfo,
    addressInfo,
    stateInfo,
    cityInfo,
    zipInfo,
    countryInfo,
  ])

  emailInfo.addEventListener('blur', (event) => {
    if (!re.test(event.target.value)) {
      document.getElementById("emailInfoError").innerHTML = "Invalid email"
      return;
    } else {
      document.getElementById("emailInfoError").innerHTML = ""
    }
  })
}

let tbodyRowsLen = tbody.rows.length;

for (let i = 0; i < tbodyRowsLen; i++) {
  tbody.rows[i].addEventListener('click', (e) => {
    let data = tbody.rows[i].getAttribute("data")
    //Reformat data string into JSON
    let reformatData = data.replaceAll(`'`, `"`).replaceAll("True", "true").replaceAll("False", "false");
    //console.log(JSON.parse(reformatData));
    let dataJSON = JSON.parse(reformatData);

    //put data to Modal
    contactId.value = dataJSON.contact_id;
    emailInfo.value = dataJSON.email_address;
    statusInfo.value = dataJSON.status;
    firstNameInfo.value = dataJSON.merge_fields.FNAME;
    lastNameInfo.value = dataJSON.merge_fields.LNAME;
    addressInfo.value = dataJSON.merge_fields.ADDRESS.country || "";
    stateInfo.value = dataJSON.merge_fields.ADDRESS.state || "";
    cityInfo.value = dataJSON.merge_fields.ADDRESS.city || "";
    zipInfo.value = dataJSON.merge_fields.ADDRESS.zip || "";
    countryInfo.value = dataJSON.merge_fields.ADDRESS.country || "";
    phoneInfo.value = dataJSON.merge_fields.PHONE;
    birthdayInfo.value = dataJSON.merge_fields.BIRTHDAY;
    emailTypeInfo.value = dataJSON.email_type;
    languageInfo.value = dataJSON.language;
    dataJSON.vip ? vipInfo.checked = true : vipInfo.checked = false;
  })
}

document.getElementById("updateForm").addEventListener('submit', (event) => {

  showRequiredAll([
    emailInfo,
    firstNameInfo,
    lastNameInfo,
    addressInfo,
    stateInfo,
    cityInfo,
    zipInfo,
    countryInfo,
  ])

  if (!validateOnSubmit(firstNameInfo) ||
    !validateOnSubmit(firstNameInfo) ||
    !validateOnSubmit(lastNameInfo) ||
    !validateOnSubmit(addressInfo) ||
    !validateOnSubmit(stateInfo) ||
    !validateOnSubmit(cityInfo) ||
    !validateOnSubmit(zipInfo) ||
    !validateOnSubmit(countryInfo)) {
    event.preventDefault();
    return;
  }

  const data = {
    list_id: listId.value,
    contactId: contactId.value,
    email: emailInfo.value,
    status: statusInfo.value,
    merge_fields: {
      firstName: firstNameInfo.value,
      lastName: lastNameInfo.value,
      address: {
        addr1: addressInfo.value,
        addr2: " ",
        city: cityInfo.value,
        state: zipInfo.value,
        zip: zipInfo.value,
        country: countryInfo.value
      },
      phone: phoneInfo.value,
      birthday: birthdayInfo.value.slice(6).replaceAll("-", "/"),
    },
    emailType: emailTypeInfo.value,
    language: languageInfo.value,
    vip: vipInfo.checked ? "true" : "false",
  }

  fetchData(data, 'update', toastMessage);

  memInfoModal.classList.remove("show");
  memInfoModal.classList.add("fade");
  document.querySelector(".modal-backdrop").classList.remove("modal-backdrop");
  event.preventDefault();
})

/** ARCHIVE MEMBER */
function archiveMember(event) {

  let confirm = prompt(`Type "Archive" to Archive member: `)

  while (confirm.toLowerCase() != 'archive') {
    return;
  }

  const data = {
    list_id: listId.value,
    subscriber_hash: contactId.value
  }

  console.log(data)

  fetchData(data, 'archive', toastMessage)
}

/** Subscriber Info Modal */
const subscibeModalInputEL = getModalInputEl([
  'emailSub',
  'statusSub',
  'firstNameSub',
  'lastNameSub',
  'addressSub',
  'stateSub',
  'citySub',
  'zipSub',
  'countrySub',
  'phoneSub',
  'birthdaySub',
  'emailTypeSub',
  'languageSub',
  'vipSub'
])

const [
  emailSub,
  statusSub,
  firstNameSub,
  lastNameSub,
  addressSub,
  stateSub,
  citySub,
  zipSub,
  countrySub,
  phoneSub,
  birthdaySub,
  emailTypeSub,
  languageSub,
  vipSub
] = subscibeModalInputEL

function addValidateOnOpenSubscribeModal() {
  addBlurEvent([
    emailSub,
    statusSub,
    firstNameSub,
    lastNameSub,
    addressSub,
    stateSub,
    citySub,
    zipSub,
    countrySub,
  ])

  emailSub.addEventListener('blur', (event) => {
    console.log('blur')
    if (!re.test(event.target.value)) {
      document.getElementById("emailSubError").innerHTML = "Invalid email"
      return;
    } else {
      document.getElementById("emailSubError").innerHTML = ""
    }
  })
}

document.getElementById("subscribeForm").addEventListener('submit', (event) => {

  showRequiredAll([
    emailSub,
    firstNameSub,
    lastNameSub,
    addressSub,
    stateSub,
    citySub,
    zipSub,
    countrySub,
  ])

  if (!validateOnSubmit(firstNameSub) ||
    !validateOnSubmit(firstNameSub) ||
    !validateOnSubmit(lastNameSub) ||
    !validateOnSubmit(addressSub) ||
    !validateOnSubmit(stateSub) ||
    !validateOnSubmit(citySub) ||
    !validateOnSubmit(zipSub) ||
    !validateOnSubmit(countrySub)) {
    event.preventDefault();
    return;
  }

  const data = {
    list_id: listId.value,
    email: emailSub.value,
    status: statusSub.value,
    merge_fields: {
      firstName: firstNameSub.value,
      lastName: lastNameSub.value,
      address: {
        addr1: addressSub.value,
        addr2: " ",
        city: citySub.value,
        state: zipSub.value,
        zip: zipSub.value,
        country: countrySub.value
      },
      phone: phoneSub.value,
      birthday: birthdaySub.value.slice(6).replaceAll("-", "/"),
    },
    emailType: emailTypeSub.value,
    language: languageSub.value,
    vip: vipSub.checked ? "true" : "false",
  }

  fetchData(data, 'subscribe', toastMessage);

  subscribeModal.classList.remove("show");
  subscribeModal.classList.add("fade");
  document.querySelector(".modal-backdrop").classList.remove("modal-backdrop");
  event.preventDefault();
})

/**Batch Subcribe */
let formFile = document.getElementById("formFile");
const reader = new FileReader();

function submitFile(event) {
  //Validate file
  if (!formFile.value) {
    document.getElementById('formFileError').innerHTML = 'Required.';
    return;
  } else {
    document.getElementById('formFileError').innerHTML = '';
  }

  const file = formFile.files[0];
  const fileName = file.name;
  const fileExtension = fileName.split('.').at(-1);

  //Validate file extension
  if (fileExtension.toLowerCase() != 'json') {
    document.getElementById('formFileError').innerHTML = 'File not support.';
    return;
  } else {
    document.getElementById('formFileError').innerHTML = '';
  }

  // Read file
  reader.readAsBinaryString(file);

  // Load file
  reader.addEventListener("load", (event) => {
    const fileData = event.target.result;
    //console.log(JSON.parse(fileData));
    const data = {
      list_id: listId.value,
      members: JSON.parse(fileData).members
    }

    console.log(data);

    fetchData(data, 'batch_subscribe', toastMessage);

    batchSubModal.classList.remove("show");
    batchSubModal.classList.add("fade");
    document.querySelector(".modal-backdrop").classList.remove("modal-backdrop");
    event.preventDefault();
  })
}

/**Refresh button */
document.getElementById("btnRefresh").addEventListener('click', () => (
  window.location.reload()
))

/**Table search */
function tableSearch() {
  // Declare vaiables
  const searchInput = document.getElementById("searchInput");
  const filter = searchInput.value.toUpperCase();
  const tbody = document.getElementById('tbody');
  const tr = tbody.getElementsByTagName('tr');

  // Loop through all table rows, and hide those who don't match the search query
  for (let i = 0; i < tr.length; i++) {
    const td = tr[i].getElementsByTagName("td")[0];

    if (td) {
      let txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none"
      }
    }
  }
}

/**BOOTSTRAP Enable tooltips everywhere */
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

/** REFRESH PAGE WHEN TOAST MESSAGE IS CLOSE TO UPDATE DATA */
document.getElementById("closeToast").addEventListener('click', () => {
  window.location.reload()
})