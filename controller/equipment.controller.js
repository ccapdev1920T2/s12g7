const Equipment = require('../model/equipment.model');
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

exports.createEquipment = function (req, res) {

    console.log(req.file);

    const tempPath = req.file.path;
    const filename = shortid.generate() + '.png';
    const filePath = path.join(__dirname, '/../public/uploads/equipment-images', filename);
    const staticFilePath = '/uploads/equipment-images/' + filename;

    console.log('target: ' + filePath);

    fs.rename(tempPath, filePath, async function(err) {
        if (err) {
            console.log(err);
            res.redirect('/manage-equipment/equipment');
        } else {
            let equipment = new Equipment({
                name: req.body.name,
                quantity: parseInt(req.body.count),
                available: parseInt(req.body.count),
                imageURL: staticFilePath
            });

            try {
                await equipment.save();
            } catch(err) {
                console.log(err);
            }
            res.redirect("/manage-equipment/equipment");
        }
    });

    // console.log(equipment);
};

exports.viewAllEquipment = function (req, res) {
    Equipment.find({}, function (err, equipment) {
        res.render('manage-equipment-page', {
            active: { active_manage_equipment: true },
            sidebarData: {
                dp: req.session.passport.user.profile.photos[0].value,
                name: req.session.passport.user.profile.displayName,
                idNum: req.session.idNum
            },
            equipmentList: equipment
        });
    });
};

exports.updateEquipment = async function (req, res) {
    await Equipment.findById(req.body.equipmentid, async function (err, equipment) {
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
    Equipment.findByIdAndDelete(req.body.equipmentid, function (err) {
        if (err) return next(err);
        console.log('Equipment deleted successfully.');
        res.redirect("/manage-equipment/equipment");
    });
};

/* exports.equipment_details = ;

exports.equipment_update = ;

exports.equipment_delete = ; */