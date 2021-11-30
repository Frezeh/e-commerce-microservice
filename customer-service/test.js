const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("./index");
const should = chai.should();
chai.use(chaiHttp);

describe("Testing POST on /customer/register ", () => {
  it("It should verify the register request body and return a new user", (done) => {
    const register = {
      email: "ezehfrank877@gmail.com",
      password: "password",
      username: "Frezeh"
    };
    chai
      .request(app)
      .post("/customer/register")
      .send(register)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("email");
        res.body.should.have.property("username");
        res.body.should.have.property("password");
        done();
      });
  });
});

describe("Testing POST on /customer/login ", () => {
    it("It should verify the login request body return a JWT token and userId", (done) => {
      const login = {
        email: "ezehfrank87@gmail.com",
        password: "password",
      };
      chai
        .request(app)
        .post("/customer/login")
        .send(login)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("token");
          res.body.should.have.property("userID");
          done();
        });
    });
  });
