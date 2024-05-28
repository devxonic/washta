const CustomerModel = require('../models/Customer');
// const notification = require('../helpers/notifications');
// // const chatRooms = require('../models/chatrooms')
// // const courtOwnerModel = require('../models/courtOwner')
// // const courtModel = require('../models/court');
// // const messageModel = require("../models/chatmessages")
// // const bookingModel = require('../models/booking');
// // const gameModel = require('../models/game');
// // const playerFollowModel = require('../models/playerFollow');
// const mongoose = require('mongoose');
// require('dotenv').config();
const bcrypt = require('bcrypt');
// // const stripe = require('stripe')(process.env.stripe_secret)
// const crypto = require('crypto');

const signUp = async (req) => {
    let newCustomer = new CustomerModel(req.body);
    let hash = await bcrypt.hash(req.body.password, 10);
    newCustomer.password = hash;
    let result = await newCustomer.save();
    return result;
}


// // const changePassword = async (req) => {
// //     let hash = await bcrypt.hash(req.body.password, 10);
// //     let player = await CustomerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { password: hash } })
// //     return player
// // }

// // const updateImage = async (req) => {
// //     let player = await CustomerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { avatar: req.file.location, avatarPath: req.file.location } })
// //     return player
// // }

const getCustomer = async (req) => {

    let Customer = await CustomerModel.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });

    return Customer;
}
const findCustomer = async (req) => {
    let player = await CustomerModel.findById(req.user.id);
    console.log("asdasdas", req.user.id, player)
    return player;
}

const updateRefreshToken = async (req, token) => {
    let player = await CustomerModel.findOneAndUpdate({ username: req.body.identifier }, { $set: { sessionKey: token } })
    return player
}

const signUpWithGoogle = async (req) => {
    let player = await CustomerModel.findOne({ email: req.body.identifier })
    console.log(player)
    if (player) {
        console.log('google user found')
        if (player.googleId === req.body.googleUser.id) return player
        throw new Error("incorrect details provided")
    }
    console.log('creating a new google user')
    req.body.googleId = req.body.googleUser.id
    req.body.email = req.body.identifier
    let newPlayer = new CustomerModel(req.body);
    let result = await newPlayer.save();
    return result;

}

const CheckUserisExist = async (UserName) => {
    let res = await CustomerModel.findOne({ username: UserName })
    return res ? true : false
}


const editProfile = async (req) => {
    const { username, phone } = req.body;
    console.log(req.body)
    console.log(req.user)
    let Customer = await CustomerModel.findOneAndUpdate({ _id: req.user.id },
        { $set: { username : username, phone : phone } });
    return Customer;
}

const createProfile = async (req) => {
    const { foot, position, jerseyNo } = req.body;
    let player = await CustomerModel.findOneAndUpdate({ username: req.user.username },
        { $set: { foot: foot, position: position, jerseyNo: jerseyNo } });
    return player;
}

const getProfile = async (req) => {
    let player = await CustomerModel.findOne({ username: req.user.username }, { password: 0, __v: 0 });
    return player;
}



