
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
 "userRandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// Routing Functions here

//Main Page


app.get("/register", (req, res) => {

  res.render("registration");
});

app.post("/register", (req, res) => {
   for (var ids in users) {
    for (var email in users[ids]) {
     if (req.body.email == users[ids][email]) {
    res.status("400");
    res.send("This e-mail already exists. Please choose another");
    }
   }
 }if(req.body.email =="" || req.body.password ==""){
      res.status("400");
      res.send("Please enter a valid e-mail and password");
    } else {
      let id = generateRandomString();
      let email = req.body.email;
      let password = req.body.password;
      let newUser = {
        id: id,
        email: email,
        password: password
      };
        users[id] = newUser;
        console.log(users);
       res.cookie("users_id", id);
       res.redirect("/urls");
}
});


app.get("/urls", (req, res) => {
  let title = "URLs";
  let templateVars = {
   title:title,
   urls: urlDatabase,
   id:req.cookies.users_id
 };
 res.render("urls_index", templateVars);
});

app.post("/urls",  (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.redirect("/urls");
});


// Register and Login Pages
app.get("/login", (req, res) => {
  res.render("login")
});

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
    id:req.cookies.users_id,
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
    userid:req.cookies.users_id
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