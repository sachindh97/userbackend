const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const bodyparser = require("body-parser");

// db connections
var db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "company",
});

db.connect((err) => {
  err
    ? console.log("database connection failed ...", err)
    : console.log("database connected ...");
});

app.use(cors());
app.use(bodyparser.json());

// routing
app.post("/create_user", (req, res) => {
  try {
    if (req.body) {
      let insertQry = `INSERT INTO USERS(name,username,password) 
                              values('${req.body.name}','${req.body.username}','${req.body.password}')`;

      db.query(insertQry, (err, result) => {
        if (err) {
          res.json({
            status: false,
            msg: "something went to wrong when inserting data ...",
          });
        }
        if (result) {
          res.json({ status: true, msg: "user created successfully..." });
        }
      });
    } else {
      res.json({ status: false, msg: "please enter all field" });
    }
  } catch (error) {
    res.json({
      status: false,
      msg: "something went to wrong please try again",
    });
  }
});

app.post("/auth", (req, res) => {
  try {
    if (req.body) {
      let chkUsr = `SELECT * FROM users WHERE username='${req.body.username}'`;
      db.query(chkUsr, (error, result) => {
        if (result.length > 0) {
          let checkQry = `SELECT * FROM users WHERE username='${req.body.username}' and password='${req.body.password}'`;
          db.query(checkQry, (error, resp) => {
            if (error) {
              console.log(error, "error");
              res.json({
                status: false,
                msg: "something went to wrong when auth ...",
              });
            }
            if (resp.length > 0) {
              res.json({ status: true, msg: "user found", data: resp });
            } else {
              res.json({ status: false, msg: "user not found" });
            }
          });
        } else {
          res.json({ status: false, msg: "username not found" });
        }
      });
    } else {
      res.json({ status: false, msg: "please enter username and password" });
    }
  } catch (error) {
    console.log(error, "error");
    res.json({
      status: false,
      msg: "something went to wrong please try again",
    });
  }
});

app.get("/get-details", (req, res) => {
  try {
    let checkQry = `SELECT * FROM users order BY id DESC`;
    db.query(checkQry, (err, result) => {
      if (err) {
        console.log(err, "err");
        res.json({
          status: false,
          msg: "something went to wrong when getting details ...",
        });
      }
      if (result.length > 0) {
        res.json({ status: true, msg: "user lists", data: result });
      } else {
        res.json({ status: false, msg: "data not found" });
      }
    });
  } catch (error) {
    res.json({
      status: false,
      msg: "something went to wrong please try again",
    });
  }
});

app.listen(3000, () => {
  console.log("app running");
});