// // const bookCourt = async (req) => {
// //     console.log()
// //     let booking = await bookingModel.findOne({ fieldId: req.body.fieldId, Date: req.body.date });
// //     console.log('req user', req.user);
// //     let username = await CustomerModel.findById(req.user.id, { name: 1, avatar: 1, avatarPath: 1 });
// //     console.log(username);
// //     let field = await courtModel.findOne({ "fields._id": req.body.fieldId }, { "fields.$": 1, images: 1, name: 1, courtOwnerId: 1 });
// //     if (!field) return 'Field not found';
// //     console.log('username', username.name);
// //     let timeslotarr = [];
// //     let timingRange = [];
// //     let amount = 0;
// //     console.log('fields data', field);
// //     for (let item of req.body.timeslots) {
// //         let court = await courtModel.findOne(
// //             { "fields.timings.timeslots._id": item.id },
// //             { "fields.$": 1 }
// //         );
// //         let timeslotDetails = null;
// //         if (court) {
// //             court.fields.forEach(field => {
// //                 field.timings.forEach(timing => {
// //                     timing.timeslots.forEach(slot => {
// //                         if (slot._id.toString() === item.id) {
// //                             timeslotDetails = slot;
// //                         }
// //                     });
// //                 });
// //             });
// //         }
// //         console.log('timeslotDetails', timeslotDetails);
// //         timeslotDetails.price ? amount += parseFloat(timeslotDetails.price) : amount += 0;
// //         timeslotarr.push((item.id));
// //         timingRange.push(timeslotDetails.time);
// //     }
// //     console.log(timeslotarr, timingRange);
// //     let bookingObj = {
// //         bookedBy: req.user.id,
// //         startTime: req.body.startTime,
// //         endTime: req.body.endTime,
// //         paymentStatus: 'NOT PAID',
// //         courtOwnerId: field.courtOwnerId,
// //         fieldName: field.fields[0].name,
// //         fieldId: req.body.fieldId,
// //         timeslots: timeslotarr,
// //         timingRange: timingRange,
// //         bookedByName: username.name,
// //         courtName: field.name,
// //         courtImage: 'https://w0.peakpx.com/wallpaper/454/383/HD-wallpaper-football-super-wonderful-nice-awesone-ground-stadium.jpg',
// //         date: new Date(req.body.date),
// //         location: field.location ? field.location : 'N/A',
// //         sessionDuration: req.body.sessionDuration,
// //         amount: amount,
// //         paymentDone: false,
// //         amountInCurrency: amount + '$'
// //     }
// //     let paymentId = crypto.randomUUID();
// //     if (booking) {
// //         // if the booking exists, update the bookings array with the new booking
// //         let paymentLink = await makeStripePayment(amount, 'usd', 1, paymentId);
// //         bookingObj.paymentLink = paymentLink.url;
// //         bookingObj.paymentId = paymentId;
// //         await bookingModel.updateOne({ fieldId: req.body.fieldId, Date: req.body.date }, {
// //             $push: {
// //                 bookings: bookingObj
// //             }
// //         });
// //         notification.sendNotifToCourtOwner("court-booked", `${username.name} has booked your court`);
// //         return bookingObj;
// //     } else {
// //         // if the booking does not exist, create a new booking array for that specific date
// //         let paymentLink = await makeStripePayment(amount, 'usd', 1, paymentId);
// //         bookingObj.paymentLink = paymentLink.url;
// //         bookingObj.paymentId = paymentId;
// //         let bookingByDate = {
// //             fieldId: req.body.fieldId, Date: new Date(req.body.date), bookings: [
// //                 bookingObj
// //             ]
// //         }
// //         let newBooking = new bookingModel(bookingByDate);
// //         await newBooking.save();
// //         notification.sendNotifToCourtOwner("court-booked", `${username.name} has booked your court`);
// //         return bookingObj;
// //     }

// // }

// // const getBookingCalendar = async (req) => {
// //     let newDate = new Date(req.query.date);
// //     console.log('newDate', newDate);
// //     // from this newDate get the day of the week in letters
// //     let day = newDate.toLocaleString('en-us', { weekday: 'long' });
// //     console.log(day);
// //     // find all of the timeslots first of that field / club based on the given date's day
// //     // let clubDetails = await courtModel.findOne({ "fields._id": req.query.clubId, "fields.timings.day": day }, { "fields.$": 1 });
// //     let clubDetails = await courtModel.findOne(
// //         { "fields": { $elemMatch: { "_id": req.query.fieldId, "timings.day": day } } },
// //         { "fields.$": 1 }
// //     );
// //     // then find the bookings for that specific date
// //     // let bookedSlots = await bookingModel.findOne({ clubId: req.query.clubId, Date: newDate });
// //     console.log('club details', clubDetails);
// //     let timeslotArr = [];
// //     if (clubDetails && clubDetails.fields.length > 0) {
// //         let allTimeSlots = clubDetails.fields[0].timings.find(x => x.day === day);
// //         // console.log('clubDetails.clubs[0]', clubDetails.clubs[0]);
// //         // allTimeSlots.timeslots.forEach((timeSlot) => {
// //         //     let timebooked = false;
// //         //     bookedSlots.bookings.forEach((booking) => {
// //         //         booking.timeslots.forEach(item => {
// //         //             if (JSON.stringify(item) === JSON.stringify(timeSlot._id)) {
// //         //                 timebooked = true;
// //         //             }
// //         //         });
// //         //     })
// //         //     if (timebooked) timeslotArr.push({ time: timeSlot.time, isBooked: true });
// //         //     else timeslotArr.push({ time: timeSlot.time, isBooked: false });
// //         // })
// //         for (let timeSlot of allTimeSlots.timeslots) {
// //             let timeslotBooked = await bookingModel.findOne({ fieldId: req.query.fieldId, Date: newDate, "bookings.timeslots": timeSlot._id });
// //             if (timeslotBooked) timeslotArr.push({ time: timeSlot.time, isBooked: true, _id: timeSlot._id, price: timeSlot.price ? timeSlot.price : '' });
// //             else timeslotArr.push({ time: timeSlot.time, isBooked: false, _id: timeSlot._id, price: timeSlot.price ? timeSlot.price : '' });
// //         }
// //         return timeslotArr;
// //     }
// //     return timeslotArr;

