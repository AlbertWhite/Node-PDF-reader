//documents are the programmers' friends
//expressjs multer: https://github.com/expressjs/multer   https://ewiggin.gitbooks.io/expressjs-middleware/content/multer.html

var app = require("express")();
var http = require("http").Server(app);
var multer = require("multer");
var upload = multer({dest:'uploads/'});//set the destiation for the files uploaded. The files are saved in the same folder as index.js
var filepath = "";
var io = require("socket.io")(http);
var comments = [];
var filename = "";
var fileList = [];

app.get("/",function(req, res){
    res.sendFile(__dirname+"/index.html")
});




app.get("/askforsrc",function(req,res){//send file to image src
    //console.log("filepath "+filepath);
    res.contentType("application/pdf");
    console.log("before "+__dirname+"/"+filepath);
    res.sendFile(__dirname+"/"+filepath);
});

http.listen(3000, function(){
    console.log("listening  on 3000");
});

io.on("connection",function(socket){

    socket.on("filename",function(msg){
        filename = msg;
        app.post('/'+filename, upload.single("pdf"), function (req, res) {
            console.log("inside "+filename);
            res.sendFile(__dirname+"/upload.html")
            //console.log("post function");//request.body contains all the text fields
            //console.log(req.file);//req.file get the current file
            filepath = req.file.path;

            var file = {name:req.file.originalname, path:filepath};
            fileList.push(file);
            //console.log(fileList);
        });
    });

    console.log("a user has connected");
    io.emit("initial",comments);
    socket.on("message", function(msg){
        comments.push(msg);
        io.emit("message", msg);
    });
    socket.on("filelist", function(msg){
        io.emit("filelist", fileList);
    });
    socket.on("changepdf", function(msg){
        //console.log(__dirname+"/"+fileList[msg - 1].path);

        //io.emit("changepdf",__dirname+"/"+fileList[msg - 1].path);
        app.get("/askforsrc",function(req,res){//send file to image src
            //console.log("filepath "+filepath);
            res.contentType("application/pdf");
            //console.log("before "+__dirname+"/"+filepath);
            res.sendFile(__dirname+"/"+filepath);
        });
    });
});