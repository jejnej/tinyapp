
  var express = require("express");
  var app = express();
  var PORT = process.env.PORT || 8080;
  var bodyParser = require("body-parser");
  var cookieParser = require('cookie-parser')

    function generateRandomString() {

      var randomString = " ";

      var charset = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";

      for( var i=0; i <=5; i++ )
          randomString += charset.charAt(Math.floor(Math.random() * charset.length));

      return randomString;
  }

  var urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
  };

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cookieParser());
  app.set("view engine", "ejs");

// Routing Functions here
  app.get("/urls", (req, res) => {
    var title = "URLs";
    var templateVars = {
     title:title,
     urls: urlDatabase,
     username:req.cookies["username"]
   };
    res.render("urls_index", templateVars);
  });

  app.post("/login", (req, res) => {
    res.cookie("username", req.body.username);
    res.redirect("/urls");
  });

app.post("/logout", (req, res) => {
    res.clearCookie('username', req.body.username);
    res.redirect("/urls");
  });

  app.get("/urls/new", (req, res) => {
    var templateVars = {
      username:req.cookies["username"]
    };
    res.render("urls_new", templateVars);
  });

  app.post("/urls/new",  (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.redirect("/urls", templateVars);
  });

 app.post('/urls/:id/delete', (req, res) => {
 delete urlDatabase[req.params.id];
 res.redirect('/urls');
});

  app.get("/u/:shortURL", (req, res) => {
    var longURL =  urlDatabase[req.params.shortURL];
    if(longURL === undefined) {
      res.status(404).send();
    }
    res.redirect(longURL);
  });

  app.get("/urls/:id", (req, res) => {
    var templateVars = {
      shortURL: req.params.id,
      urls: urlDatabase,
      username:req.cookies["username"]
    };
    res.render("urls_show",templateVars);
  });

  app.post('/urls/:id/update', (req, res) =>{
 var newURL = req.body.newURL;
 urlDatabase[req.params.id] = newURL;
 res.redirect('/urls');
});

// Port here
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});