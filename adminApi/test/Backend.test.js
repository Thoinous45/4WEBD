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

process.env.Test_TOKEN_KEY;

describe("TestBackend", () => {
  // get userid + token to use in other tests
  let testToken = "testToken";
  let testUserId = "testUserId";

  before(function (done) {
    this.timeout(3000);
    setTimeout(done, 2000);
  });

  beforeEach(function (chai) {
    this.timeout(3000);
    setTimeout(chai, 100);
  });

  describe("Users", () => {
    //Before each test we set a delay to wait server to be ready

    /**
     * Test the /POST signup route
     */

    describe("/POST user signup", () => {
      it("it should not POST a user without email field", (done) => {
        let user = {
          pseudo: "test",
          password: "password",
          password_confirmation: "password",
        };
        chai
          .request(server)
          .post("/api/users/signup")
          .send(user)
          .end((err, res) => {
            res.should.have.status(406);
            res.should.be.a("object");
            res.body.should.have.property("err");
            res.body.should.have
              .property("msg")
              .eql("veuillez vérifier votre email/password");
            done();
          });
      });

      it("it should not POST a user without password field", (done) => {
        let user = {
          pseudo: "test",
          email: "test@email.com",
          password_confirmation: "password",
        };
        chai
          .request(server)
          .post("/api/users/signup")
          .send(user)
          .end((err, res) => {
            res.should.have.status(406);
            res.should.be.a("object");
            res.body.should.have.property("err");
            res.body.should.have
              .property("msg")
              .eql("veuillez vérifier votre email/password");
            done();
          });
      });

      it("it should not POST a user without password_confirmation field", (done) => {
        let user = {
          pseudo: "test",
          email: "test@email.com",
          password: "password123!",
        };
        chai
          .request(server)
          .post("/api/users/signup")
          .send(user)
          .end((err, res) => {
            res.should.have.status(406);
            res.should.be.a("object");
            res.body.should.have.property("err");
            res.body.should.have
              .property("msg")
              .eql("veuillez vérifier votre email/password");
            done();
          });
      });

      it("it should not POST a user without pseudo field", (done) => {
        let user = {
          email: "test.email.com",
          password: "password123!",
          password_confirmation: "password123!",
        };
        chai
          .request(server)
          .post("/api/users/signup")
          .send(user)
          .end((err, res) => {
            res.should.have.status(406);
            res.should.be.a("object");
            res.body.should.have.property("err");
            res.body.should.have
              .property("msg")
              .eql("veuillez vérifier votre email/password");
            done();
          });
      });

      it("it should not POST a user with wrong email", (done) => {
        let user = {
          pseudo: "test",
          email: "test.email.com",
          password: "password123!",
          password_confirmation: "password123!",
        };
        chai
          .request(server)
          .post("/api/users/signup")
          .send(user)
          .end((err, res) => {
            res.should.have.status(406);
            res.should.be.a("object");
            res.body.should.have.property("err");
            res.body.should.have
              .property("msg")
              .eql("veuillez vérifier votre email/password");
            done();
          });
      });

      it("it should not POST a user with wrong password", (done) => {
        let user = {
          pseudo: "test",
          email: "test.email.com",
          password: "pass",
          password_confirmation: "pass",
        };
        chai
          .request(server)
          .post("/api/users/signup")
          .send(user)
          .end((err, res) => {
            res.should.have.status(406);
            res.should.be.a("object");
            res.body.should.have.property("err");
            res.body.should.have
              .property("msg")
              .eql("veuillez vérifier votre email/password");
            done();
          });
      });

      it("it should not POST a user with wrong password_confirmation", (done) => {
        let user = {
          pseudo: "test",
          email: "test.email.com",
          password: "password123!",
          password_confirmation: "pass",
        };
        chai
          .request(server)
          .post("/api/users/signup")
          .send(user)
          .end((err, res) => {
            res.should.have.status(406);
            res.should.be.a("object");
            res.body.should.have.property("err");
            res.body.should.have
              .property("msg")
              .eql("veuillez vérifier votre email/password");
            done();
          });
      });

      it("it should POST a user", (done) => {
        let user = {
          pseudo: "test",
          email: "test1@email.com",
          password: "password123!",
          password_confirmation: "password123!",
        };
        chai
          .request(server)
          .post("/api/users/signup")
          .send(user)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a("object");
            res.body.should.not.have.property("err");
            res.body.should.have.property("message").eql("Utilisateur créé !");
            done();
          });
      });

      it("it should not POST a user with same email", (done) => {
        let user = {
          pseudo: "test",
          email: "test1@email.com",
          password: "password123!",
          password_confirmation: "password123!",
        };
        chai
          .request(server)
          .post("/api/users/signup")
          .send(user)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.be.a("object");
            res.body.should.have.property("err");
            done();
          });
      });
    });

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
          pseudo: "test2",
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

//need to be deprecated to active next test
    });

    //error on modifie user , have to check this later
    /** 
  
    it("it should PUT a user", (done) => {
      let moduser = {
        pseudo: "test2",
        password: "password123!",
        password_confirmation: "password123!",
      };

      chai
        .request(server)
        .put("/api/users/modify/" + testUserId)
        .set({ Authorization: `Bearer ${testToken}` })
        .send(moduser)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.not.have.property("err");
          res.body.should.have.property("message").eql("Utilisateur modifié !");
          done();
     });   
    });
  });
  */

    /**
     * Test the /Get route
     */

    describe("/GET user", () => {
      it("it should GET a user with token", (done) => {
        chai
          .request(server)
          .get("/api/users/" + testUserId)
          .set({ Authorization: `Bearer ${testToken}` })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.not.have.property("err");
            res.body.should.have.property("pseudo");
            res.body.should.have.property("email");
            res.body.should.have.property("_id");
            done();
          });
      });

      it("it should not GET a user with wrong token", (done) => {
        let user = {
          email: "test1@email.com",
          password: "password123!",
        };
        chai
          .request(server)
          .post("/api/users/login")
          .send(user)
          .end((err, res) => {
            chai
              .request(server)
              .get("/api/users/" + testUserId)
              .set({ Authorization: `Bearer ${testToken}1` })
              .end((err, res) => {
                res.should.have.status(500);
                done();
              });
          });
      });

      it("it should not GET a user with wrong id", (done) => {
        let user = {
          email: "test1@email.com",
          password: "password123!",
        };
        chai
          .request(server)
          .post("/api/users/login")
          .send(user)
          .end((err, res) => {
            chai
              .request(server)
              .get("/api/users/" + testUserId + "1")
              .set({ Authorization: `Bearer ${testToken}` })
              .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a("object");
                res.body.should.have
                  .property("message")
                  .eql("erreur serveur ou identifiant invalide");
                done();
              });
          });
      });
    });

    /**
     * We do not delete admin use , maybe we can add later a SUPERADMIN user who can manage admin account and delete them
     */
  });
});