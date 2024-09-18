shopScheduleCronJob = () => {
    let date = new Date()
    return {
        date: date,
        query: [
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
                                        '$dayOfWeek': date
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
                    '_id': 1
                }
            }, {
                '$replaceRoot': {
                    'newRoot': {
                        '$mergeObjects': [
                            '$todaySchedule.v', {
                                '_id': '$_id'
                            }
                        ]
                    }
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
                        '$hour': date
                    },
                    'currentMinute': {
                        '$minute': date
                    }
                }
            }, {
                '$addFields': {
                    'isOpen': {
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
                '$project': {
                    '_id': 1,
                    'isOpen': 1
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
}

module.exports = {
    shopScheduleCronJob
}