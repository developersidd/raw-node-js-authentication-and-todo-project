// Dependencies

const fs = require("fs");
const path = require("path");
// Module Scaffolding
const lib = {};

// Configuration
lib.basedir = path.join(__dirname, "/../.data/");

// Create File
lib.create = (dir, file, data, flag, callback) => {
    // `${`${lib.basedir + dir}/${file}`}.json`,
    //to create a new file we have to open a new File
    fs.open(lib.basedir + dir + "/" + file + ".json", flag, (err1, fileDescriptor) => {
        console.log("err msg 1 ", err1);
        if (!err1 && fileDescriptor) {
            // after opening the file now write to the file 
            fs.writeFile(fileDescriptor, JSON.stringify(data), (err2) => {
                console.log("Error msg", err2)
                if (!err2) {
                    // after writing close the file
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback({ message: "There was an error closing the file" })
                        }
                    });
                } else {
                    callback({ message: `There was an error writing the file` })
                }
            });
        } else {
            callback({ message: `There was an Error to Opening the file` })
        }

    });
};

// Read File
lib.read = (dir, file, callback) => {
    // read file
    fs.readFile(lib.basedir + dir + "/" + file + ".json", "utf8", (err, data) => {
        callback(err, data ? JSON.parse(data) : {});
    });
};

// Update File

lib.update = (dir, file, data, callback) => {
    // First check if the file is already exists or not
    fs.readFile(lib.basedir + dir + "/" + file + ".json", "utf-8", (err1, fileData) => {
        if (!err1 && fileData.length > 0) {
            // Now Open the file to update
            fs.open(path.join(__dirname, "/../.data/", `${dir}/${file}.json`), 'w', (err2, fileDescriptor) => {
                if (!err2 && fileDescriptor) {

                    // Clear the existing data of the file
                    fs.ftruncate(fileDescriptor, (err3) => {
                        if (!err3) {
                            // Now write the updated data to the file
                            fs.writeFile(fileDescriptor, JSON.stringify(data), (err4) => {

                                if (!err4) {
                                    // after writing updated data close the file 
                                    fs.close(fileDescriptor, (err5) => {
                                        if (!err5) {
                                            callback(false)
                                        } else {
                                            callback({ message: "There was an error closing the file for update" })
                                        }
                                    });
                                } else {
                                    callback({ message: `There was an Error to Writing the file for the update` });

                                }

                            });
                        } else {
                            callback({ message: `There was an Error to Clearing the file for the update` })
                        }


                    });
                } else {
                    callback({ message: `There was an Error to Opening the file for updating ${err1}` })
                }
            })
        } else {
            callback({ message: "Your File is not exists! 😞 " })
        }
    });
};


// Delete File

lib.delete = (dir, file, callback) => {
    fs.unlink(lib.basedir + dir + "/" + file + ".json", (err) => {
        if (err) {
            callback({ message: `There was an Error to Deleting the file!😓` });
        }
        callback(false);
    });
};

// export the lib object
module.exports = lib;