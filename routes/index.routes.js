const express = require("express");
const Project = require("../models/Project.model");
const User = require("../models/User.model");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  Project.find()
  .then ((projects)=>{
    res.render("index", {projects})
  })
  
  });
router.get("/logged-in", (req, res, next) => {
  const username = req.session.currentUser;
  Project.find()
  .then((allProjects)=> {
    res.render ('logged-index', {username, allProjects})
  })

});

router.get("/profile", (req, res, next) => {
  const username = req.session.currentUser;
  const photo = req.body;

  Project.find({user:username._id})
  .then((allProjects)=> {
    res.render ('profile', {photo, username, allProjects})
  })

});

//route for editing profile
router.get("/edit-profile", (req, res, next) => {
  const currentUser = req.session.currentUser;

  // Fetch the user's data from the database
  User.findById(currentUser._id)
    .then((user) => {
      res.render("edit-profile", { user });
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      next(error);
    });
});
router.post("/edit-profile", (req, res, next) => {
  const currentUser = req.session.currentUser;
  const { name, email, photo, username, userDescription } = req.body;


  User.findByIdAndUpdate(
    currentUser._id,
    { name, email, photo, username, userDescription },
    { new: true }
  )
    .then((updatedUser) => {
      req.session.currentUser = updatedUser; 
      res.redirect("/profile"); 
    })
    .catch((error) => {
      console.error("Error updating user profile:", error);
      next(error);
    });
});

module.exports = router;
