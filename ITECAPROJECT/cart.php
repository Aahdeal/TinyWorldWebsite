<?php
include 'session.php';
include 'dbconn.php';

// Function to increase the quantity of an item in the cart
function increaseQuantity($itemID) {
    if (isset($_SESSION['cart'])) {
        foreach ($_SESSION['cart'] as &$item) {
            if ($item['id'] == $itemID) {
                $item['quantity'] += 1;
                break;
            }
        }
    }
}

// Function to decrease the quantity of an item in the cart
function decreaseQuantity($itemID) {
    if (isset($_SESSION['cart'])) {
        foreach ($_SESSION['cart'] as $key => &$item) {
            if ($item['id'] == $itemID) {
                $item['quantity'] -= 1;
                if ($item['quantity'] <= 0) {
                    unset($_SESSION['cart'][$key]);
                }
                break;
            }
        }
        // Re-index the array to remove any gaps
        $_SESSION['cart'] = array_values($_SESSION['cart']);
    }
}

// Handle form submissions for increasing or decreasing quantity
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['increase'])) {
        increaseQuantity($_POST['itemID']);
    } elseif (isset($_POST['decrease'])) {
        decreaseQuantity($_POST['itemID']);
    } elseif (isset($_POST['paymentbtn'])) {
        header('Location: checkout.php');
        exit();
    }
    header('Location: cart.php'); // Redirect to avoid form resubmission
    exit();
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
$redirect = isset($_SESSION['userid']) ? "checkout.php" : "login.php";
?>
<div class="container" id="Hero">
    <div class="py-5 text-center">
        <h2>Checkout</h2>
    </div>
    <div class="container">
        <h2>Your Cart</h2>
        <?php if (isset($_SESSION['cart']) && count($_SESSION['cart']) > 0): ?>
            <ul class="list-group mb-3">
                <?php foreach ($_SESSION['cart'] as $item): ?>
                    <li class="list-group-item d-flex justify-content-between lh-sm">
                        <div>
                            <h6 class="my-0"><?php echo htmlspecialchars($item['name']); ?></h6>
                            <small class="text-body-secondary">Quantity: <?php echo htmlspecialchars($item['quantity']); ?></small>
                        </div>
                        <span class="text-body-secondary">R<?php echo htmlspecialchars($item['price']); ?></span>
                        <div>
                            <form method="post" style="display:inline;">
                                <input type="hidden" name="itemID" value="<?php echo htmlspecialchars($item['id']); ?>">
                                <button type="submit" name="increase" class="btn btn-sm btn-success">+</button>
                                <button type="submit" name="decrease" class="btn btn-sm btn-danger">-</button>
                            </form>
                        </div>
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
                            echo $total;
                        ?>
                    </strong>
                </li>
            </ul>
            <form method="post" action="<?php echo $redirect; ?>">
                <button type="submit" class="btn btn-primary" name="paymentbtn" style="margin-bottom: 15px;">Proceed to Payment</button>
            </form>        
        <?php else: ?>
            <div>
              <p>Your cart is empty.</p>
            </div>
        <?php endif; ?>
    </div>
</div>
<?php
include 'footer.php';
?>
</body>
</html>
