//dependencies
//node.js framework
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
// ******************
//bodyParser extracts the entire body portion of an incoming request stream and exposes it on req.body.  This is middleware that no longer is part of Express.js.  Parses the JSON, buffer, string, and URL encoded data submitted using HTTP POST request.
// var bodyParser = require("body-parser")
// ******************
var PORT = process.env.PORT || 3030
var db = require("./models");

var exphbs = require('express-handlebars')
// ******************
//node.js module for mongodb
// var mongojs = require("mongojs")
//JavaScript library used to make HTTP requests from node.js or XMLHttpRequests from the browser. 
// var axios = require('axios')
//Cheerio to implement the core of jQuery for the server.
// var cheerio = require('cheerio')

//initialze express
var app = express()
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 120000 }
}));
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());




// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB

var databaseUri = "mongodb://localhost/scrape";
if(process.env.MONGODB_URI){
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true
    });
} else {
    mongoose.connect(databaseUri, {
        useNewUrlParser: true
    })
}

//handlebars
app.engine("handlebars",
    exphbs({
        defaultLayout: 'main'
    })
)
app.set("view engine", "handlebars")

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);






//Listen on port 3030
app.listen(PORT, function () {
    console.log("App running on port 3030")
})