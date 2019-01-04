// Full Documentation - https://www.turbo360.co/docs
const turbo = require("turbo360")({ site_id: process.env.TURBO_APP_ID });
const vertex = require("vertex360")({ site_id: process.env.TURBO_APP_ID });
const router = vertex.router();
const Profile = require("../models/Profile");

router.get("/delete/:id", (req, res) => {
  var query = { _id: req.params.id };
  Profile.deleteOne(query)
    .then(profile => {
      req.flash.success = "<b>" + req.params.id + " Deleted !</b>";
      res.redirect("/");
    })
    .catch(err => {
      res.json({
        confirmation: "Failed"
      });
    });
});

router.get("/updateForm/:id", (req, res) => {
  var query = { _id: req.params.id };
  req.session.updateValue = null;
  req.flash.errors = null;
  Profile.findById(query)
    .then(profile => {
      req.session.updateValue = profile;
      res.redirect("/update");
    })
    .catch(err => {
      res.json({
        confirmation: "Failed"
      });
    });
});

router.post("/updateProfile", (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let age = req.body.age;
  let position = req.body.position;
  let team = req.body.team;
  let id = req.body.getID;

  req.checkBody("firstName", "First Name is required").notEmpty();
  req.checkBody("lastName", "Last Name is required").notEmpty();
  req
    .checkBody("age", "Age is required")
    .notEmpty()
    .isInt();
  req.checkBody("position", "Position is required").notEmpty();
  req.checkBody("team", "Team is required").notEmpty();

  var errors = req.validationErrors(true);

  if (errors) {
    req.flash.errors = errors;
    req.session.updateValue = req.body;
    res.redirect("/update");
  } else {
    Profile.findByIdAndUpdate(id, req.body, { new: true })
      .then(profile => {
        req.flash.success = "<b>" + id + " Successfully Updated !</b>";
        res.redirect("/");
      })
      .catch(err => {
        res.json({
          confirmation: "Failed",
          message: err.message
        });
      });
  }
});

//Remove
router.get("/profile/remove", (req, res) => {
  const query = req.query;
  const profileId = query.id;
  //delete query["id"];

  Profile.findByIdAndRemove(profileId)
    .then(profiles => {
      res.json({
        confirmation: "success",
        data: "Profile ID =" + profileId + " Successfully Deleted"
      });
    })
    .catch(err => {
      res.json({
        confirmation: "Failed",
        message: err.message
      });
    });
});

router.get("/profile", (req, res) => {
  Profile.find()
    .then(profiles => {
      res.json({
        confirmation: "success",
        data: profiles
      });
    })
    .catch(err => {
      res.json({
        confirmation: "Failed",
        message: err.message
      });
    });
});

router.post("/profile", (req, res) => {
  //console.log(req.body);
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let age = req.body.age;
  let position = req.body.position;
  let team = req.body.team;

  req.checkBody("firstName", "First Name is required").notEmpty();
  req.checkBody("lastName", "Last Name is required").notEmpty();
  req
    .checkBody("age", "Age is required")
    .notEmpty()
    .isInt();
  req.checkBody("position", "Position is required").notEmpty();
  req.checkBody("team", "Team is required").notEmpty();

  var errors = req.validationErrors(true);
  if (errors) {
    req.flash.errors = errors;
    req.flash.success = false;
    req.flash.formValue = req.body;

    res.redirect("/");
  } else {
    req.flash.success = "<b>Successfully Inserted !</b>";
    Profile.create(req.body)
      .then(profile => {
        res.redirect("/");
      })
      .catch(err => {
        res.json({
          confirmation: "Failed",
          message: req.body
        });
      });
  }
});

module.exports = router;
