
const CustomerFunctions = require('../functions/Customer');
const SignupFunctions = require('../functions/auth');
const response = require('../helpers/response');
const validationFunctions = require('../functions/validations');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CustomerModel = require('../models/Customer');
const VehiclesModel = require('../models/Vehicles');
const SellerModel = require('../models/seller');
require('dotenv').config();

const signUp = async (req, res) => {
    try {
        let { role, username, email, name, phone, password, car } = req.body
        console.log('siggning user up');

        let resObj = {};

        if (role == "customer") {

            let customerExists = await SignupFunctions.getUser(req , role)
            if (!customerExists) return response.resBadRequest(res, "username or email already exists");
            let hash = await bcrypt.hash(password, 10);
            let customerBody = { username, name, email, phone, password: hash }
            let newCustomer = new CustomerModel(customerBody)
            let savedCustomer = await newCustomer.save()

            if (!savedCustomer) return response.resBadRequest(res, "There is some error on save Customer");
            let newVehicle = await new VehiclesModel({ Owner: savedCustomer._id, ...car }).save()
            if (!newVehicle) return response.resBadRequest(res, "There is some error on save Car");
            resObj = {
                id: savedCustomer._id,
                username: savedCustomer.username,
                email: savedCustomer.email,
                phone: savedCustomer.phone,
                name: savedCustomer.name,
            }
        }
        if (role == "seller") {
            let SellerExists = await SignupFunctions.getUser(req , role)
            if (!SellerExists) return response.resBadRequest(res, "username or email already exists");
            let hash = await bcrypt.hash(password, 10);
            let SellerBody = { username, name, email, phone, password: hash }
            let newSeller = new SellerModel(SellerBody)
            let savedSeller = await newSeller.save()
            if (!savedSeller) return response.resBadRequest(res, "There is some error on save Customer");

            resObj = {
                id: savedSeller._id,
                username: savedSeller.username,
                email: savedSeller.email,
                phone: savedSeller.phone,
                name: savedSeller.name,
            }
        }

        let selectEnv = role == 'customer' ? process.env.customerToken : role == "seller" ? process.env.sellerToken : undefined
        if (!selectEnv) return response.resBadRequest(res, "Invalid role or some thing Wrong on ENV");
        let refrashToken = jwt.sign({
            id: resObj.id,
            email: resObj.email,
            username: resObj.username
        }, selectEnv, { expiresIn: '30 days' })

        await SignupFunctions.updateRefreshToken(req, refrashToken, role)
        let token = jwt.sign({
            id: resObj.id,
            email: resObj.email,
            username: resObj.username
        }, selectEnv, { expiresIn: '7d' })

        return response.resSuccessData(res, {
            user: {
                id: resObj.id,
                username: resObj.username,
                email: resObj.email,
                phone: resObj.phone,
            },
            accessToken: token, refrashToken
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

        User = await SignupFunctions.getUser(req, role);
        if (!User) return response.resBadRequest(res, "couldn't find user");
        if (!await validationFunctions.verifyPassword(password, User.password)) return response.resAuthenticate(res, "one or more details are incorrect");

        let selectEnv = role == 'customer' ? process.env.customerToken : role == "seller" ? process.env.sellerToken : undefined
        if (!selectEnv) return response.resBadRequest(res, "Invalid role or some thing Wrong on ENV");

        let refrashToken = jwt.sign({
            id: User.id,
            email: User.email,
            username: User.username
        }, selectEnv, { expiresIn: '30 days' })

        await SignupFunctions.updateRefreshToken(req, refrashToken , role)

        let token = jwt.sign({
            id: User.id,
            email: User.email,
            username: User.username
        }, selectEnv , { expiresIn: '7d' })


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

module.exports = {
    signUp,
    logOut,
    logIn,

}