require("dotenv").config();
const express = require("express");
const routes = require("./routes/index");
const app = express();
require("./db");
const exphbs = require('express-handlebars');

app.use(express.urlencoded({ extended: true }));    
app.use(express.json());    
app.use(routes);

app.use(express.static("public"));        
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.listen(process.env.PORT || 3000, () => {
  console.log("Now listening");
});
