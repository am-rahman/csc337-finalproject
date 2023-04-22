// tests/app.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const bcrypt = require("bcrypt");
const should = chai.should();
const chaiAsPromised = require("chai-as-promised");
const chaiDiff = require("chai-diff");

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/chatter", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const User = require("../models/user");
const Post = require("../models/post");

chai.use(chaiHttp);
chai.use(chaiAsPromised);
chai.use(chaiDiff);

describe("Users", () => {
    beforeEach(async (done) => {
        User.deleteMany({})
            .then((res) => {
                console.log("Deleted user count: " + res.deletedCount);
            })
            .catch((err) => {
                console.error(err);
            });
        done();
    });

    describe("/POST users/add", () => {
        //test for creating a new user
        it("should create a new user", (done) => {
            const user = {
                username: "testuser",
                email: "testuser@example.com",
                password: "password",
            };
            chai.request(server)
                .post("/users/add")
                .send(user)
                .end((err, res) => {
                    if (err) {
                        console.error(err);
                        done(err);
                    } else {
                        try {
                            // console.log(res.body);
                            // console.log(res.status);
                            res.should.have.status(201);
                            console.log(res.status);
                            console.log(res.body);
                            res.body.should.be.a("object");
                            res.body.message.should.eql(
                                `Welcome to chatter ${user.username}`
                            );
                            done();
                        } catch (error) {
                            console.error(error);
                            done(error);
                        }
                    }
                });
        }).timeout(10000);

        //test for creating a new user with an existing username
        it("it should not create a user with an existing username", (done) => {
            const user = {
                username: "testuser",
                email: "testuser@example.com",
                password: "password",
            };
            const user2 = {
                username: "testuser",
                email: "testuser2@example.com",
                password: "password",
            };
            chai.request(server)
                .post("/users/add")
                .send(user)
                .end((err, res) => {
                    chai.request(server)
                        .post("/users/add")
                        .send(user2)
                        .end((err, res) => {
                            res.should.have.status(409);
                            res.body.should.be.a("object");
                            res.body.message.should.be.eql(
                                "Username already exists"
                            );
                            done();
                        });
                });
        }).timeout(10000);

        //test for creating a new user with an existing email
        it("it should not create a user with an existing email", (done) => {
            const user = {
                username: "testuser",
                email: "testuser@example.com",
                password: "password",
            };
            const user2 = {
                username: "testuser2",
                email: "testuser@example.com",
                password: "password",
            };
            chai.request(server)
                .post("/users/add")
                .send(user)
                .end((err, res) => {
                    chai.request(server)
                        .post("/users/add")
                        .send(user2)
                        .end((err, res) => {
                            res.should.have.status(409);
                            res.body.should.be.a("object");
                            res.body.message.should.be.eql(
                                "Email already exists"
                            );
                            done();
                        });
                });
        }).timeout(10000);

        //test for password encryption
        it("it should encrypt the user's password before saving", (done) => {
            const user = {
                username: "testuser",
                email: "testuser@example.com",
                password: "password",
            };
            chai.request(server)
                .post("/users/add")
                .send(user)
                .end(async (err, res) => {
                    const savedUser = await User.findOne({
                        username: user.username,
                    });
                    const passwordMatch = await bcrypt.compare(
                        user.password,
                        savedUser.password
                    );
                    passwordMatch.should.be.true;
                    done();
                });
        }).timeout(10000);

        //test for creating a new user with an invalid email
        it("it should not create a user with an invalid email", (done) => {
            const user = {
                username: "testuser",
                email: "testuserexample.com",
                password: "password",
            };
            chai.request(server)
                .post("/users/add")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a("object");
                    res.body.errors.should.be.a("array");
                    res.body.errors[0].should.have.property(
                        "msg",
                        "Email must be a valid email address"
                    );
                    done();
                });
        }).timeout(10000);

        //test for creating a new user with an invalid password
        it("it should not create a user with an invalid password", (done) => {
            const user = {
                username: "testuser",
                email: "testuser@example.com",
                password: "pass",
            };
            chai.request(server)
                .post("/users/add")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a("object");
                    res.body.errors.should.be.a("array");
                    res.body.errors[0].should.have.property(
                        "msg",
                        "Password must be at least 8 characters long"
                    );
                    done();
                });
        }).timeout(10000);
    });
});

describe("Posts", () => {
    // Write your tests for posts here
});
