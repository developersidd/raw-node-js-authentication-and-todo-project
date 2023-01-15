
//  Dependencies
const { todoHandler } = require("./handlers/todoHandler");
const { tokenHandler } = require("./handlers/tokenHandler");
const { userHandler } = require("./handlers/userHandler");
const { sampleHandler: sample } = require("./pages/sample");

// Module Scaffolding
const handler = {};


// set Application Routes
handler.routes = {
    sample,
    user: userHandler,
    token: tokenHandler,
    todo: todoHandler
};


// export route
module.exports = handler;