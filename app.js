require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const path = require('path');

//api Middleweres 
app.use("/mailsAssets", express.static(path.resolve(__dirname, "./Mails")));
app.use(express.json());
app.use(cors());



// api routing
app.use('/api', require('./Routes/File'));
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/customer', require('./Routes/Customer'));
app.use('/api/otp', require('./Routes/Otp'));
app.use('/api/seller', require('./Routes/Seller'));
app.use('/api/admin', require('./Routes/admin'));
app.use('/api/subscription', require('./Routes/subscription'));

mongoose
    .connect(process.env.dburi)
    .then((result) => {
        // from result fetch the db name and username db connected to
        console.log('connected to db', result.connections[0].host);
        app.listen(process.env.PORT || 8080, () => {
            console.log('~~~~ server is up & running ~~~~~')
        });
    })
    .catch((err) => console.error(err));