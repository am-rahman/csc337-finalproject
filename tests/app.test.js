// tests/app.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();

const mongoose = require("mongoose");

const User = createUserModel(mongoose);
const Post = createPostModel(mongoose);

chai.use(chaiHttp);

describe("Users", () => {
    beforeEach((done) => {
        User.deleteMany({}, (err) => {
            done();
        });
    });

    describe("/POST users/add", () => {
        //create a new user
        it("it should create a new user", (done) => {
            const user = {
                username: "testuser",
                email: "testuser@example.com",
                password: "password",
            };
            chai.request(server)
                .post("/users/add")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a("string");
                    res.body.should.be.eql(
                        `Welcome to chatter ${user.username}`
                    );
                    done();
                });
        });
    });
});

describe("Posts", () => {
    // Write your tests for posts here
});
