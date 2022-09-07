"use strict";

const express = require("express");
const morgan = require("morgan"); // logging middleware
const userDao = require("./UserDataAccess"); // module for accessing the DB
const courseDao = require("./CourseDataAccess"); // module for accessing the DB
const cors = require("cors");

// Passport-related imports
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");

// init express
const app = express();
const port = 3001;

// set up the middlewares
app.use(morgan("dev"));
app.use(express.json()); // for parsing json request body

// set up and enable cors
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// Passport: set up local strategy
passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    const user = await userDao.getUser(username, password);
    if (!user) return cb(null, false, "Incorrect username or password.");

    return cb(null, user);
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  // this user is id + email + name
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

app.use(
  session({
    secret: "shhhhh... it's a secret!",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.authenticate("session"));

/*** Course APIs ***/

// GET /api/courses
app.get("/api/courses", (req, res) => {
  courseDao
    .listCourses()
    .then((courses) => {
      res.status(200).json(courses);
    })
    .catch((reason) => {
      res.status(500).json(reason);
    });
});

// GET /api/usercourses
app.get("/api/usercourses", (req, res) => {
  courseDao
    .listUserCourses()
    .then((usercourses) => {
      res.status(200).json(usercourses);
    })
    .catch((reason) => {
      res.status(500).json(reason);
    });
});

// DELETE /api/usercourses
app.delete("/api/usercourses", async (req, res) => {
  try {
    await courseDao.deleteUserCourses();
    res.status(204).end();
  } catch (err) {
    res
      .status(503)
      .json({ error: `Database error during the deletion of UserCourses.` });
  }
});

// POST /api/usercourse
app.post("/api/usercourse", async (req, res) => {
  try {
    await courseDao.addUserCourse(req.body);
    res.status(201).end();
  } catch (err) {
    res.status(503).json({
      error: `Database error during the creation of UserCourse.`,
    });
  }
});

/*** User APIs ***/

// POST /api/sessions
/*
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});*/

/* If we aren't interested in sending error messages... */

// POST /api/sessions
app.post("/api/sessions", passport.authenticate("local"), (req, res) => {
  res.status(201).json(req.user);
});

// GET /api/sessions/current
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});

// DELETE /api/session/current
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// GET /api/user
app.post("/api/user", async (req, res) => {
  const userID = req.body.id;
  userDao
    .getUserById(userID)
    .then((user) => res.status(200).json(user))
    .catch(() =>
      res.status(503).json({
        error: `Database error during the getting info of user.`,
      })
    );
});

// PUT /api/user
app.put("/api/user", async (req, res) => {
  const idToUpdate = req.body.id;
  const creditsToUpdate = req.body.maxcredits;
  try {
    await userDao.changeMaxCredits(idToUpdate, creditsToUpdate);
    res.status(200).end();
  } catch (err) {
    res.status(503).json({
      error: `Database error during the editing of user.`,
    });
  }
});

// activate the server
app.listen(port, () =>
  console.log(`Server started at http://localhost:${port}.`)
);
