
const CustomerFunctions = require('../functions/Customer');
const SignupFunctions = require('../functions/auth');
const response = require('../helpers/response');
const validationFunctions = require('../functions/validations');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CustomerModel = require('../models/Customer');
const VehiclesModel = require('../models/Vehicles');
const SellerModel = require('../models/seller');
const OtpModel = require('../models/Otp');
const { generate4DigitCode } = require('../helpers/helper');
const nodemailer = require('nodemailer');
const path = require('path')
const ejs = require('ejs');
const AdminModel = require('../models/admin');
// const AdminModel = require('../Mails/verification/index.ejs');


require('dotenv').config();

const signUp = async (req, res) => {
    try {
        let { role, username, email, fullName, phone, password, car } = req.body
        console.log('siggning user up');
        let resObj = {};

        if (role == "customer") {
            let savedCustomer;
            let newVehicle;
            let customerExists = await SignupFunctions.getUserByEmail(req, role)
            if (customerExists && customerExists?._doc?.isVerifed) return response.resBadRequest(res, "username or email already exists");
            let hash = await bcrypt.hash(password, 10);
            let customerBody = { username, fullName, email, phone, password: hash }
            if (customerExists && !customerExists?._doc.isVerifed) {
                console.log('Update User data', customerExists?._doc)
                savedCustomer = await CustomerModel.findOneAndReplace({ _id: customerExists?._doc?._id }, customerBody)
                newVehicle = await VehiclesModel.findOne({ Owner: customerExists?._doc?._id, isSelected: true }, { ...car });
            }
            if (!customerExists) {
                savedCustomer = await new CustomerModel(customerBody).save();
                newVehicle = await new VehiclesModel({ Owner: savedCustomer?._id, isSelected: true, ...car }).save();
            }
            if (!savedCustomer) return response.resBadRequest(res, "There is some error on save Customer");
            if (!newVehicle) return response.resBadRequest(res, "There is some error on save Car");

            resObj = {
                id: savedCustomer._id,
                username: savedCustomer.username,
                email: savedCustomer.email,
                phone: savedCustomer.phone,
                name: savedCustomer.fullName,
            }
        }
        if (role == "seller") {
            let savedSeller;
            let SellerExists = await SignupFunctions.getUserByEmail(req, role)
            let hash = await bcrypt.hash(password, 10);
            let SellerBody = { username, fullName, email, phone, password: hash }
            if (SellerExists && !SellerExists?._doc.isVerifed) savedSeller = await SellerModel.findOneAndReplace({ _id: SellerExists?._doc?._id }, SellerBody)
            if (SellerExists && SellerExists?._doc.isVerifed) return response.resBadRequest(res, "username or email already exists");
            if (!SellerExists) savedSeller = await new SellerModel(SellerBody).save();
            if (!savedSeller) return response.resBadRequest(res, "There is some error on save Seller");

            resObj = {
                id: savedSeller._id,
                username: savedSeller.username,
                email: savedSeller.email,
                phone: savedSeller.phone,
                name: savedSeller.fullName,
            }
        }

        const transporter = nodemailer.createTransport({
            host: process.env.mailerHost,
            port: process.env.mailerPort,
            auth: {
                user: process.env.mailerEmail,
                pass: process.env.mailerPassword,
            },
        });
        let OTP = generate4DigitCode()
        let mailPath = path.resolve(__dirname, `../Mails/EmailVerification/index.ejs`)
        let Mail = await ejs.renderFile(mailPath, { data: { name: fullName ?? username, msg: OTP } });
        let transporterRes = await transporter.sendMail({
            from: process.env.mailerEmail,
            to: email,
            subject: "Verification",
            html: Mail,
        });
        if (transporterRes.rejected.length >= 1) return response.resBadRequest(res, transporterRes);
        let Otp = await new OtpModel({
            otp: OTP,
            email: resObj.email,
            For: "registration"
        }).save();

        return response.resSuccessData(res, {
            email: Otp.email,
            For: Otp.For,
            message: "Registration OTP Sended On Your Email"
        });


    }
    catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}




const logIn = async (req, res) => {
    try {
        let { role, password } = req.body

        let User = await SignupFunctions.getUser(req, role);
        if (!User) return response.resBadRequest(res, "couldn't find user");
        if (User && User?._doc?.isTerminated) return response.resBadRequest(res, "This user has been terminated")
        if (!await validationFunctions.verifyPassword(password, User.password)) return response.resAuthenticate(res, "one or more details are incorrect");
        if (!User?._doc.isVerifed) {
            const transporter = nodemailer.createTransport({
                host: process.env.mailerHost,
                port: process.env.mailerPort,
                auth: {
                    user: process.env.mailerEmail,
                    pass: process.env.mailerPassword,
                },
            });
            let OTP = generate4DigitCode()
            let mailPath = path.resolve(__dirname, `../Mails/EmailVerification/index.ejs`)
            let Mail = await ejs.renderFile(mailPath, { data: { name: User.fullName ?? User.name, msg: OTP } });
            let transporterRes = await transporter.sendMail({
                from: process.env.mailerEmail,
                to: User._doc.email,
                subject: "Verification",
                html: Mail,
            });
            if (transporterRes.rejected.length >= 1) return response.resBadRequest(res, transporterRes);
            let Otp = await new OtpModel({
                otp: OTP,
                email: User._doc.email,
                For: "registration"
            }).save();
            return res.status(400).send({
                status: false,
                code: 400,
                message: "Unverified user, please verify your email with the OTP sent to your email again",
            })
        }
        if (role == "seller" && !User._doc.business.isApproved) return res.status(400).send({
            status: false,
            code: 400,
            message: "Account is Not Approved by Admin Please contact to Admin",
            data: { _id: User?._doc?._id },
        })

        let selectEnv = role == 'customer' ? process.env.customerToken : role == "seller" ? process.env.sellerToken : undefined
        if (!selectEnv) return response.resBadRequest(res, "Invalid role or some thing Wrong on ENV");

        let refrashToken = jwt.sign({
            id: User.id,
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
                name: User.name,
                username: User.username,
                email: User.email,
                profileImage: User.avatarPath
            }, accessToken: token, refrashToken
        });
    }
    catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}


