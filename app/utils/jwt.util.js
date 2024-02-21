const JWT = require("jsonwebtoken");
const ApiError = require("../api-error");
const config = require("../config");

module.exports = {
    signAccessTokenUser: (userID) => {
        return new Promise((resolve, reject) => {
            const payload = {
                id: userID,
                admin: false,
            }
            const secret = config.jwt.access_key;
            const options = {
                expiresIn: '30s'
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) return reject(err)
                resolve(token)
            })
        })
    },
    signRefreshTokenUser: (userID) => {
        return new Promise((resolve, reject) => {
            const payload = {
                id: userID,
                admin: false,
            }
            const secret = config.jwt.refresh_key
            const options = {
                expiresIn: '1y'
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) return reject(err)
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(401, "Unauthorized")
        const token = req.headers['authorization'].split(" ")[1]
        JWT.verify(token, config.jwt.access_key, (err, payload) => {
            if (err) return next(new ApiError(401, err.message));
            req.payload = payload;
            next()
        })
    },
    verifyAccessTokenAndAdmin: (req, res, next) => {
        if (!req.headers['authorization']) return next(401, "Unauthorized")
        const token = req.headers['authorization'].split(" ")[1]
        JWT.verify(token, config.jwt.access_key, (err, payload) => {
            if (err) return next(new ApiError(401, err.message));
            if (!payload.admin) return next(new ApiError(403, "Forbidden"));
            req.payload = payload;
            next()
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, config.jwt.refresh_key, (err, payload) => {
                if (err) return reject(new ApiError(400, "Invalid token"))
                const userID = payload.id;
                resolve(userID);
            })
        })
    },
    signAccessTokenAdmin: (userID) => {
        return new Promise((resolve, reject) => {
            const payload = {
                id: userID,
                admin: true,
            }
            const secret = config.jwt.access_key;
            const options = {
                expiresIn: '30s'
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) return reject(err)
                resolve(token)
            })
        })
    },
    signRefreshTokenAdmin: (userID) => {
        return new Promise((resolve, reject) => {
            const payload = {
                id: userID,
                admin: true,
            }
            const secret = config.jwt.refresh_key
            const options = {
                expiresIn: '1y'
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) return reject(err)
                resolve(token)
            })
        })
    },
}