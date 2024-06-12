let CustomerModel = require('../models/Customer')
let OtpModel = require('../models/Otp')
let response = require('../helpers/response')
const SignupFunctions = require('../functions/auth');
const { generate4DigitCode } = require('../helpers/helper')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const path = require('path')
const ejs = require('ejs');
const SellerModel = require('../models/seller');


const sendOTP = async (req, res) => {
    try {
        let { email, role } = req.body;
        if (!email) return response.resBadRequest(res, "email & role value is Must required");
        let User = await SignupFunctions.getUserByEmail(req, role);
        if (!User) return response.resUnauthorized(res, "This User doesn't Exist");

        const transporter = nodemailer.createTransport({
            host: process.env.mailerHost,
            port: process.env.mailerPort,
            auth: {
                user: process.env.mailerEmail,
                pass: process.env.mailerPassword,
            },
        });
        let OTP = generate4DigitCode()
        let mailPath = path.resolve(__dirname, `../Mails/resetPassword/index.ejs`)
        let Mail = await ejs.renderFile(mailPath, { data: { Code: OTP } });
        let transporterRes = await transporter.sendMail({
            from: process.env.EmailFrom,
            to: email,
            subject: "Forget Password",
            html: Mail,
        });
        if (transporterRes.rejected.length >= 1) return response.resBadRequest(res, transporterRes);
        let Otp = await new OtpModel({
            otp: OTP,
            email: email,
            For: "forgetPassword"
        }).save();
        response.resSuccess(res, `OTP SuccessFully Send on ${email}`)

    } catch (error) {
        console.error(error);
        return response.resBadRequest(res, error);
    }
}
const VerifyCode = async (req, res) => {
    try {
        let { code, email } = req.body;
        if (!code && !email) return response.resBadRequest(res, "code & email value is Must required");

        let OTP = await OtpModel.findOne({ $and: [{ email: email }, { otp: code }, { For: "forgetPassword" }] })
        if (!OTP) return response.resBadRequest(res, "Invailed payload");
        let Passwordtoken = jwt.sign(
            { ...OTP._doc },
            process.env.OTPPasswordToken,
            { expiresIn: 60 * 5 }
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
        let customer = await SignupFunctions.resetPassword(decoded.email , newPassword, role);
        console.log("", customer)
        if (!customer) return response.resUnauthorized(res, "This Customer doesn't Exist");
        return response.resSuccess(res, "Password Successfully Changed");

    } catch (error) {
        console.error(error);
        return response.resBadRequest(res, error);
    }
}



const userVerifiaction = async (req, res) => {
    try {
        let { code, role, email } = req.body;

        if (!code && !role) return response.resBadRequest(res, "code & role  value is Must required");

        let OTP = await OtpModel.findOne({ $and: [{ email: email }, { otp: code }, { For: "registration" }] })
        if (!OTP) return response.resBadRequest(res, "Invailed payload");
        let User = await SignupFunctions.MakeUserVerifed(req, role)
        if (!User) return response.resUnauthorized(res, "This User doesn't Exist");

        let selectEnv = role == 'customer' ? process.env.customerToken : role == "seller" ? process.env.sellerToken : undefined
        if (!selectEnv) return response.resBadRequest(res, "Invalid role or some thing Wrong on ENV");
        let refrashToken = jwt.sign({
            id: User._id,
            email: User.email,
            username: User.username
        }, selectEnv, { expiresIn: '30 days' })

        await SignupFunctions.updateRefreshToken(req, refrashToken, role)
        let token = jwt.sign({
            id: User.id,
            email: User.email,
            username: User.username
        }, selectEnv, { expiresIn: '7d' })

        return response.resSuccessData(res, {
            user: {
                id: User.id,
                username: User.username,
                email: User.email,
                phone: User.phone,
            },
            accessToken: token, refrashToken
        });


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