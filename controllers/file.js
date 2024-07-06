const response =  require("../helpers/response")

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

module.exports = {
    uploadFile,
}