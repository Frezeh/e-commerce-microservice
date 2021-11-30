const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("./index");
const should = chai.should();
chai.use(chaiHttp);

describe("Testing POST on /payment ", () => {
  it("It should start the payment service and save the transaction history", (done) => {
    chai
      .request(app)
      .post("/payment")
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV6ZWhmcmFuazg3QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiRnJlemVoIiwiaWF0IjoxNjM4MjYzNzUxfQ.ByQKIALcttBI9IF3LIqy6XSQIGR6EpbuvfbunxqLrfU')
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});