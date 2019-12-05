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
            isAdmin: req.session.isAdmin,
            error: req.session.error
        }

        req.session.error = null;

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
            if (match && user.active) {
                req.session.username = credentials.username;
                req.session.isAdmin = user.roles.includes('admin');
            } else if (match && !user.active) {
                req.session.error = "This account is suspended";
            } else {
                req.session.error = "Invalid username or passsword.";
            }
        } else {
            req.session.error = "Invalid username or passsword.";
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

router.route("/admin").get(
    function(req, resp) {
        if (req.session.isAdmin) {
            getAllUser().then(function(results) {
                var model = {
                    username: req.session.username,
                    users: results
                }

                resp.render("admin", model);
            });
        } else {
            req.session.error = "You do not have permission to access this page.";

            resp.redirect("/");
        }
    });

router.route("/data").get(
    async function(req, resp) {
        var questions = await Question.find();

        resp.send(questions);
    });

router.route("/admin-status/:username").post(
    async function(req, resp) {
        if (req.session.isAdmin) {
            var user = await User.findOne({ username: req.params.username });

            if (user) {
                if (user.roles.includes("admin")) {
                    await User.updateOne({ username: user.username }, { $pull: { roles: "admin" } });
                } else {
                    console.log("gets here");
                    await User.updateOne({ username: user.username }, { $push: { roles: "admin" } });
                }
            }
            resp.redirect("/admin");
        } else {
            resp.redirect("/");
        }
    });

router.route("/status/:username").post(
    async function(req, resp) {
        if (req.session.isAdmin) {
            var user = await User.findOne({ username: req.params.username });

            if (user) {
                if (user.active) {
                    await User.updateOne({ username: user.username }, { $set: { active: false } });
                } else {
                    await User.updateOne({ username: user.username }, { $set: { active: true } });
                }
            }
            resp.redirect("/admin");
        } else {
            resp.redirect("/");
        }
    });

async function getAllUser() {
    var users = await User.find();

    return users;
}

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
                active: true,
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
                question1.blue += 1;
                break;
            case "green":
                question1.green += 1;
                break;
            case "red":
                question1.red += 1;
                break;
            case "purple":
                question1.purple += 1;
                break;
        }
        question1.save();
    }

    if (answers.answer2) {
        var question2 = await Question.findOne({ name: "question2" });
        switch (answers.answer2) {
            case "italian":
                question2.italian += 1;
                break;
            case "asian":
                question2.asian += 1;
                break;
            case "mexican":
                question2.mexican += 1;
                break;
            case "moroccan":
                question2.moroccan += 1;
                break;
        }
        question2.save();
    }

    if (answers.answer3) {
        var question3 = await Question.findOne({ name: "question3" });
        switch (answers.answer3) {
            case "dog":
                question3.dog += 1;
                break;
            case "cat":
                question3.cat += 1;
                break;
            case "sloth":
                question3.sloth += 1;
                break;
            case "eagle":
                question3.eagle += 1;
                break;
        }
        question3.save();
    }
}
router.route("/edit-profile").get(
    async function(req, resp) {
        var username = req.session.username;
        var user = await User.findOne({ username: username });
        var model = {
            user: user
        };
        resp.render("edit-profile", model);

    }
);
router.route("/edit-profile").post(
    async function(req, resp) {
        var user = await User.findOne({username: req.session.username});
        var oldAnswer1 = user.question1;
        var oldAnswer2 = user.question2;
        var oldAnswer3 = user.question3;
        var question1 = req.body.question1;
        var question2 = req.body.question2;
        var question3 = req.body.question3;


        if(oldAnswer1 !== question1){
            var question1db = await Question.findOne({name: question1});

            if(oldAnswer1 === "blue"){
                question1db.blue -=1;
            } else if(oldAnswer1 === "green"){
                question1db.green -=1;
            } else if(oldAnswer1 === "red"){
                question1db.red -=1;
            } else if(oldAnswer1 === "purple"){
                question1db.purple -=1;
            }

            if(question1 === "blue"){
                question1db.blue +=1;
            } else if(question1 === "green"){
                question1db.green +=1;
            } else if(question1 === "red"){
                question1db.red +=1;
            } else if(question1 === "purple"){
                question1db.purple +=1;
            }
            question1db.save();
        }

        if(oldAnswer2 !== question2){
            var question2db = await Question.findOne({name: question2});

            if(oldAnswer2 === "italian"){
                question2db.italian -=1;
            } else if(oldAnswer2 === "asian"){
                question2db.asian -=1;
            } else if(oldAnswer2 === "mexican"){
                question2db.mexican -=1;
            } else if(oldAnswer2 === "moroccan"){
                question2db.moroccan -=1;
            }

            if(question2 === "italian"){
                question2db.italian +=1;
            } else if(question2 === "asian"){
                question2db.asian +=1;
            } else if(question2 === "mexican"){
                question2db.mexican +=1;
            } else if(question2 === "moroccan"){
                question2db.moroccan +=1;
            }
            question2db.save();
        }

        if(oldAnswer3 !== question3){
            var question3db = await Question.findOne({name: question3});

            if(oldAnswer3 === "dog"){
                question3db.dog -=1;
            } else if(oldAnswer3 === "cat"){
                question3db.cat -=1;
            } else if(oldAnswer3 === "sloth"){
                question3db.sloth -=1;
            } else if(oldAnswer3 === "eagle"){
                question3db.eagle -=1;
            }

            if(question3 === "dog"){
                question3db.dog +=1;
            } else if(question3 === "cat"){
                question3db.cat +=1;
            } else if(question3 === "sloth"){
                question3db.sloth +=1;
            } else if(question3 === "eagle"){
                question3db.eagle +=1;
            }
            question3db.save();
        }

        if(req.body.password === ""){
            User.updateOne({username:req.session.username}, {$set: {username: req.body.username, email: req.body.email, age: req.body.age, question1: question1, question2: question2, question3: question3}});
        } else{
            User.updateOne({username:req.session.username}, {$set: {username: req.body.username, password: req.body.password, email: req.body.email, age: req.body.age, question1: question1, question2: question2, question3: question3}});

        }
    }
);

module.exports = router;