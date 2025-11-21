<?php
    // Local development database configuration
    $servername = "localhost";
    $username = "root";
    $password = "";  // Change this if your MySQL root password is different
    $dbname = "tinyworld_db";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
?>