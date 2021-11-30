const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("./index");
const should = chai.should();
chai.use(chaiHttp);

describe("Testing POST on /product/create ", () => {
  it("It should verify the product request body and return a new product", (done) => {
    const createProduct = {
      name: "Test Product",
      description: "Test Product Description",
      price: 5000
    };
    chai
      .request(app)
      .post("/product/create")
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV6ZWhmcmFuazg3QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiRnJlemVoIiwiaWF0IjoxNjM4MjYzNzUxfQ.ByQKIALcttBI9IF3LIqy6XSQIGR6EpbuvfbunxqLrfU')
      .send(createProduct)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("name");
        res.body.should.have.property("description");
        res.body.should.have.property("price");
        done();
      });
  });
});

describe("Testing POST on /product/buy ", () => {
    it("It should buy an item from the product list and send to order service", (done) => {
      const buyProduct = {
        ids: [
            "61a5f4df60732636c8fd9877"
        ]
      };
      chai
        .request(app)
        .post("/product/buy/619f0c1dd45b602a081f1611")
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV6ZWhmcmFuazg3QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiRnJlemVoIiwiaWF0IjoxNjM4MjYzNzUxfQ.ByQKIALcttBI9IF3LIqy6XSQIGR6EpbuvfbunxqLrfU')
        .send(buyProduct)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });
