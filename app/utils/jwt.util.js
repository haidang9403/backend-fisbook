const JWT = require("jsonwebtoken");
const ApiError = require("../api-error");
const config = require("../config");

module.exports = {
    signAccessTokenUser: (userID) => {
        return new Promise((resolve, reject) => {
            const payload = {
                aud: userID,
                admin: false,
            }
            const secret = config.jwt.access_key;
            const options = {
                expiresIn: '15m'
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
                aud: userID,
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
    verifyRefreshToken: (req, res, next) => {
        const token = req.cookies.refreshToken
        JWT.verify(token, config.jwt.refresh_key, (err, payload) => {
            if (err) return next(new ApiError(401, err.message));
            req.payload = payload;
            next()
        })
    },
    verifyRefreshTokenAndAdmin: (req, res, next) => {
        const token = req.cookies.refreshTokenAdmin
        JWT.verify(token, config.jwt.refresh_key, (err, payload) => {
            if (err) return next(new ApiError(401, err.message));
            if (!payload.admin) return next(new ApiError(403, "Forbidden"));
            req.payload = payload;
            next()
        })
    },
    signAccessTokenAdmin: (userID) => {
        return new Promise((resolve, reject) => {
            const payload = {
                aud: userID,
                admin: true,
            }
            const secret = config.jwt.access_key;
            const options = {
                expiresIn: '15m'
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
                aud: userID,
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
    verifyToken: (token) => {
        let user_id;
        JWT.verify(token, config.jwt.refresh_key, (err, payload) => {
            if (err) return next(new ApiError(401, err.message));
            user_id = payload.aud;
        })

        return user_id
    },
    verifyAccessTokenAndAuthOrAdmin: (req, res, next) => {
        if (!req.headers['authorization']) return next(401, "Unauthorized");
        const id = req.params.id || req.body.user_id;
        const token = req.headers['authorization'].split(" ")[1]

        JWT.verify(token, config.jwt.access_key, (err, payload) => {
            if (err) return next(new ApiError(401, err.message));

            const isPermission = id == payload.aud
            if (payload.admin || isPermission) {
                req.payload = payload;
                next()
            } else {
                return next(new ApiError(403, "Forbidden"));
            }
        })
    },
    verifyAccessTokenAndAuth: (req, res, next) => {
        if (!req.headers['authorization']) return next(401, "Unauthorized");
        const id = req.params.id || req.body.id;
        const token = req.headers['authorization'].split(" ")[1]

        JWT.verify(token, config.jwt.access_key, (err, payload) => {
            if (err) return next(new ApiError(401, err.message));

            const isPermission = id == payload.aud

            if (isPermission) {
                req.payload = payload;
                next()
            } else {
                return next(new ApiError(403, "Forbidden"));
            }
        })
    }
}