var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    showItemsAvailable();
});

function showItemsAvailable() {
    var query = "SELECT item_id, product_name, department_name, price FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("Products available for purchase: ");
        console.log("");

        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " | Product: " + res[i].product_name + " | Department: " + res[i].department_name + " | Price: $" + res[i].price);
        }
    });

    // set timeout for itemANdQuantityMessage
    setTimeout(function() {
        console.log("");
        itemOrdered();
    }, 1000);

}

function itemOrdered() {
    inquirer.prompt([{
        name: "item",
        type: "input",
        message: "What item would you like to purchase? Please enter Item ID."

    }]).then(function(answer) {
        var query = "SELECT * FROM products WHERE item_id=?";
        connection.query(query, [answer.item], function(err, res) {
            if (err) throw err;

            for (var i = 0; i < res.length; i++) {
                console.log("");
                console.log(res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price);
                console.log("-----------------------------------");
            }
            quantityOrdered(answer.item);
        });




    });

}

function quantityOrdered(value) {
    inquirer.prompt([{
        name: "quantity",
        type: "input",
        message: "How many would you like?"

    }]).then(function(number) {
        var query = "SELECT * FROM products WHERE item_id=?";
        connection.query(query, [value], function(err, res) {
            if (err) throw err;

            for (var i = 0; i < res.length; i++) {
                console.log("");
                var stockLevel = res[i].stock_quantity;
                var price = res[i].price;
                // console.log(res[i].product_name + " | " + stockLevel);
                // console.log("-----------------------------------");
            }

            if (stockLevel - number.quantity > 0) {
                console.log("Thank you for choosing Bamazon! Your order has been placed.");
                var totalCost = (number.quantity * price);
                console.log("");
                console.log("Total: $" + totalCost);

                stockLevelUpdate();
                showItemsAvailable();
            }

            else if (stockLevel - number.quantity === 0) {
                console.log("Just enough! Thank you for choosing Bamazon! Your order has been placed.");
                // console.log(stockLevel - number.quantity);
                var totalCost = (number.quantity * price);
                console.log("");
                console.log("Total: $" + totalCost);

                stockLevelUpdate();
                showItemsAvailable();
            }

            else if (stockLevel - number.quantity < 0) {
                console.log("Insufficient quantity. Please try again.");
                console.log("");
                showItemsAvailable();

            }


            function stockLevelUpdate() {
                var newStockLevel = stockLevel - number.quantity;
                // console.log(stockLevel);
                // console.log(newStockLevel);

                var query = "UPDATE products SET stock_quantity=? WHERE item_id=?";

                connection.query(query, [newStockLevel, value], function(err, res) {
                    if (err) throw err;
                    // console.log(value);
                });
            }


        });

    });


}
