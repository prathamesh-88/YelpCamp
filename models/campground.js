const mongoose = require('mongoose'),
      Comment = require('../models/user');


var campgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Comment',
        }],
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});



module.exports= mongoose.model("Campground", campgroundSchema);