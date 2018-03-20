  function generateRandomString() {

      var randomString = " ";

      var charset = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";

      for( var i=0; i <=5; i++ )
          randomString += charset.charAt(Math.floor(Math.random() * charset.length));

      return randomString;
  }



  var express = require("express");
  var app = express();
  var PORT = process.env.PORT || 8080;
  var bodyParser = require("body-parser");
  app.use(bodyParser.urlencoded({extended: true}));
  app.set("view engine", "ejs");

  var urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
  };

  app.get("/urls", (req, res) => {
    var title = "URLs";
    var templateVars = {
     title:title,
     urls: urlDatabase
   };
    res.render("urls_index", templateVars);
  });

  app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });

  app.post("/urls",  (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.redirect("/urls");
  });



  app.get("/u/:shortURL", (req, res) => {
    let longURL =  urlDatabase[req.params.shortURL];
    if(longURL === undefined) {
      res.status(404).send();
    }
    res.redirect(longURL);
  });


  app.get("/urls/:id", (req, res) => {
    var templateVars = { shortURL: req.params.id };
    res.render("urls_show", templateVars);
  });







app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});