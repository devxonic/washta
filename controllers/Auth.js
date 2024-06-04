
const CustomerFunctions = require('../functions/Customer');
const response = require('../helpers/response');
const validationFunctions = require('../functions/validations');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const signUp = async (req, res) => {
    try {
        console.log('siggning user up');
        if (await validationFunctions.validateEmailUsernameSignUp(req)) return response.resBadRequest(res, "username or email already exists");

        let Customer = await CustomerFunctions.signUp(req);
        let refrashToken = jwt.sign({
            id: Customer.id,
            email: Customer.email,
            username: Customer.username
        }, process.env.customerToken, { expiresIn: '30 days' })

        await CustomerFunctions.updateRefreshToken(req, refrashToken)
        let token = jwt.sign({
            id: Customer.id,
            email: Customer.email,
            username: Customer.username
        }, process.env.customerToken, { expiresIn: '7d' })

        return response.resSuccessData(res, {
            user: {
                name: Customer.name,
                username: Customer.username,
                email: Customer.email
            }, accessToken: token, refrashToken
        });
    }
    catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
}




const logIn = async (req, res) => {
    try {
        let Customer;
        if (req.body.type === "google") {
            Customer = await CustomerFunctions.signUpWithGoogle(req)
            console.log('Customers', Customer)
        }
        else {
            if (!await validationFunctions.validateEmailUsername(req)) return response.resBadRequest(res, "couldn't find user");
            Customer = await CustomerFunctions.getCustomer(req);
            console.log('Customers', Customer)
            if (! await validationFunctions.verifyPassword(req.body.password, Customer.password)) return response.resAuthenticate(res, "one or more details are incorrect");
            // if(!player.isActive) {return response.resAuthenticate(res, "your account has been disabled / deactivated")}
        }
        let refrashToken = jwt.sign({
            id: Customer.id,
            email: Customer.email,
            username: Customer.username
        }, process.env.customerToken, { expiresIn: '30 days' })

        await CustomerFunctions.updateRefreshToken(req, refrashToken)

        let token = jwt.sign({
            id: Customer.id,
            email: Customer.email,
            username: Customer.username
        }, process.env.customerToken, { expiresIn: '7d' })


        return response.resSuccessData(res, {
            user: {
                id: Customer.id,
                name: Customer.name,
                username: Customer.username,
                email: Customer.email,
                profileImage: Customer.avatarPath
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