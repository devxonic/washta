const express = require('express');
const router = express.Router();
require('dotenv').config();
const stripe = require('stripe')(process.env.stripe_secret);
const io = require('socket.io-client');

router.post('/paymentUpdate', async (req, res) => {
    const payloadString = JSON.stringify(req.body);
    const sig = req.headers['stripe-signature'];
    const secret = process.env.stripe_signature
    const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret
    });
    let event;
    try {
        event = stripe.webhooks.constructEvent((payloadString), header, secret);
        // console.log('event', event)
    } catch (err) {
        console.log('err came', err);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    let paymentIntent = '';

    console.log('webhook event', event.type)
    // Handle the event 

    if(event.type === 'payment_intent.succeeded'){
        //**let newConnection = new ws('ws://localhost:3000');
        //console.log('event object', event);
       // paymentIntent = event.data.object;
        //console.log('PaymentIntent was successful!');
       // newConnection.on('open', function open() {
          //  newConnection.send(JSON.stringify({
          //      type: "paymentIntent",
          //      paymentType: 'payment_intent.succeeded',
         //   }));
        //    newConnection.close();
       // });

    }

    if(event.type === 'checkout.session.completed'){
        //let newConnection = new ws('ws://localhost:3000');
        console.log('checout session completed with this object', event.data.object.metadata);
        paymentIntent = event.data.object;
        console.log('payment link was updated');
       // newConnection.on('open', function open() {
        //    newConnection.send(JSON.stringify({
         //       type: "checkout.session.completed",
      //          paymentType: 'checkout.session.completed',
          //      paymentId: event.data.object.metadata.paymentId
           // }));
            //newConnection.close();
        //});
        let socketClient = io(process.env.backendURL);
        socketClient.emit("checkout.session.completed", {paymentId:event.data.object.metadata.paymentId})
    }

    if(event.type === 'payment_link.updated'){
     //   let newConnection = new ws('ws://localhost:3000');
        console.log('event object', event);
        paymentIntent = event.data.object;
        console.log('payment link was updated');
      //  newConnection.on('open', function open() {
       //     newConnection.send(JSON.stringify({
        //        type: "paymentLinkUpdate",
        //        paymentType: 'payment_link.updated',
         //   }));
          //  newConnection.close();
       // });
    }

    else{
    return res.json({ received: true });
    }
    // Return a response to acknowledge receipt of the event

})
module.exports = router
