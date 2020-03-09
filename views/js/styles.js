$(document).ready(function() {
    $('#locker-btn').hover(
        function() {
            $(`#human-locker, 
               #human-equipment,
               #table,
               #laptop,
               #umbrella, 
               #bench,
               #trashcan, 
               #clock,
               #window,
               #wall2,
               #wall1`).addClass('locker-anim');
            console.log('hovered');
        }, function() {
            $(`#human-locker, 
               #human-equipment,
               #table,
               #laptop,
               #umbrella, 
               #bench,
               #trashcan, 
               #clock,
               #window,
               #wall2,
               #wall1`).removeClass('locker-anim');
        }
    );
    $('#equipment-btn').hover(
        function() {
            $(`#human-locker, 
               #human-equipment,
               #table,
               #laptop,
               #umbrella, 
               #bench,
               #trashcan, 
               #clock,
               #window,
               #wall2,
               #wall1`).addClass('equipment-anim');
            console.log('hovered');
        }, function() {
            $(`#human-locker, 
               #human-equipment,
               #table,
               #laptop,
               #umbrella, 
               #bench,
               #trashcan, 
               #clock,
               #window,
               #wall2,
               #wall1`).removeClass('equipment-anim');
        }
    );

    var collapsed = false;
    $('.nav-btn').click(function() {
        if (!collapsed) {
            $('.main').addClass('collapsed');
            collapsed = true;
        } else {
            $('.main').removeClass('collapsed');
            collapsed = false;
        }
    });
});