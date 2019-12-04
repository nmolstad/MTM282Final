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
            username: req.session.username
        }

        if (req.session.username) {
            resp.render("index", model);
        } else {
            resp.render("login", model);
        }
    }
)

router.route("/create-account").get(
    function(req, resp) {
        resp.render("create-account");
    }
)



module.exports = router;