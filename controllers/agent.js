
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


const endChat = async (req, res) => {
    try {
        let Booking = await agentFunctoins.endChat(req)
        if (Booking?.error) return response.resBadRequest(res, Booking.error)
        if (Booking?.success) return response.resBadRequest(res, Booking.success)
        if (!Booking) return response.resBadRequest(res, "couldn't find support Room")
        return response.resSuccessData(res, Booking);

    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}


// ----------------------------------------------- review -----------------------------------------------------//

const getAgentReviews = async (req, res) => {
    try {
        let Order = await agentFunctoins.getAgentReviews(req)
        if (!Order) return response.resBadRequest(res, "couldn't find review")
        return response.resSuccessData(res, Order);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const replyToReview = async (req, res) => {
    try {
        let Order = await agentFunctoins.replyToReview(req)
        if (!Order) return response.resBadRequest(res, "couldn't find review")
        return response.resSuccessData(res, Order);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}

const editMyReplys = async (req, res) => {
    try {
        let Order = await agentFunctoins.editMyReplys(req)
        if (!Order) return response.resBadRequest(res, "couldn't find review")
        return response.resSuccessData(res, Order);
    } catch (error) {
        console.log(error);
        return response.resInternalError(res, error)
    }
}



module.exports = {
    getSupportRoom,
    acceptSupportRequest,
    getAgentReviews,
    replyToReview,
    editMyReplys,
    endChat,
}