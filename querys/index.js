let querys = {
    shopScheduleCronJob: [
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
    ]
}

module.exports = querys