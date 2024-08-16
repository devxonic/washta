require('dotenv').config;
const jwt = require('jsonwebtoken');
const response = require('../helpers/response');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const rateLimiter = require('express-rate-limit');

aws.config.update({
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    region: process.env.S3_REGION
})

const s3 = new aws.S3();


const awsUpload = new multer({
    storage: multerS3({
        s3: s3,
        dirname: '/files',
        bucket: process.env.S3_BUCKET_NAME,
        contentDisposition: 'inline',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // acl: 'public-read',
        key: function (req, file, cb) {
            let dateparam = new Date();
            console.log('FFILER::', file);
            cb(
                null,
                `files/${dateparam.getTime()}_${file.originalname}`
            );
        },
    }),
});





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
                req.user = Authdata;
                next();
            }
        });
    } else {
        return response.resAuthenticate(res, "no token found");
    }
}

const verifySeller = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearertoken = bearer[1];
        req.token = bearertoken;
        jwt.verify(req.token, process.env.sellerToken, async (err, Authdata) => {
            if (err) {
                return response.resUnauthorized(res, "couldn't verify the token!");
            } else {
                req.user = Authdata;
                next();
            }
        });
    } else {
        return response.resAuthenticate(res, "no token found");
    }
}


const verifyAdmin = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearertoken = bearer[1];
        req.token = bearertoken;
        jwt.verify(req.token, process.env.adminToken, async (err, Authdata) => {
            if (err) {
                return response.resUnauthorized(res, "couldn't verify the token!");
            } else {
                req.user = Authdata;
                next();
            }
        });
    } else {
        return response.resAuthenticate(res, "no token found");
    }
}



const limiter = rateLimiter({
    windowMs: 2 * 60 * 1000,
    max: 10,
    message: { status: false, code: 429, message: 'Too many requests, please try again later.' },
});


module.exports = {
    verifyCustomer,
    verifySeller,
    verifyAdmin,
    awsUpload,
    limiter
}
