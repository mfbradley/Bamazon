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
    showMenuOptions();
});

function showMenuOptions() {
    inquirer.prompt([{
        name: "menuChoice",
        type: "list",
        message: "Welcome to the Bamazon Manager Portal. Please choose an option below.",
        choices: [{ name: "View Products for Sale", value: "View_Products" }, { name: "View Low Inventory", value: "View_Low_Inventory" }, { name: "Add to Inventory", value: "Add_To_Inventory" }, { name: "Add New Product", value: "Add_New_Product" }]

    }]).then(function(answer) {
        if (answer.menuChoice === "View_Products") {
            console.log("");
            console.log("Available Products: ");
            console.log("-----------------------------------");

            var query = "SELECT * FROM products";
            connection.query(query, function(err, res) {
                if (err) throw err;

                for (var i = 0; i < res.length; i++) {
                    console.log(res[i].item_id + " " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " | Quantity: " + res[i].stock_quantity);
                }
            });
        }

        else if (answer.menuChoice === "View_Low_Inventory") {
            showLowInventory();
        }

        else if (answer.menuChoice === "Add_To_Inventory") {
            addToInventory();
        }
    });
}

function showLowInventory() {
    console.log("");
    console.log("Items with Low Inventory: ");
    console.log("-----------------------------------");

    var query = "SELECT * FROM products WHERE stock_quantity <= 5";
    connection.query(query, function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            // console.log("");
            console.log(res[i].item_id + " " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " | Quantity: " + res[i].stock_quantity);
            // console.log("-----------------------------------");
        }
    });

}

function addToInventory() {

    inquirer.prompt([{
        name: "item",
        type: "input",
        message: "Which item would you like to add inventory to? Please enter Item ID."

    }]).then(function(itemToAddTo) {
        var query = "SELECT * FROM products";
        connection.query(query, function(err, res) {
            if (err) throw err;

            for (var i = 0; i < res.length; i++) {
                console.log(res[i].item_id + " " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " | Quantity: " + res[i].stock_quantity);

            }
        });

        updateQuantity(itemToAddTo);

    });

}

function updateQuantity(value) {
    inquirer.prompt([{
        name: "itemQuantity",
        type: "input",
        message: "How many units would you like to add?"

    }]).then(function(quantityUpdate) {
        var query = "UPDATE products SET stock_quantity=? WHERE item_id=?";
        connection.query(query, [quantityUpdate.itemQuantity, value.item], function(err, res) {
            if (err) throw err;

            for (var i = 0; i < res.length; i++) {
                console.log("");
                console.log(res[i].product_name + " | Quantity: " + res[i].stock_quantity);
            }
        });
    });
}
