
const CustomerFunctions = require('../functions/Customer');
const response = require('../helpers/response');
const validationFunctions = require('../functions/validations');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CustomerModel = require('../models/Customer');
const VehiclesModel = require('../models/Vehicles');
require('dotenv').config();

const signUp = async (req, res) => {
    try {
        let { role, username, email, name, phone, password, car } = req.body
        console.log('siggning user up');
        
        let customerExists = await CustomerModel.findOne({ $or: [{ username: username }, { email: email }] })
        if (customerExists) return response.resBadRequest(res, "username or email already exists");
        console.log('18 --- ');
        let hash = await bcrypt.hash(password, 10);
        let customerBody = { username, name, email, phone, password : hash }
        let newCustomer = new CustomerModel(customerBody)
        let savedCustomer = await newCustomer.save()
        console.log(savedCustomer)
        console.log('23 --- ');
        if (savedCustomer) {
            let newVehicle = new VehiclesModel({
                Owner: savedCustomer._id, ...car
            })
            let savedVehicle = await newVehicle.save()
            if (savedVehicle) {
                let refrashToken = jwt.sign({
                    id: savedCustomer.id,
                    email: savedCustomer.email,
                    username: savedCustomer.username
                }, process.env.customerToken, { expiresIn: '30 days' })

                await CustomerFunctions.updateRefreshToken(req, refrashToken)
                let token = jwt.sign({
                    id: savedCustomer.id,
                    email: savedCustomer.email,
                    username: savedCustomer.username
                }, process.env.customerToken, { expiresIn: '7d' })

                return response.resSuccessData(res, {
                    user: {
                        name: savedCustomer.name,
                        username: savedCustomer.username,
                        email: savedCustomer.email
                    },
                    car: { ...savedVehicle._doc },
                    accessToken: token, refrashToken
                });
            }

        }

    }
    catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}




const logIn = async (req, res) => {
    try {
        let User;
        if (req.body.type === "google") {
            User = await CustomerFunctions.signUpWithGoogle(req)
            console.log('Customers', User)
        }
        else {
            if (!await validationFunctions.validateEmailUsername(req)) return response.resBadRequest(res, "couldn't find user");
            Customer = await CustomerFunctions.getCustomer(req);
            console.log('Customers', Customer)
            // if (! await validationFunctions.verifyPassword(req.body.password, Customer.password)) return response.resAuthenticate(res, "one or more details are incorrect");
            // if(!player.isActive) {return response.resAuthenticate(res, "your account has been disabled / deactivated")}
        }
        let refrashToken = jwt.sign({
            id: User.id,
            email: User.email,
            username: User.username
        }, process.env.customerToken, { expiresIn: '30 days' })

        await CustomerFunctions.updateRefreshToken(req, refrashToken)

        let token = jwt.sign({
            id: User.id,
            email: User.email,
            username: User.username
        }, process.env.customerToken, { expiresIn: '7d' })

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