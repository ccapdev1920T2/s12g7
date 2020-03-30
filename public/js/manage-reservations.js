$(document).ready(function () {
  var pagination;
  var pageNum;
  var pageStart;
  var pageEnd;
  var idNum = '';
  var stat = 'all';
  const itemsPerPage = 5;

  $.get('/reservations/manage/get-reservations?page=&idnum=&status=all', function (data, status) {
    pagination = Math.ceil(data.totalCt / itemsPerPage);
    pageNum = 1;
    pageStart = 1;
    pageEnd = pagination > 5 ? 5 : pagination;
    displayPagination(pagination, pageStart, pageEnd, pageNum, idNum, stat);
    displayReservations(data.items);
  });

  $("#statusFilter").on("change", function () {
    stat = $(this).val().split('-')[1];
    $.get('/reservations/manage/get-reservations' 
        + '?page=&idnum=' + idNum 
        + '&status=' + stat, 
        function (data, status) {
      pagination = Math.ceil(data.totalCt / itemsPerPage);
      pageNum = 1;
      pageStart = 1;
      pageEnd = pagination > 5 ? 5 : pagination;
      displayPagination(pagination, pageStart, pageEnd, pageNum, idNum, stat)
      displayReservations(data.items);
    });
  });

  $("#searchBox").on("keyup", function () {
    idNum = $(this).val();
    $.get('/reservations/manage/get-reservations' 
        + '?page=&idnum=' + idNum 
        + '&status=' + stat, 
        function (data, status) {
      pagination = Math.ceil(data.totalCt / itemsPerPage);
      pageNum = 1;
      pageStart = 1;
      pageEnd = pagination > 5 ? 5 : pagination;
      displayPagination(pagination, pageStart, pageEnd, pageNum, idNum, stat)
      displayReservations(data.items);
    });
  });
});

$(document).ajaxStart(function () {
  console.log('loading');
  $('table').css('filter', 'opacity(0.3)');
});

$(document).ajaxComplete(function () {
  console.log('loaded');
  $('table').css('filter', 'opacity(1)');
});

function displayPagination(pagination, pageStart, pageEnd, pageNum, idNum, stat) {
  $('#resPagination .page-item').remove();
  $('#resPagination').append(`
      <li class="page-item">
        <a class="page-link" href="#otherResCard" id="prevPage">
          <div class="icon" id="arrow-left"/>
        </a>
      </li>
    `);
  for (var i = pageStart; i <= pageEnd; i++) {
    $('#resPagination').append(
      '<li class="page-item' + ((i == pageNum) ? ' active' : '') + '">' +
      '<a class="page-link page-number" href="#otherResCard">' +
      i +
      '</a>' +
      '</li>'
    );
  }
  $('#resPagination').append(`
      <li class="page-item">
        <a class="page-link" href="#otherResCard" id="nextPage">
          <div class="icon" id="arrow-right"/>
        </a>
      </li>
    `);

  $('#resPagination .page-link').click(function () {
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
      $.get('/reservations/manage/get-reservations?page=' 
          + (pageNum + offset) 
          + '&idnum=' + idNum
          + '&status=' + stat, function (data, status) {
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
        displayReservations(data.items);
      });
    }
  });
}

function updatePagination(pageStart, pageEnd, pageNum) {
  $('#resPagination .page-number').each(function (index, element) {
    $(element).text(pageStart + index);
    if ($(element).text() != pageNum)
      $(element).parent().removeClass('active');
    else
      $(element).parent().addClass('active');
  })
}

function displayReservations(reservations) {
  $('#reservationsTable tr').remove();
  reservations.forEach(function (reservation) {

    var stat;
    if (reservation.status == 'Uncleared')
      stat = 'status-uncleared';
    else if (reservation.status == 'On Rent')
      stat = 'status-on-rent';
    else if (reservation.status == 'Returned')
      stat = 'status-returned';
    else if (reservation.status == 'Denied')
      stat = 'status-denied';

    $('#reservationsTable').append(
      '<tr>' +
        '<td>' +
          '<div class="icon mr-2 col-1" id="' + ((reservation.onItemType == 'Locker') ? 'locker' : 'equipment') + '"/>' +
        '</td>' +
        '<td>' + reservation.userID + '</td>' +
        '<td>' + (new Date(reservation.dateCreated)).toDateString() + '</td>' +
        '<td>' + reservation.description + '</td>' +
        '<td>' + (reservation.penalty > 0 ? 'Php ' + reservation.penalty : 'N/A') + '</td>' +
        '<td>' +
          '<div class="badge badge-pill ' + stat + '">' +
            reservation.status +
          '</div>' +
        '</td>' +
        '<td>' +
          '<a class="table-link" data-toggle="modal" ' +
              'data-title="' + reservation.title + '" ' +
              'data-userid="' + reservation.userID + '" ' +
              'data-datecreated="' + (new Date(reservation.dateCreated)).toDateString() + '" ' +
              'data-status="' + reservation.status + '" ' +
              'data-description="' + reservation.description + '" ' +
              'data-remarks="' + reservation.remarks + '" ' +
              'data-penalty="' + reservation.penalty + '" ' +
              'data-onItemType="' + reservation.onItemType + '" ' +
              'data-id="' + reservation._id + '" ' +
              'data-paymentdate="' + reservation.pickupPayDate + '" ' +
              'href="#editReservationModal">' +
            '<div class="icon col-1" title="Edit Reservation" id="edit"/>' +
          '</a>' +
        '</td>' +
      '</tr>'
    );
  });
}

