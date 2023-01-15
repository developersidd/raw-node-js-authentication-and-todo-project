
// Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const { notFoundHandler } = require('../pages/notfound');
const { routes } = require("../routes");
// Handler Object -> Module Scaffolding
const handler = {};

//handle Req & Res
handler.handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;
    const trimmedPath = pathName.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();

    const { headers } = req;
    const queryString = parsedUrl.query;
    const data = new StringDecoder("utf-8");
    let realData = "";

    const requestPros = {
        req,
        res,
        method,
        headers,
        queryString,
    }

    //Handle Routes
    const chosenRoute = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler

    // get data from req 
    req.on("data", (buffer) => {
        realData += data.write(buffer);
        //console.log("Data Comming", buffer)
    });
    // after getting data
    req.on("end", () => {
        realData += data.end();
        //console.log(realData);
        requestPros.body = JSON.parse(realData);
        chosenRoute(requestPros, (status, payload) => {
            const statusCode = typeof status === "number" ? status : 500;
            const data = typeof payload === "object" ? payload : {};
            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode);
            res.end(JSON.stringify(data));
        });
    });
};


// Export Handler Object 
module.exports = handler;