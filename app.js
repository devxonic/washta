require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socket = require('./controllers/sockethandler');
const app = express();
const path = require('path');
const cron = require('node-cron');
const shopModel = require('./models/shop');
const { shopScheduleCronJob } = require('./querys');

// socket server 
const server = http.createServer(app)
socket(server);



//api Middleweres 
app.use("/mailsAssets", express.static(path.resolve(__dirname, "./Mails")));
app.use(express.json());
app.use(cors());



const cornJob = async (req, res) => {
    console.log("cron Job")
    let { query, date } = shopScheduleCronJob()
    console.log("cron Job", date)
    let shop = await shopModel.aggregate(query).exec();
    console.log("cron job done")
}

cron.schedule('0 * * * *', cornJob);

// api routing
app.use('/api/webhooks', require('./helpers/webhooks'));
app.use('/api', require('./Routes/File'));
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/customer', require('./Routes/Customer'));
app.use('/api/otp', require('./Routes/Otp'));
app.use('/api/seller', require('./Routes/Seller'));
app.use('/api/admin', require('./Routes/admin'));
app.use('/api/agent', require('./Routes/agent'));
app.use('/api/subscription', require('./Routes/subscription'));

mongoose
    .connect(process.env.dburi)
    .then((result) => {
        // from result fetch the db name and username db connected to
        console.log('connected to db', result.connections[0].host);
        server.listen(process.env.PORT || 8080, () => {
            console.log('~~~~ server is up & running ~~~~~')
        });
    })
    .catch((err) => console.error(err));