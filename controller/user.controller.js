const User = require('../model/user.model');

exports.people_details = function (req, res) {

    var colleges = User.schema.path('college').enumValues;

    res.render('manage-people-page', {
        active: {active_manage_people: true},
        sidebarData: {
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
            idNum: req.session.idNum,
            type: req.session.type      
        },
        colleges: colleges
    });

}

exports.people_get = async function (req, res) {
    try {

        console.log(req.query);

        var page = (req.query.page) == '' ? 1 : req.query.page;
        const itemsPerPage = 1;

        var people = new Object();

        people.totalCt = await User
            .find({idNum: { $regex: '[0-9]*' + req.query.idnum + '[0-9]*' }})
            .countDocuments();

        people.items = await User
            .find({idNum: { $regex: '[0-9]*' + req.query.idnum + '[0-9]*' }})
            .sort('lastname')
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        console.log(people.items);

        if (people)
            res.send(people);

    } catch (err) {
        console.log(err);
    }
}

exports.profile_details = async function (req, res) {
    try {
        var user = await User.findOne({ idNum: req.params.idNum });
        if (user) {
            if (user.idNum == req.session.idNum) // user is the same as logged in user
                res.render('profile-page', {
                    active: { active_profile: true },
                    sidebarData: {
                        dp: req.session.passport.user.profile.photos[0].value,
                        name: req.session.passport.user.profile.displayName,
                        idNum: req.session.idNum,
                        type: req.session.type      
                    },
                    user: user
                });
            else
                res.redirect('/404');
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
        const filter = { idNum: req.params.idNum };
        const update = { contactNum: req.body.phone };
        await User.findOneAndUpdate(filter, update);
        res.redirect('/profile/' + req.session.idNum);
    } catch (err) {
        console.log(err);
    }
}