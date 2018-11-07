// var router = require("express").Router();
var db = require("../models")
var axios = require("axios")
var cheerio = require('cheerio')

module.exports = 
function(app){
app.get("/", function (req, res) {
    // db.ScrapedData.find({});
    console.log("Test82")
    axios.get('https://old.reddit.com/r/JavaScriptHelp+compsci+computerscience+cscareerquestions+javascript+learnjavascript+node+reactjs/').then(function(response) {

        var $ = cheerio.load(response.data);

        // mongoose.connection.db.dropDatabase();
        $("div.top-matter").each(function (i, element) {
            var title = $(this).find("a.title").text();
            var link = $(this).find("a:first-child").attr("href");
            if (link.indexOf('http') === -1) {
                link = `http://www.reddit.com${link}`
            }
            var timeStamp = $(this).find("time").attr("title");
            var time = $(this).find("time").text();
            var sub = $(this).find("a.subreddit").text();
            // console.log(link);
            var result = {
                title: title,
                link: link,
                timeStamp: timeStamp,
                time: time,
                sub: sub
            }

            db.ScrapedData.create(result)
                .then(function() {
                    res.sendStatus(204);
                })
                .catch(function(err) {
                    console.log(err);
                    res.sendStatus(500)
                })
        })

    })
    db.ScrapedData.find({}, function (err, data) {
        // console.log(data);
        if (err) throw err;
        else {
            var hbsObject = {
                entries: data
            }

            console.log(hbsObject + " <__hbsObject");
            // res.send(hbsObject);
            res.render("index", hbsObject)
        }
    })

    // var defaultUserName = {
    //     email: "KBrummage@gmail.com",
    //     username: "KBrummage",
    //     password: "on"
    // }
    
    // db.User.create(defaultUserName);

})
}
