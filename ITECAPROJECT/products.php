<?php
include 'session.php';
include 'dbconn.php';

function addToCart($itemName, $itemPrice, $itemID, $personalizationType = null, $personalizationValue = null) {
    if (!isset($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
    }

    // Calculate the new price based on personalization
    if ($personalizationType === 'name') {
        $itemPrice += 30;
    } elseif ($personalizationType === 'initial') {
        $itemPrice += 20;
    }

    // Check if the item is already in the cart
    $itemExists = false;
    foreach ($_SESSION['cart'] as &$item) {
        if ($item['id'] === $itemID) {
            $item['quantity'] += 1;
            $itemExists = true;
            break;
        }
    }

    // If the item doesn't exist, add it to the cart
    if (!$itemExists) {
        $_SESSION['cart'][] = [
            'name' => $itemName,
            'price' => $itemPrice,
            'id' => $itemID,
            'quantity' => 1,
            'personalizationType' => $personalizationType,
            'personalizationValue' => $personalizationValue
        ];
    }
}

// Handle add to cart request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['itemName']) && isset($_POST['itemPrice']) && isset($_POST['itemID'])) {
    $personalizationType = $_POST['personalizationType'] ?? null;
    $personalizationValue = $_POST['personalizationValue'] ?? null;
    addToCart($_POST['itemName'], $_POST['itemPrice'], $_POST['itemID'], $personalizationType, $personalizationValue);
    $_SESSION['itemAdded'] = true;
    header('Location: products.php#'.$_POST["itemName"].''); // Redirect to avoid form resubmission
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TinyWorld/Products</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>
<?php
$activePage = 'products';
include 'header.php';
    
    if(isset($_SESSION['itemAdded']) && $_SESSION['itemAdded']){
        echo '<script>console.log("Item added to cart")</script>';
        $_SESSION['itemAdded'] = false;
    }
?>
<div class="container col-xl-10 col-xxl-8 px-4 py-5">
    <div class="row align-items-center g-lg-5 py-5">
        <div class="col-lg-7 text-center text-lg-start">
            <h1 class="display-4 fw-boldbody-emphasis mb-3">Find your Ideal Shoe</h1>
            <p class="col-lg-10 fs-4">Search through our gallery of available shoe models or contact us to create and personalize your own shoe keyring.</p>
        </div>
        <div class="col-md-10 mx-auto col-lg-5">
            <form class="p-4 p-md-5 border rounded-3 bg-body-tertiary" id="contactForm">
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingInputEmail" placeholder="name@example.com">
                    <label for="floatingInput">Email address</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="floatingInputName" placeholder="Name">
                    <label for="floatingInput">Name</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" style="height: 150px;" class="form-control" id="floatingInputMessage" placeholder="Message">
                    <label for="floatingInput">Describe your shoe</label>
                </div>
                <button class="w-100 btn btn-lg btn-primary" type="submit">Send</button>
                <hr class="my-4">
                <small class="text-body-secondary">By clicking Send, we will review your message and contact you via email</small>
            </form>
        </div>
    </div>
</div>

<div class="album py-5 bg-body-tertiary" id="album-container">
    <div class="container"> 
    <h3>Shoe Keyrings</h3>
        <?php
        $sql = "SELECT DISTINCT brand FROM products";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            while ($brandRow = $result->fetch_assoc()) {
                $brand = htmlspecialchars($brandRow["brand"]);
                echo "<h4><br>{$brand}</h4>";
                echo '<div class="row row-cols-2 row-cols-sm-2 row-cols-md-3 g-3">';

                $stmt = $conn->prepare("SELECT stockid, name, price, image, quantity FROM products WHERE brand = ?");
                $stmt->bind_param("s", $brand);
                $stmt->execute();
                $productsResult = $stmt->get_result();

                if ($productsResult->num_rows > 0) {
                    while ($row = $productsResult->fetch_assoc()) {
                        $imagePath = htmlspecialchars($row["image"]);
                        $stockID = htmlspecialchars($row["stockid"]);

                        echo '
                            <div class="col">
                                <div class="card shadow-sm" id="'.htmlspecialchars($row["name"]).'">
                                    <img style="object-fit: cover; height: 225px;" src="'.$imagePath.'" class="bd-placeholder-img card-img-top" width="100%" height="225" alt="' . htmlspecialchars($row["name"]) . '">
                                    <div class="card-body">
                                        <p class="card-text">' . htmlspecialchars($row["name"]) . '</p>
                                        <form method="POST" action="products.php">
                                            <input type="hidden" name="itemName" value="' . htmlspecialchars($row["name"]) . '">
                                            <input type="hidden" name="itemPrice" value="' . htmlspecialchars($row["price"]) . '">
                                            <input type="hidden" name="itemID" value="' . htmlspecialchars($row["stockid"]) . '">
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="personalizationType" id="personalizationName'.$stockID.'" value="name" required>
                                                <label class="form-check-label" for="personalizationName'.$stockID.'">Add Name (+R30)</label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="personalizationType" id="personalizationInitial'.$stockID.'" value="initial" required>
                                                <label class="form-check-label" for="personalizationInitial'.$stockID.'">Add Initial (+R20)</label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="personalizationType" id="personalizationNone'.$stockID.'" value="none" required>
                                                <label class="form-check-label" for="personalizationNone'.$stockID.'">Normal Shoe</label>
                                            </div>
                                            <div class="mb-3">
                                                <input type="text" class="form-control" name="personalizationValue" placeholder="Enter Name/Initial">
                                            </div>
                                            <button type="submit" class="btn btn-sm btn-outline-secondary">Add to cart</button>
                                        </form>
                                        <div class="d-flex justify-content-between align-items-center mt-3">
                                            <div>
                                                <p class="card-text" style="text-align:right;">R' . htmlspecialchars($row["price"]) . '</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ';
                    }
                } else {
                    echo "<p>No products available for this brand.</p>";
                }

                echo '</div>';
            }
        } else {
            echo "<p>No brands available.</p>";
        }
        ?>
    </div>
</div>

<script src="https://cdn.emailjs.com/dist/email.min.js"></script>
<script src="sendEmailQuery.js"></script>
<?php
include 'footer.php';
?>
</body>
</html>
