const async = require('async');
const ATMModel = require('../model/ATMModel');
const {denomination} = require('../helpers/utility');
const ATMController = {
    home: (req, res) => {
        res.render('index', {title: 'ATM withdrawal'});
    },
    withdraw: (req, res) => {
        async.waterfall([
            (callback) => {
                /*
                 * Validate card
                 */
                ATMModel.getCard(req.body, (error, results) => {
                    if (error) {
                        callback(error, {code: 500, error: error.errno, data: error.sqlMessage});
                    } else if (!results.length) {
                        callback({error: 'Invalid Card details'}, {code: 400, error: 105, data: "Invalid card details"});
                    } else if (results[0].balance !== 'approved') {
                        callback({error: 'Low Balance'}, {code: 400, error: 106, data: "Low Balance"});
                    } else {
                        callback(null, results[0]);
                    }
                });
            },
            (cardDetails, callback) => {
                /*
                 * Notes available in ATM
                 */
                ATMModel.getNotesAvailableInATM((error, results) => {
                    if (error) {
                        callback(error, {code: 500, error: error.errno, data: error.sqlMessage});
                    } else {
                        callback(null, cardDetails, results);
                    }
                });
            },
            (cardDetails, notesAvailableInATM, callback) => {
                /*
                 * Calculate notes
                 */
                if (req.body.denomination === '') {
                    req.body.denomination = 0;
                }
                let notes = denomination(parseInt(req.body.amount), parseInt(req.body.denomination), notesAvailableInATM);
                if (notes.error) {
                    callback({error: notes}, {code: 400, error: 107, data: notes.data});
                    return false;
                }
                callback(null, cardDetails, notes);
            },
            (cardDetails, notes, callback) => {
                /*
                 * Add Transaction
                 */
                ATMModel.addTransaction(cardDetails.card_id, req.body.amount, (error, results) => {
                    if (error) {
                        callback(error, {code: 500, error: error.errno, data: error.sqlMessage});
                    } else {
                        callback(null, notes.data);
                    }
                });
            },
            (notes, callback) => {
                /*
                 * Dispatch Cash
                 */
                ATMModel.dispatchCashFromATM(notes, (error, results) => {
                    if (error) {
                        callback(error, {code: 500, error: error.errno, data: error.sqlMessage});
                    } else {
                        callback(null, {code: 200, error: 0, data: notes});
                    }
                });
            }
        ], (err, data) => {
            let code = data.code;
            if (err) {
                console.log(err);
            }
            delete data.code;
            res.status(code).json(data);
        });
    }
};
module.exports = ATMController;