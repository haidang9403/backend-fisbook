const ApiError = require("../api-error");
const User = require("../models/user.model");
const Admin = require("../models/admin.model");
const { authSchema } = require("../utils/validation_shema.util");
const JWT = require("../utils/jwt.util");

const authController = {
    // REGISTER
    register: async (req, res, next) => {
        try {
            const result = await authSchema.register.validateAsync(req.body);
            const existUser = await User.findOne({ username: result.username });
            if (existUser) throw new ApiError(409, `${result.username} is already been registered`);

            const user = new User(result);
            const savedUser = await user.save();
            const accessToken = await JWT.signAccessTokenUser(savedUser.id);
            const refreshToken = await JWT.signRefreshTokenUser(savedUser.id);// refreshToken lưu vào cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                samSite: "strict",
            });
            const { password, ...infoUser } = savedUser._doc;
            res.send({ ...infoUser, accessToken });
        } catch (error) {
            if (error.isJoi) error.statusCode = 422;
            return next(error)
        }
    },
    // LOGIN
    login: async (req, res, next) => {
        try {
            const result = await authSchema.login.validateAsync(req.body);
            const user = await User.findOne({ username: result.username });
            if (!user) throw new ApiError(404, "Username not registered");

            const isMatch = await user.isValidPassword(result.password);
            if (!isMatch) throw new ApiError(404, "Username or password not correct");

            const accessToken = await JWT.signAccessTokenUser(user.id);
            const refreshToken = await JWT.signRefreshTokenUser(user.id); // refreshToken lưu vào cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                samSite: "strict",
            })
            const { password, ...infoUser } = user._doc;
            res.send({ ...infoUser, accessToken });
        } catch (error) {
            if (error.isJoi) error.statusCode = 422;
            next(error);
        }
    },
    // REFRESH TOKEN
    refreshToken: async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) throw new ApiError(400, "Refresh Token is not valid");
            const userId = await JWT.verifyRefreshToken(refreshToken);

            const newAccessToken = await JWT.signAccessTokenUser(userId);
            const newRefreshToken = await JWT.signRefreshTokenUser(userId);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                samSite: "strict",
            })
            res.send({ newAccessToken })
        } catch (error) {
            next(error)
        }
    },
    // LOGOUT
    logout: async (req, res) => {
        res.clearCookie("refreshToken");
        res.send({ message: "Logout successfully!" })
    },
    // LOGIN ADMIN
    adminLogin: async (req, res, next) => {
        try {
            const result = await authSchema.login.validateAsync(req.body);
            const admin = await Admin.findOne({ username: result.username });
            if (!admin) throw new ApiError(404, "Username not registered");

            const isMatch = await admin.isValidPassword(result.password);
            if (!isMatch) throw new ApiError(404, "Username or password not correct");

            const accessToken = await JWT.signAccessTokenAdmin(admin.id);
            const refreshToken = await JWT.signRefreshTokenAdmin(admin.id); // refreshToken lưu vào cookie
            res.cookie("refreshTokenAdmin", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                samSite: "strict",
            })
            const { password, ...infoAdmin } = admin._doc;
            res.send({ ...infoAdmin, accessToken });
        } catch (error) {
            if (error.isJoi) error.statusCode = 422;
            next(error);
        }
    },
    // REGISTER ADMIN
    adminRegister: async (req, res, next) => {
        try {
            const result = await authSchema.registerAdmin.validateAsync(req.body);
            const existAdmin = await Admin.findOne({ username: result.username });
            if (existAdmin) throw new ApiError(409, `${result.username} is already been registered`);

            const admin = new Admin(result);
            const savedAdmin = await admin.save();
            const accessToken = await JWT.signAccessTokenAdmin(savedAdmin.id);
            const refreshToken = await JWT.signRefreshTokenAdmin(savedAdmin.id);// refreshToken lưu vào cookie
            res.cookie("refreshTokenAdmin", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                samSite: "strict",
            });
            const { password, ...infoAdmin } = savedAdmin._doc;
            res.send({ ...infoAdmin, accessToken });
        } catch (error) {
            if (error.isJoi) error.statusCode = 422;
            return next(error)
        }
    },
    // LOGOUT ADMIN
    adminLogout: (req, res) => {
        res.clearCookie("refreshTokenAdmin");
        res.send({ message: "Logout successfully!" })
    },
    // REFRESH TOKEN ADMIN
    refreshTokenAdmin: async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshTokenAdmin;
            if (!refreshToken) throw new ApiError(400, "Refresh Token is not valid");
            const userId = await JWT.verifyRefreshToken(refreshToken);

            const newAccessToken = await JWT.signAccessTokenAdmin(userId);
            const newRefreshToken = await JWT.signRefreshTokenAdmin(userId);
            res.cookie("refreshTokenAdmin", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                samSite: "strict",
            })
            res.send({ newAccessToken })
        } catch (error) {
            next(error)
        }
    },
}

module.exports = authController;
