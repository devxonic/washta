function generate4DigitCode() {
    const code = Math.floor(Math.random() * 9000) + 1000;
    return code.toString();
}

function getTopCustomersBySpending(ordersList, customerList, limit) {
    const customerSpending = {};
    const customerOrders = {};

    // i have customer Data / Order 
    // i want to check 1by1 all cus , who complete Order , and how much spent 






    console.log("CustomerList ----------------- ", customerList)
    ordersList.forEach(order => {
        const { customerId, cost } = order;

        // for (let i = 0; i < customerList.length; i++) {
        if (!customerOrders[customerId]) {
            let SelectedCustomer = customerList.filter((x) => {
                if (x._id.toString() == customerId.toString()) { return x }
            })[0]
            if (SelectedCustomer) {
                customerOrders[customerId] = {
                    ...SelectedCustomer,
                    totalSpent: parseInt(cost)
                }
                customerOrders[customerId].totalSpent += parseInt(cost);
            }
        }
    });

    console.log("customerOrders ----------------- ", customerOrders)

    const sortedCustomers = Object.values(customerOrders).sort((a, b) => b.totalSpent - a.totalSpent);

    let result = sortedCustomers.map(customer => {
        console.log("customer ------------- ",customer)
        return {
            ...customer._doc,
            totalSpent: customer.totalSpent.toString()
        };
    });



    if (!limit) return result
    return result.slice(0, limit);
}


module.exports = {
    generate4DigitCode,
    getTopCustomersBySpending
}