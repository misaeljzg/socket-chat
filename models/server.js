const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            users: '/api/users',
            auth: '/api/auth',
            search: '/api/search',
            categories: '/api/categories',
            products: '/api/products'
        }
        
        //Connect to database
        this.connectDB();
        
        //Middlewares
        this.middlewares();
        //App routes
        this.routes();

        //Sockets
        this.sockets();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //Reading and parsing request body
        this.app.use(express.json());

        //Public folder
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.users, require('../routes/users'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
    }

    sockets() {
        this.io.on("connection", (socket ) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Server running on', this.port);
        });
    }
}

module.exports = Server;