//dependencies
//node.js framework
var express = require("express")

// ******************
//bodyParser extracts the entire body portion of an incoming request stream and exposes it on req.body.  This is middleware that no longer is part of Express.js.  Parses the JSON, buffer, string, and URL encoded data submitted using HTTP POST request.
// var bodyParser = require("body-parser")
// ******************

var exphbs = require('express-handlebars')
// ******************
//node.js module for mongodb
var mongojs = require("mongojs")
//JavaScript library used to make HTTP requests from node.js or XMLHttpRequests from the browser. 
var axios = require('axios')
//Cheerio to implement the core of jQuery for the server.
var cheerio = require('cheerio')

//initialze express
var app = express()
var PORT = process.env.PORT || 3030


//MiddleWare
app.use(express.urlencoded({
    extended: false
}))
app.use(express.json())

//Set up static folder (public) for web page
app.use(express.static("public"))
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

// ***********************
// app.use(session({secret: "keyboard cat", resave: true, saveUninitialized: true}))
// app.use(passport.initialize());
// app.use(passport.session());
// ***********************

//handlebars
app.engine("handlebars",
    exphbs({
        defaultLayout: 'main'
    })
)
app.set("view engine", "handlebars")

//routes
// require("./routes/apiRoutes")(app)
// require("./routes/htmlRoutes")(app)

//Database config
var databaseUrl = 'scraper';
var collections = ['scrapedData']

//Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error: ", error)
})




app.get("/", function (req, res) {
    res.render("index");
})


app.get('/all', function (req, res) {
    db.scrapedData.find({}, function (err, data) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.json(data);
        }
    })
})

app.get("/scrape", function (req, res) {
    axios.get('https://old.reddit.com/r/JavaScriptHelp+compsci+computerscience+cscareerquestions+javascript+learnjavascript+node+reactjs/').then(function (response) {

        var $ = cheerio.load(response.data)
        db.collections.remove();
        $("div.top-matter").each(function(i, element){
            var title = $(this).find("a.title").text();
            var link = $(this).find("a:first-child").attr("href");
            var timeStamp = $(this).find("time").attr("title");
            var time = $(this).find("time").text();
            var sub = $(this).find("a.subreddit").text();

            db.scrapedData.insert({
              title: title,
              link: link,
              timeC: timeStamp,
              time: time,
            sub: sub
            })
          })
        //   res.send("Finished")
        db.scrapedData.find({}, function (err, data) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
         
                console.log(data);
                var hbsObject = {
                    entries: data
                }
                console.log(hbsObject)

                res.render("index", hbsObject)
                // res.json(data);
            }
        })
        })
      })


//Listen on port 3030
app.listen(PORT, function () {
    console.log("App running on port 3030")
})