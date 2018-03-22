
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");


function generateRandomString() {
  let randomString = "";
  let charset = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
  for( var i=0; i <=5; i++ )
    randomString += charset.charAt(Math.floor(Math.random() * charset.length));
  return randomString;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

// Routing Functions here

//Main Page


app.get("/register", (req, res) => {

  res.render("registration");
});

app.post("/register", (req, res) => {
   if(!req.body.email || !req.body.password){
      res.status("400");
      res.send("Invalid details!");
   } else {
      users.filter(function(user){
         if(user.email === req.body.email){
            res.send("User Already Exists! Login or choose another user id");
         }
      });
      var newUser = {
        id: generateRandomString(),
        email: req.body.email,
        password:req.body.password};
      users.push(newUser);
   }
  res.redirect("/urls");
});


app.get("/urls", (req, res) => {
  let title = "URLs";
  let templateVars = {
   title:title,
   urls: urlDatabase,
   username:req.cookies["username"]
 };
 res.render("urls_index", templateVars);
});

app.post("/urls",  (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.redirect("/urls");
});


// Register and Login Pages


app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
});

// New URLs

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username:req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

app.post("/urls/new", (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.redirect("/urls");
});

app.post('/urls/:id/delete', (req, res) => {
 delete urlDatabase[req.params.id];
 res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  let longURL =  urlDatabase[req.params.shortURL];
  if(longURL === undefined) {
    res.status(404).send();
    return;
  }
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase,
    username:req.cookies["username"]
  };
  res.render("urls_show",templateVars);
});

app.post('/urls/:id/update', (req, res) =>{
 let newURL = req.body.newURL;
 urlDatabase[req.params.id] = newURL;
 res.redirect('/urls');
});

// Port here
app.listen(PORT, () => {
  console.log(`Welcome to Tinyapp on ${PORT}!`);
});