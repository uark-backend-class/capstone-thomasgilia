require("dotenv").config();
const express = require("express");
const routes = require("./routes/index");
const app = express();
// const db = require('./db');
require("./db");
const exphbs = require('express-handlebars');

app.use(express.json());
app.use(routes);

app.use(express.static("public"));        //middleware. pass in folder and now every file in that folder has a route created

app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT | 3000, () => {
  console.log("Now listening");
});
