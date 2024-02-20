require("dotenv").config();

const config = {
    app: {
        port: process.env.PORT || 3000
    },
    db: {
        uri: process.env.MONGODB_URI
    },
    jwt: {
        access_key: process.env.JWT_ACCESS_KEY,
        refresh_key: process.env.JWT_REFRESH_KEY
    }
}

module.exports = config;