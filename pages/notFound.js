// Handler Object -> Module Scaffolding
const handler = {};

handler.notFoundHandler = (requestProps, callback) => {
    callback(404, { message: "Your requested url was not found! 😢" })
};

// Export handler object
module.exports = handler;
