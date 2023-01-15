// Dependencies
const { hashPassword } = require("../helpers/utilities");
const { create, read, update, delete: deleteUser } = require("../lib/data");
const { token: { verify, createToken } } = require("./tokenHandler");


// Module Scaffolding
const handler = {};

handler.userHandler = (requestProps, callback) => {
    const acceptedMethods = ["get", "post", "put", "delete"];
    if (acceptedMethods.indexOf(requestProps.method) !== -1) {
        handler.user[requestProps.method](requestProps, callback)
    } else {
        callback(405, { message: 'Method not allowed' });
    }
};

// user Module Scaffolding
handler.user = {};


// create user
handler.user.post = (requestProps, callback) => {
    // get the data from user
    const firstname = typeof requestProps.body.firstname === "string" && requestProps.body.firstname.length > 0 ? requestProps.body.firstname.trim() : false;

    const lastname = typeof requestProps.body.lastname === "string" && requestProps.body.lastname.length > 0 ? requestProps.body.lastname.trim() : false;

    const password = typeof requestProps.body.password === "string" && requestProps.body.password.length > 0 ? hashPassword(requestProps.body.password) : false;

    const phonenumber = typeof requestProps.body.phonenumber === "string" && requestProps.body.phonenumber.length == 11 ? requestProps.body.phonenumber.trim() : false;

    const agreement = typeof requestProps.body.agreement === "boolean" ? requestProps.body.agreement : false;

    const user = {
        firstname, lastname, phonenumber, password, agreement, todos: []
    };


    if (firstname && lastname && password && phonenumber && agreement) {

        read("users", phonenumber, (err1) => {
            if (err1) {
                console.log("reading error", err1);
                create("users", phonenumber, user, "wx", (err2) => {
                    console.log(err2);
                    if (err2) {
                        callback(500, { message: "Couldn't create an user!" })
                    }
                    else {
                        // call the token post method
                        createToken(requestProps, (err, res) => {
                            if (!err && res.payload) {
                                callback(200, { message: "User Created successfully", token: res.payload });
                            } else {
                                callback(500, { message: "Couldn't create an user!" })
                            }
                        });
                    }
                });

            } else {
                callback(500, { message: "User already exists!" })
            }
        });

    } else {
        callback(400, { message: "Please enter correct information" });
    }

};


// Read User
handler.user.get = (requestProps, callback) => {
    const phonenumber = typeof requestProps.queryString.id === "string" && requestProps.queryString.id.length == 11 ? requestProps.queryString.id.trim() : false;

    const token = typeof requestProps.headers.token === "string" && requestProps.headers.token.length === 20 ? requestProps.headers.token : false;
    if (phonenumber) {

        verify(phonenumber, token, (err) => {
            if (!err) {
                read("users", phonenumber, (err, user) => {
                    const data = { ...user };
                    delete data.password;
                    if (err) {
                        callback(500, { message: "There was an error getting user!" })
                    }
                    callback(500, { message: "user Got successfully!", payload: data })
                });
            } else {
                callback(403, { message: "Authentication failure!" })
            }
        });
    } else {
        callback(400, { message: "Please enter correct information" });
    }
};

// Update user
handler.user.put = (requestProps, callback) => {
    // get the data from user
    const firstname = typeof requestProps.body.firstname === "string" && requestProps.body.firstname.length > 0 ? requestProps.body.firstname.trim() : false;

    const lastname = typeof requestProps.body.lastname === "string" && requestProps.body.lastname.length > 0 ? requestProps.body.lastname.trim() : false;

    const password = typeof requestProps.body.password === "string" && requestProps.body.password.length > 6 ? hashPassword(requestProps.body.password) : false;

    const phonenumber = typeof requestProps.queryString.id === "string" && requestProps.queryString.id.length == 11 ? requestProps.queryString.id.trim() : false;

    const agreement = typeof requestProps.body.agreement === "string" && requestProps.body.agreement.length > 0 ? requestProps.body.agreement : false;

    const token = typeof requestProps.headers.token === "string" && requestProps.headers.token.length === 20 ? requestProps.headers.token : false;

    if (phonenumber && (firstname || lastname || password || phonenumber || agreement)) {

        verify(phonenumber, token, (err) => {
            if (!err) {
                read("users", phonenumber, (err1, user) => {
                    const data = { ...user };
                    const updatedData = {
                        firstname: firstname || data.firstname,
                        lastname: lastname || data.lastname,
                        password: password || data.password,
                        agreement: agreement || data.agreement,
                    }

                    if (!err1 && user.firstname) {
                        console.log("reading error", err1);
                        update("users", phonenumber, updatedData, (err2) => {
                            console.log(err2);
                            if (err2) {
                                callback(500, { message: "Couldn't Update user!" })
                            }
                            else {
                                callback(200, { message: "User Updated successfully" });
                            }
                        });

                    } else {
                        callback(500, { message: "User is not exists!" })
                    }
                });

            } else {
                callback(403, { message: "Authentication failure!" })
            }
        });

    } else {
        callback(400, { message: "Please enter correct information" });
    }

};

// Delete User
handler.user.delete = (requestProps, callback) => {
    const phonenumber = typeof requestProps.queryString.id === "string" && requestProps.queryString.id.length == 11 ? requestProps.queryString.id.trim() : false;

    const token = typeof requestProps.headers.token === "string" && requestProps.headers.token.length === 20 ? requestProps.headers.token : false;

    if (phonenumber) {
        verify(phonenumber, token, (err) => {
            if (!err) {
                deleteUser("users", phonenumber, (err) => {
                    if (err) {
                        callback(500, { message: "There was an error deleting user!" })
                    }
                    callback(500, { message: "user Deleted successfully" })
                });
            } else {
                callback(403, { message: "Authentication failure!" })
            }
        });

    } else {
        callback(400, { message: "Please enter correct information." });
    }
};





// Export handler object
module.exports = handler;