// Call the dataTables jQuery plugin
let userData;
$(document).ready(async function () {
  // $('#dataTable').DataTable();
  let students = await getUserData();
  $("#exportExcel").click(function () {
    $('<table>')
      .append(
        $("#dataTable").DataTable().$('tr').clone()
      )
      .table2excel({
        exclude: ".excludeThisClass",
        name: "Worksheet Name",
        filename: "studentList" //do not include extension
      });
  });
  userData = students.data;
  renderStudents(students.data);
});

function getUserData(qs = {}) {
  return $.ajax({
    url: `${window.location.origin}/api/admin/users`,
    beforeSend: function (xhrObj) {
      xhrObj.setRequestHeader("Content-Type", "application/json");;
    },
    type: "GET",
    qs: qs,
    processData: false
  });
}

function renderStudents(users) {
  let html = '';

  for (const [index, column] of users.entries()) {
    html += `
      <tr>
        <td>${column.name}</td>
        <td>${column.mobile}</td>
        <td>${column.email}</td>
        <td>${column.address}</td>
        <td>${column.createdAt ? new Date(column.createdAt).toDateString() : ''}</td>
    `;
    let docUrls = '';
    if (column.doc1) {
      docUrls += `<a href="/${column.doc1}" target="_blank">Accedemic doc 1</a><br>`;
    }
    if (column.doc2) {
      docUrls += `<a href="/${column.doc2}" target="_blank">Accedemic doc 2</a>`;
    }
    html += `
      <td>${docUrls}</td>
      <td>
        <button onclick="editStudent(${index})"><span class="fa fa-edit"></span></button>
        <button onclick="deleteUser('${column._id}')"><span class="fa fa-trash"></span></button>
      </td>
      </tr>
    `
  }
  $("tbody").html(html);

  $('#dataTable').DataTable();
};

function editStudent(i) {
  let user = userData[i];
  $("#name").val(user.name);
  $("#mobile").val(user.mobile);
  $("#email").val(user.email);
  $("#address").val(user.address);
  $("#editedId").val(user._id);
  $("#editModal").modal();
}

async function update() {
  let name = $("#name").val();
  let mobile = $("#mobile").val();
  let email = $("#email").val();
  let address = $("#address").val();
  let id = $("#editedId").val();

  $.ajax({
    url: `${window.location.origin}/api/admin/editUser/${id}`,
    beforeSend: function (xhrObj) {
      xhrObj.setRequestHeader("Content-Type", "application/json");;
    },
    type: "PUT",
    data: JSON.stringify({ name, mobile, email, address }),
    processData: false
  }).then(async () => {
    let students = await getUserData();
    userData = students.data;
    renderStudents(students.data);
    $("#editModal").modal('hide');
  }).fail(() => {

  });
};

function deleteUser(id) {
  $("#deletedId").val(id);
  $("#confirmationModel").modal();
}

function deleteConfirmed() {
  let id = $("#deletedId").val();
  $.ajax({
    url: `${window.location.origin}/api/admin/delete/${id}`,
    beforeSend: function (xhrObj) {
      xhrObj.setRequestHeader("Content-Type", "application/json");;
    },
    type: "DELETE",
    processData: false
  }).then(async () => {
    let students = await getUserData();
    userData = students.data;
    renderStudents(students.data);
    $("#confirmationModel").modal('hide');
  }).fail(() => {

  });
}



