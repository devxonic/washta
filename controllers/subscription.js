const response = require("../helpers/response");
const subscriptionModel = require("../models/subscription");
const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");


const subscibe = async (req, res) => {
    try {
        let { name, email, phone, companyName, registerOnwashta, acceptOnlinePayment, additionalText } = req.body
        let exits = await subscriptionModel.findOne({ email })
        if (exits) return response.resBadRequest(res, `you Already subscribe with this ${email} Email`)
        let subs = await subscriptionModel({ name, email, phone, companyName, registerOnwashta, acceptOnlinePayment, additionalText }).save()
        if (!subs) return response.resBadRequest(res, "couldn't Found")
        const transporter = nodemailer.createTransport({
            host: process.env.mailerHost,
            port: process.env.mailerPort,
            auth: {
                user: process.env.mailerEmail,
                pass: process.env.mailerPassword,
            },
        });
        let mailPath = path.resolve(__dirname, `../Mails/subsciptions/index.ejs`)
        let Mail = await ejs.renderFile(mailPath, { data: { name } });
        let transporterRes = await transporter.sendMail({
            from: process.env.mailerEmail,
            to: email,
            subject: "subscription",
            html: Mail,
        });
        if (transporterRes.rejected.length >= 1) return response.resBadRequest(res, transporterRes);
        response.resSuccessData(res, subs)
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}



const getAllSubscibers = async (req, res) => {
    try {
        let subs = await subscriptionModel.find()
        if (!subs) response.resBadRequest(res, "couldn't Found")
        response.resSuccessData(res, subs)
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}


const getSubscibersById = async (req, res) => {
    try {
        let { id } = req.params
        let subs = await subscriptionModel.findOne({ _id: id })
        if (!subs) response.resBadRequest(res, "couldn't Found")
        response.resSuccessData(res, subs)
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}


module.exports = {
    subscibe,
    getAllSubscibers,
    getSubscibersById

}