// // }

// // const getFieldDetails = async (req) => {
// //     let field = await courtModel.findOne({ "fields._id": req.query.fieldId, "fields.isActive": true }, { "fields.$": 1 });
// //     return field;
// // }

// // const getAvailableCourts = async (req) => {
// //     let courts = await courtModel.find({ isActive: true }, { "fields": 0, "pricing": 0, location: 0, days: 0, isActive: 0, isDeleted: 0 });
// //     console.log('courts', courts);
// //     return courts;
// // }

const updateNotification = async (req) => {
    let Customer = await CustomerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { notification: req.body } })
    return Customer
}

const getNotification = async (req) => {
    let Customer = await CustomerModel.findOne({ _id: req.user.id }, { password: 0, __v: 0 });
    return Customer.notification;
}
const updatePrivacy = async (req) => {
    let player = await CustomerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { privacy: req.body } })
    return player
}

const getPrivacy = async (req) => {
    let Customer = await CustomerModel.findOne({ _id: req.user.id }, { password: 0, __v: 0 });
    return Customer.privacy;
}
const updateSecurity = async (req) => {
    let Customer = await CustomerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { security: req.body } })
    return Customer
}

const getSecurity = async (req) => {
    let Customer = await CustomerModel.findOne({ _id: req.user.id }, { password: 0, __v: 0 });
    return Customer.security;
}

// // const getMyBookings = async (req) => {
// //     // let bookings = await bookingModel.find({ "bookings.bookedBy": req.user.id }, { "bookings.$": 1 });
// //     let bookings = await bookingModel.aggregate([
// //         { $unwind: "$bookings" },
// //         { $match: { "bookings.bookedBy": new mongoose.Types.ObjectId(req.user.id) } },
// //         { $group: { _id: null, bookings: { $push: "$bookings" } } },
// //         { $project: { _id: 0 } }
// //     ]);
// //     if (bookings.length === 0) return [];
// //     return bookings[0].bookings;

// // }

// // const getCourtsByLocation = async (req) => {
// //     console.log('req.body.radius', req.body.radius, req.query.lat, req.query.long);
// //     let results = await courtModel.find({
// //         location:
// //         {
// //             $nearSphere:
// //             {
// //                 $geometry: {
// //                     type: "Point",
// //                     coordinates: [req.query.long, req.query.lat]
// //                 },
// //                 $minDistance: 0,
// //                 $maxDistance: parseFloat(req.query.radius ? req.query.radius : 1000)
// //             }
// //         },
// //         isActive: true,
// //         isDeleted: false
// //     });
// //     return results;
// // }

// // const getCourtFields = async (req) => {
// //     let fields = await courtModel.aggregate([
// //         { $match: { _id: new mongoose.Types.ObjectId(req.query.courtId) } },
// //         { $unwind: "$fields" },
// //         { $match: { "fields.isActive": true } },
// //         { $project: { "fields.isActive": 0, "fields.isDeleted": 0, "fields.timings": 0 } },
// //         { $replaceRoot: { newRoot: "$fields" } }
// //     ]);
// //     return fields;
// // }

// // const startAGame = async (req) => {
// //     // find the court location coordinates from courtid
// //     // let court = await courtModel.findById(req.body.courtId, { location: 1 });
// //     let court = await courtModel.findOne({ "fields._id": req.body.fieldId }, { location: 1 })
// //     console.log('court details', court._id);
// //     req.body.location = court.location;
// //     req.body.courtId = court._id
// //     let game = new gameModel(req.body);
// //     let result = await game.save();
// //     return result;
// // }

