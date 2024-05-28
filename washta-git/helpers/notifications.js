// const { sendFcmMessage } = require('../helpers/firebaseconfig');

// const sendNotifToCourtOwner = async (type, message, token, additionalDetails) => {
//     if (type === "court-booked") {
//         let msgObject = {
//             message: {
//                 // token: "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
//                 token: "e3NxVQepTUSfwTimHvc6Sr:APA91bGb94b2h1IwCMBONNmowcdJG4xwRPMmXM3VsmWV9WkY76KbWvYl_ntiZLBwmNzvikYXYSyM738qW-1eycMqqROQ0R2ptJZQfRN3RCMugJKJlZvdGaIiMEs9IyDhRBrCjSUkrMT_",
//                 // token: token,
//                 notification: {
//                     title: "Court Booked",
//                     body: message
//                 }
//             }
//         }
//         sendFcmMessage(msgObject)
//     }
//     if (type === "request") {
//         let msgObject = {
//             message: {
//                 // token: "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
//                 // token: "e3NxVQepTUSfwTimHvc6Sr:APA91bGb94b2h1IwCMBONNmowcdJG4xwRPMmXM3VsmWV9WkY76KbWvYl_ntiZLBwmNzvikYXYSyM738qW-1eycMqqROQ0R2ptJZQfRN3RCMugJKJlZvdGaIiMEs9IyDhRBrCjSUkrMT_",
//                 token: token,
//                 notification: {
//                     title: "Portugal vs. Denmark",
//                     body: message
//                 }
//             }
//         }
//         sendFcmMessage(msgObject)
//     }
//     if (type === "request") {
//         let msgObject = {
//             message: {
//                 // token: "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
//                 // token: "e3NxVQepTUSfwTimHvc6Sr:APA91bGb94b2h1IwCMBONNmowcdJG4xwRPMmXM3VsmWV9WkY76KbWvYl_ntiZLBwmNzvikYXYSyM738qW-1eycMqqROQ0R2ptJZQfRN3RCMugJKJlZvdGaIiMEs9IyDhRBrCjSUkrMT_",
//                 token: token,
//                 notification: {
//                     title: "Portugal vs. Denmark",
//                     body: message
//                 }
//             }
//         }
//         sendFcmMessage(msgObject)
//     }
// }
// const sendNotifToPlayer = async (message, token, additionalDetails) => {
//     if (type === "request") {
//         let msgObject = {
//             message: {
//                 // token: "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
//                 // token: "e3NxVQepTUSfwTimHvc6Sr:APA91bGb94b2h1IwCMBONNmowcdJG4xwRPMmXM3VsmWV9WkY76KbWvYl_ntiZLBwmNzvikYXYSyM738qW-1eycMqqROQ0R2ptJZQfRN3RCMugJKJlZvdGaIiMEs9IyDhRBrCjSUkrMT_",
//                 token: token,
//                 notification: {
//                     title: "Portugal vs. Denmark",
//                     body: message
//                 }
//             }
//         }
//         sendFcmMessage(msgObject)
//     }
//     if (type === "request") {
//         let msgObject = {
//             message: {
//                 // token: "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
//                 // token: "e3NxVQepTUSfwTimHvc6Sr:APA91bGb94b2h1IwCMBONNmowcdJG4xwRPMmXM3VsmWV9WkY76KbWvYl_ntiZLBwmNzvikYXYSyM738qW-1eycMqqROQ0R2ptJZQfRN3RCMugJKJlZvdGaIiMEs9IyDhRBrCjSUkrMT_",
//                 token: token,
//                 notification: {
//                     title: "Portugal vs. Denmark",
//                     body: message
//                 }
//             }
//         }
//         sendFcmMessage(msgObject)
//     }
//     if (type === "request") {
//         let msgObject = {
//             message: {
//                 // token: "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
//                 // token: "e3NxVQepTUSfwTimHvc6Sr:APA91bGb94b2h1IwCMBONNmowcdJG4xwRPMmXM3VsmWV9WkY76KbWvYl_ntiZLBwmNzvikYXYSyM738qW-1eycMqqROQ0R2ptJZQfRN3RCMugJKJlZvdGaIiMEs9IyDhRBrCjSUkrMT_",
//                 token: token,
//                 notification: {
//                     title: "Portugal vs. Denmark",
//                     body: message
//                 }
//             }
//         }
//         sendFcmMessage(msgObject)
//     }
// }

// const sendMessageNotif = (user, token) => {

//     let msgObject = {
//         message: {
//             // token: "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
//             // token: "e3NxVQepTUSfwTimHvc6Sr:APA91bGb94b2h1IwCMBONNmowcdJG4xwRPMmXM3VsmWV9WkY76KbWvYl_ntiZLBwmNzvikYXYSyM738qW-1eycMqqROQ0R2ptJZQfRN3RCMugJKJlZvdGaIiMEs9IyDhRBrCjSUkrMT_",
//             token: token,
//             notification: {
//                 title: "Message Received",
//                 body: user
//             }
//         }
//     }
//     sendFcmMessage(msgObject)
// }

// module.exports = {
//     sendNotifToPlayer,
//     sendNotifToCourtOwner,
//     sendMessageNotif
// }


