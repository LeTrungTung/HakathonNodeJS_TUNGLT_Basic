const express = require("express");
const route = express.Router();
const path = require("path");
const fs = require("fs");

const pathUser = path.join(__dirname, "../resources/users.json");

module.exports = route;
