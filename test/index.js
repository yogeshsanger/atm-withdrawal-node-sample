const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../app');
describe('ATM Withdrawl', () => {
    
    it('should not withdraw without card number', (done) => {
        let atmData = {
            card_no: "",
            pin: "1234",
            amount: "100"
        };
        chai.request(app).post('/withdraw').send(atmData).end((err, res) => {
            chai.expect(err).to.be.null;
            chai.expect(res).to.have.status(403);
            chai.expect(res.body.error).to.equal(101);
            done();
        });
    });
    
    it('should not withdraw without PIN', (done) => {
        let atmData = {
            card_no: "4111111111111111",
            pin: "",
            amount: "100"
        };
        chai.request(app).post('/withdraw').send(atmData).end((err, res) => {
            chai.expect(err).to.be.null;
            chai.expect(res).to.have.status(403);
            chai.expect(res.body.error).to.equal(101);
            done();
        });
    });
    
    it('should not withdraw without amount', (done) => {
        let atmData = {
            card_no: "4111111111111111",
            pin: "1234",
            amount: ""
        };
        chai.request(app).post('/withdraw').send(atmData).end((err, res) => {
            chai.expect(err).to.be.null;
            chai.expect(res).to.have.status(403);
            chai.expect(res.body.error).to.equal(101);
            done();
        });
    });
    
    it('should have 16 digit card number', (done) => {
        let atmData = {
            card_no: "411111111111",
            pin: "1234",
            amount: "100"
        };
        chai.request(app).post('/withdraw').send(atmData).end((err, res) => {
            chai.expect(err).to.be.null;
            chai.expect(res).to.have.status(403);
            chai.expect(res.body.error).to.equal(101);
            done();
        });
    });
    
    it('should have 4 digit pin number', (done) => {
        let atmData = {
            card_no: "4111111111111111",
            pin: "abc",
            amount: "100"
        };
        chai.request(app).post('/withdraw').send(atmData).end((err, res) => {
            chai.expect(err).to.be.null;
            chai.expect(res).to.have.status(403);
            chai.expect(res.body.error).to.equal(101);
            done();
        });
    });
    
    it('should not have demomination value other than 10, 20, 50, 100, 200, 500, 1000', (done) => {
        let atmData = {
            card_no: "4111111111111111",
            pin: "1234",
            amount: "100",
            denomination: "5"
        };
        chai.request(app).post('/withdraw').send(atmData).end((err, res) => {
            chai.expect(err).to.be.null;
            chai.expect(res).to.have.status(403);
            chai.expect(res.body.error).to.equal(101);
            done();
        });
    });
    
});
