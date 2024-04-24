
const Yup = require("yup");

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const userSchema = {
    update: Yup.object().shape({
        fullname: Yup.string().required("Hãy nhập họ và tên"),
        email: Yup.string().required("Hãy nhập email").email("Email không hợp lệ"),
        phone: Yup.string().required("Hãy nhập số điện thoại").matches(phoneRegExp, "Số điện thoại không hợp lệ"),
        address: Yup.string().required("Hãy nhập địa chỉ")
    }),
    updateImage: Yup.object().shape({
        image: Yup.string().required("Vui lòng chọn ảnh")
    }),
    updateFull: Yup.object().shape({
        fullname: Yup.string().required("Hãy nhập họ và tên"),
        email: Yup.string().required("Hãy nhập email").email("Email không hợp lệ"),
        phone: Yup.string().required("Hãy nhập số điện thoại").matches(phoneRegExp, "Số điện thoại không hợp lệ"),
        date: Yup.date("Ngày sinh không hợp lệ").required("Hãy chọn ngày sinh"),
        gender: Yup.number().required("Hãy chọn giới tính").oneOf([1, 2, 3]),
        address: Yup.string().required("Hãy nhập địa chỉ")
    })
}

const authSchema =
{
    register: Yup.object().shape({
        confirmPassword: Yup.string().required("Xác nhận lại mật khẩu").oneOf([Yup.ref('password'), null], "Xác nhận không chính xác"),
        password: Yup.string().required("Hãy nhập mật khẩu").min(6, "Mật khẩu có ít nhất 6 ký tự"),
        username: Yup.string().trim().required("Hãy nhập tên tài khoản").min(6, "Tên tài khoản có ít nhất 6 ký tự"),
        fullname: Yup.string().required("Hãy nhập họ và tên"),
    }),
    login: Yup.object().shape({
        password: Yup.string().required("Hãy nhập mật khẩu").min(6, "Mật khẩu có ít nhất 6 ký tự"),
        username: Yup.string().trim().required("Hãy nhập tên tài khoản").min(6, "Tên tài khoản có ít nhất 6 ký tự"),
    }),
    registerAdmin: Yup.object().shape({
        confirmPassword: Yup.string().required("Xác nhận lại mật khẩu").oneOf([Yup.ref('password'), null], "Xác nhận không chính xác"),
        password: Yup.string().required("Hãy nhập mật khẩu").min(6, "Mật khẩu có ít nhất 6 ký tự"),
        username: Yup.string().trim().required("Hãy nhập tên tài khoản").min(6, "Tên tài khoản có ít nhất 6 ký tự"),
        address: Yup.string().required("Hãy nhập địa chỉ"),
        position: Yup.number().typeError("Giá trị phải là số").required("Hãy chọn vị trí").oneOf([0, 1], "Vị trí không hợp lệ"),
        phone: Yup.string().required("Hãy nhập số điện thoại").matches(phoneRegExp, "Số điện thoại không hợp lệ"),
        fullname: Yup.string().required("Hãy nhập họ và tên"),
    }),
    changePassword: Yup.object().shape({
        confirmPassword: Yup.string().required("Xác nhận lại mật khẩu mới").oneOf([Yup.ref('newPassword'), null], "Xác nhận không chính xác"),
        newPassword: Yup.string().required("Hãy nhập mật khẩu mới").min(6, "Mật khẩu có ít nhất 6 ký tự").notOneOf([Yup.ref('password')], 'Mật khẩu mới khác mật khẩu hiện tại'),
        password: Yup.string().required("Hãy nhập mật khẩu hiện tại").min(6, "Mật khẩu có ít nhất 6 ký tự"),
    })
}

const bookSchema =
{
    validate: Yup.object().shape({
        title: Yup.string().trim().required("Vui lòng nhập tên sách"),
        img: Yup.string().trim().required("Vui lòng chọn hình ảnh"),
        price: Yup.number().typeError("Giá trị phải là số").required("Vui lòng nhập đơn giá").integer("Giá phải là số nguyên").moreThan(-1, "Giá phải lớn hơn hoặc bằng 0"),
        amount: Yup.number().typeError("Giá trị phải là số").integer("Số lượng phải là số nguyên").moreThan(-1, "Số lượng phải lớn hơn hoặc bằng 0"),
        author: Yup.string().required("Vui lòng chọn tác giả"),
        category: Yup.string().required("Vui lòng chọn thư mục"),
        publisher: Yup.string().required("Vui lòng chọn nhà xuất bản"),
    }),
}

const authorSchema = {
    validate: Yup.object().shape({
        fullname: Yup.string().trim().required("Vui lòng nhập tên tác giả"),
    }),
}

const publisherSchema = {
    validate: Yup.object().shape({
        name: Yup.string().trim().required("Vui lòng nhập tên nhà xuất bản"),
    }),
}

const categorySchema = {
    validate: Yup.object().shape({
        title: Yup.string().trim().required("Vui lòng nhập thư mục"),
    }),
}

const borrowingSchema = {
    add: Yup.object().shape({
        book_id: Yup.string().trim().required("Vui lòng chọn sách"),
        user_id: Yup.string().trim().required("Vui lòng đăng nhập"),
    }),
    update: Yup.object().shape({
        book_id: Yup.string().trim().required("Vui lòng chọn sách"),
        user_id: Yup.string().trim().required("Vui lòng đăng nhập"),
        admin_id: Yup.string().trim().required("Vui lòng đăng nhập"),
        status: Yup.string().oneOf(['Chưa duyệt', 'Đang mượn', 'Đã trả', 'Từ chối']),
        return_at: Yup.date("Ngày không hợp lệ"),
    })
}

const errorValidate = (res, error) => {
    if (error.name === "ValidationError") {
        error.statusCode = 422
        const err = {
            [error.path]: error.message
        }
        return res.status(422).send(err)
    };
}

const errorValidateAll = (res, error) => {
    if (error.name && error.name === "ValidationError") {
        error.statusCode = 422
        const errors = error.inner.reduce((totalErrors, err) => {
            return {
                ...totalErrors,
                [err.path]: err.message
            }
        }, {});
        return res.status(422).send(errors)
    }
}

module.exports = {
    authSchema,
    bookSchema,
    authorSchema,
    publisherSchema,
    categorySchema,
    borrowingSchema,
    userSchema,
    errorValidate,
    errorValidateAll,
}