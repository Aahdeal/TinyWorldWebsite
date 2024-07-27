<?php
include 'session.php';
include 'dbconn.php';

// Ensure the user is logged in before proceeding
if (!isset($_SESSION['userid'])) {
    header("Location: login.php");
    exit();
}

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Check if the form has been submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['paymentbtn'])) {
    // Ensure all required POST variables are set
    if (isset($_POST['email']) && isset($_POST['cellno']) && isset($_POST['delivery_method'])) {
        $userid = $_SESSION['userid'];
        $email = $_POST['email'];
        $cellno = $_POST['cellno'];
        $coldev = $_POST['delivery_method'];
        $total = 0;
        $quantity = 0;
        $date = date('Y-m-d');
        $status = 'Pending Payment';
        
        $_SESSION['email'] = $email;
        $_SESSION['cellNo'] = $cellno;
        $_SESSION['delivery'] = $coldev;

        foreach ($_SESSION['cart'] as $item) {
            $total += $item['price'] * $item['quantity'];
            $quantity += $item['quantity'];
        }

        // Insert order into the orders table
        $stmt = $conn->prepare("INSERT INTO orders (userid, totalcost, quantity, date, coldev, status) VALUES (?, ?, ?, ?, ?, ?)");
        if ($stmt === false) {
            die('Prepare failed: ' . htmlspecialchars($conn->error));
        }
        $stmt->bind_param("iidsss", $userid, $total, $quantity, $date, $coldev, $status);
        if ($stmt->execute()) {
            $orderid = $stmt->insert_id; // Get the ID of the inserted order
            $_SESSION['oID'] = $orderid;
        } else {
            die('Execute failed: ' . htmlspecialchars($stmt->error));
        }
        $stmt->close();

        // Insert order products into the orderproducts table
        $stmt = $conn->prepare("INSERT INTO orderproducts (orderid, stockid, quantity, type, value) VALUES (?, ?, ?, ?, ?)");
        if ($stmt === false) {
            die('Prepare failed: ' . htmlspecialchars($conn->error));
        }
        foreach ($_SESSION['cart'] as $item) {
            $stmt->bind_param("iiiss", $orderid, $item['id'], $item['quantity'], $item['personalizationType'], $item['personalizationValue']);
            if (!$stmt->execute()) {
                die('Execute failed: ' . htmlspecialchars($stmt->error));
            }
        }
        $stmt->close();

        // Clear the cart after successful order placement
        unset($_SESSION['cart']);
        echo '
        <div class="alert alert-success" role="alert">Order placed successfully! Please view order status in the account page.</div>
        ';
        $_SESSION['ordered'] = true;
    } else {
        echo '<div class="alert alert-danger" role="alert">Please fill in all required fields.</div>';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TinyWorld/Checkout</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
</head>
<body>
<?php
$activePage = 'cart';
include 'header.php';
    if(isset($_SESSION['ordered'])&&$_SESSION['ordered']){
        echo '
        <div class="container" id="PaymentDetails">
            <div class="py-5 text-center">
                <h2>Payment Details</h2>
                <p class="lead">Please make your payment to the following bank account and email the proof of payment (PoP) to the email address below:</p>
                <p class="lead">Bank: Capitec Bank</p>
                <p class="lead">Account Number: 1730075752</p>
                <p class="lead">Account Type: Savings</p>
                <p class="lead">Account Holder: Miss E Felic</p>
                <p class="lead">Email for PoP: emily.tinyw0rld@gmail.com</p>
            </div>
        </div>
        ';
        
        echo '<script>document.getElementById("Hero").style.visibility = "hidden";</script>';
        
        echo '<input type="hidden" id="oID" value="'.$_SESSION['oID'].'">';
        echo '<input type="hidden" id="total" value="'.$_SESSION['total'].'">';
        echo '<input type="hidden" id="email" value="'.$_SESSION['email'].'">';
        echo '<input type="hidden" id="cellNo" value="'.$_SESSION['cellNo'].'">';
        echo '<input type="hidden" id="delivery" value="'.$_SESSION['delivery'].'">';
        echo '<div id="send" style="visibility: hidden"></div>';
        $_SESSION['ordered'] = false;
    }
?>
<div class="container" id="Hero" style="visibility: visible" >
    <div class="py-5 text-center">
        <h2>Checkout</h2>
    </div>
    <div class="row">
        <!-- User Information Form -->
        <div class="col-md-8 order-md-1" style="margin-bottom: 10px">
            <h4 class="mb-3">Contact Information</h4>
            <form action="" method="post">
                <div class="mb-3">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" name="email" value="<?php echo isset($_SESSION['email']) ? htmlspecialchars($_SESSION['email']) : ''; ?>" required>
                </div>
                <div class="mb-3">
                    <label for="cellNumber">Cell Number</label>
                    <input type="text" class="form-control" id="cellNumber" name="cellno" value="<?php echo isset($_SESSION['cellno']) ? htmlspecialchars($_SESSION['cellno']) : ''; ?>" required>
                </div>
                <div class="mb-3">
                    <label for="deliveryMethod">Delivery Method</label>
                    <select class="custom-select d-block w-100" id="deliveryMethod" name="delivery_method" required>
                        <option value="">Choose...</option>
                        <option value="collection-CR">Collection - City Rock Cape Town</option>
                        <option value="collection-B11PE">Collection - Bloc11 Paarden Eiland</option>
                        <option value="collection-B11DR">Collection - Bloc11 Dipe River</option>
                        <option value="delivery">Delivery (additional fee)</option>
                    </select>
                </div>
                <hr class="mb-4">
                <h4 class="mb-3">Your Cart</h4>
                <?php if (isset($_SESSION['cart']) && count($_SESSION['cart']) > 0): ?>
                    <ul class="list-group mb-3">
                        <?php foreach ($_SESSION['cart'] as $item): ?>
                            <li class="list-group-item d-flex justify-content-between lh-sm">
                                <div>
                                    <h6 class="my-0"><?php echo htmlspecialchars($item['name']); ?></h6>
                                    <small class="text-body-secondary">Quantity: <?php echo htmlspecialchars($item['quantity']); ?></small>
                                </div>
                                <span class="text-body-secondary">R<?php echo htmlspecialchars($item['price']); ?></span>
                            </li>
                        <?php endforeach; ?>
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Total</span>
                            <strong>
                            R<?php 
                                    $total = 0;
                                    foreach ($_SESSION['cart'] as $item) {
                                        $total += $item['price'] * $item['quantity'];
                                    }
                                    $_SESSION['total'] = $total;
                                    echo $total;
                                ?>
                            </strong>
                        </li>
                    </ul>
                    <hr class="mb-4">
                    <button type="submit" class="btn btn-primary btn-lg btn-block" name="paymentbtn">Proceed to Payment</button>
                <?php else: ?>
                    <div>
                        <p>Your cart is empty.</p>
                    </div>
                <?php endif; ?>
            </form>
        </div>
    </div>
</div>

<?php
include 'footer.php';
?>

<!-- Bootstrap JS and dependencies -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
<script src="https://cdn.emailjs.com/dist/email.min.js"></script>
<script src="sendEmailOrder.js"></script>
</body>
</html>
  
