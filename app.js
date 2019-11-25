const express = require("express");
const session = require('express-session');
const app = express();
var port = 3000;

app.use(session({
    secret: 'pineapple',
    cookie: {}
}))

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));

var routes = require('./routes/routes.js');
app.use("/", routes);

app.use(function(req, resp, next) {
    resp.status(404);

    resp.render("404", {
        url: req.url,
        username: req.session.username
    });
    return;
});

app.listen(port, function() {
    console.log("Express started and listening on port: " + port);
});