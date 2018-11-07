var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    cards: [{
        type: Schema.Types.ObjectId,
        unique: true,
        ref: "ScrapedData"
    }]
})

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    console.log(this + "<--this")
    bcrypt.hash(user.password, 10, function (err, hash) {
        console.log("Before if error")
        if (err) {
            console.log(err + "err throw line 34")
            return next(err);
        }
        user.password = hash;
        console.log("Got past err throw on line 33")
        next();
    })
});

UserSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}


var User = mongoose.model("User", UserSchema);
module.exports = User;