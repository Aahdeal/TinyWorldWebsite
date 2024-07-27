<?php
  include 'session.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TinyWorld/FAQ</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>
<?php
      $activePage = 'faq';
      include 'header.php';
  ?>
    
    <div id="Hero" class="container col-xxl-8 px-4">
      <h4 style="text-align: center; padding: 20px;">Frequently Asked Questions</h4>
    </div>

    <div class="d-flex flex-column flex-md-row p-4 gap-4 py-md-5 align-items-center justify-content-center">
  <div class="list-group">
    <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
      <div class="d-flex gap-2 w-100 justify-content-between">
        <div>
          <h6 class="mb-0">How to Order</h6>
          <p class="mb-0 opacity-75">Orders are placed via our products page or through our Instagram.</p>
        </div>
      </div>
    </a>
    <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
      <div class="d-flex gap-2 w-100 justify-content-between">
        <div>
          <h6 class="mb-0">Can I Personalize My Shoe</h6>
          <p class="mb-0 opacity-75">When selecting your shoe, you will be prompted with any customizations you would like to add <br>
          Eg. Adding a name to the sole of the shoe.</brt></p>
        </div>
      </div>
    </a>
    <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
      <div class="d-flex gap-2 w-100 justify-content-between">
        <div>
          <h6 class="mb-0">Returns and Refunds</h6>
          <p class="mb-0 opacity-75">All sales of climbing shoe keyrings are final. We do not offer refunds, returns or exchanges. <br>
          Please ensure that you review your order before completing the purchase</p>
        </div>
      </div>
    </a>
    <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
        <div class="d-flex gap-2 w-100 justify-content-between">
          <div>
            <h6 class="mb-0">Payment</h6>
            <p class="mb-0 opacity-75">All payments must be made in full at the time of placing your order. <br>
            Payments are to be made via EFT<br>
          With proof of payment to be sent to email:</p>
          </div>
        </div>
      </a>
      <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
        <div class="d-flex gap-2 w-100 justify-content-between">
          <div>
            <h6 class="mb-0">Shipping</h6>
            <p class="mb-0 opacity-75">We strive to process and ship orders promptly; However, delivery times may vary. <br>
            Tiny World is not responsible for delays caused by external factors, including but not limited to shipping carriers and customs.<br>
            </p>
          </div>
        </div>
      </a>
      <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
        <div class="d-flex gap-2 w-100 justify-content-between">
          <div>
            <h6 class="mb-0">Collection</h6>
            <p class="mb-0 opacity-75">If you have placed your order from within Cape Town. <br>
            You may collect your order from any of the climbing gyms within the City.</p>
          </div>
        </div>
      </a>
      <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
        <div class="d-flex gap-2 w-100 justify-content-between">
          <div>
            <h6 class="mb-0">Damaged or Defective Goods</h6>
            <p class="mb-0 opacity-75">In the unlikely event that you receive a damaged or defective product from us, please contact us within 14 days of receiving the product. <br>
            We will assess the situation on a case-by-case basis and may provide a replacement at our discretion.</p>
          </div>
        </div>
      </a>
      <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
        <div class="d-flex gap-2 w-100 justify-content-between">
          <div>
            <h6 class="mb-0">Intellectual Property</h6>
            <p class="mb-0 opacity-75">The design, images and content associated eith our climbing shoe keyrings are the intellectual property of Tiny World. <br>
            Reproduction or unauthorized use of these materials is strictly prohibited</p>
          </div>
        </div>
      </a>
      <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
        <div class="d-flex gap-2 w-100 justify-content-between">
          <div>
            <h6 class="mb-0">Acceptance of Terms</h6>
            <p class="mb-0 opacity-75">By purchasing a climbing shoe keyring from Tiny World, <br>
            You agree to abide by these terms and conditions. These terms constitute a legally binding agreement between you and Tiny World.<br><br>
          Tiny World reserves the right to update or modify these terms and conditions at any time. Customers will be notified of any changes, and continued use of our website and services constitues acceptance of the modified terms.</p>
          </div>
        </div>
      </a>
      <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
        <div class="d-flex gap-2 w-100 justify-content-between">
          <div>
            <h6 class="mb-0">Limitation of Liability</h6>
            <p class="mb-0 opacity-75">Tiny World is not liable for any indirect, incidental, speical, or consequential damages arising out of the use our inability to use our climbing shoe keyrings.</p>
          </div>
        </div>
      </a>
  </div>
  </div>

  <?php
      include 'footer.php';
    ?>
</body>
</html>