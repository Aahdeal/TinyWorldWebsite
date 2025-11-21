-- Database setup script for TinyWorld ITECAPROJECT
-- Run this script to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS tinyworld_db;
USE tinyworld_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) DEFAULT '',
    surname VARCHAR(255) DEFAULT '',
    cellno VARCHAR(20) DEFAULT '',
    privilege ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    stockid INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT DEFAULT 0,
    image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    orderid INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    totalcost DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    date DATE NOT NULL,
    coldev VARCHAR(255) DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'Pending Payment',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
);

-- Create orderproducts table
CREATE TABLE IF NOT EXISTS orderproducts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderid INT NOT NULL,
    stockid INT NOT NULL,
    quantity INT NOT NULL,
    type VARCHAR(255) DEFAULT NULL,
    value VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderid) REFERENCES orders(orderid) ON DELETE CASCADE,
    FOREIGN KEY (stockid) REFERENCES products(stockid) ON DELETE CASCADE
);

-- Create an admin user (password: admin123 - change this after first login!)
-- Password hash for 'admin123'
INSERT INTO users (email, password, name, surname, privilege) 
VALUES ('admin@tinyworld.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin')
ON DUPLICATE KEY UPDATE email=email;