$('#approveReservationModal').on('show.bs.modal', (event) => {
  var btn = $(event.relatedTarget).prev();
  var reservation = {
    id: btn.data('id'),
    title: btn.data('title'),
    userID: btn.data('userid'),
    dateCreated: btn.data('datecreated'),
    status: btn.data('status'),
    description: btn.data('description'),
    remarks: btn.data('remarks'),
    penalty: btn.data('penalty'),
    type: btn.data('type'),
    paymentDate: btn.data('paymentdate')
  }

  var payDate = new Date();
  var payDateString =
    payDate.getFullYear() + '-'
    + ((payDate.getMonth() <= 8) ? '0' : '') + (payDate.getMonth() + 1) + '-'
    + ((payDate.getDate() <= 9) ? '0' : '') + payDate.getDate();

  $('#approveReservationTitle').text(reservation.title);
  $('#approveReservationID').val(reservation.id);
  $('#approveReservationType').val(reservation.type);
  $('#approveDateCreated').text(reservation.dateCreated);
  $('#approveDescription').text(reservation.description);
  $('#approveRemarks').val(reservation.remarks);
  $('#approveStatus').val('status-manage-pickup-pay');
  $('#approvePaymentDate').val(payDateString);
  $('#approveIDNum').text(reservation.userID);

  $.get('/reservations/manage/uncleared?idNum=' + reservation.userID, function (data, status) {
    if (jQuery.isEmptyObject(data))
      $('#apUnclearedError').text('User has no uncleared reservations').removeClass('error-label');
    else
      $('#apUnclearedError').text('User has uncleared reservations').addClass('error-label');
  });

  $('#approvePenaltyForm').css('display', 'none');
  $('#approveSelectForm').css('display', 'none');

  if (reservation.type == 'Locker')
    $('#approvePaymentForm').css('display', 'flex');
  else
    $('#approvePaymentForm').css('display', 'none');
});

$('#denyReservationModal').on('show.bs.modal', (event) => {
  var btn = $(event.relatedTarget).prev().prev();
  var reservation = {
    id: btn.data('id'),
    title: btn.data('title'),
    userID: btn.data('userid'),
    dateCreated: btn.data('datecreated'),
    status: btn.data('status'),
    description: btn.data('description'),
    remarks: btn.data('remarks'),
    penalty: btn.data('penalty'),
    type: btn.data('type')
  }

  $('#denyReservationTitle').text(reservation.title);
  $('#denyReservationID').val(reservation.id);
  $('#denyReservationType').val(reservation.type);
  $('#denyDateCreated').text(reservation.dateCreated);
  $('#denyDescription').text(reservation.description);
  $('#denyRemarks').val(reservation.remarks);
  $('#denyStatus').val('status-manage-denied');
  $('#denyIDNum').text(reservation.userID);


  $('#denyPenaltyForm').css('display', 'none');
  $('#denySelectForm').css('display', 'none');
});

$('#editReservationModal').on('show.bs.modal', (event) => {
  var btn = $(event.relatedTarget);
  var reservation = {
    id: btn.data('id'),
    title: btn.data('title'),
    userID: btn.data('userid'),
    dateCreated: btn.data('datecreated'),
    status: btn.data('status'),
    description: btn.data('description'),
    remarks: btn.data('remarks'),
    penalty: btn.data('penalty'),
    type: btn.data('type'),
    paymentDate: btn.data('paymentdate')
  }

  $.get('/reservations/manage/uncleared?idNum=' + reservation.userID, function (data, status) {
    if (jQuery.isEmptyObject(data))
      $('#unclearedError').text('User has no uncleared reservations').removeClass('error-label');
    else
      $('#unclearedError').text('User has uncleared reservations').addClass('error-label');
  });

  var payDate = reservation.paymentDate == '' ? new Date() : new Date(reservation.paymentDate);
  var payDateString = payDate.getFullYear() + '-'
    + ((payDate.getMonth() <= 8) ? '0' : '') + (payDate.getMonth() + 1) + '-'
    + ((payDate.getDate() <= 9) ? '0' : '') + payDate.getDate();

  $('#statusModalLabel').text(reservation.title);
  $('#idNum').text(reservation.userID);
  $('#dateCreated').text(reservation.dateCreated);
  $('#description').text(reservation.description);
  $('#editRemarks').val(reservation.remarks);
  $('#penalty').val(reservation.penalty);
  $('#reservationID').val(reservation.id);
  $('#onItemType').val(reservation.type);
  $('#paymentDate').val(payDateString);

  var pickupPayText;
  if (reservation.type == 'Locker')
    $('[value="status-manage-pickup-pay"]').text('To Pay')
  else
    $('[value="status-manage-pickup-pay"]').text('For Pickup')

  $('#remarksForm').css('display', 'none');
  $('#penaltyForm').css('display', 'none');

  switch (reservation.status) {
    case 'Pending':
      $('#status').val('status-manage-pending');
      break;
    case 'To Pay':
    case 'For Pickup':
      $('#status').val('status-manage-pickup-pay');
      break;
    case 'On Rent':
      $('#status').val('status-manage-on-rent');
      break;
    case 'Returned':
      $('#status').val('status-manage-returned');
      break;
    case 'Uncleared':
      $('#status').val('status-manage-uncleared');
      break;
    case 'Denied':
      $('#status').val('status-manage-denied');
      break;
  }

  $('#status').change(function () {
    var status = $(this).val();

    if (status != 'status-manage-pending')
      $('#remarksForm').css('display', 'flex');
    else
      $('#remarksForm').css('display', 'none');

    if (status == 'status-manage-uncleared')
      $('#penaltyForm').css('display', 'flex');
    else
      $('#penaltyForm').css('display', 'none');

    if (status == 'status-manage-pickup-pay' && reservation.type == 'Locker')
      $('#paymentForm').css('display', 'flex');
    else
      $('#paymentForm').css('display', 'none');
  });

  $('#status').change();

});