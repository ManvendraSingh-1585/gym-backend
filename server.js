const mysql = require("mysql2");
const express = require("express");
const session = require('express-session');
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
const db = mysql.createConnection({
    host: "sql12.freesqldatabase.com",
    user: "sql12670908",
    password: "HfsuyHCj65",
    database: "sql12670908"
});

db.connect((err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Connected to database Gym");
    }
});

app.use(
    session({
        secret: 'Reiden',
        resave: false,
        saveUninitialized: true,
    })
);
app.use(express.json()); // To parse JSON data
app.use(express.urlencoded({ extended: true }));

app.post("/signup", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var age = req.body.age;
    var gender = req.body.gender;
    var phone = req.body.phone;
    var batchTime = req.body.batch_time;
    var startDate = req.body.start_date;
    var password = req.body.password;
    console.log(age);
    console.log(batchTime);
    console.log(startDate);
    console.log(phone);
    // Validate age
    if (age < 18 || age > 65) {
        res.status(400).json({ status: false, message: "Age must be between 18 and 65." });

        return;
    }

    const query = `
    INSERT INTO user (user_name, user_email, user_age, user_gender, user_phone, user_batch_time, user_start_date, user_password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [name, email, age, gender, phone, batchTime, startDate, password], (err, result) => {
        if (err) {
            res.status(400).json({ status: false, message: "Enter Correct details!!" });
        } else {
            const user = {
                user_id: result.insertId,
                user_name: name,
                user_email: email,
                user_age: age,
                user_gender: gender,
                user_phone: phone,
                user_batch_time: batchTime,
                user_start_date: startDate,
                user_password: password
            };
            res.status(200).json({ status: true, user });
        }
    });
});


app.post("/login", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  db.query("SELECT * FROM user WHERE user_email=? AND user_password=?", [email, password], function (err, result) {
      if (err) {
          res.status(400).json({ status: false, message: "Enter Correct details!!" });
      } else {
          if (result.length > 0) {
              const user = result[0];
              if (user.fee_status === false) {
                  res.status(200).json({ status: true, paymentRequired: true, ...user });
              } else {
                  res.status(200).json({ status: true, paymentRequired: false, ...user });
              }
          } else {
              res.status(400).json({ status: false, message: "Enter Correct details!!" });
          }
      }
  });
});



app.put("/updateBatchTime/:userId", (req, res) => {
  const userId = req.params.userId;
  const newBatchTime = req.body.newBatchTime;

  const updateQuery = `
  UPDATE user 
  SET user_batch_time = ? 
  WHERE user_id = ?
  `;

  db.query(updateQuery, [newBatchTime, userId], (err, result) => {
      if (err) {
          res.status(500).json({ status: false, message: "Failed to update batch time." });
      } else {
          if (result.affectedRows > 0) {
              res.status(200).json({ status: true, message: "Batch time updated successfully." });
          } else {
              res.status(404).json({ status: false, message: "User not found." });
          }
      }
  });
});




app.listen(8000, () => {
    console.log("running server");
});
