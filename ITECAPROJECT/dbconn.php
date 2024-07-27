<?php
    $servername = "localhost";
    $username = "tinywqgs_admin";
    $password = "TinyWorld@1";
    $dbname = "tinywqgs_clients";

              // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

              // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
?>