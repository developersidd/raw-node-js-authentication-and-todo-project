// Dependencies
const { createHmac } = require('crypto');


// Module Scaffolding 
const utilities = {};

// Has Password
utilities.hashPassword = (password) => {
    if (typeof password === "string" && password.length > 0) {
        const hash = createHmac("sha256", "dfdfdfsfadad").update(password).digest("hex");
        return hash;
    };
    return false;
};

utilities.randomString = (strlength) => {
    const number = typeof strlength === "number" && strlength > 0 ? strlength : false;

    if (number) {
        let randomStr = "";
        const posssibleString = "abcdefghijklmnopqrstuvwxyz1234567890";

        for (let i = 1; i <= strlength; i++) {
            const selectedChar = posssibleString.charAt(Math.floor(Math.random() * posssibleString.length));
            randomStr += selectedChar;
        }
        return randomStr;
    } else {
        return false;
    }
};

module.exports = utilities;

