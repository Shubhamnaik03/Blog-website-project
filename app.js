//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const multer  = require('multer');
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://admin-shubham:Shub031admin@webapps031.riona.mongodb.net/blogDB");

const postSchema = {
  title: String,
  content: String,
  image: String
}

const Post = mongoose.model("Post", postSchema);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage });

const homeStartingContent = "Create a unique and beautiful blog. It’s easy!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        image: post.image,
        title: post.title,
        content: post.content
      });
    });
  
  });

app.get("/about", function(req, res){
res.render("about");
});

app.get("/compose", function(req, res){
  
  res.render("compose");
  });

  app.post("/compose", upload.single('imageContent'), function(req, res){
    console.log(JSON.stringify(req.file))
    const post = new Post({
      image: req.file.filename,
      title: req.body.textContent,
      content:req.body.postContent
    });


    post.save(function(err){
      if (!err){
          res.redirect("/");
      }
    });
  });

  app.post("/delete", function(req, res){
    const item = req.body.checkbox;
    Post.findByIdAndRemove({_id: item}, function(err, post){
      console.log(item);
      res.redirect("/allPost");
    });
  });

  app.get("/allpost", function(req, res){
    Post.find({}, function(err, posts){
      res.render("allpost", {
        posts: posts
        });
    });
  });


  app.get("/form", function(req, res){
    res.render("form");
    });

app.get("/contact", function(req, res){
  res.render("contact");
  });



  const port = process.env.PORT;
  if(port == null || port == ""){
    port == 3000;
  }
  app.listen(port, function() {
    console.log("Server started on port 3000");
  });