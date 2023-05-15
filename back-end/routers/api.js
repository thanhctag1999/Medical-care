const express = require("express");
var app = express();

const authRoutes = require("./authRoutes");
const usersRoutes = require("./usersRoutes");

app.use("/auth", authRoutes);
app.use("/user", usersRoutes);

module.exports = app;
