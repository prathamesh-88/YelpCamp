const mongo = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new mongo.Schema({
    username: String,
    password : String,

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongo.model("User",userSchema);