const logOut = async (req, res) => {
    try {

        let Customer = await CustomerFunctions.logout(req);
        return response.resSuccessData(res, "logout successfull");

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


// ----------------------------------------------- Admin -----------------------------------------------------//

const AdminSignUp = async (req, res) => {
    try {
        let { username, email, fullName, phone, password, role } = req.body
        console.log('siggning user up');
        let resObj = {};
        let AdminExists = await SignupFunctions.getAdminByEmail(req)
        if (AdminExists) return response.resBadRequest(res, "username or email already exists");
        let hash = await bcrypt.hash(password, 10);
        let adminBody = { username, fullName, email: email, phone, password: hash, role }
        // console.log(adminBody)
        let newAdmin = new AdminModel(adminBody)
        let savedAdmin = await newAdmin.save()
        // console.log(savedAdmin)

        if (!savedAdmin) return response.resBadRequest(res, "There is some error on save Customer");

        const transporter = nodemailer.createTransport({
            host: process.env.mailerHost,
            port: process.env.mailerPort,
            auth: {
                user: process.env.mailerEmail,
                pass: process.env.mailerPassword,
            },
        });
        let OTP = generate4DigitCode()
        let mailPath = path.resolve(__dirname, `../Mails/EmailVerification/index.ejs`)
        let Mail = await ejs.renderFile(mailPath, { data: { name: fullName ?? username, msg: OTP } });
        let transporterRes = await transporter.sendMail({
            from: process.env.mailerEmail,
            to: email,
            subject: "Verification",
            html: Mail,
        });
        if (transporterRes.rejected.length >= 1) return response.resBadRequest(res, transporterRes);
        let Otp = await new OtpModel({
            otp: OTP,
            email: savedAdmin.email,
            For: "registration"
        }).save();

        return response.resSuccessData(res, {
            email: Otp.email,
            For: Otp.For,
            message: "Registration OTP Sended On Your Email"
        });

    }
    catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}

const AdminlogIn = async (req, res) => {
    try {
        let { password } = req.body

        let admin = await SignupFunctions.getAdmin(req);
        if (!admin) return response.resBadRequest(res, "couldn't find user");
        if (admin && admin?._doc?.isTerminated) return response.resBadRequest(res, "This user has been terminated");
        const transporter = nodemailer.createTransport({
            host: process.env.mailerHost,
            port: process.env.mailerPort,
            auth: {
                user: process.env.mailerEmail,
                pass: process.env.mailerPassword,
            },
        });
        let OTP = generate4DigitCode()
        let mailPath = path.resolve(__dirname, `../Mails/EmailVerification/index.ejs`)
        let Mail = await ejs.renderFile(mailPath, { data: { name: admin?._doc?.fullName ?? admin?._doc?.username, msg: OTP } });
        if (!await validationFunctions.verifyPassword(password, admin.password)) return response.resAuthenticate(res, "one or more details are incorrect");
        if (!admin?._doc.isVerifed) {
            let transporterRes = await transporter.sendMail({
                from: process.env.mailerEmail,
                to: admin._doc.email,
                subject: "Verification",
                html: Mail,
            });
            if (transporterRes.rejected.length >= 1) return response.resBadRequest(res, transporterRes);
            let Otp = await new OtpModel({
                otp: OTP,
                email: admin._doc.email,
                For: "registration"
            }).save();

            return res.send({
                status: false,
                code: 200,
                message: "Unverified user, please verify your email with the OTP sent to your email again",
            })
        }
        let transporterRes = await transporter.sendMail({
            from: process.env.mailerEmail,
            to: admin._doc.email,
            subject: "Login",
            html: Mail,
        });
        if (transporterRes.rejected.length >= 1) return response.resBadRequest(res, transporterRes);
        let Otp = await new OtpModel({
            otp: OTP,
            email: admin._doc.email,
            For: "registration"
        }).save();

        return response.resSuccessData(res, {
            email: Otp.email,
            For: "Login",
            message: "Login OTP Sended On Your Email"
        });
    }
    catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}

module.exports = {
    signUp,
    logOut,
    logIn,
    AdminSignUp,
    AdminlogIn,

}