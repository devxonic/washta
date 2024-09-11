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

// socket server 
const server = http.createServer(app)
socket(server);



//api Middleweres 
app.use("/mailsAssets", express.static(path.resolve(__dirname, "./Mails")));
app.use(express.json());
app.use(cors());



cron.schedule('* * * * *', async () => {
    let date = new Date();
    console.log(date)
    console.log("cron Job")
    let shop = await shopModel.aggregate([
        {
            '$addFields': {
                'today': {
                    '$let': {
                        'vars': {
                            'daysOfWeek': [
                                '', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
                            ]
                        },
                        'in': {
                            '$arrayElemAt': [
                                '$$daysOfWeek', {
                                    '$dayOfWeek': new Date()
                                }
                            ]
                        }
                    }
                }
            }
        }, {
            '$project': {
                'isOpen': 1,
                'todaySchedule': {
                    '$arrayElemAt': [
                        {
                            '$filter': {
                                'input': {
                                    '$objectToArray': '$timing'
                                },
                                'as': 'item',
                                'cond': {
                                    '$eq': [
                                        '$$item.k', '$today'
                                    ]
                                }
                            }
                        }, 0
                    ]
                },
                '_id': 0
            }
        }, {
            '$replaceRoot': {
                'newRoot': '$todaySchedule.v'
            }
        }, {
            '$addFields': {
                'openHour': {
                    '$hour': '$from'
                },
                'openMinute': {
                    '$minute': '$from'
                },
                'closeHour': {
                    '$hour': '$to'
                },
                'closeMinute': {
                    '$minute': '$to'
                },
                'currentHour': {
                    '$hour': new Date()
                },
                'currentMinute': {
                    '$minute': new Date()
                }
            }
        }, {
            '$addFields': {
                'isOpened': {
                    '$cond': {
                        'if': {
                            '$eq': [
                                '$open', false
                            ]
                        },
                        'then': false,
                        'else': {
                            '$and': [
                                {
                                    '$or': [
                                        {
                                            '$gt': [
                                                '$currentHour', '$openHour'
                                            ]
                                        }, {
                                            '$and': [
                                                {
                                                    '$eq': [
                                                        '$currentHour', '$openHour'
                                                    ]
                                                }, {
                                                    '$gte': [
                                                        '$currentMinute', '$openMinute'
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }, {
                                    '$or': [
                                        {
                                            '$lt': [
                                                '$currentHour', '$closeHour'
                                            ]
                                        }, {
                                            '$and': [
                                                {
                                                    '$eq': [
                                                        '$currentHour', '$closeHour'
                                                    ]
                                                }, {
                                                    '$lte': [
                                                        '$currentMinute', '$closeMinute'
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        }, {
            '$merge': {
                'into': 'shops',
                'whenMatched': 'merge',
                'whenNotMatched': 'discard'
            }
        }
    ])
});

// api routing
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