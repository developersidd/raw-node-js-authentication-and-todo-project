/*
Title: Token Handler
Date: 30/1/2022
Author: AB Siddik
*/

// dependencies
const { read, create, update, delete: deleteToken } = require('../lib/data');
const { hashPassword, randomString } = require('../helpers/utilities');
// module scaffolding
const handler = {};

handler.tokenHandler = (requestProps, callback) => {
    const acceptedRequest = ['get', 'post', 'put', 'delete'];
    if (acceptedRequest.indexOf(requestProps.method) !== -1) {
        handler.token[requestProps.method](requestProps, callback);
    } else {
        // 405 means not allowed this type of request
        callback(405);
    }
};

// module scaffolding for - methods
handler.token = {};

// Token post method
handler.token.createToken = (requestProps, callback) => {

    const password = typeof requestProps.body.password === "string" && requestProps.body.password.length > 0 ? hashPassword(requestProps.body.password) : false;

    const phonenumber = typeof requestProps.body.phonenumber === "string" && requestProps.body.phonenumber.length == 11 ? requestProps.body.phonenumber.trim() : false;

    if (password && phonenumber) {

        // get that user and match password
        read("users", phonenumber, (err1, data) => {
            const hashedPassword = data.password;
            if (!err1 && hashedPassword === password) {
                const tokenId = randomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObj = {
                    phonenumber,
                    tokenId,
                    expires
                };

                // before creating the token we need to check if the token already exists or not

                read("tokens", tokenId, (err2) => {
                    if (err2) {
                        create("tokens", tokenId, tokenObj, "wx", (err3) => {
                            if (err3) {
                                callback(true, { message: "There was an Error creating token" });
                            } else {
                                callback(false, { message: "Token Created Successfully", payload: tokenObj });
                            }
                        });
                    } else {
                        callback(500, { message: "Token already exists!" });
                    }
                });



            } else {
                callback(500, { message: "Password didn't matched" });
            }
        });

    } else {
        callback(400, { message: "Please enter correct information" });
    }

};

// Token get method
handler.token.get = (requestProps, callback) => {
    const tokenId = typeof requestProps.queryString.token === "string" && requestProps.queryString.token.length == 20 ? requestProps.queryString.token.trim() : false;

    if (tokenId) {
        read("tokens", tokenId, (err, user) => {
            if (err) {
                callback(500, { message: "There was an error getting Token!" })
            }
            callback(500, { message: "Token Got successfully!", payload: user })
        });
    } else {
        callback(400, { message: "Please enter correct information" });
    }
};

// Token update method
handler.token.put = (requestProps, callback) => {

    const tokenId = typeof requestProps.queryString.token === "string" && requestProps.queryString.token.length == 20 ? requestProps.queryString.token.trim() : false;

    const extend = typeof requestProps.body.extend === "boolean" ? requestProps.body.extend : false;

    if (tokenId && extend) {

        read("tokens", tokenId, (err1, token) => {
            const data = { ...token };
            const newExpiresTime = Date.now() + 60 * 60 * 1000;
            if (!err1) {
                if (data.expires > Date.now()) {
                    // if expires Time is reamaining then we can update the expires time
                    data["expires"] = newExpiresTime;
                    update("tokens", tokenId, data, (err2) => {
                        if (err2) {
                            callback(500, { message: "Couldn't Update Token!" })
                        }
                        else {
                            callback(200, { message: "Token Updated successfully" });
                        }
                    });
                } else {
                    callback(500, { message: "Token already expired!" })
                }
            } else {
                callback(500, { message: "Token is not exists!" })
            }
        });

    } else {
        callback(400, { message: "Please enter correct information" });
    }


};

// Token Delete method

handler.token.delete = (requestProps, callback) => {
    const tokenId = typeof requestProps.queryString.token === "string" && requestProps.queryString.token.length == 20 ? requestProps.queryString.token.trim() : false;

    if (tokenId) {
        deleteToken("tokens", tokenId, (err) => {
            if (err) {
                callback(500, { message: "There was an error deleting Token!" })
            }
            callback(500, { message: "Token Deleted successfully" })
        });
    } else {
        callback(400, { message: "Please enter correct information." });
    }
};

// verify the token
handler.token.verify = (phone, tokenId, callback) => {

    read("tokens", tokenId, (err, token) => {
        if (!err && tokenId === token.tokenId && phone === token.phonenumber) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

module.exports = handler;
