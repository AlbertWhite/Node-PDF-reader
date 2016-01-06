//documents are the programmers' friends
//expressjs multer: https://github.com/expressjs/multer   https://ewiggin.gitbooks.io/expressjs-middleware/content/multer.html

var app = require("express")();
var http = require("http").Server(app);
var multer = require("multer");
var upload = multer({dest:'uploads/'});//set the destiation for the files uploaded. The files are saved in the same folder as index.js
var filepath = "";

app.get("/",function(req, res){
    res.sendFile(__dirname+"/index.html")
});

app.post('/upload_action', upload.single("pdf"), function (req, res) {
    res.sendFile(__dirname+"/upload.html")
    console.log(req.body);//request.body contains all the text fields
    console.log(req.file);//req.file get the current file
    filepath = req.file.path;
});

app.get("/image.jpg",function(req,res){//send file to image src
    console.log("filepath "+filepath);
    res.sendFile(__dirname+"/"+filepath);
});

http.listen(3000, function(){
    console.log("listening  on 3000");
});