// // const getGames = async (req) => {
// //     // find games by location lat long
// //     let games = await gameModel.find({ lookingFor: req.query.lookingFor }).populate({
// //         path: "players",
// //         select: { _id: 1, name: 1, email: 1, avatar: 1, avatarPath: 1 }
// //     });
// //     let finalArr = [];
// //     for (const item of games) {
// //         let courtdetails = await courtModel.findOne({ _id: item.courtId }, {})
// //         console.log('courtdcetails', courtdetails);
// //         let fieldDetails = {}
// //         if (courtdetails) {
// //             console.log('inside the condition', courtdetails._id);
// //             for (let field of courtdetails.fields) {
// //                 if (JSON.stringify(field._id) === JSON.stringify(item.fieldId)) {
// //                     console.log('field found');
// //                     console.log('field', field)
// //                     fieldDetails = field;
// //                     break
// //                 }
// //             }
// //         }
// //         let status = 'not joined';
// //         let alreadyJoined = await gameModel.findOne({ _id: item._id, players: req.user.id })
// //         if (alreadyJoined) status = "joined"
// //         let tempObj = {
// //             _id: item._id,
// //             bookingId: item.bookingId,
// //             players: item.players,
// //             fieldId: item.fieldId,
// //             location: item.location,
// //             lookingFor: item.lookingFor,
// //             maxPlayers: item.maxPlayers,
// //             court: courtdetails,
// //             field: fieldDetails,
// //             duration: item.duration,
// //             matchType: item.matchType,
// //             pricePerPerson: item.pricePerPerson,
// //             teamOneJerseyColor: item.teamOneJerseyColor,
// //             teamSecondJerseyColor: item.teamSecondJerseyColor,
// //             startTime: item.startTime,
// //             date: item.date,
// //             note: item.note,
// //             status: status
// //         }
// //         finalArr.push(tempObj);
// //     }
// //     return finalArr;
// // }


// // const getAllGames = async (req) => {
// //     // find games by location lat long
// //     let games = await gameModel.find({}).populate({
// //         path: "players",
// //         select: { _id: 1, name: 1, email: 1, avatar: 1, avatarPath: 1 }
// //     });
// //     let finalArr = [];
// //     for (const item of games) {
// //         let courtdetails = await courtModel.findOne({ _id: item.courtId }, {})
// //         console.log('courtdcetails', courtdetails);
// //         let fieldDetails = {}
// //         if (courtdetails) {
// //             console.log('inside the condition', courtdetails._id);
// //             for (let field of courtdetails.fields) {
// //                 if (JSON.stringify(field._id) === JSON.stringify(item.fieldId)) {
// //                     console.log('field found');
// //                     console.log('field', field)
// //                     fieldDetails = field;
// //                     break
// //                 }
// //             }
// //         }
// //         let status = 'not joined';
// //         let alreadyJoined = await gameModel.findOne({ _id: item._id, players: req.user.id })
// //         if (alreadyJoined) status = "joined"
// //         let tempObj = {
// //             _id: item._id,
// //             bookingId: item.bookingId,
// //             players: item.players,
// //             fieldId: item.fieldId,
// //             location: item.location,
// //             lookingFor: item.lookingFor,
// //             maxPlayers: item.maxPlayers,
// //             court: courtdetails,
// //             field: fieldDetails,
// //             duration: item.duration,
// //             matchType: item.matchType,
// //             pricePerPerson: item.pricePerPerson,
// //             teamOneJerseyColor: item.teamOneJerseyColor,
// //             teamSecondJerseyColor: item.teamSecondJerseyColor,
// //             startTime: item.startTime,
// //             date: item.date,
// //             note: item.note,
// //             status: status
// //         }
// //         finalArr.push(tempObj);
// //     }
// //     return finalArr;
// // }

// // const followPlayer = async (req) => {
// //     if (req.body.playerId === req.user.id) return ('You cannot follow yourself');
// //     if (req.body.isFollow) {
// //         let followVerify = await playerFollowModel.findOne({ playerId: req.body.playerId, followerId: req.user.id });
// //         if (followVerify) return "you're already following this player";
// //         req.body.followerId = req.user.id;
// //         req.body.playerId = req.body.playerId;
// //         let follow = new playerFollowModel(req.body);
// //         let result = await follow.save();
// //         return result;
// //     }
// //     else {
// //         let result = await playerFollowModel.findOneAndDelete({ playerId: req.body.playerId, followerId: req.user.id });
// //         return result;
// //     }

// // }

// // const getFollowRequests = async (req) => {
// //     let requests = await playerFollowModel.find({ playerId: req.user.id, status: 'PENDING' }).populate({
// //         path: "followerId",
// //         select: { _id: 1, name: 1, email: 1, avatar: 1, avatarPath: 1 }
// //     });
// //     let finalRequests = [];
// //     requests.forEach(item => {
// //         finalRequests.push(item.followerId);
// //     });
// //     return finalRequests;
// // }

