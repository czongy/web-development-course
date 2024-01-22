import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import "dotenv/config";

const app = express();
const port = 3000;
const saltRounds = 10;

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 5000 * 60,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/secrets", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const result = await db.query("SELECT DISTINCT secret FROM users WHERE email = $1", 
      [req.user.email]);
      const user_secret = result.rows[0].secret;
      
      if (user_secret) {
        res.render("secrets.ejs", {secret:user_secret});
      } else {
        res.render("secrets.ejs", {secret:"You should submit a secret!"});
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect("/login");
  }

});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit.ejs");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    res.redirect("/");
  })
})

app.post("/register", async (req, res) => {
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      req.body.username,
    ]);

    if (checkResult.rows.length > 0) {
      req.redirect("/login");
    } else {
      bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        if (err) {
          console.error(err);
        } else {
          const result = await db.query(
            "INSERT INTO users(email, password) VALUES($1, $2) RETURNING *",
            [req.body.username, hash]
            );
          const user = result.rows[0];
          req.login(user, (err) => {
            console.log(err);
            res.redirect("/secrets");
          });
        }
      });
    }
  } catch (err) {
    if (err.code == 23505) {
      res.send("Email already exists. Try logging in.");
    } else {
      console.error(err);
    }
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

// USING PLAIN USERNAME AND PASSWORD VERIFICATION
// try {
//   const resp = await db.query("SELECT * FROM users WHERE email = $1",
//   [req.body.username]);

//   if (resp.rows.length > 0) {
//     bcrypt.compare(req.body.password, resp.rows[0].password, (err, result) => {
//       if (err) {
//         console.error(err);
//       } else {
//         if (result) {
//           res.render("secrets.ejs");
//         } else {
//           res.send("Incorrect password. Please try again.");
//         }
//       }
//     });
//   } else {
//     res.send("Incorrect email. Please try again.");
//   }
// } catch (err) {
//   console.error(err);
// }
// });

app.post("/submit", async (req, res) => {
  try {
    await db.query("UPDATE users SET secret = $1 WHERE email = $2", 
    [req.body.secret, req.user.email]);
    res.redirect("/secrets");
  } catch (err) {
    console.log(err);
  }
});

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const resp = await db.query("SELECT * FROM users WHERE email = $1", [username]);

      if (resp.rows.length > 0) {
        const user = resp.rows[0];
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            return cb(err);
          } else {
            if (result) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      return cb(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      useProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [profile.email])
        if (result.rows.length === 0) {
          const newUser = await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [profile.email, "google"]);
          cb(null, newUser.rows[0]);
        } else {
          cb(null, result.rows[0])
        }
      } catch (err) {
        cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
