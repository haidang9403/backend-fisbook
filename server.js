const app = require("./app")
const config = require("./app/config")
const connection = require("./app/utils/mongodb.util")

const startServer = async () => {
    try {
        // Connect to server
        connection(config.db.uri);
        // Start server
        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log(`Can't start server!`)
        console.error(error)
    }
}

startServer();
