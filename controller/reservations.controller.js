const hbs = require('hbs');
const cron = require('node-cron');
const mongoose = require('mongoose');

const Reservation = require('../model/reservation.model');
const Locker = require('../model/locker.model');
const Equipment = require('../model/equipment.model');


// TODO: update reservations based on time
/* cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
});
 */
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
            title: 'LAN Cable',
            userID: 11641223,
            reservationType: 'equipment',
            itemID: mongoose.Types.ObjectId('5e74a0492beec33a04f262c8'),
            dateCreated: Date.now(),
            status: 'To Pay',
            description: 'needed on March 30, 2020, 11:00am',
            remarks: 'N/A',
            penalty: 0,
            onItemType: 'Equipment'
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



exports.manageReservations = async function (req, res) {

    var now = new Date();
    var dateToday = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
    var tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    var dateTomorrow = tomorrow.getFullYear()+'-'+(tomorrow.getMonth()+1)+'-'+tomorrow.getDate();

    try {
        var pendingToday = await Reservation
            .find({status: 'Pending'})
            .where('dateCreated').gte(dateToday).lt(dateTomorrow);
        var pendingEarlier = await Reservation
            .find()
            .where('dateCreated').lt(dateToday)
            .populate('itemID');

        console.log(pendingEarlier);
    } catch (err) {
        console.log('ERROR' + err);
    }

    res.render('manage-reservations-page', {
        active: { active_manage_reservations: true },
        sidebarData: {
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
            idNum: req.session.idNum
        },
        pendingToday: pendingToday,
        pendingEarlier: pendingEarlier
    });
}