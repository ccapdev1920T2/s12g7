const hbs = require('hbs');
const Reservation = require('../model/reservation.model');
const cron = require('node-cron');

// TODO: update reservations based on time
cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
});

hbs.registerHelper('hasPenalty', (penalty) => { return penalty > 0; });

hbs.registerHelper('status-pending', (status) => { return status == 'Pending'; });
hbs.registerHelper('status-pickup-pay', (status) => { return status == 'For Pickup' || status == 'To Pay'; });
hbs.registerHelper('status-on-rent', (status) => { return status == 'On Rent'; });
hbs.registerHelper('status-denied', (status) => { return status == 'Denied'; });
hbs.registerHelper('status-uncleared', (status) => { return status == 'Uncleared'; });
hbs.registerHelper('status-returned', (status) => { return status == 'Returned'; });

hbs.registerHelper('cancellable', (status) => {
    return status == 'Pending' || status == 'For Pickup' || status == 'To Pay';
})

exports.myReservations = async function (req, res) {

    /* try {
        var reservation = new Reservation({
            title: 'Locker'
            userID: 11826401,
            reservationType: 'locker',
            itemID: null,
            dateCreated: Date.now(),
            status: 'To Pay',
            description: 'Locker #331, Big Panel #2, Gokongwei, 3/F',
            remarks: 'Please proceed to the Student Services office for your payment of P70.00',
            penalty: 0
        });
        await reservation.save();
    } catch (err) {
        console.log(err);
    } */

    try {
        var reservations = await Reservation.find({ userID: req.session.idNum }).sort('dateCreated');
        var activeReservations = [];
        var pastReservations = [];

        reservations.forEach(function (reservation) {
            reservation.dateCreatedStr = reservation.dateCreated.toDateString();
            if (reservation.status == 'Denied') {
                var elapsedTime = Date.now() - reservation.dateCreated;
                if (elapsedTime / 86400000 > 1)
                    pastReservations.push(reservation);
                else
                    activeReservations.push(reservation);
            } else if (reservation.status == 'Returned') {
                pastReservations.push(reservation);
            } else {
                activeReservations.push(reservation);
            }
        });

        res.render('my-reservations-page', {
            active: { active_my_reservations: true },
            sidebarData: {
                dp: req.session.passport.user.profile.photos[0].value,
                name: req.session.passport.user.profile.displayName,
                idNum: req.session.idNum
            },
            activeRes: activeReservations,
            pastRes: pastReservations,
        });

    } catch (err) {
        console.log(err);
    }
};