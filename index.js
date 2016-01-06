//documents are the programmers' friends
//expressjs multer: https://github.com/expressjs/multer   https://ewiggin.gitbooks.io/expressjs-middleware/content/multer.html

var app = require("express")();
var http = require("http").Server(app);
var multer = require("multer");
var upload = multer();

app.get("/",function(req, res){
    res.sendFile(__dirname+"/index.html")
});

app.post('/upload_action', upload.single("pdf"), function (req, res) {
    res.send("Thank you");
    console.log(req.body);//request.body contains all the text fields
    console.log(req.file);//req.file get the current file
});

http.listen(3000, function(){
    console.log("listening  on 3000");
});