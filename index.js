const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "/views"));



// Create the connection to database
const connection =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'samiya@2804'
  });

  let getrandomUser = ()=>{
    return [
       faker.string.uuid(),
      faker.internet.userName(),
       faker.internet.email(),
     faker.internet.password(),
    ];
};

//home route 


app.get("/" , (req,res)=>{
  let q = `SELECT count(*) FROM user`;
  try{ //sari table dikhti hai
    connection.query( q ,  (err,result)=>{
        if(err) throw err;
        let count = result[0]["count(*)"];
        res.render("home.ejs", {count} );
      });

  }catch(err){
    res.send("some error in database");
  }
});

// show route ---> user

app.get("/user" , (req,res)=>{
  let q = `SELECT * FROM user`;
  try{ //sari table dikhti hai
    connection.query( q ,  (err,users)=>{
        if(err) throw err;
       // in object
        res.render("show.ejs", {users} );
        
      });

  }catch(err){
    res.send("some error in database");
  }
});

// EDIT ROUTE -----> username based on right password

app.get("/user/:id/edit" ,(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id= '${id}'`;
  try{ //sari table dikhti hai
    connection.query( q ,  (err,result)=>{
        if(err) throw err;
       // in object
       let user = result[0];
        res.render("edit.ejs", {user});
        
      });

  }catch(err){
    console.log(err);
    res.send("some error in database");
  }

});
// Update Route ---> username change in DATA BASE
app.patch("/user/:id" ,(req,res)=>{
  let {id} = req.params;
  let {username,password } = req.body;
  let q = `SELECT * FROM user WHERE id= '${id}'`;
  try{ //sari table dikhti hai
    connection.query( q ,  (err,result)=>{
        if(err) throw err;
       // in object
       let user = result[0];
       if( user.password!= password){
        res.send(`Password Incorrect ! sorry cannot update the username :( `)
       }else{
         let q2 =  `UPDATE user SET username = '${username}' WHERE id = '${id}'`;
         connection.query( q2 , (err , result) =>{
             if(err) throw err;
             else{
              console.log("updated!");
             res.redirect("/user");
             }
         });
       }
      });

  }catch(err){
    res.send("some error in database");
  }
});
// query ------> to insert new user
app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});


app.post("/user/new", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();
  //Query to Insert New User
  let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("added new user");
      res.redirect("/user");
    });
  } catch (err) {
    res.send("some error occurred");
  }
});

// DELETE-----> THE USER
app.get("/user/:id" ,(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id= '${id}'`;
  try{ 
    connection.query( q ,  (err,result)=>{
        if(err) throw err;
       let user = result[0];
        res.render("delete.ejs", {user});
    
      });
    }catch(err){
      res.send("some error in database");
    }
  
  });

app.delete("/user/:id" , (req,res)=>{
   let {id} = req.params;
   let {password} = req.body;
  let q = `SELECT * FROM user WHERE id= '${id}'`;
try{
  connection.query( q , (err , result)=>{
    if(err) throw err;
       let user = result[0];

       if( user.password!= password){
        res.send(`Password Incorrect ! sorry cannot delete the user :( `);
       }else{
        let q2 = `DELETE FROM user WHERE id='${id}'`;
        connection.query(q2, (err, result)=>{
          if(err) throw err;
          else{
            console.log(result);
            console.log("deleted!");
            res.redirect("/user");
          }
        });
       } 
  });
}catch(err){
  res.send("some error with DB");}
});
  

app.listen("8080" , ()=>{
  console.log("server is listening to port 8080");
});
