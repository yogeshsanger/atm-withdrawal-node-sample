const { getAllowedBills } = require('../model/ATMModel');
const validations = {
    withdraw: (req, res, next) => {
        let valid = {
            card_no: {
                required: true,
                integer: true,
                valid_length: 16
            },
            pin: {
                required: true,
                integer: true,
                valid_length: 4
            },
            amount: {
                required: true,
                integer: true
            },
            denomination: {
                required: false,
                integer: true,
                notesAllowed: getAllowedBills()
            }
        };
        validations.__validate(valid,req.body, (err) => {
            if(!err) {
                next();
                return false;
            }
            res.status(403).json({ error: 101, data:  err});
        });
    },
    __validate: (validator, body, callback) => {
        let errors = {};
        let requestFields = Object.keys(body);
        let validFields = Object.keys(validator);
        const disallowedFields = requestFields.filter(element => validFields.indexOf(element) === -1);
        if(disallowedFields.length) {
            for(let disallowedField of disallowedFields) {
                if(typeof errors[disallowedField] === 'undefined') {
                    errors[disallowedField] = [];
                }
                errors[disallowedField].push(disallowedField + ' feild not allowed');
            }
            callback(errors);
            return false;
        }
        for (let field in validator) {
            let errorMessages = [];
            body[field] = body[field] || '';
            let validationsVal = validator[field];
            for (let validation in validationsVal) {
                let fn = validations[validation];
                let error = fn(validationsVal[validation],body[field],field);
                if(error) {
                    errorMessages.push(error);
                }
            }
            if(errorMessages.length) {
                if(typeof errors[field] === 'undefined') {
                    errors[field] = [];
                }
                errors[field] = [...errors[field], ...errorMessages];
            }
        }
        if(Object.keys(errors).length) {
            callback(errors);
            return false;
        }
        callback(null);
    },
    required: (value,fieldVal,field) => {
        if(!value || fieldVal !== '') {
            return false;
        }
        return field + ' is required';
    },
    integer: (value,fieldVal,field) => {
        if(!value || fieldVal === '') {
            return false;
        }
        if(isNaN(fieldVal)) {
            return field + ' must be number';
        }
        if(!Number.isInteger(parseFloat(fieldVal))) {
            return field + ' must be valid number';
        }
    },
    valid_length: (value,fieldVal,field) => {
        if(fieldVal === '') {
            return false;
        }
        if(fieldVal.length !== value) {
            return field + ' must have ' + value + ' characters only';    
        }
    },
    notesAllowed: (value,fieldVal,field) => {
        if(fieldVal === '') {
            return false;
        }
        if(value.indexOf(parseInt(fieldVal)) === -1) {
            return 'Allowed '+ field + ' are ' + value.join(', ');
        }
    }
};
module.exports = validations;