
const response = require('../helpers/response');
const agentFunctoins = require('../functions/agent');

// ----------------------------------------------- help/support -----------------------------------------------------//

const getSupportRoom = async (req, res) => {
    try {
        let Booking = await agentFunctoins.getSupportRoom(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find support Room")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const acceptSupportRequest = async (req, res) => {
    try {
        let Booking = await agentFunctoins.acceptSupportRequest(req)
        if (!Booking) return response.resBadRequest(res, "couldn't find support Room")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}




module.exports = {
    getSupportRoom,
    acceptSupportRequest,
}