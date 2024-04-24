const ApiError = require("../api-error");
const User = require("../models/user.model");
const Admin = require("../models/admin.model");
const { authSchema, errorValidate, errorValidateAll } = require("../utils/validation_shema.util");
const JWT = require("../utils/jwt.util");

const authController = {
    // REGISTER
    register: async (req, res, next) => {
        try {
            const result = await authSchema.register.validate(req.body);
            const { confirmPassword, ...registerUser } = result;
            const existUser = await User.findOne({ username: registerUser.username });
            if (existUser) return res.status(422).send({ username: "Tài khoản đã tồn tại" });

            const user = new User(registerUser);
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
            return res.send({ ...infoUser, accessToken });
        } catch (error) {
            if (error.name === "ValidationError") {
                errorValidate(res, error);
            } else {
                return next(error);
            }
        }
    },
    // LOGIN
    login: async (req, res, next) => {
        try {
            const result = await authSchema.login.validate(req.body);
            const user = await User.findOne({ username: result.username });
            if (!user) return res.status(422).send({ username: "Tài khoản không tồn tại" });

            const isMatch = await user.isValidPassword(result.password);
            if (!isMatch) return res.status(422).send({ username: "Tài khoản hoặc mật khẩu không đúng" });

            const accessToken = await JWT.signAccessTokenUser(user._doc._id);
            const refreshToken = await JWT.signRefreshTokenUser(user._doc._id); // refreshToken lưu vào cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                samSite: "strict",
            })
            const { password, ...infoUser } = user._doc;
            return res.send({ ...infoUser, accessToken });
        } catch (error) {
            if (error.name === "ValidationError") {
                errorValidate(res, error);
            } else {
                return next(error);
            }
        }
    },
    // REFRESH TOKEN
    refreshToken: async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) throw new ApiError(400, "Refresh Token is not valid");
            const userId = await JWT.verifyToken(refreshToken);
            console.log(userId)

            const newAccessToken = await JWT.signAccessTokenUser(userId);
            const newRefreshToken = await JWT.signRefreshTokenUser(userId);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                samSite: "strict",
            })
            res.send({ accessToken: newAccessToken })
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
            const result = await authSchema.login.validate(req.body);
            const admin = await Admin.findOne({ username: result.username });
            if (!admin) return res.status(404).send({ username: "Tài khoản không tồn tại" })
            const isMatch = await admin.isValidPassword(result.password);
            if (!isMatch) return res.status(422).send({ password: "Mật khẩu hoặc tài khoản không chính xác" })

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
            if (error.name === "ValidationError") {
                error.statusCode = 422
                const err = {
                    [error.path]: error.message
                }
                return res.status(422).send(err)
            };

            next(error);
        }
    },
    // REGISTER ADMIN
    adminRegister: async (req, res, next) => {
        try {
            const result = await authSchema.registerAdmin.validate(req.body);
            const existAdmin = await Admin.findOne({ username: result.username });
            if (existAdmin) res.status(400).send({ username: "Tài khoản đã tồn tại" });

            const { confirmPassword, ...adminInfo } = result
            const admin = new Admin(adminInfo);
            const savedAdmin = await admin.save();

            const { password, ...infoAdmin } = savedAdmin._doc;
            res.status(200).send(infoAdmin);
        } catch (error) {
            if (error.name === "ValidationError") {
                console.log(error)
                errorValidateAll(res, error);
            } else {
                return next(error);
            }
        }
    },
    // LOGOUT ADMIN
    adminLogout: (req, res) => {
        res.clearCookie("refreshTokenAdmin");
        res.send({ message: "Đăng xuất thành công!" })
    },
    getRefeshToken: (req, res) => {
        res.send(!!req.cookies.refreshTokenAdmin);
    },
    getRefreshTokenUser: (req, res) => {
        res.send(!!req.cookies.refreshToken);
    },
    // REFRESH TOKEN ADMIN
    refreshTokenAdmin: async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshTokenAdmin;
            if (!refreshToken) throw new ApiError(400, "Refresh Token is not valid");
            const userId = await JWT.verifyToken(refreshToken);

            const newAccessToken = await JWT.signAccessTokenAdmin(userId);
            const newRefreshToken = await JWT.signRefreshTokenAdmin(userId);
            res.cookie("refreshTokenAdmin", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                samSite: "strict",
            })
            res.send({ accessToken: newAccessToken })
        } catch (error) {
            next(error)
        }
    },
    changePassword: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id) next(new ApiError(400, "Refresh Token is not valid"));

            const result = await authSchema.changePassword.validate(req.body);

            const user = await User.findById(id)
            if (!user) next(new ApiError(404, "User not found"));

            const isMatch = await user.isValidPassword(result.password);
            if (!isMatch) return res.status(422).send({ password: "Mật khẩu không chính xác" });

            user.password = result.newPassword;

            const userSaved = await user.save()

            const accessToken = await JWT.signAccessTokenUser(userSaved.id);
            const refreshToken = await JWT.signRefreshTokenUser(userSaved.id);// refreshToken lưu vào cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                samSite: "strict",
            });

            const { password, ...infoUser } = userSaved._doc;
            return res.status(200).send({ ...infoUser, accessToken });
        } catch (error) {
            if (error.name === "ValidationError") {
                errorValidate(res, error);
            } else {
                return next(error);
            }
        }
    }
}

module.exports = authController;
