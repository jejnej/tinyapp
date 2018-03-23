
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
const methodOverride = require('method-override')

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(cookieSession({
  name: 'session',
  keys: ["secret"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

function generateRandomString() {
  let randomString = "";
  let charset = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
  for( let i=0; i <=5; i++ )
    randomString += charset.charAt(Math.floor(Math.random() * charset.length));
  return randomString;
}

const urlDatabase = {
  "b2xVn2": {url: "http://www.lighthouselabs.ca", user_id: 'userRandomID'},
  "9sm5xK": {url: "http://www.google.com", user_id: 'user2RandomID'},

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
};

// middleware
const authenticate = (req, res, next) => {
  if(users[req.session.users_id]) {
    next()
  } else {
    res.redirect('/login')
  }
}

// Routing Functions here



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
      let password = bcrypt.hashSync(req.body.password, 15);
      console.log(password)
      let newUser = {
        id: id,
        email: email,
        password: password
      };
        users[id] = newUser;
        console.log(users);
       req.session.users_id = newUser;
       res.redirect("/urls");
}
});


app.get("/urls", authenticate, (req, res) => {
  let title = "My URLs";
  let templateVars = {
   title:title,
   urls: urlDatabase,
   user: users[req.session.users_id]
 };
 res.render("urls_index", templateVars);
});

app.post("/urls",  (req, res) => {
  urlDatabase[generateRandomString()] = {url: req.body.longURL, user_id: req.session.users_id};
  res.redirect("/urls");
});


// Register and Login Pages
app.get("/login", (req, res) => {
  res.render("login")
});

app.post("/login", (req, res) => {
  for (var ids in users) {
    if (users[ids].email === req.body.email && bcrypt.compareSync(req.body.password, users[ids].password))  {
      req.session.users_id = ids;
      res.redirect("/urls")
      return;
    }
  }
  res.status(401).send("Please check your e-mail and try again or register for an account first.")
});

app.post("/logout", (req, res) => {
      req.session = null;
      // req.session.destroy();
      console.log("user logged out.")
     res.redirect("/urls");
});


   // res.redirect('/login');


// New URLs

app.get("/urls/new", authenticate, (req, res) => {
  let templateVars = {
    user: users[req.session.users_id]
  };

  res.render("urls_new", templateVars);
});


app.post("/urls/new", authenticate, (req, res) => {

  urlDatabase[generateRandomString()] = req.body.longURL;
  res.redirect("/urls");
});

app.delete('/urls/:id', (req, res) => {
 delete urlDatabase[req.params.id];
 res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  let longURL =  urlDatabase[req.params.shortURL].url;
  if(longURL === undefined) {
    res.status(404).send();
    return;
  }
  res.redirect(longURL);
});

app.get("/urls/:id", authenticate, (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase,
    user: users[req.session.users_id]
  };
  res.render("urls_show",templateVars);
});

app.put('/urls/:id', authenticate,(req, res) =>{
 let newURL = req.body.newURL;
 urlDatabase[req.params.id] = newURL;
 res.redirect('/urls');
});

// Port here
app.listen(PORT, () => {
  console.log(`Welcome to Tinyapp on ${PORT}!`);
});