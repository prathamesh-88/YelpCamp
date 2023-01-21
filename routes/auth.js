const router = require('express').Router(),
      passport = require('passport'),
      User = require('../models/user');


// Landing
router.get("/", (req, res) => {
    res.render("home");
});
// AUTH ROUTE
//show login form
router.get("/login", (req, res) => {
    res.render("login");
});

router.post('/login', passport.authenticate("local", {
    successRedirect: '/campground',
    failureRedirect: "/login"
}), (req, res) => {
    // res.send("Whatevs");
})

//show register form
router.get('/register', (req, res) => {
    res.render("register")
});

router.post("/register", (req, res) => {
    User.register(new User({
        username: req.body.username
    }), req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success",`Sucessfully registered ${req.user.username}`);
            res.redirect('/campground');
        });

    });
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", `Logged you out sucessfully`);
    res.redirect('/campground');
});


module.exports = router;
