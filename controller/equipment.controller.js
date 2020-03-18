const Equipment = require('../model/equipment.model');

exports.createEquipment = async function (req, res) {
    let equipment = new Equipment({
        name: req.body.name,
        quantity: req.body.quantity,
        available: req.body.available
        // ,imageURL: req.body.imageURL TODO:
    });

    await panel.save(function (err) {
        if (err) {
            console.log('Error writing to db');
        } else {
            console.log('success');
        }
    });
};

exports.viewEquipments = function (req, res) {
    res.render('manage-equipment-page', {
        active: { active_manage_equipment: true },
        sidebarData: {
            dp: req.session.passport.user.profile.photos[0].value,
            name: req.session.passport.user.profile.displayName,
        }
    });
};

/* exports.equipment_details = ;

exports.equipment_update = ;

exports.equipment_delete = ; */