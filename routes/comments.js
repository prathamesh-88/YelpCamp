// Import model and modules
const router = require('express').Router({mergeParams: true}),
      Campground = require('../models/campground'),
      Comment = require('../models/comment'),
      middleware = require('../middleware/index');




//######## ROUTES #################
//New comment Form
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/form", {
                campground: campground
            });
        }
    });

});

// Edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id,(err,comment) => {
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {
                comment: comment,
                campground_id:req.params.id
            });
        }
    });
});

//Update comment in database
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,comment) => {
        if(err){
            res.redirect(`/campground/${req.params.id}`);
        }else{
            res.redirect(`/campground/${req.params.id}`);
        }
    });
});

// Delete route for comments

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
        if(err){
            console.log("error");
        }else{
            req.flash('sucess', "Comment deleted sucessfully");
            res.redirect(`/campground/${req.params.id}`);
        }
    })
})

//Creates comment in db
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash('error', "Something went wrong");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.owner.id = req.user._id;
                    comment.owner.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campground/${req.params.id}`)
                }
            });
        }
    });
});

module.exports = router;
