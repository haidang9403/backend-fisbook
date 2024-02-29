const multer = require("multer");
const ApiError = require("../api-error")

const imgConfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "public/uploads")
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname)
    }
})

const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true)
    } else {
        callback(new ApiError(400, "Only image is allowed"))
    }
}

const upload = multer({
    storage: imgConfig,
    fileFilter: isImage
})



module.exports = upload