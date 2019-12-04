const db = require('../helpers/mysql');
const moment = require('moment');
const ATMModel = {
    getAllowedBills: () => {
        return [1000, 500, 200, 100, 50, 20, 10];
    },
    getCard: (data, callback) => {
        db.getConnection((err, conn) => {
            if(err) {
                callback(err,[]);
                return false;
            }
            conn.query("SELECT `tbl`.* FROM `cards` AS `c` LEFT JOIN (SELECT `card_id`,(SUM(IF(`transaction_type` = 'credit',`amount`,0)) - SUM(IF(`transaction_type` = 'debit',`amount`,0))) AS `total`, IF((SUM(IF(`transaction_type` = 'credit',`amount`,0)) - SUM(IF(transaction_type = 'debit',`amount`,0))) < ?, 'unapproved','approved') AS `balance` FROM `transactions` GROUP BY `card_id`) AS `tbl` ON `c`.`id` = `tbl`.`card_id` WHERE `c`.`card_number` = ? AND `c`.`pin` = MD5(?)",[data.amount,data.card_no,data.pin] ,(error, results) => {
                db.releaseConnection(conn);
                callback(error, results);
            });
        });
    },
    addTransaction: (card_id, amount, callback) => {
        db.getConnection((err, conn) => {
            if(err) {
                callback(err,[]);
                return false;
            }
            conn.query("INSERT INTO `transactions` SET `card_id` = ?,`amount` = ?, `transaction_type` = 'debit', `created` = ?",[card_id,amount,moment().format('YYYY-MM-DD HH:mm:ss')] ,(error, results) => {
                db.releaseConnection(conn);
                callback(error, results);
            });
        });
    },
    getNotesAvailableInATM: (callback) => {
        db.getConnection((err, conn) => {
            if(err) {
                callback(err,[]);
                return false;
            }
            conn.query("SELECT * FROM `notes`",(error, results) => {
                db.releaseConnection(conn);
                callback(error, results);
            });
        });
    },
    dispatchCashFromATM: (notes, callback) => {
        let setVal = [];
        for(let note in notes) {
            setVal.push('`'+note + '` = `' + note + '` - ' + notes[note]);
        }
        db.getConnection((err, conn) => {
            if(err) {
                callback(err,[]);
                return false;
            }
            conn.query("UPDATE `notes` SET "+setVal.join(', '),(error, results) => {
                db.releaseConnection(conn);
                callback(error, results);
            });
        });
    }
};
module.exports = ATMModel;