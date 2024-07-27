<?php
  include 'session.php';
  if (isset($_SESSION['userid'])) {
    require 'dbconn.php';

    // Prepare and bind parameters
    $stmt = $conn->prepare("SELECT privilege FROM users WHERE userid = ?");
    if ($stmt) {
        $stmt->bind_param("i", $_SESSION['userid']);
        $stmt->execute();
        $stmt->store_result();

        // Check if a result is returned
        if ($stmt->num_rows > 0) {
            // Bind the result to a variable
            $stmt->bind_result($privilege);
            $stmt->fetch();

            // Check if the privilege is true
            if ($privilege) {
            } else {
                echo '<script>alert("User does not have correct privilege.");</script>';
                header("Location: index.php");
                exit();
            }
        } else {
            echo '<script>alert("No user found with the given user ID.");</script>';
        }

        // Close the statement
        $stmt->close();
    } else {
        echo '<script>alert("Failed to prepare the SQL statement.");</script>';
    }

    // Close the connection
    $conn->close();
} else {
    echo '<script>alert("User ID not set in session.");</script>';
    header("Location: index.php");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <title>TinyWorld/Admin</title>
</head>
<body>
<?php
    $activePage = 'account';
    include 'header.php';
    require 'dbconn.php';
?>
<div class="container rounded bg-white mt-5 mb-5">
    <div class="row">
        <div class="col-md-3 border-right">
            <div class="d-flex flex-column align-items-center text-center p-3 py-5">
                <img class="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg">
                <span class="font-weight-bold">Admin</span>
            </div>
        </div>
        <div class="col-md-9 border-right">
            <div class="p-3 py-5">
                <h4 class="text-right">Stock Management</h4>
                <div class="container mt-5">
                    <?php
                    $brand = '';
                    $shoe = '';
                    $total_count = 0;
                    $stockID = 0;
                    $price = 0;
                    $image = '';

                    if (isset($_POST["brandsubmit"])) {
                        $brand = $_POST["brand"];
                    }

                    if (isset($_POST["shoesubmit"])) {
                        $brand = $_POST["brand"];
                        $shoe = $_POST["shoe"];
                    
                        // Fetch shoe details
                        $sql = "SELECT stockid, price, quantity, image FROM products WHERE brand = ? AND name = ?";
                        $stmt = $conn->prepare($sql);
                        $stmt->bind_param("ss", $brand, $shoe);
                        $stmt->execute();
                        $result = $stmt->get_result();
                        if ($result->num_rows > 0) {
                            $row = $result->fetch_assoc();
                            $stockID = $row["stockid"];
                            $price = $row["price"];
                            $total_count = $row["quantity"];
                            $image = $row["image"];
                        } else {
                            echo '<div class="alert alert-danger" role="alert">Product does not exist.</div>';
                            exit;
                        }
                    }

                    if (isset($_POST["updateShoe"])) {
                        $brand = $_POST["brand"];
                        $shoe = $_POST["shoe"];
                        $price = $_POST["price"];
                        $quantity = $_POST["quantity"];
                        $deleteImage = isset($_POST["deleteImage"]) ? $_POST["deleteImage"] : 0;
                        $newImage = $_FILES["newImage"]["name"];
                        $stockID = $_POST["stockID"]; // Ensure this is passed from the form
                    
                        // Delete current image if selected
                        if ($deleteImage == 1) {
                            $sql = "SELECT image FROM products WHERE brand = ? AND name = ?";
                            $stmt = $conn->prepare($sql);
                            if ($stmt) {
                                $stmt->bind_param("ss", $brand, $shoe);
                                $stmt->execute();
                                $result = $stmt->get_result();
                                if ($result->num_rows > 0) {
                                    $row = $result->fetch_assoc();
                                    $currentImage = $row["image"];
                                    if (!empty($currentImage)) {
                                        unlink("uploads/" . $currentImage);
                                    }
                                }
                                $stmt->close();
                            }
                    
                            $sql = "UPDATE products SET image = NULL WHERE stockid = ?";
                            $stmt = $conn->prepare($sql);
                            if ($stmt) {
                                $stmt->bind_param("i", $stockID);
                                $stmt->execute();
                                $stmt->close();
                            }
                        }
                    
                        // Upload new image if provided
                        if (!empty($newImage)) {
                            $target_dir = "uploads/";
                            $target_file = $target_dir . basename($_FILES["newImage"]["name"]);
                            if (move_uploaded_file($_FILES["newImage"]["tmp_name"], $target_file)) {
                                $sql = "UPDATE products SET image = ? WHERE brand = ? AND name = ?";
                                $stmt = $conn->prepare($sql);
                                if ($stmt) {
                                    $stmt->bind_param("sss", $target_file, $brand, $shoe);
                                    $stmt->execute();
                                    $stmt->close();
                                    echo '<div class="alert alert-success" role="alert">Shoe image updated successfully!</div>';
                                }
                            }
                        }
                    
                        // Update other details
                        $sql = "UPDATE products SET price = ?, quantity = ? WHERE stockid = ?";
                        $stmt = $conn->prepare($sql);
                        if ($stmt) {
                            $stmt->bind_param("dii", $price, $quantity, $stockID);
                            if ($stmt->execute()) {
                                echo '<div class="alert alert-success" role="alert">Shoe details updated successfully!</div>';
                            } else {
                                echo '<div class="alert alert-danger" role="alert">Error updating shoe details.</div>';
                            }
                            $stmt->close();
                        } else {
                            echo '<div class="alert alert-danger" role="alert">Failed to prepare the SQL statement.</div>';
                        }
                    }

                    if (isset($_POST["newshoesubmit"])) {
                        $brand = $_POST["newbrand"];
                        $shoe = $_POST["newshoe"];
                        $price = $_POST["newprice"];
                        $quantity = $_POST["newquantity"];
                        $image = $_FILES["newimage"]["name"];

                        // Upload image
                        $target_dir = "uploads/";
                        $target_file = $target_dir . basename($_FILES["newimage"]["name"]);
                        if (move_uploaded_file($_FILES["newimage"]["tmp_name"], $target_file)) {
                            $sql = "INSERT INTO products (brand, name, price, quantity, image) VALUES (?, ?, ?, ?, ?)";
                            $stmt = $conn->prepare($sql);
                            $stmt->bind_param("ssdis", $brand, $shoe, $price, $quantity, $image);
                            if ($stmt->execute()) {
                                echo '<div class="alert alert-success" role="alert">New shoe added successfully!</div>';
                            } else {
                                echo '<div class="alert alert-danger" role="alert">Error adding new shoe.</div>';
                            }
                        } else {
                            echo '<div class="alert alert-danger" role="alert">Error uploading image.</div>';
                        }
                    }
                    ?>

                    <!-- First form: Select brand -->
                    <form class="p-4 p-md-5 border rounded-3 bg-body-tertiary" method="POST" style="display: flex; justify-content: space-between;">
                        <div class="col-md-3">
                            <label class="labels">Brand</label>
                            <select id="brand" name="brand" class="form-control">
                                <?php
                                $sql = "SELECT DISTINCT brand FROM products";
                                $result = $conn->query($sql);
                                if ($result->num_rows > 0) {
                                    while ($row = $result->fetch_assoc()) {
                                        $selected = ($brand == $row["brand"]) ? 'selected' : '';
                                        echo '<option value="' . htmlspecialchars($row["brand"]) . '" ' . $selected . '>' . htmlspecialchars($row["brand"]) . '</option>';
                                    }
                                } else {
                                    echo '<option value="">No brands available</option>';
                                }
                                ?>
                            </select>
                        </div>
                        <div>
                            <button class="w-100 btn btn-lg btn-primary" type="submit" name="brandsubmit">Next</button>
                        </div>
                    </form>

                    <!-- Second form: Select shoe -->
                    <?php if (isset($brand) && !isset($_POST["shoesubmit"])): ?>
                        <form class="p-4 p-md-5 border rounded-3 bg-body-tertiary" method="POST" style="display: flex; justify-content: space-between;">
                            <input type="hidden" name="brand" value="<?php echo htmlspecialchars($brand); ?>">
                            <div class="col-md-3">
                                <label class="labels">Shoe</label>
                                <select id="shoe" name="shoe" class="form-control">
                                    <?php
                                    $sql = "SELECT DISTINCT name FROM products WHERE brand = ?";
                                    $stmt = $conn->prepare($sql);
                                    $stmt->bind_param("s", $brand);
                                    $stmt->execute();
                                    $result = $stmt->get_result();
                                    if ($result->num_rows > 0) {
                                        while ($row = $result->fetch_assoc()) {
                                            echo '<option value="' . htmlspecialchars($row["name"]) . '">' . htmlspecialchars($row["name"]) . '</option>';
                                        }
                                    } else {
                                        echo '<option value="">No shoes available</option>';
                                    }
                                    ?>
                                </select>
                            </div>
                            <div>
                                <button class="w-100 btn btn-lg btn-primary" type="submit" name="shoesubmit">Next</button>
                            </div>
                        </form>
                    <?php endif; ?>
                    
                     <!-- Form to update a shoe -->
                    <h4 class="text-right">Update Shoe</h4>
                    <form style="margin-top: 10px" class="p-4 p-md-5 border rounded-3 bg-body-tertiary" method="POST" enctype="multipart/form-data">
                        <input type="hidden" name="productID" value="<?php echo htmlspecialchars($productID); ?>">
                        <div class="col-md-3 mb-3">
                            <label class="labels">stockid</label>
                            <input type="text" name="stockID" value="<?php echo htmlspecialchars($stockID); ?>" readonly>                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="labels">Brand</label>
                            <input type="text" name="brand" class="form-control" value="<?php echo htmlspecialchars($brand); ?>" readonly>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="labels">Shoe</label>
                            <input type="text" name="shoe" class="form-control" value="<?php echo htmlspecialchars($shoe); ?>" readonly>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="labels">Price</label>
                            <input type="number" step="0.01" name="price" class="form-control" value="<?php echo htmlspecialchars($price); ?>" required>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="labels">Quantity</label>
                            <input type="number" name="quantity" class="form-control" value="<?php echo htmlspecialchars($total_count); ?>" required>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="labels">Current Image</label><br>
                            <?php if (!empty($image)): ?>
                                <img src="<?php echo htmlspecialchars($image); ?>" class="img-thumbnail" alt="Current Image" style="max-width: 200px; max-height: 200px;"><br><br>
                                <input type="checkbox" name="deleteImage" value="1"> Delete Current Image<br><br>
                            <?php else: ?>
                                <p>No current image available</p>
                            <?php endif; ?>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="labels">New Image</label>
                            <input type="file" name="newImage" id="newImage" class="form-control" accept="image/*">
                        </div>
                        <div class="col-md-3 mb-3">
                            <button class="w-100 btn btn-lg btn-primary" type="submit" name="updateShoe">Update Shoe</button>
                        </div>
                    </form>
                    </div>

                    <!-- Form to add a new shoe -->
                    <h4 class="text-right">Add Shoe</h4>
                    <form style="margin-top: 10px" class="p-4 p-md-5 border rounded-3 bg-body-tertiary" method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column;">
                        <div class="col-md-3 mb-3">
                            <label class="labels">Brand</label>
                            <input type="text" name="newBrand" class="form-control" required>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="labels">Shoe</label>
                            <input type="text" name="newShoe" class="form-control" required>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="labels">Price</label>
                            <input type="number" step="0.01" name="newPrice" class="form-control" required>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="labels">Quantity</label>
                            <input type="number" name="newQuantity" class="form-control" required>
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="labels">Image</label>
                            <input type="file" name="newImage" class="form-control" accept="image/*" required>
                        </div>
                        <div class="col-md-3 mb-3">
                            <button class="w-100 btn btn-lg btn-primary" type="submit" name="addNewShoe">Add New Shoe</button>
                        </div>
                    </form>
                    
            <!--Orders-->
                    <div id="ordertab" class="p-4 p-md-5 border rounded-3 bg-body-tertiary">
            <div class="p-4 p-md-5 border rounded-3 bg-body-tertiary">
                <div class="d-flex justify-content-between align-items-center experience">
                    <span>Pending Orders</span>
                </div>
                <br>
                <?php
                $sql = "SELECT orderid, date, status FROM orders WHERE status = 'Pending Payment'";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        echo '
                        <div class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                            <div class="d-flex gap-2 w-100 justify-content-between">
                                <div>
                                    <h6 class="mb-0">Order No: ' . htmlspecialchars($row["orderid"]) . '</h6>
                                    <p class="mb-0 opacity-75">Status: ' . htmlspecialchars($row["status"]) . '</p>
                                </div>
                                <small class="opacity-50 text-nowrap">' . htmlspecialchars($row["date"]) . '</small>
                            </div>
                            </div><br>
                            <div class="d-flex gap-2">
                                <form method="POST" action="admin.php#ordertab">
                                    <input type="hidden" name="orderid" value="' . htmlspecialchars($row["orderid"]) . '">
                                    <input type="hidden" name="new_status" value="Paid">
                                    <button type="submit" class="btn btn-success btn-sm">Set to Paid</button>
                                </form>
                                <form method="POST" action="admin.php#ordertab">
                                    <input type="hidden" name="orderid" value="' . htmlspecialchars($row["orderid"]) . '">
                                    <input type="hidden" name="new_status" value="Completed">
                                    <button type="submit" class="btn btn-primary btn-sm">Set to Completed</button>
                                </form>
                                <form method="POST" action="admin.php#ordertab">
                                    <input type="hidden" name="orderid" value="' . htmlspecialchars($row["orderid"]) . '">
                                    <input type="hidden" name="new_status" value="Cancelled">
                                    <button type="submit" class="btn btn-danger btn-sm">Set to Cancelled</button>
                                </form>
                                <form method="POST" action="admin.php#ordertab">
                                    <input type="hidden" name="orderid" value="' . htmlspecialchars($row["orderid"]) . '">
                                    <input type="hidden" name="new_status" value="Pending Payment">
                                    <button type="submit" class="btn btn-danger btn-sm">Set to Pending</button>
                                </form>
                            </div>
                        ';
                    }
                } else {
                    echo "No orders here";
                }
                ?>
            </div>
                    </div>
                    <div id="paidorder"class="p-4 p-md-5 border rounded-3 bg-body-tertiary">
    <div class="p-4 p-md-5 border rounded-3 bg-body-tertiary">
        <div class="d-flex justify-content-between align-items-center experience"><span>Paid</span></div><br>
        <?php
        $sql = "SELECT orderid, date, status FROM orders WHERE status = 'Paid'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                echo '
                <div class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                    <div class="d-flex gap-2 w-100 justify-content-between">
                        <div>
                            <h6 class="mb-0">Order No: ' . htmlspecialchars($row["orderid"]) . '</h6>
                            <p class="mb-0 opacity-75">Status: ' . htmlspecialchars($row["status"]) . '</p>
                        </div>
                        <small class="opacity-50 text-nowrap">' . htmlspecialchars($row["date"]) . '</small>
                    </div>
                </div>
                    <div class="d-flex gap-2">
                        <form method="POST" action="admin.php#paidorder">
                            <input type="hidden" name="orderid" value="' . htmlspecialchars($row["orderid"]) . '">
                            <input type="hidden" name="new_status" value="Paid">
                            <button type="submit" class="btn btn-success btn-sm">Set to Paid</button>
                        </form>
                        <form method="POST" action="admin.php#paidorder">
                            <input type="hidden" name="orderid" value="' . htmlspecialchars($row["orderid"]) . '">
                            <input type="hidden" name="new_status" value="Completed">
                            <button type="submit" class="btn btn-primary btn-sm">Set to Completed</button>
                        </form>
                        <form method="POST" action="admin.php#paidorder">
                            <input type="hidden" name="orderid" value="' . htmlspecialchars($row["orderid"]) . '">
                            <input type="hidden" name="new_status" value="Cancelled">
                            <button type="submit" class="btn btn-danger btn-sm">Set to Cancelled</button>
                        </form>
                        <form method="POST" action="admin.php#paidorder">
                            <input type="hidden" name="orderid" value="' . htmlspecialchars($row["orderid"]) . '">
                            <input type="hidden" name="new_status" value="Pending">
                            <button type="submit" class="btn btn-danger btn-sm">Set to Pending</button>
                        </form>
                    </div><br>
                    <div class="d-flex gap-2">
                    <button type="button" class="btn btn-info btn-sm" onclick="showOrderDetails(' . htmlspecialchars($row["orderid"]) . ')">View Details</button>
                    </div>
                    <div id="order-details-' . htmlspecialchars($row["orderid"]) . '" class="order-details mt-3" style="display: none;"></div>
                ';
            }
        } else {
            echo "No orders here";
        }
        ?>
    </div>
