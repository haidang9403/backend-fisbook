const ApiError = require("../api-error");
const User = require("../models/user.model");
const { authSchema } = require("../utils/validation_shema.util");
const { signAccessTokenUser, signRefreshTokenUser, verifyRefreshToken } = require("../utils/jwt.util");

const authController = {
    // REGISTER
    register: async (req, res, next) => {
        try {
            const result = await authSchema.register.validateAsync(req.body);
            const existUser = await User.findOne({ username: result.username });
            if (existUser) throw new ApiError(409, `${result.username} is already been registered`);

            const user = new User(result);
            const savedUser = await user.save();
            const accessToken = await signAccessTokenUser(savedUser.id);
            const refreshToken = await signRefreshTokenUser(savedUser.id);// refreshToken lưu vào cookie
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

            const accessToken = await signAccessTokenUser(user.id);
            const refreshToken = await signRefreshTokenUser(user.id); // refreshToken lưu vào cookie
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
            const userId = await verifyRefreshToken(refreshToken);

            const newAccessToken = await signAccessTokenUser(userId);
            const newRefreshToken = await signRefreshTokenUser(userId);
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
    }
}

module.exports = authController;
