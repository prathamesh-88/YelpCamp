const Campground = require("../models/campground"),
      Comment = require("../models/comment");


module.exports = {
    //MiddleWare
    isLoggedIn : (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error',"You're not logged in! Kindly login to continue");
        res.redirect("/login")
    },

    checkOwnership : (req, res, next) => {
        if (req.isAuthenticated()) {

            Campground.findById(req.params.id, (err, campground) => {
                if (err) {
                    req.flash('error', "Campground not found");
                    res.redirect("back");
                } else {
                    //Does user own campground
                    if (campground.owner.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash('error', "you dont have the required permissions bozo");
                        res.redirect("back")
                    }

                }
            })
        } else {
            req.flash('error', "You need to log in");
            res.redirect("back");
        }

    },

//TO check the ownership of the comment
    checkCommentOwnership : (req, res, next) => {
        if (req.isAuthenticated()) {

            Comment.findById(req.params.comment_id, (err, comment) => {
                if (err) {
                    req.flash('error', "Comment not found");
                    res.redirect("back");
                } else {
                    //Does user own campground
                    if (comment.owner.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash('error', "You dont have the required permissions");
                        res.redirect("back")
                    }

                }
            });
        } else {
             req.flash('error', "You need to log in");
            res.redirect("back");
        }

    }
}