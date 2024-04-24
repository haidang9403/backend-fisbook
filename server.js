const app = require("./app");
const config = require("./app/config");
const connection = require("./app/utils/mongodb.util");

const startServer = async () => {
    try {
        connection(config.db.uri);

        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(`Can't start server!`);
        console.error(error);
    }
};

startServer();
