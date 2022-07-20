//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
var _ =require("lodash");

const homeStartingContent = "We are pleased to introduce you a beautiful,comprehensive yet simple journal website,suitable for beginners. Join millions of Daily Journal users and create a healthier, happier mind. A sanctuary for your mind and soul, Daily Journal will help increase your positive energy, be more grateful and a calmer mind by building healthy thinkings through journaling.";
const aboutContent = "Daily journal is a private space to share your thoughts and feelings and whatever comes to your mind as you work. Reflect on your day and keep track of your growth and experiences.";
const contactContent = "Give us your reviews so that we can improve our product. Submit your reviews at rbubna141@gmail.com";

const app = express();
const url="mongodb+srv://rachu141:amsterdam@cluster0.jnefo.mongodb.net/blogDB";
var port=process.env.PORT || 3000;

mongoose.connect(url,{useUnifiedtopology:true}).then(function(ans){
  console.log("Connected Successfully to the server");
});

// 

const postSchema=new mongoose.Schema({
  title:String,
  content:String
});
const Post=mongoose.model("Post",postSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  Post.find({},function(err,docs){

      res.render("home",{title:"Home",content:homeStartingContent,postArray:docs});
  });

//  console.log(posts);
});

app.get("/about",function(req,res){
  res.render("about",{title:"About",content:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{title:"Contact",content:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose",{title:"Compose"});
});

app.post("/compose",function(req,res){
  const post=new Post({
    title:req.body.postTitle,
    content:req.body.postBody
  });
//  posts.push(post);
post.save(function(err){
  if(!err){

    res.redirect("/");
  }
});

// console.log(post);
});

app.get("/posts/:title",function(req,res){
  //console.log(req.params.title);
//  res.render("post",{postArray:posts,searchTitle:req.params.title});
var requestedTitle=_.lowerCase(req.params.title);

Post.find({},function(err,docs){
  docs.forEach(function(post){
    var postTitle=_.lowerCase(post.title);
    if(postTitle===requestedTitle){
  //    console.log("Match found");
      res.render("post",{title:post.title,postContent:post.content});
   }
});



  });
});



app.listen(port, function() {
  console.log("Server started on port 3000");
});
