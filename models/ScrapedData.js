var mongoose = require('mongoose');

var ScrapedSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    link: {
        type: String,
        require: true,
        trim: true
    },
    timeStamp:{
        type: Date,
        require: true,
        trim: true
    },
    time:{
        type: String,
        require: true,
        trim: true
    },
    sub:{
        type: String,
        require: true,
        trim: true
    }
})

var ScrapedData = mongoose.model("ScrapedData", ScrapedSchema);
module.exports = ScrapedData;