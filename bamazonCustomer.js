// declare and require mysql and inquirer packages
var mysql = require("mysql");
var inquirer = require("inquirer");

//create connection to bamazondb
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazonDB"
});

// call showItemsAvailable upon connecting
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    showItemsAvailable();
});

// show items available function
// show customer a list of items that are available for purchase
// item list includes ids, name, department, and price
// pull items from products table in bamazonDB on mysql using connection.query
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

    // set timeout for itemOrdered function
    // allows showItemsAvailable to fully run before customer is prompted with the next question (1 second delay)
    // list of items will populate before customer is asked what they would like to purchase
    setTimeout(function() {
        console.log("");
        itemOrdered();
    }, 1000);

}

// item ordered function
// prompt user with question asking what they would like to order
// save ide as answer.item and pass down the line
// pull product from db with the id that matches the id the user requested to buy
// populate that information in the console so the user can be sure they chose the right product
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

            // run quantity function and pass answer.item to it as an argument
            // allows quantityOrdered function to update the correct row in the products table
            quantityOrdered(answer.item);
        });
    });
}

// quantity ordered function
// ask user how many units of the item they would like to purchase
// pull items from db and update stock_quantity column to reflect dec in stock levels
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
            // if there is sufficient stuck available to purchas...
            // thank customer and place order
            // show cost of order (price * quantity)
            if (stockLevel - number.quantity > 0) {
                console.log("Thank you for choosing Bamazon! Your order has been placed.");
                var totalCost = (number.quantity * price);
                console.log("");
                console.log("Total: $" + totalCost);

                // update stock levels in db
                // restart by showing customer items available
                stockLevelUpdate();
                showItemsAvailable();
            }

            // if customer orders entire stock (leaving stock empty)
            // tell them there was just enough
            // show total cost (price * quantity)
            else if (stockLevel - number.quantity === 0) {
                console.log("Just enough! Thank you for choosing Bamazon! Your order has been placed.");
                // console.log(stockLevel - number.quantity);
                totalCost = (number.quantity * price);
                console.log("");
                console.log("Total: $" + totalCost);

                // update stock levels in db
                // restart by showing customer items available
                stockLevelUpdate();
                showItemsAvailable();
            }

            // if there is not enough stock on hand to fulfill order...
            // tell customer there is insufficient quantity
            // ask to try again
            else if (stockLevel - number.quantity < 0) {
                console.log("Insufficient quantity. Please try again.");
                console.log("");

                // restart by showing customer items available
                showItemsAvailable();
            }

            // update stock levels function
            // subtract customer order from stock_quantity in db (set newStockLevel = current stock - customer order)
            // use connection.query UPDATE to update the db (just for the item ordered)
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
