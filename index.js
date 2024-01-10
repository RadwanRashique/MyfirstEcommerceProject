const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

// To connect node.js with data base (library)

const mongoose = require("mongoose");

// pass path   from mongo
mongoose.connect(process.env.MONGO_URL);

const path = require("path");



app.set("view engine", "ejs");
//  for error handling
app.set("views","./views/admin")

// app.use(express.static(path.join(__dirname,'public')))

// to clear cache
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

//  for user routes
const userRoute = require("./routes/userRoute");

// for admin
const adminRoute = require("./routes/adminRoute");
app.use(express.static("public/user"));
app.use(express.static(path.join(__dirname, "/public")));
app.use("/", userRoute);

app.use("/admin", adminRoute);



//  for error page
app.use((req, res) => {

  
  res.status(404).render("404");
  

});




// to conntect public folder to main page for static view
// here public is folder which contain font image....

//  app.use(express.static("public/admin"))
const port=process.env.PORT || 3000
app.listen(port, console.log("server is now running well "));
