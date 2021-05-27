const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('api/schema');
const resolvers = require('api/resolver');
const User = require('app/models/users');



const app = express();

module.exports = class Application {
    constructor() {
        this.ServerConfig();
        this.DatabaseConfig();
        this.Routes();
    }

    ServerConfig() {
        const server = new ApolloServer({
            typeDefs, resolvers, formatError(err) {

                if (!err.originalError) {
                    return err;
                }

                const data = err.originalError.data;
                const code = err.originalError.code || 500;
                const message = err.message || 'error';

                return { data, status: code, message }
            },
            context: async ({ req }) => {
                const secretId = config.secretId
                const check = await User.CheckToken(req, secretId);
                let isAdmin = false;
                if (check) {
                    isAdmin = await User.findById(check.id)
                }
                return {
                    isAdmin: isAdmin.level,
                    secretId,
                    check
                }
            }
        })
        server.applyMiddleware({ app })
        app.listen(config.port, () => {
            console.log(`server run0 on port ${config.port}`)
        })
    }

    DatabaseConfig() {
        mongoose.Promise = global.Promise;
        mongoose.connect(config.database.url, config.database.options)
    }

    Routes() {

    }
}