const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const saltRounds = 5;

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
    roles: Array,
    active: Boolean,
    answer1: String,
    answer2: String,
    answer3: String,
});

const User = mongoose.model("User", userSchema);

const questionSchema = mongoose.Schema({
    name: String,
    answer1: Number,
    answer2: Number,
    answer3: Number,
    answer4: Number
});

const Question = mongoose.model("Question", questionSchema);

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
        var answers = {
            answer1: req.body.question1,
            answer2: req.body.question2,
            answer3: req.body.question3
        }
        console.log
        createUser(userInfo, answers).then(function(result) {
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
        saveAnswers(answers).then(function() {

        });
    }
)

async function createUser(userInfo, answers) {
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
                roles: ['user'],
                answer1: answers.answer1,
                answer2: answers.answer2,
                answer3: answers.answer3
            });

            user.save();
        });
    }
}

async function saveAnswers(answers) {
    if (answers.answer1) {
        var question1 = await Question.findOne({ name: "question1" });
        switch (answers.answer1) {
            case "blue":
                question1.answer1 += 1;
                break;
            case "green":
                question1.answer2 += 1;
                break;
            case "red":
                question1.answer3 += 1;
                break;
            case "purple":
                question1.answer4 += 1;
                break;
        }
        question1.save();
    }

    if (answers.answer2) {
        var question2 = await Question.findOne({ name: "question2" });
        switch (answers.answer2) {
            case "italian":
                question2.answer1 += 1;
                break;
            case "asian":
                question2.answer2 += 1;
                break;
            case "mexican":
                question2.answer3 += 1;
                break;
            case "moroccan":
                question2.answer4 += 1;
                break;
        }
        question2.save();
    }

    if (answers.answer3) {
        var question3 = await Question.findOne({ name: "question3" });
        switch (answers.answer3) {
            case "dog":
                question3.answer1 += 1;
                break;
            case "cat":
                question3.answer2 += 1;
                break;
            case "sloth":
                question3.answer3 += 1;
                break;
            case "eagle":
                question3.answer4 += 1;
                break;
        }
        question3.save();
    }
}

module.exports = router;