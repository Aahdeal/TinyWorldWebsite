<!-- header.php -->
<?php
    if (session_status() == PHP_SESSION_NONE){session_start();}
    require 'dbconn.php';
    // Check if the logout button is clicked

    if (isset($_POST['LogOut'])) {
        session_unset(); // Clear session variables
        session_destroy();
        echo '<script>window.location.href = "index.php"</script>'; // Redirect to home page
        exit();
    }
    
    // Check if the account button is clicked
    if (isset($_POST['account'])) {
        // Check if user ID is set in the session
        if (isset($_SESSION['userid'])) {
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
                        echo '<script>window.location.href = "admin.php"</script>';
                        exit(); // Ensure the script stops executing after the redirect
                    } else {
                        echo '<script>window.location.href = "account.php"</script>';
                        exit(); // Ensure the script stops executing after the redirect
                    }
                } else {
                    echo '<script>alert("No user found with the given user ID.");</script>';
                }
    
                // Close the statement
                $stmt->close();
            } else {
                echo '<script>alert("Failed to prepare the SQL statement: ' . $conn->error . '");</script>';
            }
        } else {
            echo '<script>alert("User ID not set in session.");</script>';
        }
    }
?>

<div class="container col-xxl-8 px-4" id="header">
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom" style="padding-right: 10px">
        <div class="col-md-3 mb-2 mb-md-0">
            <a href="" class="d-inline-flex link-body-emphasis text-decoration-none">
                <img src="assets/tinyworld-header.PNG" alt="" style="height: 10em; margin-bottom: 2px;">
            </a>
        </div>
        <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0" style="margin-top: 0px;">
            <li><a href="index.php" class="nav-link px-2 <?= $activePage == 'home' ? 'link-secondary' : '' ?>">Home</a></li>
            <li><a href="products.php" class="nav-link px-2 <?= $activePage == 'products' ? 'link-secondary' : '' ?>">Products</a></li>
            <li><a href="contactus.php" class="nav-link px-2 <?= $activePage == 'contactus' ? 'link-secondary' : '' ?>">Contact Us</a></li>
            <li><a href="faq.php" class="nav-link px-2 <?= $activePage == 'faq' ? 'link-secondary' : '' ?>">FAQs</a></li>
        </ul>
        <div class="col-md-3 text-end">
                <div class="col-md-3 text-end" style="display:flex; flex-direction: row; justify-content: space-around; align-items:center; ">
                    <?php if (isset($_SESSION['userid']) || isset($_SESSION['login'])): ?>
                        <form method="POST">
                            <button type="submit" name="LogOut" class="btn btn-outline-primary me-2">LogOut</button>
                        </form>
                        <form method="POST">
                            <button type="submit" name="account" class="btn btn-primary" style="width:fit-content">Account</button>
                        </form>
                        <button type="button" class="btn btn-success" onclick="window.location.href = 'cart.php'" style="margin-left: 5px">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"></path>
                            </svg>
                        Cart
                        </button>

                    <?php else:?>
                        <a href="/login.php"><button type="button" class="btn btn-outline-primary me-2">Login</button></a>
                        <a href="/signup.php"><button type="button" class="btn btn-primary" style="width:fit-content">Sign Up</button></a>
                        <button type="button" class="btn btn-success" onclick="window.location.href = 'cart.php'" style="margin-left: 5px">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"></path>
                            </svg>
                        Cart
                        </button>
                    <?php endif; ?>
                </div>
            </div>
    </header>
</div>

