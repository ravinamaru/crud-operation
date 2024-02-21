const {faker} = require("@faker-js/faker"); //faker is use to generate fake data
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodoverride = require("method-override");
const {v4: uuidv4} = require("uuid");

app.use(methodoverride("_method"));
app.use(express.urlencoded({extended: true}));  //to parse form data

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'Ravina@2003',
  database : 'delta_app'
});

//for create random user
let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

app.listen("8080", () => {
  console.log("listening for request");
});

//count of user
app.get("/", (req,res) => {
  let q = "select count(*) from user";
  try{
      connection.query(q, (err, result) => {
        if(err) throw err;
        let count = result[0]['count(*)'];
        res.render("home.ejs", {count});  //res=get route, result=query result
      });  
    }
    catch(err){
      console.log(err);
      res.send("some error occurers");
    }
});

//view data
app.get("/user", (req,res) => {
  let q = "select * from user";
  try{
    connection.query(q, (err, result) => {
      if(err) throw err;
      let data = result;
      res.render("user.ejs", {data});  //res=get route, result=query result
    });  
  }
  catch(err){
    console.log(err);
    res.send("some error occurers");
  }
});

//add new user
app.get("/user/new",(req, res) => {
  res.render("new.ejs");
});

app.post("/user", (req, res) => {
  console.log(req.body);
  let id = uuidv4();
  let {username: newuser, email: newemail, password: newpass} = req.body;
  let q4 = `INSERT INTO user VALUES('${id}', '${newuser}', '${newemail}', '${newpass}')`;
  connection.query(q4, (err, result) => {
    if(err) throw err;
    res.send(result);
  });
});

//edit username
app.get("/user/:id/edit", (req, res) => {
  let {id} = req.params;
  let q = `select * from user where id='${id}'`;
  try{
    connection.query(q, (err, result) => {
      if(err) throw err;
      // console.log(result);
      // console.log(result[0]);
      let user = result[0];
      res.render("edit.ejs", {user});
    });  
  }
  catch(err){
    console.log(err);
    res.send("some error occurers");
  }
});
 
//update route
app.patch("/user/:id", (req, res) => {
  let {id} = req.params;
  let {password: formpass, username: newUsername} = req.body;
  let q = `select * from user where id='${id}'`;    //step-1
  try{
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      if(formpass != user.password){    //step-2
        res.send("WRONG password");
      }
      else{
        let q2 = `UPDATE user SET name='${newUsername}' WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if(err) throw err;
          res.redirect("/user");
        });
      }
    });  
  }
  catch(err){
    console.log(err);
    res.send("some error occurers");
  }
});

//delete records
app.get("/user/:id/delete", (req, res) => {
  let {id} = req.params;
  let q = `select * from user where id='${id}'`;
  try{
    connection.query(q, (err, result) => {
      if(err) throw err;
      // console.log(result);
      // console.log(result[0]);
      let user = result[0];
      res.render("delete.ejs", {user});
    });  
  }
  catch(err){
    console.log(err);
    res.send("some error occurers");
  }
});

app.delete("/user/:id", (req, res) => {
  let {id} = req.params;
  let {password, email} = req.body;
  let q = `select * from user where id='${id}'`;
  try{
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      if(password == user.password && email == user.email){
        let q3 = `DELETE FROM user where id='${id}'`
        connection.query(q3, (err, result) => {
          if(err) throw err;
          res.redirect("/user");
        });
      }else{
        res.send("WRONG Password or Email");
      }
    });
  }
  catch(err){
    console.log(err);
    res.send("Some error occurs");
  }
});


//inserting data
// let q = "INSERT INTO user (id, name, email, password) VALUES ?";
// let data = [];
// for(let i=1; i<=100; i++){
//   data.push(getRandomUser());  //100 fake data push in array
// }

// try{
//   connection.query(q, [data], (err, result) => {
//     if(err) throw err;
//     console.log(result);
//   });  
// }
// catch(err){
//   console.log("its error",err);
// }

// connection.end();

