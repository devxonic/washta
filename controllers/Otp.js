let CustomerModel = require('../models/Customer')
let OtpModel = require('../models/Otp')
let response = require('../helpers/response')
const { generate4DigitCode } = require('../helpers/helper')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const path = require('path')
const ejs = require('ejs')


const sendOTP = async (req, res) => {
    try {
        let isUserExist = false
        let { sendTo, For, role } = req.body;
        if (!sendTo && !For) return response.resBadRequest(res, "sendTo & For value is Must required");
        if (role === "customer") {
            let Customer = await CustomerModel.findOne({ email: sendTo });
            console.log("", Customer)
            if (!Customer) {
                return response.resUnauthorized(res, "This Customer doesn't Exist");
            }
            isUserExist = true
        } else {
            return response.resBadRequest(res, "Invaild Inputs");
        }
        if (isUserExist) {
            const transporter = nodemailer.createTransport({
                host: process.env.mailerHost,
                port: process.env.mailerPort,
                auth: {
                    user: process.env.mailerEmail,
                    pass: process.env.mailerPassword,
                },
            });
            let OTP = generate4DigitCode()
            let mailPath = path.resolve(__dirname, `../Mails/${For == "forgetPassword" ? "resetPassword" : For == "Verification" ? "EmailVerification" : ""}/index.ejs`)
            let Mail = await ejs.renderFile(mailPath, { data: { Code: OTP } });
            transporter.sendMail({
                from: process.env.EmailFrom,
                to: sendTo,
                subject: For == "forgetPassword" ? "Forget Password" : For == "verification" ? "Verification" : "",
                html: Mail,
            },
                async function (err) {
                    if (err) return response.resBadRequest(res, "Message Not send");
                    let Otp = new OtpModel({
                        otp: OTP,
                        email: sendTo,
                        For
                    });
                    await Otp.save();
                    response.resSuccess(res, "OTP SuccessFully Send")

                });
        }

    } catch (error) {
        console.error(error);
        return response.resBadRequest(res, error);
    }
}
const VerifyCode = async (req, res) => {
    try {
        let { code, email } = req.body;
        if (!code && !email) return response.resBadRequest(res, "code & Email value is Must required");

        let OTP = await OtpModel.findOne({ $and: [{ email: email }, { otp: code }] })
        if (!OTP) return response.resBadRequest(res, "OTP Or Email is Invailed");

        let Passwordtoken = jwt.sign(
            { ...OTP._doc },
            OTP.For == "verification" ? process.env.OTPverifyToken : process.env.OTPPasswordToken,
            { expiresIn: 60 * 2 }
        );
        response.resSuccessData(res, { token: Passwordtoken })
    } catch (error) {
        console.error(error);
        return response.resBadRequest(res, error);
    }
}


const setPassword = async (req, res) => {
    try {
        let { token, newPassword, role } = req.body;
        if (!token && !newPassword) return response.resBadRequest(res, "newPassword value is Must required");
        let decoded = jwt.verify(token, process.env.OTPPasswordToken)
        console.log(decoded.email)
        if (!decoded) return response.resUnauthorized(res, "Invailed Token");
        if (decoded.For != "forgetPassword") return response.resUnauthorized(res, "Invailed Token");
        if (role === "customer") {
            let customer = await CustomerModel.findOneAndUpdate({ email: decoded.email }, { password: newPassword });
            console.log("", customer)
            if (!customer) {
                return response.resUnauthorized(res, "This Customer doesn't Exist");
            }
            return response.resSuccess(res, "Password Successfully Changed")
        }
    } catch (error) {
        console.error(error);
        return response.resBadRequest(res, error);
    }
}



const userVerifiaction = async (req, res) => {
    try {
        let { token, role } = req.body;
        if (!token && !role) return response.resBadRequest(res, "Token and role value is Must required");
        let decoded = jwt.verify(token, process.env.OTPverifyToken)
        console.log(decoded.email)
        if (!decoded) return response.resUnauthorized(res, "Invailed Token");
        if (decoded.For != "verification") return response.resUnauthorized(res, "Invailed Token");
        if (role === "customer") {
            let customer = await CustomerModel.findOneAndUpdate({ email: decoded.email }, { isVerifed: true });
            console.log("", customer)
            if (!customer) {
                return response.resUnauthorized(res, "This Customer doesn't Exist");
            }
            return response.resSuccess(res, "User Successfully Verified")
        }
    } catch (error) {
        console.error(error);
        return response.resBadRequest(res, error);
    }
}


module.exports = {
    sendOTP,
    VerifyCode,
    setPassword,
    userVerifiaction,
}