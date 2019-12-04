const ATMModel = require('../model/ATMModel');
module.exports = {
    denomination: (amount, denomination, availableNotesInATM) => {
        let response = {error: 0, data: {}};
        if(amount < denomination) {
            response.error = 1;
            response.data = 'Selected denomination should not be greater than amount';
            return response;
        }
        let notes = ATMModel.getAllowedBills().sort(function (a, b) {
            return b - a;
        });
        if (denomination) {
            notes = notes.filter(obj => {
                return obj <= denomination;
            });
        }
        for (let note of notes) {
            if (amount >= note) {
                let notesCount = parseInt(amount / note);
                response.data[note] = notesCount;
                amount = amount % note;
            }
            if (typeof response.data[note] !== 'undefined') {
                let availableNoteCount = 0;
                if (availableNotesInATM.length) {
                    availableNoteCount = availableNotesInATM[0][note];
                }
                if (denomination && availableNoteCount < response.data[note]) {
                    response.error = 1;
                    amount = 0;
                    let availableDenomination = ATMModel.getAllowedBills().sort(function (a, b) {
                        return b - a;
                    }).filter(obj => {
                        return obj > denomination;
                    });
                    if (availableDenomination.length) {
                        response.data = 'Please choose the notes from ' + availableDenomination.join(', ');
                    }
                    break;
                } else if (availableNoteCount < response.data[note]) {
                    let missingNotes = response.data[note] - availableNoteCount;
                    response.data[note] = response.data[note] - missingNotes;
                    if(!response.data[note]) {
                        delete response.data[note];
                    }
                    amount = amount + (missingNotes * note);
                }
            }
        }
        let minNote = Math.min(...notes);
        if (amount) {
            response.error = 1;
            response.data = 'ATM is running with low cash';
            if (minNote > amount) {
                response.data = 'Please enter the amount in ' + ATMModel.getAllowedBills().join(', ') + ' multiple';
            }
        }
        
        return response;
    }
};
