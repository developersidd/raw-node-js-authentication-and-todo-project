// Dependencies
const { create, update, delete: deleteFile, read } = require("../lib/data");

// Handler Object -> Module Scaffolding
const handler = {};

handler.sampleHandler = (requestProps, callback) => {
    //console.log("requestProps", requestProps);
    /*  create("users", "0189874998", { "message": "Hello My gorgeous Friends on the Internet: 😃", "age": "25" }, ({ message }) => {
          callback(200, { message })
      });
  */
    /*    // update file
        update("users", "0189874998", { "message": "Hello My extraordinary Friends on the Internet: 😃", "age": "28" }, ({ message }) => {
            callback(200, { message })
        });
    */

    // delete file 
    deleteFile("users", "0189874998", ({ message }) => {
        callback(200, { message })
    });

    /*
        // read file
        read("users", "0189874997", ({ message, payload }) => {
            callback(200, { message, payload })
        });*/
};

// Export handler object
module.exports = handler;
