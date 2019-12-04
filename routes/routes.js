const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const saltRounds = 15;

mongoose.connect('mongodb+srv://express:Paf8PpfyCneqkqed@expresssite-knif3.mongodb.net/MTM282Final?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    age: Number,
    roles: Array
});

const User = mongoose.model("User", userSchema);

const router = express.Router();

router.route("/").get(
    function(req, resp) {
        var model = {
            username: req.session.username,
            isAdmin: req.session.isAdmin
        }

        if (req.session.username) {
            resp.render("index", model);
        } else {
            resp.render("login", model);
        }
    }
)

router.route("/login").post(
    async function(req, resp) {
        var credentials = {
            username: req.body.username,
            password: req.body.password
        }

        var user = await User.findOne({ username: credentials.username });
        if (user) {
            const match = await bcrypt.compare(credentials.password, user.password);
            if (match) {
                req.session.username = credentials.username;
                req.session.isAdmin = user.roles.includes('admin');
            }
        }
        resp.redirect("/");
    }
)

router.route("/logout").get(
    function(req, resp) {
        req.session.username = null;
        req.session.isAdmin = null;

        resp.redirect("/");
    }
)

router.route("/create-account").get(
    function(req, resp) {
        resp.render("create-account");
    }
)

router.route("/create-account").post(
    function(req, resp) {
        var model;
        var userInfo = {
            age: req.body.age,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        };
        createUser(userInfo).then(function(result) {
            if (!result) {
                req.session.username = userInfo.username;
                resp.redirect("/");
            } else {
                model = {
                    error: result
                };
                resp.render("create-account", model);
            }
        });
    }
)

async function createUser(userInfo) {
    var user = await User.findOne({ username: userInfo.username });
    if (user) {
        return userInfo.username + " already exists.";
    } else {
        bcrypt.hash(userInfo.password, saltRounds, function(err, result) {
            user = new User({
                age: userInfo.age,
                email: userInfo.email,
                username: userInfo.username,
                password: result,
                roles: ['user']
            });

            user.save();
        });
    }
}

module.exports = router;