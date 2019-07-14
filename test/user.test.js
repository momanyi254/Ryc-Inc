
const expect = require('chai').expect;
const app = require('../app.js');
var mocha = require('mocha');
var describe = mocha.describe;
const chai = require('chai');
chai.use(require('chai-http'));

var it = mocha.it;
let Token;
let userT;
let res;

describe('User signup/POST/', () => {
    it('should signup a user with valid details', () => {
        chai.request(app)
            .post('/users/signup')
            .send(
            {
                username: 'Henry',
                email: 'momanyi@hotmail.com',
                address: 'Nairobi West',
                password: 'qwe',
            })

            .then(res => {
                exports.userToken = res.body.Token;
                expect(res.status).to.be.equal(201);
                expect(res.body).to.have.property('message');
            });

    });

    it('should signup an admin with valid details', () => {
        chai.request(app)
            .post('/users/signup')
            .send(
            {
                username: 'Henry',
                email: 'momanyi@hotmail.com1',
                address: 'Nairobi West',
                password: 'qwe',
                isAdmin: 'True'
            })

            .then(res => {
                exports.userToken = res.body.Token;
                expect(res.status).to.be.equal(201);
                expect(res.body).to.have.property('message');
            });

    });
    it('should not signup a user with invalid details', () => {
        chai.request(app)
            .post('/users/signup')
            .send(
            {
                usernam: 'Henry',
                email: 'momanyi@hotmail.com11',
                address: 'Nairobi West',
                password: 'qwe',
            })

            .then(res => {
                exports.userToken = res.body.Token;
                expect(res.status).to.be.equal(400);
                expect(res.body).to.have.property('message');
            });
    })

    it('should not signup a user with already exist email', () => {
        chai.request(app)
            .post('/users/signup')
            .send(
            {
                username: 'Henry',
                email: 'momanyi@hotmail.com',
                address: 'Nairobi West',
                password: 'qwe',
            })

            .then(res => {
                expect(res.status).to.be.equal(409);
                expect(res.body).to.have.property('message');

            });
    });
})



describe('User signin/POST/', () => {

    it('should login user', () => {
        chai.request(app)
            .post('/users/signin')
            .send({
                email: 'momanyi@hotmail.com',
                password: 'qwe'
            })
            .then((res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('token');
            })
            .catch(error => done(error));
    });
    it('should not login user with invalid details', (done) => {
        chai.request(app)
            .post('/users/signin')
            .send({
                email: 'momanyi@hotmail.com',
                password: 'hery123'
            })
            .then((res) => {
                expect(res.status).to.be.equal(401);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message');
                done();
            })
            .catch(error => done(error));
    });
    it('should not login user with non-exist details(email)', (done) => {
        chai.request(app)
        .post('/users/signin')
            .send({
                email: 'momanyi@gmail.comiiiii',
                password: 'hery123'
            })
            .then((res) => {
                expect(res.status).to.be.equal(400);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message');
                done();
            })
            .catch(error => done(error));

});

});