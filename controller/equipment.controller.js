const Equipment = require('../model/equipment.model');

exports.createEquipment = async function (req, res) {
    let equipment = new Equipment({
        name: req.body.name,
        quantity: parseInt(req.body.count),
        available: parseInt(req.body.count)
        // ,imageURL: req.body.imageURL TODO:
    });
    
    console.log(equipment);

    await equipment.save(function (err) {
        if (err) {
            console.log('Error writing to db');
        } else {
            console.log('success');
            res.redirect("/manage-equipment/equipment");
        }
    });
};

exports.viewAllEquipment = function (req, res) {
    Equipment.find({}, function(err, equipment) {
        res.render('manage-equipment-page', {
            active: { active_manage_equipment: true },
            sidebarData: { 
                dp: req.session.passport.user.profile.photos[0].value,
                name: req.session.passport.user.profile.displayName
                },
            equipmentList: equipment
        });
    });

};

export.updateEquipment 
exports.deleteEquipment = function (req, res) {
    Equipment.findByIdAndDelete(req.body.equipmentid, function(err) {
        if (err) return next(err);
        console.log('Equipment deleted successfully.');
        res.redirect("/manage-equipment/equipment");
    });
};

/* exports.equipment_details = ;

exports.equipment_update = ;

exports.equipment_delete = ; */