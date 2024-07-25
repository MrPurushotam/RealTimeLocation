const socket = io();
console.log("Script")
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const { longitude , latitude }=position.coords
        socket.emit("send-location",{longitude,latitude})
    },(err)=>{
        console.error("Error",err.message)
    },{
        enableHighAccuracy:true,
        maximumAge:0,
        timeout:5000
    })
}

const map =L.map("map").setView([0,0],16)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"PJcreations"
}).addTo(map)

const marker={}
socket.on("recieve-location",(data)=>{
    const {id,latitude,longitude}=data
    map.setView([latitude,longitude])
    if(marker[id]){
        marker[id].setLatLng([latitude,longitude])
    }else{
        marker[id]=L.marker([latitude,longitude]).addTo(map)
    }
})

socket.on("user-disconnected",(id)=>{
    if(marker[id]){
        marker.removeLayer(marker[id])
        delete marker[id]
    }
})