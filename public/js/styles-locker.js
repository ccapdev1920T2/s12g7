$(document).ready(function() {
    $('.locker.locker-status-vacant').click(
        function() {
            $(this).toggleClass('selected');

            var currLocker = this;
            $('.locker.locker-status-vacant.selected').each(function(index) {
                if (currLocker != this) {
                    $(this).removeClass('selected');
                }
            });
        }
    );
});