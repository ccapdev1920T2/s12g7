const User = require('../model/user.model');

exports.people_details = function (req, res) {

    var colleges = User.schema.path('college').enumValues;

    res.render('manage-people-page', {
        active: {active_manage_people: true},
        sidebarData: {
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
            type: req.session.type      
        },
        colleges: colleges
    });

}

exports.people_update = async function (req, res) {

    try {
        await User.findByIdAndUpdate(
            req.body.id,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                idNum: req.body.idNum,
                college: req.body.college,
                degreeProg: req.body.degProg,
                contactNum: req.body.mobile
            }
        );

    } catch (err) {
        console.log(err);
    }
    
    res.redirect('/profile/manage');
}

exports.people_get = async function (req, res) {
    try {
        var page = (req.query.page) == '' ? 1 : req.query.page;
        const itemsPerPage = 10;

        var people = new Object();

        people.totalCt = await User
            .find({idNum: { $regex: '[0-9]*' + req.query.idnum + '[0-9]*' }})
            .countDocuments();

        people.items = await User
            .find({idNum: { $regex: '[0-9]*' + req.query.idnum + '[0-9]*' }})
            .sort('lastname')
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        if (people)
            res.send(people);

    } catch (err) {
        console.log(err);
    }
}

exports.profile_details = async function (req, res) {
    try {
        var user = await User.findOne({ idNum: req.session.idNum });
        if (user) {
            res.render('profile-page', {
                active: { active_profile: true },
                sidebarData: {
                    dp: req.session.passport.user.profile.photos[0].value,
                    name: req.session.passport.user.profile.displayName,
                    type: req.session.type      
                },
                user: user
            });
        } else {
            console.log('profile: user cannot be accessed');
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};

exports.profile_update = async function (req, res) {
    try {
        const filter = { idNum: req.session.idNum };
        const update = { contactNum: req.body.phone };
        await User.findOneAndUpdate(filter, update);
        res.redirect('/profile');
    } catch (err) {
        console.log(err);
    }
}