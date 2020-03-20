const Equipment = require('../model/equipment.model');

exports.createEquipment = async function (req, res) {
    let equipment = new Equipment({
        name: req.body.name,
        quantity: parseInt(req.body.count),
        available: parseInt(req.body.count),
        image: {
            data: fs.readFileSync(req.files.userPhoto.path),
            contentType: 'image/png'
        }
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

exports.updateEquipment = async function (req, res) {
    await Equipment.findById(req.body.equipmentid, async function(err, equipment) {
        if (err) return next(err);

        if (req.body.name != null) {
		equipment.name = req.body.name;
	    }

        if (req.body.count != null) {
            equipment.quantity = req.body.count;
        }
       
        await equipment.save(function (err) {
            if (err) {
                console.log('Error updating db');
            } else {
                console.log('success');
                res.redirect("/manage-equipment/equipment");
            }
        });

    });
};
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