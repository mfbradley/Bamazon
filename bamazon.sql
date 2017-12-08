DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(10) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tent", "Camping", 350.00, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sleeping Bag", "Camping", 150.00, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Backpack", "Camping", 200.00, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Water Filter", "Camping", 45.00, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pillow", "Camping", 40.00, 32);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Water Bottle", "Camping", 15.00, 60);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Camelbak", "Camping", 50.00, 45);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bug Spray", "Camping", 5.00, 80);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Hiking Boots", "Camping", 150.00, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Percolator", "Camping", 30.00, 40);

SELECT * FROM products;

