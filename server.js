const http = require("http");
const {logEvents}  = require("./logEvents");
const path = require("path");
const fileSys = require("fs");
const fileSysPromises = require("fs").promises;

const PORT = process.env.PORT || 4000;

//create server 
const server = http.createServer((req, res) => {
    console.log(req.url, req.method)
})

server.listen(PORT, () => console.log(`server is successfully running on port ${PORT}`))