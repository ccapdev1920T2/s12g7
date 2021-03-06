const { check } = require('express-validator');

const validation = {

    addPanelValidation: function () {
        var validation = [
            check('type', 'Type should not be empty.').notEmpty(),
            check('building', 'Building should not be empty.').notEmpty(),
            check('level', 'Floor level should be an integer.').notEmpty().isInt(),
            check('lowerRange', 'Lower range should be an integer.').notEmpty().isInt(),
            check('upperRange', 'Upper range should be an integer greater than or equal to lower range.').notEmpty().isInt().custom((upperRange, { req }) => {
                var lower = parseInt(req.body.lowerRange);
                var upper = parseInt(upperRange);

                if (upper >= lower)
                    return true;
                else return false;
            })
        ];
        return validation;
    },

    addOrUpdateEquipmentValidation: function () {
        var validation = [
            check('name', 'Equipment name should not be empty.').notEmpty(),
            check('count', 'Quantity should be an integer.').notEmpty().isInt()
        ];
        return validation;
    },

    registerValidation: function () {
        var validation = [
            check('idNum', 'ID number should contain 8 digits.')
                .isLength({min: 8, max: 8}),
            check('degProg', 'Degree program cannot be empty').notEmpty(),
            check('phone', 'Phone cannot be empty').notEmpty(),
            check('phone', 'Invalid phone number')
                .isLength({min: 10, max: 10})
                .isNumeric({no_symbols: true})
        ];
        return validation;
    },

    editProfileValidation: function () {
        var validation = [
            check('phone', 'Phone cannot be empty').notEmpty(),
            check('phone', 'Invalid phone number')
                .isLength({min: 10, max: 10})
                .isNumeric({no_symbols: true})
        ]
        return validation;
    }
}

module.exports = validation;