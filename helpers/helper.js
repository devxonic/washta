function generate4DigitCode() {
    const code = Math.floor(Math.random() * 9000) + 1000;
    return code.toString();
}

function getTopCustomersBySpending(ordersList, customerList, limit) {
    const customerSpending = {};
    const customerOrders = {};

    // i have customer Data / Order 
    // i want to check 1by1 all cus , who complete Order , and how much spent 






    // console.log("CustomerList ----------------- ", customerList)
    ordersList.forEach(order => {
        const { customerId, cost } = order;

        let SelectedCustomer = customerList.map((x) => {
            console.log("customer --------------- ", x._id.toString() == customerId.toString())
            console.log("cost  --------------- ", parseInt(cost))
            if (x._id.toString() == customerId.toString()) {
                if (!customerOrders[customerId]) {
                    customerOrders[customerId] = {
                        ...x._doc,
                        totalSpent: parseInt(cost)
                    }
                }
                customerOrders[customerId].totalSpent += parseInt(cost);
                return customerOrders
            }
        })
        console.log(" -------------------------------------------------------------------------------------- ", SelectedCustomer)
    });


    console.log

    const result = Object.values(customerOrders).sort((a, b) => b.totalSpent - a.totalSpent);

    // let result = sortedCustomers.map(customer => {
    //     console.log("customer ------------- ", customer)
    //     return {
    //         ...customer._doc,
    //         totalSpent: customer.totalSpent.toString()
    //     };
    // });



    if (!limit) return customerOrders
    return result.slice(0, limit);
}

function getTimeDifferenceFormatted(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const timeDifference = end - start;

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}


let formateReviewsRatings = (Reviews) => {

    let clone = JSON.parse(JSON.stringify(Reviews)) || []
    return changeRatingFormat = clone?.map((review) => {
        console.log(review.rating['$numberDecimal'])
        review.rating = Number(review.rating['$numberDecimal'])
        return review
    })
}

let getRatingStatistics = (reviews) => {
    const totalReviews = reviews.length;

    if (totalReviews === 0) {
        return {
            ratings: {
                1: "0%",
                2: "0%",
                3: "0%",
                4: "0%",
                5: "0%"
            },
            averageRating: 0,
            totalReviews: 0,
            recommendationPercentage: 0.0
        };
    }

    const ratingCounts = [0, 0, 0, 0, 0, 0]; // Index 0 is unused
    let sumOfRatings = 0;

    reviews.forEach(review => {
        const rating = review.rating;
        ratingCounts[Math.floor(rating)]++;
        sumOfRatings += rating;
    });

    const averageRating = (sumOfRatings / totalReviews).toFixed(1);

    const ratingPercentages = ratingCounts.slice(1).map(
        count => (count / totalReviews * 100).toFixed(1)
    );

    const recommendationPercentage = ((ratingCounts[4] + ratingCounts[5]) / totalReviews * 100).toFixed(1);

    return {
        ratings: {
            1: `${ratingPercentages[0]}%`,
            2: `${ratingPercentages[1]}%`,
            3: `${ratingPercentages[2]}%`,
            4: `${ratingPercentages[3]}%`,
            5: `${ratingPercentages[4]}%`
        },
        averageRating: parseFloat(averageRating),
        totalReviews,
        recommendationPercentage: parseFloat(recommendationPercentage)
    };
}

module.exports = {
    generate4DigitCode,
    getTopCustomersBySpending,
    getTimeDifferenceFormatted,
    formateReviewsRatings,
    getRatingStatistics
}