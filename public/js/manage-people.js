$(document).ready(function () {
  var pagination;
  var pageNum;
  var pageStart;
  var pageEnd;
  var idNum = '';
  const itemsPerPage = 1;

  $.get('/profile/manage/get-people?page=&idnum=', function (data, status) {
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
    $.get('/profile/manage/get-people' 
        + '?page=&idnum=' + idNum, 
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

function displayPeople(pips) {
  $('#peopleTable tbody *').remove();
  $('.empty-note').remove();

  if (pips.length == 0) {
    $('.card').append(
      '<div class="empty-note text-center font-italic">' + 'Nothing to display' + '</div>'
    );
  }
  pips.forEach(function (person) {

    console.log('person: ' + person);
    $('#peopleTable tbody').append(
      '<tr>' +
      '<td><div class="profile-icon" style="background-image: url(' + person.dpURL + ');"></div></td>' +
      '<td>' + person.idNum + '</td>' +
      '<td>' + person.lastName + ', ' + person.firstName + '</td>' +
      '<td>' + person.contactNum + '</td>' +
      '<td>' +
      '<a class="table-link" data-toggle="modal" href="#editProfileModal">' +
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
      $.get('/profile/manage/get-people?' +
        'page=' + (pageNum + offset) +
        '&idnum=' + idNum, function (data, status) {
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