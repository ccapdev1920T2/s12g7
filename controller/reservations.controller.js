const hbs = require('hbs');
const cron = require('node-cron');
const mongoose = require('mongoose');

const Reservation = require('../model/reservation.model');
const Locker = require('../model/locker.model');
const Equipment = require('../model/equipment.model');
const User = require('../model/reservation.model');

// TODO: update reservations based on time
/* cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
});
 */

hbs.registerHelper('dateStr', (date) => {return date.toDateString();});

hbs.registerHelper('dateTimeToday', () => {
    const date = new Date();
    return date.toDateString() + ', ' + date.toLocaleTimeString()

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
});

hbs.registerHelper('isLocker', (type) => {
    return type == 'locker';
})

exports.myReservations = async function (req, res) {

    /* try {
        var reservation = new Reservation({
            title: 'LAN Cable',
            userID: 11641223,
            reservationType: 'equipment',
            item: mongoose.Types.ObjectId('5e799396737917283c38bc68'),
            dateCreated: Date.now(),
            status: 'Pending',
            description: 'needed on March 25, 2020, 11:00am',
            remarks: 'N/A',
            penalty: 0,
            onItemType: 'Equipment'
        });
        await reservation.save();
        
        var reservation = new Reservation({
            title: 'Locker #30',
            userID: 11826401,
            reservationType: 'locker',
            item: mongoose.Types.ObjectId('5e78b2bc9a0bc0057841790f'),
            dateCreated: Date.now(),
            status: 'To Pay',
            description: 'Locker #101, Big Panel 1, Gokongwei 2/F',
            remarks: 'Pay Php 70.00 at the office.',
            penalty: 0,
            onItemType: 'Locker'
        });
        await reservation.save();

    } catch (err) {
        console.log(err);
    } */

    try {
        var activeReservations = await Reservation
            .find({ 
                userID: req.session.idNum, 
                status: ['Pending', 'For Pickup', 'To Pay', 'Uncleared', 'On Rent'] 
            }).sort({dateCreated: -1});
                
        var pastReservations = await Reservation
            .find({ 
                userID: req.session.idNum, 
                status: ['Denied', 'Returned'] 
            }).sort({dateCreated: -1});

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

exports.reservation_details = async function (req, res) {

    var now = new Date();
    var dateToday = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
    var tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    var dateTomorrow = tomorrow.getFullYear()+'-'+(tomorrow.getMonth()+1)+'-'+tomorrow.getDate();

    try {
        var pendingToday = await Reservation
            .find({status: 'Pending'})
            .where('dateCreated').gte(dateToday).lt(dateTomorrow)
            .populate('item');
        var pendingEarlier = await Reservation
            .find({status: 'Pending'})
            .where('dateCreated').lt(dateToday)
            .populate('item');

        var pickupPayToday = await Reservation
            .find({status: ['For Pickup', 'To Pay']});

        var activeLockers = await Reservation
            .find({status: ['On Rent', 'Uncleared'], reservationType: 'locker'});
        var pastLockers = await Reservation
            .find({status: ['Denied', 'Returned'], reservationType: 'locker'});
        
        var activeEquipment = await Reservation
            .find({status: ['On Rent', 'Uncleared'], reservationType: 'equipment'});
        var pastEquipment = await Reservation
            .find({status: ['Denied', 'Returned'], reservationType: 'equipment'});

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
        pendingEarlier: pendingEarlier,
        pickupPayToday: pickupPayToday,
        activeLockers: activeLockers,
        pastLockers: pastLockers,
        activeEquipment: activeEquipment,
        pastEquipment: pastEquipment
    });
}

exports.reservation_delete = async function(req, res) {
    try {
        var reservation = await Reservation.findById(req.body.reservationID);
        var user = await User.find({idNum: req.session.idNum});

        if ((reservation.userID == req.session.idNum && isCancellable(reservation)) || userIsAdmin(user))
            await Reservation.findByIdAndDelete(reservation._id);
    } catch(err) {console.log(err);};
    res.redirect('/reservations');    
};

function isCancellable(reservation) {
    return reservation.status == 'Pending' 
        || reservation.status == 'For Pickup'
        || reservation.status == 'To Pay';
}

function userIsAdmin(user) {
    return user.type == 'studentRep';
}