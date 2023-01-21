const Campground = require('../models/campground');

const router = require('express').Router(),
      Comment = require('../models/comment'),
      middleware = require('../middleware/index');

//routes
//Jumps to index page
router.get("/", async(req, res) => {
    await Campground.find({}, (err, campgrounds) => {
        if (!err)
            res.render("campgrounds/campground", {
                campgrounds: campgrounds
            });
        else
            console.log("wth");
    });

});


// Creates a campground
router.post("/",middleware.isLoggedIn, (req, res) => {

    let camp = req.body.camp;
    Campground.create(camp, (err, camp) => {
        if (!err){
            camp.owner.id = req.user.id;
            camp.owner.username = req.user.username;
            camp.save();
        }
            
        else
            console.log(err);
    });
    res.redirect("/campground");
});


// New campground form
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/form")
});


// Campground Show
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((err, selectedCamp) => {
        if (err)
            console.log(err);
        else {
            res.render("campgrounds/show", {
                campground: selectedCamp
            });
        }
    });

});

// Render edit form
router.get("/:id/edit",middleware.checkOwnership,(req, res) => {
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                console.log(err);
            } else {
                //Does user own campground
                    res.render("campgrounds/edit", {
                        campground: campground
                    });
            }
        });
});

// Edit PUT route
router.put("/:id",middleware.checkOwnership,(req,res) => {
    Campground.findByIdAndUpdate(req.params.id,req.body.camp,(err,UpdatedCamp)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect(`/campground/${req.params.id}`);
        }
    });
});

// Destroy DELETE route

// Delete/destroy Campground
router.delete("/:id", middleware.checkOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany({
            _id: {
                $in: campgroundRemoved.comments
            }
        }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/campground");
        });
    })
});





module.exports = router;