// // const acceptFollowRequest = async (req) => {
// //     if (req.body.status) {
// //         let result = await playerFollowModel.findOneAndUpdate({ playerId: req.user.id, followerId: req.body.followerId }, { $set: { status: 'FOLLOWER' } });
// //         return result;
// //     }
// //     else {
// //         let result = await playerFollowModel.findOneAndDelete({ playerId: req.user.id, followerId: req.body.followerId });
// //         return result;
// //     }
// // }

// // const getFollowers = async (req) => {
// //     let followers = await playerFollowModel.find({ playerId: req.user.id, status: 'FOLLOWER' }).populate({
// //         path: "followerId",
// //         select: { _id: 1, name: 1, email: 1, avatar: 1, avatarPath: 1 }
// //     });
// //     let finalFollowers = [];
// //     followers.forEach(item => {
// //         finalFollowers.push(item.followerId);
// //     });
// //     return finalFollowers;

// // }

// // const getMyChatRooms = async (req) => {
// //     let myChatRooms = await chatRooms.find({ users: req.user.id })
// //     let finArr = [];
// //     for (let room of myChatRooms) {
// //         let roomUsers = room.users.filter(x => JSON.stringify(x) !== JSON.stringify(req.user.id))
// //         console.log('my own id', req.user.id)
// //         console.log(roomUsers)
// //         for (let user of roomUsers) {
// //             let playerdetails = await CustomerModel.findOne({ _id: user }, { name: 1, _id: 1, avatarPath: 1 })
// //             if (playerdetails) {
// //                 let tempObj = {
// //                     name: playerdetails.name,
// //                     _id: playerdetails._id,
// //                     profileImage: playerdetails.avatarPath ? playerdetails.avatarPath : "",
// //                     chatRoomId: room._id
// //                 }
// //                 finArr.push(tempObj)
// //                 continue
// //             }
// //             let courtOwnerDetails = await courtOwnerModel.findOne({ _id: user }, { name: 1, _id: 1, profilePicture: 1 })
// //             if (courtOwnerDetails) {
// //                 let tempObj = {
// //                     name: courtOwnerDetails.name,
// //                     _id: courtOwnerDetails._id,
// //                     profileImage: courtOwnerDetails.profilePicture ? courtOwnerDetails.profilePicture : "",
// //                     chatRoomId: room._id
// //                 }
// //                 finArr.push(tempObj)
// //                 continue
// //             }
// //             // else{
// //             //     let tempObj ={
// //             //         name: "not found",
// //             //         _id: ""
// //             //     }
// //             //     finArr.push(tempObj)
// //             // }
// //         }
// //     }
// //     return finArr;
// // }

// // const getChatHistory = async (req) => {
// //     let chatHistory = await messageModel.find({ chatRoomId: req.query.chatRoomId })
// //     return chatHistory;
// // }


// // const inviteToGame = async (req) => {
// //     let game = await gameModel.findOneAndUpdate({ _id: req.body.gameId }, { $push: { players: req.body.players } });
// //     return game;
// // }

// // const getPlayersLeaderboard = async (req) => {
// //     let players = await CustomerModel.find({}, { name: 1, avatar: 1, _id: 1, avatarPath: 1, points: 1 });
// //     let finalArray = [];
// //     for (let player of players) {
// //         console.log('player', player._id, req.user.id)
// //         let follow = await playerFollowModel.findOne({ playerId: player._id, followerId: req.user.id });
// //         console.log('follow', follow);
// //         let tempObj = {
// //             _id: player._id,
// //             name: player.name,
// //             avatar: player.avatar,
// //             avatarPath: player.avatarPath,
// //             points: player.points,
// //             followStatus: follow ? follow.status : ''
// //         }
// //         finalArray.push(tempObj);
// //     }
// //     return finalArray;
// // }

// // const stripeTest = async (req, res) => {
// //     // const paymentIntent = await stripe.paymentIntents.create({
// //     //     amount: 1099,
// //     //     currency: 'usd',
// //     //     payment_method_types: ['card'],
// //     //     receipt_email: ''
// //     // });
// //     let price = await stripe.prices.create({
// //         unit_amount: 2000,
// //         currency: 'usd',
// //         product_data: {
// //             name: 'T-shirt',
// //         },
// //     })
// //     const paymentLink = await stripe.paymentLinks.create({
// //         line_items: [
// //             {
// //                 price: price.id,
// //                 quantity: 1
// //             }
// //         ]
// //     })
// //     return paymentLink;
// // }

