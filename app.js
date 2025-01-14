"use strict";

/** Express app for vacation-time */

const express = require("express");
const mongoose = require("mongoose");
const { getDatabaseUri } = require("./config");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const hotelsRoutes = require("./routes/hotels");
const flightsRoutes = require("./routes/flights");
// const mytripRoutes = require("./routes/mytrip");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/flights", flightsRoutes);
app.use("/hotels", hotelsRoutes);
// app.use("/mytrip", mytripRoutes);

// -------------------

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

mongoose
  .connect(getDatabaseUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Middleware and routes setup...

module.exports = app;

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
