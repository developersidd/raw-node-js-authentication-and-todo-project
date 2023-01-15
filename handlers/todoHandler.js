// Dependencies
const { create, read, update, delete: deleteTodo } = require("../lib/data");
const { token: { verify } } = require("./tokenHandler");


// Module Scaffolding
const handler = {};

handler.todoHandler = (requestProps, callback) => {
    const acceptedMethods = ["get", "post", "put", "delete"];
    if (acceptedMethods.indexOf(requestProps.method) !== -1) {
        handler.todo[requestProps.method](requestProps, callback)
    } else {
        callback(405, { message: 'Method not allowed' });
    }
};

// user Module Scaffolding
handler.todo = {};

// create user
handler.todo.post = (requestProps, callback) => {

    // get the data from user
    const id = typeof requestProps.body.id === "string" ? requestProps.body.id.trim() : false;

    const title = typeof requestProps.body.title === "string" && requestProps.body.title.length > 0 ? requestProps.body.title.trim() : false;

    const phonenumber = typeof requestProps.queryString.id === "string" && requestProps.queryString.id.length == 11 ? requestProps.queryString.id.trim() : false;

    const token = typeof requestProps.headers.token === "string" && requestProps.headers.token.length === 20 ? requestProps.headers.token : false;

    const description = typeof requestProps.body.description === "string" && requestProps.body.description.length > 0 ? requestProps.body.description.trim() : false;

    const startingDate = new Date().toLocaleDateString();

    const endingDate = typeof requestProps.body.endingDate === "string" && requestProps.body.endingDate.length > 0 ? requestProps.body.endingDate.trim() : false;

    const todo = {
        id,
        title, description, startingDate, endingDate
    };

    if (id && title && description && startingDate && endingDate && phonenumber) {

        // verify the user first
        verify(phonenumber, token, (err) => {
            if (!err) {

                read("users", phonenumber, (err1, user) => {
                    // get the user and add it to the todo 
                    const userWithTodo = { ...user, todos: [...user.todos, todo] };
                    if (!err1) {
                        create("users", phonenumber, userWithTodo, "w", (err2) => {
                            if (err2) {
                                callback(500, { message: "Couldn't create Todo!" })
                            }
                            else {
                                callback(200, { message: "Todo Created successfully" });
                            }
                        });

                    } else {
                        callback(500, { message: "User not Found!" })
                    };
                });
            } else {
                callback(403, { message: "Authentication failure!" })
            }
        });

    } else {
        callback(400, { message: "Please enter correct information" });
    }
};

// Read User
handler.todo.get = (requestProps, callback) => {
    const phonenumber = typeof requestProps.queryString.id === "string" && requestProps.queryString.id.length == 11 ? requestProps.queryString.id.trim() : false;

    const token = typeof requestProps.headers.token === "string" && requestProps.headers.token.length === 20 ? requestProps.headers.token : false;

    if (phonenumber) {

        verify(phonenumber, token, (err) => {
            if (!err) {
                read("users", phonenumber, (err, user) => {
                    const data = { todos: user.todos };
                    if (err) {
                        callback(500, { message: "There was an error getting user!" })
                    }
                    callback(500, { message: "Todos Got successfully!", payload: data })
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
handler.todo.put = (requestProps, callback) => {
    // get the data from user
    const id = typeof requestProps.queryString.todoId === "string" ? requestProps.queryString.todoId.trim() : false;

    const title = typeof requestProps.body.title === "string" && requestProps.body.title.length > 0 ? requestProps.body.title.trim() : false;

    const description = typeof requestProps.body.description === "string" && requestProps.body.description.length > 0 ? requestProps.body.description.trim() : false;

    const endingDate = typeof requestProps.body.endingDate === "string" && requestProps.body.endingDate.length > 0 ? requestProps.
        body.endingDate.trim() : false;

    const phonenumber = typeof requestProps.queryString.id === "string" && requestProps.queryString.id.length == 11 ? requestProps.queryString.id.trim() : false;

    const token = typeof requestProps.headers.token === "string" && requestProps.headers.token.length === 20 ? requestProps.headers.token : false;


    if (phonenumber && id && (title || description || endingDate)) {

        verify(phonenumber, token, (err) => {
            if (!err) {
                read("users", phonenumber, (err1, user) => {
                    if (!err1 && user.firstname) {
                        // get the searched todo
                        const searchedTodo = user.todos.find(todo => todo.id === id);
                        // checking the todo found or not
                        if (searchedTodo) {
                            // update the searched todo
                            const updatedTodo = {
                                id: id,
                                title: title || searchedTodo.title,
                                description: description ||
                                    searchedTodo.description,
                                endingDate: endingDate ||
                                    searchedTodo.endingDate,
                            }
                            // destructure the user object and separate user data
                            const { todos, ...rest } = user;
                            // get the todos except updated todo
                            const remainingTodos = todos.filter(todo => todo.id !== id);
                            // create the new user with updated todo
                            const updatedData = { ...rest, todos: [...remainingTodos, updatedTodo] };

                            update("users", phonenumber, updatedData, (err2) => {
                                if (!err2) {
                                    callback(200, { message: "Todo Updated successfully" });
                                }
                                else {
                                    callback(500, { message: "Couldn't Update Todo!" });
                                }
                            });
                        } else {
                            callback(400, { message: "Todo doesn't exists!" });
                        }

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
handler.todo.delete = (requestProps, callback) => {
    const phonenumber = typeof requestProps.queryString.id === "string" && requestProps.queryString.id.length == 11 ? requestProps.queryString.id.trim() : false;

    const id = typeof requestProps.queryString.tokenId === "string" ? requestProps.queryString.tokenId.trim() : false;

    const token = typeof requestProps.headers.token === "string" && requestProps.headers.token.length === 20 ? requestProps.headers.token : false;

    if (phonenumber && id) {
        verify(phonenumber, token, (err1) => {
            if (!err1) {
                read("users", phonenumber, (err2, user) => {
                    if (!err2) {
                        const remainingTodos = user.todos.filter(todo => todo.id !== id);
                        const data = { ...user, todos: remainingTodos };

                        update("users", phonenumber, data, (err3) => {
                            if (!err3) {
                                callback(500, { message: "Todo Deleted successfully" });
                            } else {
                                callback(500, { message: "Couldn't Delete Todo" });
                            }
                        });

                    }
                    else {
                        callback(500, { message: "There was an error getting todos!" })

                    }
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