// // const getCheckOutSession = async (req, res) => {
// //     const session = await stripe.checkout.sessions.create({
// //         payment_method_types: ['card'],
// //         line_items: [
// //             {
// //                 price_data: {
// //                     currency: 'usd',
// //                     product_data: {
// //                         name: 'T-shirt',
// //                     },
// //                     unit_amount: 2000,
// //                 },
// //                 quantity: 1,
// //             },
// //         ],
// //         mode: 'payment',
// //         success_url: 'https://example.com/success',
// //         cancel_url: 'https://example.com/cancel',
// //     });
// //     return session;

// // }

// // const makeStripePayment = async (amount, currency, quantity, paymentId) => {
// //     console.log('amount', amount, currency, quantity)
// //     let price = await stripe.prices.create({
// //         unit_amount: parseInt(amount ? (amount < 0 ? 1 : amount) : 1) * 100,
// //         currency: 'usd',
// //         product_data: {
// //             name: 'T-shirt',
// //         },
// //     })
// //     const paymentLink = await stripe.paymentLinks.create({
// //         line_items: [
// //             {
// //                 price: price.id,
// //                 quantity: 1
// //             }
// //         ],
// //         metadata: {
// //             paymentId: paymentId,
// //             paymentLink: "testing"
// //         }
// //     })
// //     console.log('paymentlink object', paymentLink)
// //     return paymentLink;
// // }

// // const deactivateAccount = async (req) => {
// //     const player = await CustomerModel.findOneAndUpdate({ _id: req.user.id }, { $set: { isActive: false } }, { new: true })
// //     return player;
// // }

// // const featuredCourts = async (req) => {
// //     const courts = await courtModel.find({
// //         // featured: true
// //     })
// //     return courts;
// // }

// // const joinGame = async (req) => {
// //     let alreadyJoined = await gameModel.findOne({ _id: req.body.gameId, players: req.user.id })
// //     console.log('joining game', alreadyJoined)
// //     if (alreadyJoined) {
// //         console.log('already joined')
// //         return "already joined"
// //     }
// //     return await gameModel.findOneAndUpdate({ _id: req.body.gameId }, { $push: { players: req.user.id } })
// // }


const logout = async (req) => {
    let player = await CustomerModel.findByIdAndUpdate({ _id: req.user.id }, { $set: { sessionKey: '' } })
    return player
}


module.exports = {
    getSecurity,
    CheckUserisExist,
    signUp,
    editProfile,
    updatePrivacy,
    updateSecurity,
    updateNotification,
    updateRefreshToken,
    signUpWithGoogle,
    getNotification,
    getCustomer,
    findCustomer,
    getProfile,
    getPrivacy,
    logout,
}
// // module.exports = {
// //     signUp, getPlayer, logout, editProfile, getProfile, findPlayer, changePassword, createProfile, bookCourt, updateRefreshToken, updateNotification,
// //     deactivateAccount,
// //     joinGame,
// //     getNotification, updatePrivacy, getPrivacy, updateSecurity, getSecurity, updateImage, getBookingCalendar, getAvailableCourts,
// //     getFieldDetails, getMyBookings, getCourtsByLocation, getCourtFields,
// //     getFollowRequests,
// //     getPlayersLeaderboard,
// //     acceptFollowRequest,
// //     getFollowers,
// //     startAGame,
// //     featuredCourts,
// //     followPlayer,
// //     inviteToGame,
// //     getGames,
// //     stripeTest,
// //     getMyChatRooms,
// //     getChatHistory,
// //     getAllGames,
// // }




// // let result = await courtModel.updateOne(
// //     { "clubs.timings.timeslots._id": req.body.timeId },
// //     { "$set": { "clubs.$[i].timings.$[j].timeslots.$[k].isBooked": true } },
// //     {
// //         arrayFilters: [
// //             { "i._id": req.body.clubId },
// //             { "j.day": req.body.day },
// //             { "k._id": req.body.timeId }
// //         ]
// //     }
// // )
// // let timeSlotArr = ['65c24baf7f78a214e21dd61a'];
// // let result = await courtModel.updateOne(
// //     { "clubs.timings.timeslots._id": req.body.timeId },
// //     {
// //         $push: {
// //             bookedTimings: {
// //                 Date: new Date(),
// //                 timeslots: [timeslotsArr]
// //             }
// //         }
// //     },
// // )
// // fetch the timeslots from timeslot id and store them in arrays in order to make the booking timings field
// // let timings = await courtModel.findOne({ "clubs.timings.timeslots._id": req.body.timeId }, { "clubs.$": 1 });
// // find from booking model if the booking exists for that specific date
