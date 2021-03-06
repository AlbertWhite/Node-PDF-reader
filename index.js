//documents are the programmers' friends
//expressjs multer: https://github.com/expressjs/multer   https://ewiggin.gitbooks.io/expressjs-middleware/content/multer.html

var app = require("express")();
var http = require("http").Server(app);
var multer = require("multer");
var upload = multer({dest:'uploads/'});//set the destiation for the files uploaded. The files are saved in the same folder as index.js
var filepath = "";
var io = require("socket.io")(http);
var comments = [];//save all the comments
var filename = "";
var fileList = [];

app.get("/",function(req, res){
    res.sendFile(__dirname+"/index.html")
});

app.get("/askforsrc",function(req,res){//send file to image src
    res.contentType("application/pdf");
    res.sendFile(__dirname+"/"+filepath);
});

http.listen(3000, function(){
});

io.on("connection",function(socket){
    //if socket get this filename, then it starts to listen to post and get 
    socket.on("filename",function(msg){
        filename = msg;
        app.post('/'+filename, upload.single("pdf"), function (req, res) {
            res.sendFile(__dirname+"/upload.html"); 
            filepath = req.file.path;

            var file = {"name":filename, "path":filepath};
            fileList.push(file);
            filename = "";

        });

        app.get('/'+filename, upload.single("pdf"), function (req, res) {
            res.sendFile(__dirname+"/upload.html");
            //get url from request
            var url = req.originalUrl;
            url = url.substring(1);
            for(var i = 0;i < fileList.length;i++){
                if(fileList[i].name == url){
                    filepath = fileList[i].path;
                }
            }
        });

    });

io.emit("initial",comments);
socket.on("message", function(msg){
    comments.push(msg);
    io.emit("message", msg);
});
socket.on("filelist", function(msg){
    io.emit("filelist", fileList);
});

});