</div>

<script>
function showOrderDetails(orderId) {
    var orderDetailsDiv = document.getElementById('order-details-' + orderId);
    if (orderDetailsDiv.style.display === 'none') {
        fetch('getOrderDetails.php?orderid=' + orderId)
            .then(response => response.text())
            .then(data => {
                orderDetailsDiv.innerHTML = data;
                orderDetailsDiv.style.display = 'block';
            });
    } else {
        orderDetailsDiv.style.display = 'none';
    }
}
</script>

                    <div id="completedorder"class="p-4 p-md-5 border rounded-3 bg-body-tertiary">
                        <div class="p-4 p-md-5 border rounded-3 bg-body-tertiary">
                            <div class="d-flex justify-content-between align-items-center experience">
                                <span>Completed</span>
                            </div><br>
                            <?php
                            $sql = "SELECT orderid, date, status FROM orders WHERE status = 'Completed'";
                            $result = $conn->query($sql);

                            if ($result->num_rows > 0) {
                                while($row = $result->fetch_assoc()){
                                echo '
                                    <div  class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                                    <div class="d-flex gap-2 w-100 justify-content-between">
                                        <div>
                                        <h6 class="mb-0">Order No: '.htmlspecialchars($row["orderid"]).'</h6>
                                        <p class="mb-0 opacity-75">Status: '.htmlspecialchars($row["status"]).'</p>
                                        </div>
                                        <small class="opacity-50 text-nowrap">'.htmlspecialchars($row["date"]).'</small>
                                    </div>
                                    </div><br>
                                    <div class="d-flex gap-2">
                                        <form method="POST" action="admin.php#completedorder">
                                            <input type="hidden" name="orderid" value="' . htmlspecialchars($row["orderid"]) . '">
                                            <input type="hidden" name="new_status" value="Paid">
                                            <button type="submit" class="btn btn-success btn-sm">Set to Paid</button>
                                        </form>
                                        <form method="POST" action=admin.php#completedordeadmin.php#completedorde"">
                                            <input type="hidden" name="orderid" value="' . htmlspecialchars($row["orderid"]) . '">
                                            <input type="hidden" name="new_status" value="Completed">
                                            <button type="submit" class="btn btn-primary btn-sm">Set to Completed</button>
                                        </form>
                                        <form method="POST" action="admin.php#completedorde">
                                            <input type="hidden" name="orderid" value="' . htmlspecialchars($row["orderid"]) . '">
                                            <input type="hidden" name="new_status" value="Cancelled">
                                            <button type="submit" class="btn btn-danger btn-sm">Set to Cancelled</button>
                                        </form>
                                        <form method="POST" action="admin.php#completedorde">
                                            <input type="hidden" name="orderid" value="' . htmlspecialchars($row["orderid"]) . '">
                                            <input type="hidden" name="new_status" value="Pending">
                                            <button type="submit" class="btn btn-danger btn-sm">Set to Pending</button>
                                        </form>
                                    </div>
                                ';
                                }     
                            }else{
                                echo "No orders here";
                            }

                            ?>                   
                        </div>
                    </div>
               </div>
           </div>
       </div>
   </div>
   <?php

                    // Function to update the order status
                    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['orderid']) && isset($_POST['new_status'])) {
                        $orderid = intval($_POST['orderid']);
                        $new_status = $_POST['new_status'];

                        $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE orderid = ?");
                        $stmt->bind_param('si', $new_status, $orderid);

                        if ($stmt->execute()) {
                            echo '<div class="alert alert-success" role="alert">Order status updated successfully!</div>';
                        } else {
                            echo '<div class="alert alert-danger" role="alert">Failed to update order status.</div>';
                        }

                        $stmt->close();
                    }

                    if (isset($_POST["addNewShoe"])) {
                        $newBrand = $_POST["newBrand"];
                        $newShoe = $_POST["newShoe"];
                        $newPrice = $_POST["newPrice"];
                        $newQuantity = $_POST["newQuantity"];

                        // Image upload handling
                        $targetDir = "uploads/";
                        $targetFile = $targetDir . basename($_FILES["newImage"]["name"]);
                        $uploadOk = 1;
                        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

                        // Check if image file is a actual image or fake image
                        $check = getimagesize($_FILES["newImage"]["tmp_name"]);
                        if ($check !== false) {
                            $uploadOk = 1;
                        } else {
                            echo '<div class="alert alert-danger" role="alert">File is not an image.</div>';
                            $uploadOk = 0;
                        }

                        // Check if file already exists
                        if (file_exists($targetFile)) {
                            echo '<div class="alert alert-danger" role="alert">Sorry, file already exists.</div>';
                            $uploadOk = 0;
                        }

                        // Check file size
                        if ($_FILES["newImage"]["size"] > 500000) {
                            echo '<div class="alert alert-danger" role="alert">Sorry, your file is too large.</div>';
                            $uploadOk = 0;
                        }

                        // Allow certain file formats
                        if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
                            echo '<div class="alert alert-danger" role="alert">Sorry, only JPG, JPEG, PNG & GIF files are allowed.</div>';
                            $uploadOk = 0;
                        }

                        // Check if $uploadOk is set to 0 by an error
                        if ($uploadOk == 0) {
                            echo '<div class="alert alert-danger" role="alert">Sorry, your file was not uploaded.</div>';
                        } else {
                            if (move_uploaded_file($_FILES["newImage"]["tmp_name"], $targetFile)) {
                                $sql = "INSERT INTO products (brand, name, price, quantity, image) VALUES (?, ?, ?, ?, ?)";
                                $stmt = $conn->prepare($sql);

                                // Check if prepare() succeeded
                                if ($stmt === false) {
                                    echo '<div class="alert alert-danger" role="alert">Prepare failed: ' . htmlspecialchars($conn->error) . '</div>';
                                } else {
                                    $stmt->bind_param("ssdis", $newBrand, $newShoe, $newPrice, $newQuantity, $targetFile);

                                    if ($stmt->execute()) {
                                        echo '<div class="alert alert-success" role="alert">New shoe added successfully!</div>';
                                    } else {
                                        echo '<div class="alert alert-danger" role="alert">Execute failed: ' . htmlspecialchars($stmt->error) . '</div>';
                                    }
                                }
                            } else {
                                echo '<div class="alert alert-danger" role="alert">Sorry, there was an error uploading your file.</div>';
                            }
                        }
                    }
                    ?>

   <?php
   // Close connection
   $conn->close();
   ?>
   </div>
</body>
</html>
