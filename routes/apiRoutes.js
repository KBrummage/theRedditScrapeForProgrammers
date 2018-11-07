// var router = require("express").Router();
//signup call
// var router = require("express").Router();
var db = require("../models")
// var axios = require("axios")
// var cheerio = require('cheerio')

module.exports =
    function (app) {
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
                console.log(userData)

                db.User.create(userData, (err, resp) => {
                    if (err) console.log(err);

                    res.sendStatus(204)})
                    // .then(function () {
                    //     res.sendStatus(204);
                    // })
                    // .catch(function (err) {
                    //     console.log(err);
                    //     res.sendStatus(500);
                    // })
            }
        })

        // If YOU call a function, YOU are 'THIS'.

        //login route
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
                            res.json("")
                            console.log("It's a Match!");
                            console.log(req.session.userId)
                        } else if (!isMatch) {
                            console.log("Not a match")
                        }


                    })



                })
            }
        })

        //getting favorites list
        app.get("/fav/:userID", function(req, res){
            var userID = req.params.userID;
            db.User.find({username: userID})
            .populate('cards')
            .then(function(user){
                var cardArray = [];
                for (var i = 0; i < user[0].cards.length; i++){
                    data = user[0].cards[i];
                    card = {
                        title: data.title,
                        link: data.link,
                        timeStamp: data.timeStamp,
                        time: data.time,
                        sub: data.sub,
                        meta: data.meta
                    }
                    cardArray.push(card)
                }
                console.log(cardArray, "<got to .then");
                // console.log(cardArray + "CardArray")
                // console.log(user.cards)
                var hbsObject = {
                    entries: cardArray
                }
                console.log(hbsObject + " <__hbsObject");
                res.status(200).render("index", hbsObject)
                console.log("went past redner")
        
            })
        })

        //updating favorites list
        app.put("/fav/", function (req, res){
            var userID = req.body.userID;
            var cardID = req.body.cardID;
            console.log(`Made it to server side + "${cardID}", "${userID}"`)
             db.User.findOneAndUpdate({username: userID}, {$push: {cards: cardID}}, function(){
                 res.json("")
             }
             )
            })
        
    }