const http = require("http");
const { logEvents }  = require("./logEvents");
const path = require("path");
const fileSys = require("fs");
const fileSysPromises = require("fs").promises;

const PORT = process.env.PORT || 4000;

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fileSysPromises.readFile(
            filePath, 
            !contentType.includes("image") ? "utf8" : ""
        );

        const data = contentType === "application/json" ? JSON.parse(rawData) : rawData;

        response.writeHead(
            filePath.includes("404.html") ? 404 : 200, 
            {"Content-Type": contentType}
        );

        response.end(contentType === "application/json" ?
        JSON.stringify(data) : data);
    }catch(err) {
        console.log(err)
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method)

    const extensionName = path.extname(req.url);
    let contentType;

    //checking determining the content-type based on the request extname
    switch (extensionName) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    let filePath;

    if (contentType === "text/html" && req.url === "/") {
        filePath = path.join(__dirname, "views", "index.html");
    }else if (contentType === "text/html" && req.url.slice(-1) === "/") {
        filePath = path.join(__dirname, "views", req.url, "index.html");
    }else if (contentType === "text/html") {
        filePath = path.join(__dirname, "views", req.url);
    }else {
        filePath = path.join(__dirname, req.url);
    }

    //checking if the filePath exists before serving a response
    if (fileSys.existsSync(filePath)) {
        serveFile(filePath, contentType, res);
    } else {
        switch (path.parse(filePath).base) {
            case "old-page.html":
                res.writeHead(301, {"location": "new-page.html"});
                res.end();
                break;
            case "www-what-html":
                res.writeHead(301, {"location": "/"});
                res.end();
                break;
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), "text/html", res)
        }
    }
})

server.listen(PORT, () => console.log(`server is successfully running on port ${PORT}`))