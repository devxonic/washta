
const chatRoomModel = require('../models/chatRoom');
const ReviewModel = require('../models/Review');
const response = require('../helpers/response');
const agentFunctoins = require('../functions/agent');
const { getRatingStatistics, formateReviewsRatings, formateReviewsRatingsSingle } = require('../helpers/helper');

// ----------------------------------------------- help/support -----------------------------------------------------//

const getSupportRoom = async (req, res) => {
    let { status, New } = req.query
    let { id } = req.params

    console.log(New)
    let sts = status ? { requestStatus: status } : {}
    let isNew = New == "true" ? { isSomeOneConnected: { $ne: true } } : { 'connectedWith.id': req?.user?.id }

    let filter = {
        ...sts,
        ...isNew
    }
    console.log(filter)
    if (id) {
        let chatRoom = await chatRoomModel.findOne({ _id: id, 'connectedWith.id': req?.user?.id })
        return chatRoom
    }
    let chatRoom = await chatRoomModel.find({ ...filter })
    return chatRoom
}

const acceptSupportRequest = async (req, res) => {
    let { id } = req.params
    let { status } = req.body



    let user = {
        id: req.user.id,
        username: req.user.username,
        role: "agent",
    }
    let body = {}
    let date = new Date()

    if (status == 'ongoing') {
        body = {
            isSomeOneConnected: true,
            requestStatus: "ongoing",
            connectedWith: user
        }
    }
    if (status == 'rejected') {
        body = {
            isSomeOneConnected: true,
            requestStatus: "rejected",
            connectedWith: user,
            resolvedBy: user,
            rejectedAt: date
        }
    }
    if (status == 'resolved') {
        body = {
            isSomeOneConnected: true,
            requestStatus: "resolved",
            connectedWith: user,
            resolvedBy: user,
            rejectedAt: date
        }
    }

    let chatRoom = await chatRoomModel.findOneAndUpdate({ _id: id, requestStatus: { $in: ['pending', 'ongoing'] }, isSomeOneConnected: { $ne: true } }, { $set: body }, { new: true })
    return chatRoom
}

const endChat = async (req, res) => {
    let { id } = req.params
    let { status } = req.body

    let checkTicket = await chatRoomModel.findOne({ _id: id }, { isEnded: 1 })
    if (checkTicket?.isEnded) return { error: { message: "this ticket is Already Ended" } }

    let user = {
        id: req.user.id,
        username: req.user.username,
        role: "agent",
    }
    let body = {}
    let date = new Date();
    if (status == "ongoing") {
        body = {
            $set: {
                requestStatus: status,
            }
        }
    }
    if (status == "rejected") {
        body = {
            $set: {
                requestStatus: status,
                isEnded: true,
                endedBy: user,
                endedAt: date,
                rejectedAt: date,
                rejectedBy: user,
            },
        }
    }
    if (status == "resolved") {
        body = {
            $set: {
                requestStatus: status,
                isEnded: true,
                endedBy: user,
                endedAt: date,
                resolvedBy: user,
                resolvedAt: date,
            },
        }
    }

    let ticket = await chatRoomModel.findOneAndUpdate({ _id: id }, body, { new: true })
    return ticket
}

// ----------------------------------------------- review -----------------------------------------------------//


const getAgentReviews = async (req) => {
    let { limit, summaryOnly } = req.query
    let populate = [
        { path: "customerId", select: { username: 1, avatar: 1, resizedAvatar: 1, fullname: 1, email: 1, phone: 1 } },
        { path: "sellerId", select: { username: 1, avatar: 1, resizedAvatar: 1, fullname: 1, email: 1, phone: 1 } },
        { path: "agentId", select: { username: 1, avatar: 1, resizedAvatar: 1, fullname: 1, email: 1, phone: 1 } },
        { path: "ticketId" },
    ]
    if (summaryOnly) populate = []
    let Reviews = await ReviewModel.find({ agentId: req.user.id, isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(limit ?? null).populate(populate)
    let FormatedRating = formateReviewsRatings?.(Reviews)
    let stats = getRatingStatistics(FormatedRating)

    return summaryOnly ? stats : { reviews: FormatedRating, reviewsSummary: stats }
};



const replyToReview = async (req) => {
    let { reviewId } = req.query
    let { comment, replyTo } = req.body

    let filter = {
        isDeleted: { $ne: true },
        $and: [
            { agentId: req.user.id },
            { _id: reviewId }
        ]
    }

    let Review = await ReviewModel.findOne(filter);
    if (!Review) return null
    let body = {
        replyTo,
        replyBy: {
            id: req.user.id,
            role: 'agent'
        },
        comment
    }
    console.log(Review)

    let reply = await ReviewModel.findOneAndUpdate(filter, { $push: { reply: { ...body } } }, { new: true })
    if (!reply) return reply
    let FormatedRating = formateReviewsRatingsSingle?.(reply)
    return FormatedRating
};



const editMyReplys = async (req) => {
    let { reviewId } = req.query
    let { commentId, comment } = req.body

    let filter = {
        isDeleted: { $ne: true },
        $and: [
            { agentId: req.user.id },
            { _id: reviewId }
        ]
    }

    let Review = await ReviewModel.findOne(filter);
    if (!Review) return null
    let myReply = Review.reply.map(reply => {
        if (reply.replyBy.id.toString() == req.user.id && commentId == reply.comment._id.toString()) {
            reply.comment.text = comment.text
            return reply
        }
        return reply
    })

    let reply = await ReviewModel.findOneAndUpdate(filter, { reply: myReply }, { new: true, fields: { comment: 1, shopId: 1, reply: 1, rating: 1 } })
    if (!reply) return reply
    let FormatedRating = formateReviewsRatingsSingle?.(reply)
    return FormatedRating
}

module.exports = {
    getSupportRoom,
    acceptSupportRequest,
    getAgentReviews,
    replyToReview,
    editMyReplys,
    endChat,
}