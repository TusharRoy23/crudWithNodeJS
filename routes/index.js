const turbo = require("turbo360")({ site_id: process.env.TURBO_APP_ID });
const vertex = require("vertex360")({ site_id: process.env.TURBO_APP_ID });
const router = vertex.router();

const Profile = require("../models/Profile");

router.get("/", (req, res) => {
  Profile.find()
    .then(profile => {
      res.render("index", {
        profile: profile,
        success: req.flash.success,
        errors: req.flash.errors,
        formValue: req.flash.formValue,
        imageFile: req.flash.imageFile
      });
      req.flash.errors = null;
      req.flash.formValue = null;
      req.flash.success = null;
      req.session.updateValue = null;
      req.flash.imageFile = null;
      req.session.profileImg = null;
    })
    .catch(err => {
      res.status(400).send("Unable to fatch");
    });
});

router.get("/update", (req, res) => {
  Profile.find()
    .then(profile => {
      res.render("update", {
        profile: profile,
        updateValue: req.session.updateValue,
        errors: req.flash.errors,
        imageFile: req.flash.imageFile,
        profileImg: req.session.profileImg,
        success: req.flash.success
      });
      req.flash.imageFile = null;
      req.flash.errors = null;
      req.flash.success = null;
    })
    .catch(err => {
      res.json({
        confirmation: "failed"
      });
    });
});

/*  This route render json data */
router.get("/json", (req, res) => {
  res.json({
    confirmation: "success",
    app: process.env.TURBO_APP_ID,
    data: "this is a sample json route."
  });
});

/*  This route sends text back as plain text. */
router.get("/send", (req, res) => {
  res.send("This is the Send Route");
});

/*  This route redirects requests to Turbo360. */
router.get("/redirect", (req, res) => {
  res.redirect("https://www.turbo360.co/landing");
});

module.exports = router;
