var express = require('express');
var path=require('path');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var dburl = "mongodb://adminwormvijaicv:Krish%401997@bookworm-shard-00-00-b3joy.mongodb.net:27017,bookworm-shard-00-01-b3joy.mongodb.net:27017,bookworm-shard-00-02-b3joy.mongodb.net:27017/test?ssl=true&replicaSet=bookworm-shard-0&authSource=admin"
var bodyparser = require('body-parser');
var validator = require('validator');
var bcrypt = require('bcrypt');
var db;
app.use(express.json());
app.use(express.static('build'));
app.use(bodyparser.urlencoded({
        extended: true
}));

app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname+"/build/index.html"));
})

MongoClient.connect(dburl, function (err, client) {
        if (err) {
                console.log("could'nt connect to database => " + err)
        };
        db = client.db("Userdata");
        console.log("conected");
})

app.post('/signup', function (req, response) {
        var username = req.body.username;
        var email = req.body.email;
        var pass = req.body.pass;
        var hashcode = ""
        if (validator.isAlphanumeric(username)) {
                if (validator.isEmail(email)) {
                        console.log("valid email");
                        bcrypt.genSalt(10, function (err, salt) {
                                bcrypt.hash(pass, salt, function (err, hash) {
                                        console.log("hashing");
                                        if (err) throw err;
                                        hashcode = hash;
                                        console.log("hashcode="+hash);
                                        newobj = {
                                                username: username,
                                                email: email,
                                                pass: hashcode,
                                                books: [],
                                                following:[]
                                        }

                                        db.collection("userinfo").find({ email: email }).toArray(function (err, data) {
                                                console.log("length=" + data.length);
                                                if (data.length != 0) {
                                                        console.log(data);
                                                        response.json({ status: "An account has already been registered for this email" });
                                                }
                                                else {
                                                        db.collection("userinfo").insertOne(newobj, function (err, res) {
                                                                if (err) {
                                                                        response.json({ status: "unable to add user" });
                                                                        console.log(err);
                                                                } else {
                                                                        response.json({ status: "user added" });
                                                                        console.log("document inserted");
                                                                }
                                                        });
                                                }
                                        })
                                })
                        })
                }
        }
})


app.post("/login", function (req, res) {
        var log_u = req.body.email;
        var log_pass = req.body.password;
        db.collection("userinfo").find({ email: log_u }, { id: false }).toArray(function (err, data) {
                if (err) {
                        res.json({ isValid: false, cause: "Unable to acess user data" });
                }
                else if (data.length == 0) {
                        res.json({ isValid: false, cause: "Invalid username or password" });
                }
                else {
                        var actualpass = data[0].pass;
                        bcrypt.compare(log_pass, actualpass, function (err, resp) {
                                if (resp == true) {
                                        res.json({ isValid: true, cause: data[0].username });
                                }
                                else {
                                        res.json({ isValid: false, cause: "Invalid details" });
                                }
                        });

                }


        });


})

app.post("/add", function (request, response) {
        var bookid = request.body.id;
        var email = request.body.email;
        console.log(email);
        console.log(bookid);
        db.collection("userinfo").update({ email: email }, { $push: { books: { bookid: bookid, note: "", status: "not reading" } } }, function (err, res) {
                if (err) {
                        response.json({ status: false, cause: "server error try again" });
                }
                response.json({ status: true });
        });


})

app.post("/remove", function (request, response) {
        var bookid = request.body.id;
        var email = request.body.email;
        console.log(email);
        console.log(bookid);
        db.collection("userinfo").update({ email: email }, { $pull: { books: { bookid: bookid } } }, function (err, res) {
                if (err) {
                        response.json({ status: false, cause: "server error try again" });
                }
                response.json({ status: true });
        });


})

app.post("/books", function (req, res) {
        var email = req.body.email;
        db.collection("userinfo").find({ email: email }).project({ "books.bookid": 1, _id: 0 }).toArray(function (err, data) {
                console.log(data[0]);
                res.json({ books: data[0].books });
        })

})

app.post("/savenote", function (req, resp) {
        var email = req.body.email;
        var bookid = req.body.bookid;
        var note = req.body.note;
        db.collection("userinfo").updateOne({ email: email, "books.bookid": bookid }, { $set: { "books.$.note": note } }, function (err, res) {
                if (err) {
                        resp.json({ status: "server error try again" });
                }
                resp.json({ status: "note saved" });
        })

})


app.post("/getnote", function (req, resp) {
        var email = req.body.email;
        var bkid = req.body.bookid;
        db.collection("userinfo").find({ email: email }).toArray(function (err, data) {
                var datum = data[0].books;
                var obj = datum.find(o => o.bookid === bkid);
                if (obj) {
                        resp.json({ note: obj.note, status: obj.status });
                }
        })

})

app.post("/status", function (req, response) {
        var email = req.body.email;
        var bookid = req.body.id;
        var status = req.body.status;
        db.collection("userinfo").updateOne({ email: email, "books.bookid": bookid }, { $set: { "books.$.status": status } }, function (err, res) {
                if (err) {
                        console.log(err);
                        response.json({ saved: false });
                }
                response.json({ saved: true });
        })


})


app.post("/searchothers",function(req,res){
  var searchterm=req.body.searchterm;
  db.collection("userinfo").find({username:searchterm}).project({_id:0,username:1,email:1,"books.bookid":1,"books.status":1}).toArray(function(err,data){
          res.json({list:data});
  })
})

app.post("/follow",function(req,resp){
        var usermail=req.body.usermail;
        var email=req.body.email;
        var name=req.body.name;
        db.collection("userinfo").updateOne({email:usermail},{$push:{following:{email:email,name:name}}},function(err,res){
                if (err) {
                        console.log(err);
                        resp.json({ following: false });
                }  
                resp.json({ following: true }); 
        })
})

app.post("/getfollowing",function(req,resp){
        var email=req.body.email;
        db.collection("userinfo").find({email:email}).project({_id:0,following:1}).toArray(function(err,data){
                if (err) {
                        console.log(err);
                        resp.json({ available: false });
                }
                resp.json({ vailable:true,flist: data[0].following}); 
        })
})



app.post("/unfollow",function(req,resp){
        var email=req.body.email;
        var usermail=req.body.usermail;
        db.collection("userinfo").update({email:usermail},{$pull:{following:{email:email}}},function(err,res){
                if (err) {
                        console.log(err);
                        resp.json({ following: false });
                }  
                resp.json({ following: true }); 
        })
})


app.post("/booklstof",function(req,resp){
        var targetemail=req.body.email;
        db.collection("userinfo").find({email:targetemail}).project({_id:0,"books.bookid":1,"books.status":1}).toArray(function(err,data){
                if (err) {
                        console.log(err);
                        resp.json({ available: false });
                }  
                resp.json({ available: true,bklst:data[0].books });
        })
})
var server = app.listen(process.env.PORT, function () {
        var host = server.address().address
        var port = server.address().port
        console.log("app listening at http://%s:%s", host, port)
})