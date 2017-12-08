// declare and require mysql and inquirer packages
var mysql = require("mysql");
var inquirer = require("inquirer");

//create connection to bamazondb
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // username
    user: "root",

    // password
    password: "",
    database: "bamazonDB"
});

// call showMenuOptions upon connecting
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    showMenuOptions();
});

// show menu options function
// show manager 4 options: view products for sale, view low inventory, add to inventory, add new product
// run function specific to each option depending on which option the manager picks (using if/else statements)
function showMenuOptions() {
    inquirer.prompt([{
        name: "menuChoice",
        type: "list",
        message: "Welcome to the Bamazon Manager Portal. Please choose an option below.",
        choices: [{ name: "View Products for Sale", value: "View_Products" }, { name: "View Low Inventory", value: "View_Low_Inventory" }, { name: "Add to Inventory", value: "Add_To_Inventory" }, { name: "Add New Product", value: "Add_New_Product" }]

    }]).then(function(answer) {
        if (answer.menuChoice === "View_Products") {
            viewProducts();
        }

        else if (answer.menuChoice === "View_Low_Inventory") {
            showLowInventory();
        }

        else if (answer.menuChoice === "Add_To_Inventory") {
            addToInventory();
        }
    });
}


function viewProducts() {
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
                var quantity = res[i].stock_quantity;

            }
        });

        function updateQuantity() {
            var newQuantity = quantity +
                inquirer.prompt([{
                    name: "itemQuantity",
                    type: "input",
                    message: "How many units would you like to add?"

                }]).then(function(quantityUpdate) {
                    var query = "UPDATE products SET stock_quantity=? WHERE item_id=?";
                    connection.query(query, [quantityUpdate.itemQuantity, itemToAddTo.item], function(err, res) {
                        if (err) throw err;

                        for (var i = 0; i < res.length; i++) {
                            console.log("");
                            console.log(res[i].product_name + " | Quantity: " + res[i].stock_quantity);
                        }
                    });
                });
        }

    });

}
