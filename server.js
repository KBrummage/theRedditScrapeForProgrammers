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
var axios = require('axios')
//Cheerio to implement the core of jQuery for the server.
var cheerio = require('cheerio')

//initialze express
var app = express()

var session = require('express-session');
//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false
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
mongoose.connect("mongodb://localhost/scrape", {
    useNewUrlParser: true
});


//handlebars
app.engine("handlebars",
    exphbs({
        defaultLayout: 'main'
    })
)
app.set("view engine", "handlebars")


// db.ScrapedData.create({
//         name: "Card Data"
//     }).then(function (card) {
//         console.log("Card Created");
//     })
//     .catch(function (err) {
//         console.log(err.message);
//     })


app.get("/", function (req, res) {
    // db.ScrapedData.find({});

    axios.get('https://old.reddit.com/r/JavaScriptHelp+compsci+computerscience+cscareerquestions+javascript+learnjavascript+node+reactjs/').then(function (response) {

        var $ = cheerio.load(response.data);

        mongoose.connection.db.dropDatabase();
        $("div.top-matter").each(function (i, element) {
            var title = $(this).find("a.title").text();
            var link = $(this).find("a:first-child").attr("href");
            if (link.indexOf('http') === -1) {
                link = `http://www.reddit.com${link}`
            }
            var timeStamp = $(this).find("time").attr("title");
            var time = $(this).find("time").text();
            var sub = $(this).find("a.subreddit").text();
            console.log(link);
            var result = {
                title: title,
                link: link,
                timeStamp: timeStamp,
                time: time,
                sub: sub
            }

            db.ScrapedData.create(result)
                .then(function (card) {
                    console.log(card);
                })
                .catch(function (err) {
                    console.log(err)
                })
        })

    })
    db.ScrapedData.find({}, function (err, data) {
        console.log(data);
        if (err) throw err;
        else {
            var hbsObject = {
                entries: data
            }
            console.log(hbsObject + " <__hbsObject");
            res.render("index", hbsObject)
        }
    })

})


app.post("/user", function (req, res) {
    console.log("server side" + req.body.username)
    if (req.body.email &&
        req.body.username &&
        req.body.password) {

        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        }

        db.User.create(userData, function (error, user) {
            if (error) {
                throw error
            } else {
                req.session.userId = user._id;

            }
        })
    }
})

app.post("/verify", function (req, res, next) {
    console.log(req.body);
    if (req.body.userName && req.body.password) {
        db.User.findOne({
            username: req.body.userName
        }, function (err, user) {
            if (err) throw err;
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (err) throw err;
                else if (isMatch) {
                    req.session.userId = user._id;
                    console.log("It's a Match!")
                }
                else if(!isMatch){
                    console.log("Not a match")
                }


            })



        })
    }
})



//Listen on port 3030
app.listen(PORT, function () {
    console.log("App running on port 3030")
})