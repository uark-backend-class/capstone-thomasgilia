require("dotenv").config();
const express = require("express");
const routes = require("./routes/index");
const app = express();
// const db = require('./db');
require("./db");
const exphbs = require('express-handlebars');

app.use(express.urlencoded({ extended: true }));    ///must be before routes!!!!!! //parses multipart form data
app.use(express.json());    //parses content with type application json
//the header directs to which of the above middleware will be used. the one it doesnt belong to ignores it and it 
//continues to the next
//but if always using forms (no insomnia json etc.) dont need the express json
app.use(routes);

app.use(express.static("public"));        //middleware. pass in folder and now every file in that folder has a route created

app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.listen(process.env.PORT | 3000, () => {
  console.log("Now listening");
});
