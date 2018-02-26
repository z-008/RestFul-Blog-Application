var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer")
    mongoose   = require("mongoose"),
    express    = require("express"),
    app        = express();


//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer()); //always written after body parser
app.use(methodOverride("_method"));


//MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body  : String,
    created : {type: Date, default: Date.now}


})

var Blog = mongoose.model("Blog",blogSchema);

Blog.create({
	title:"Hello I am Sandeep",
	image:"https://scontent-bom1-1.xx.fbcdn.net/v/t31.0-8/25734200_1696645137053335_3249413580981408431_o.jpg?oh=017cfb1b871b1dd3cae1f874c66e0d27&oe=5B0234A8",
	body:"I am a third year Computer Engineering student.I have done few projects on Android platform and certain other Web frameworks and there are also some which I am working on.I am a Blockchain and AI enthusiast and I am looking for training and research internships in the above fields so that I can improve my skills."

});
//RESTFUL ROUTES

app.get("/",function(req,res){
	res.redirect("/blogs");
});

//INDEX
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err)
		{
			console.log("ERROR!");
		} else {
			res.render("index",{blogs:blogs});
		}
	});
});

//NEW BLOG
app.get("/blogs/new",function(req,res){
	res.render("new");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
	 // create blog
	// req.body.blog.body = req.sanitize(req.body.blog.body) //remove script tags

	Blog.create(req.body.blog,function(err,newBlog){

		if(err)
		{
			res.render("new");
		} else {

			res.redirect("/blogs")
		}
	});
	
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
      if(err){
         res.redirect("/blogs");
     }
         else {
         	res.render("show",{blog:foundBlog})
         }

      


	});

});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){

	Blog.findById(req.params.id,function(err,foundBlog){
      if(err){
         res.redirect("/blogs");
     }
         else {
         	res.render("edit",{blog:foundBlog})
         }

      


	});
 
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body) 
Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
      if(err){
         res.redirect("/blogs");
     }
         else {
         	res.redirect("/blogs/"+req.params.id);
         }

      


	});

   
});


app.delete("/blogs/:id",function(req,res){
 Blog.findByIdAndRemove(req.params.id,function(err){
 	  if(err){
 	  	res.redirect("/blogs");
        }
        else{
        res.redirect("/blogs");
        }
 })
   
});


app.listen(8000,function(){

console.log("The Blog Server is running");

});