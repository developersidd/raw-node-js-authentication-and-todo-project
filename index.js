
// 
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');

// App object -> Module Scaffolding
const app = {};

// configuration
app.config = {
    PORT: process.env.PORT || 5000
};


// create server starting function
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.PORT, () => {
        console.log(`Listening on ${app.config.PORT}`);
    });
}

app.handleReqRes = handleReqRes;

// Start the server
app.createServer();

// Export App object
module.exports = app;