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
    },
    upload: {
        baseUrl: process.env.BASE_UPLOAD_URL || "http://127.0.0.1:3000/uploads/"
    }
}

module.exports = config;