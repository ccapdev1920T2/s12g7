const Equipment = require('../model/equipment.model');
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

exports.createEquipment = function (req, res) {

    console.log(req.file);

    const tempPath = req.file.path;
    const filename = shortid.generate() + '.png';
    const filePath = path.join(__dirname, '/../public/uploads/equipment-images', filename);
    const relativeFilePath = '/uploads/equipment-images/' + filename;

    console.log('target: ' + filePath);

    fs.rename(tempPath, filePath, async function(err) {
        if (err) {
            console.log(err);
            res.redirect('/manage-equipment/');
        } else {
            let equipment = new Equipment({
                name: req.body.name,
                quantity: parseInt(req.body.count),
                available: parseInt(req.body.count),
                imageURL: relativeFilePath
            });

            try {
                await equipment.save();
            } catch(err) {
                console.log(err);
            }
            res.redirect("/manage-equipment/");
        }
    });

    // console.log(equipment);
};

exports.viewAllEquipment = async function (req, res) {
    try {
        equipment = await Equipment.find({});
        res.render('manage-equipment-page', {
            active: { active_manage_equipment: true },
            sidebarData: {
                dp: req.session.passport.user.profile.photos[0].value,
                name: req.session.passport.user.profile.displayName,
                idNum: req.session.idNum
            },
            equipmentList: equipment
        });
    } catch (err) {
        console.log(err);
    }
    /* Equipment.find({}, function (err, equipment) {
        res.render('manage-equipment-page', {
            active: { active_manage_equipment: true },
            sidebarData: {
                dp: req.session.passport.user.profile.photos[0].value,
                name: req.session.passport.user.profile.displayName,
                idNum: req.session.idNum
            },
            equipmentList: equipment
        });
    }); */
};

exports.updateEquipment = async function (req, res) {
    try {
        var equipment = await Equipment.findById(req.body.equipmentid);
        console.log(equipment);
        if (req.body.name.trim().length != 0) { equipment.name = req.body.name; }
        if (!isNaN(parseInt(req.body.count))) { equipment.quantity = req.body.count; }
        if (req.file != null) {
            fs.unlinkSync(path.join(__dirname, '/../public', equipment.imageURL));

            const tempPath = req.file.path;
            const filename = shortid.generate() + '.png';
            const filePath = path.join(__dirname, '/../public/uploads/equipment-images', filename);
            const relativeFilePath = '/uploads/equipment-images/' + filename;

            fs.rename(tempPath, filePath, async function(err) {
                if (err) console.log(err);
                else equipment.imageURL = relativeFilePath;
                try {
                    await equipment.save();
                }
                catch (err) {
                    console.log('Error updating db: ' + err);
                }
            });
        }
        else {
            await equipment.save();
        }
    } catch (err) {
        console.log('Error updating db: ' + err);
    }              
    res.redirect("/manage-equipment/");
};

exports.deleteEquipment = async function (req, res) { 
    try {
        var equipment = await Equipment.findById(req.body.equipmentid);
        fs.unlinkSync(path.join(__dirname, '/../public', equipment.imageURL));
        await Equipment.findByIdAndDelete(req.body.equipmentid);
    } catch (err) {
        console.log(err);
    } 
    res.redirect("/manage-equipment/");
};
