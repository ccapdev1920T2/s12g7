$(document).ready(function () {
  var pagination;
  var pageNum;
  var pageStart;
  var pageEnd;
  var idNum = '';
  const itemsPerPage = 10;

  $.get('/profile/manage/get-people', {page: 1, idnum: ''}, function (data, status) {
    pagination = Math.ceil(data.totalCt / itemsPerPage);
    pageNum = 1;
    pageStart = 1;
    pageEnd = pagination > 5 ? 5 : pagination;

    removePagination();
    if (data.totalCt > itemsPerPage)
      setupPagination(pagination, pageStart, pageEnd, pageNum, idNum);
    displayPeople(data.items);
  });

  $("#searchBox").on("keyup", function () {
    idNum = $(this).val();
    $.get('/profile/manage/get-people', 
        {page: 1, idnum: idNum},
        function (data, status) {
      pagination = Math.ceil(data.totalCt / itemsPerPage);
      pageNum = 1;
      pageStart = 1;
      pageEnd = pagination > 5 ? 5 : pagination;
      removePagination();
      if (data.totalCt > itemsPerPage)
        setupPagination(pagination, pageStart, pageEnd, pageNum, idNum)
      displayPeople(data.items);
    });
  });
});

$(document).ajaxStart(function () {
  $('table').css('filter', 'opacity(0.3)');
  $('.page-link').css('pointer-events', 'none');
  $('.page-link').css('filter', 'opacity(0.3)');
});

$(document).ajaxComplete(function () {
  $('table').css('filter', 'opacity(1)');
  $('.page-link').css('pointer-events', 'auto');
  $('.page-link').css('filter', 'opacity(1)');
});

$('#editProfileModal').on('show.bs.modal', (event) => {

  var btn = $(event.relatedTarget);
  var person = {
    id: btn.data('id'),
    firstName: btn.data('fname'),
    lastName: btn.data('lname'),
    idNum: btn.data('idnum'),
    college: btn.data('college'),
    degProg: btn.data('degprog'),
    contactNum: btn.data('mobile')
  }

  $('#editProfileModalLabel').text('Edit Profile: ' + person.firstName + ' ' + person.lastName);
  $('#firstName').val(person.firstName);
  $('#lastName').val(person.lastName);
  $('#idNum').val(person.idNum);
  $('#college').val(person.college);
  $('#college').change();
  $('#degProg').val(person.degProg);
  $('#mobile').val(person.contactNum);
  $('#id').val(person.id);
});

$('#promoteModal').on('show.bs.modal', (event) => {
  var btn = $(event.relatedTarget);
  id = btn.data('id');
  $('#promoteUserID').val(id);
});

$('#demoteModal').on('show.bs.modal', (event) => {
  var btn = $(event.relatedTarget);
  id = btn.data('id');
  $('#demoteUserID').val(id);
});

function displayPeople(pips) {
  $('#peopleTable tbody *').remove();
  $('.empty-note').remove();

  if (pips.length == 0) {
    $('.card').append(
      '<div class="empty-note text-center font-italic">' + 'Nothing to display' + '</div>'
    );
  }
  pips.forEach(function (person) {
    $('#peopleTable tbody').append(
      '<tr>' +
      '<td><div class="profile-icon" style="background-image: url(\''+ person.dpURL +'\');"></div></td>' +
      '<td>' + person.idNum + '</td>' +
      '<td>' + person.lastName + ', ' + person.firstName + '</td>' +
      '<td>' + person.type + '</td>' +
      '<td>+63' + person.contactNum + '</td>' +
      '<td class="d-flex align-items-center justify-content-end">' +
        ((person.type == 'student') ? 
          '<a class="table-link btn btn-secondary mr-4" data-toggle="modal" data-id="' + person._id + '" href="#promoteModal">Promote</a>' : 
          '<a class="table-link btn btn-warning mr-4" data-toggle="modal" data-id="' + person._id + '" href="#demoteModal">Demote</a>') +
        '<a class="table-link mr-2" data-toggle="modal" '+
            'data-fname="' + person.firstName + '" ' +
            'data-lname="' + person.lastName + '" ' +
            'data-idnum="' + person.idNum + '" ' +
            'data-college="' + person.college + '" ' +
            'data-degprog="' + person.degreeProg + '" ' +
            'data-mobile="' + person.contactNum + '" ' +
            'data-id="' + person._id + '" ' +
            'href="#editProfileModal">' +
          '<div class="icon" id="edit"></div>' +
        '</a>' +
      '</td>'
    );
  });
}

function removePagination() {
  $('#peoplePagination .page-item').remove();
}

function setupPagination(pagination, pageStart, pageEnd, pageNum, idNum) {
  $('#peoplePagination').append(`
    <li class="page-item">
      <a class="page-link" href="#otherResCard" id="prevPage">
        <div class="icon" id="arrow-left"/>
      </a>
    </li>
  `);
  for (var i = pageStart; i <= pageEnd; i++) {
    $('#peoplePagination').append(
      '<li class="page-item' + ((i == pageNum) ? ' active' : '') + '">' +
      '<a class="page-link page-number" href="#otherResCard">' +
      i +
      '</a>' +
      '</li>'
    );
  }
  $('#peoplePagination').append(`
    <li class="page-item">
      <a class="page-link" href="#otherResCard" id="nextPage">
        <div class="icon" id="arrow-right"/>
      </a>
    </li>
  `);

  $('#peoplePagination .page-link').click(function () {
    var offset = 0;
    if ($(this).attr('id') == 'nextPage')
      offset = 1;
    else if ($(this).attr('id') == 'prevPage')
      offset = -1;
    else if (pagination == 1)
      offset = 0;
    else
      offset = $(this).text() - pageNum;

    var maxPageShiftR = pagination - pageEnd;
    var maxPageShiftL = pageStart - 1;

    if (pageNum + offset >= 1 && pageNum + offset <= pagination && offset != 0) {
      $.get('/profile/manage/get-people',
        {page: pageNum + offset, idnum: idNum},
        function (data, status) {
          if (pageNum + offset >= 1 && pageNum + offset <= pagination) {
            if (offset > 0 && offset <= maxPageShiftR && pageNum + offset > (pageStart + pageEnd) / 2
              || offset < 0 && -1 * offset <= maxPageShiftL && pageNum + offset < (pageStart + pageEnd) / 2) {
              pageStart += offset;
              pageEnd += offset;
            } else if (offset > 0 && offset > maxPageShiftR) {
              pageStart += maxPageShiftR;
              pageEnd += maxPageShiftR;
            } else if (offset < 0 && -1 * offset > maxPageShiftL) {
              pageStart -= maxPageShiftL;
              pageEnd -= maxPageShiftL;
            }
          }
          pageNum += offset;
          updatePagination(pageStart, pageEnd, pageNum)
          displayPeople(data.items);
        });
    }
  });
}

function updatePagination(pageStart, pageEnd, pageNum) {
  $('#peoplePagination .page-number').each(function (index, element) {
    $(element).text(pageStart + index);
    if ($(element).text() != pageNum)
      $(element).parent().removeClass('active');
    else
      $(element).parent().addClass('active');
  })
}