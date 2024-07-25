const express= require("express")
const http= require("http")
const path = require("path")
const socketio= require("socket.io")

const app= express()
const server= http.createServer(app)
const io= socketio(server)

app.set("view engine",'ejs')

app.use(express.static(path.join(__dirname,'public')))
app.set("views",path.join(__dirname , "public/views"))

io.on("connection",(socket)=>{
    console.log("Connected ",socket.id)
    socket.on("send-location",(coordinate)=>{
        io.emit("recieve-location",{id:socket.id,...coordinate})
    })

    socket.on("disconnect",()=>{
        io.emit("user-disconnected",{id:socket.id})
    })
})

app.get("/",(req,res)=>{
    res.render("index")
})

server.listen(3000,()=>{
    console.log("running on 3000")
})