process.env.NODE_ENV = "test";
let mongoose = require("mongoose");
let User = require("../models/user");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
const { beforeEach } = require("mocha");
chai.should();
chai.use(chaiHttp);


describe("Test User", () => {
  // get userid + token to use in other tests
  let testToken = "testToken";
  let testUserId = "testUserId";

 
  describe("Users", () => {
    //Before each test we set a delay to wait server to be ready

    //You need to create a test user before with test1@email.com and password123! or start admin test because Operator are only created on admin side

    /**
     * Test the /POST login route
     */

    describe("/POST login", () => {
      it("it should GET login (userId + token)", (done) => {
        let user = {
          email: "test1@email.com",
          password: "password123!",
        };
        chai
          .request(server)
          .post("/api/users/login")
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.not.have.property("err");
            res.body.should.have.property("token");
            testToken = res.body.token;
            testUserId = res.body.userId;
            done();
          });
      });

      it("it should not GET login with wrong email", (done) => {
        let user = {
          email: "test.email.com",
          password: "password123!",
        };
        chai
          .request(server)
          .post("/api/users/login")
          .send(user)
          .end((err, res) => {
            res.should.have.status(406);
            res.body.should.be.a("object");
            res.body.should.have.property("err");
            res.body.should.have
              .property("msg")
              .eql("veuillez vérifier votre email/password");
            done();
          });
      });

      it("it should not GET login with wrong password", (done) => {
        let user = {
          email: "test1@email.com",
          password: "pass",
        };
        chai
          .request(server)
          .post("/api/users/login")
          .send(user)
          .end((err, res) => {
            res.should.have.status(406);
            res.body.should.be.a("object");
            res.body.should.have.property("err");
            res.body.should.have
              .property("msg")
              .eql("veuillez vérifier votre email/password");
            done();
          });
      });
    });

    /**
     * Test the /PUT route
     */

    describe("/PUT user", () => {
      it("it should not PUT a user with wrong token", (done) => {
        let moduser = {
          firstname: "test2",
          lastname: "test2",
          password: "password123!",
          password_confirmation: "password123!",
        };

        chai
          .request(server)
          .put("/api/users/modify/" + testUserId)
          .set({ Authorization: `Bearer ${testToken}1` })
          .send(moduser)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("token invalide ou inexistant");
            done();
          });
      });

    });

    

    

    /**
     * Test the /DELETE route
     */

    describe("/DELETE user", () => {
      it("it should not DELETE a user with wrong token", (done) => {
        chai
          .request(server)
          .delete("/api/users/delete/" + testUserId)
          .set({ Authorization: `Bearer ${testToken}1` })
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("token invalide ou inexistant");
            done();
          });
      });

      //delete user test done at the end to keed token and user id alive during all tests

      it("it should DELETE a user", (done) => {
        chai
          .request(server)
          .delete("/api/users/delete/" + testUserId)
          .set({ Authorization: `Bearer ${testToken}` })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.not.have.property("err");
            res.body.should.have
              .property("message")
              .eql("utilisateur supprimé");
            done();
          });
      });
    });
  });
});