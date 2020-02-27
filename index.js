require("dotenv").config();
const express = require("express");
const routes = require("./routes/index");
const app = express();
// const db = require('./db');
require("./db");

app.use(express.json());
app.use(routes);

app.use(express.static("public")); //middleware. pass in folder and now every file in that folder has a route created

app.listen(process.env.PORT | 3000, () => {
  console.log("Now listening");
});
