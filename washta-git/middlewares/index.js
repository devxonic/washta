const jwt = require('jsonwebtoken');
const response = require('../helpers/response');
require('dotenv').config;

const verifyCustomer = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearertoken = bearer[1];
        req.token = bearertoken;
        jwt.verify(req.token, process.env.customerToken, async (err, Authdata) => {
            if (err) {
                return response.resUnauthorized(res, "couldn't verify the token!");
            } else {
                // let deactive = await isUserDeactive(Authdata.id)
                // console.log(deactive)
                // if(deactive) return response.resUnauthorized(res, "your account is deactivated to perform any action")
                req.user = Authdata;
                next();
            }
        });
    } else {
        return response.resAuthenticate(res, "no token found");
    }
}

module.exports = {
    verifyCustomer,
}
