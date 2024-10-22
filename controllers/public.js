const response = require("../helpers/response")
const stripe = require("stripe")(process.env.stripe_secret);

const uploadFile = async (req, res) => {
    try {
        console.log(req.file);
        if (!req.file) {
            console.log("No file received");
            return res.sendStatus(204);
        } else {
            //  { url: req.file.location, name: req.file.originalname, type: req.file.mimetype }
            return response.resSuccessData(res, { path: req.file.location });
        }
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error);
    }
};

const regenerateAccountLink = async (req, res) => {
    console.log("req.query", req.query);
    let link = await stripe.accountLinks.create({
        account: req.params.acctId,
        refresh_url: `${process.env.backendURL}/api/regenerateAccountLink/${req.params.acctId}`,
        return_url: process.env.baseURL,
        type: "account_onboarding",
    });
    res.redirect(link.url);
    // return res.json({ message: "please click this link", url: link.url });
}
module.exports = {
    uploadFile,
    regenerateAccountLink,
}