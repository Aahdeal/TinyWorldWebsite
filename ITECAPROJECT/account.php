<?php
  include 'session.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <title>TinyWorld/Account</title>
</head>
<body> 
      <?php
              $activePage = 'home';
              include 'header.php';
              require 'dbconn.php';

              $sql = "SELECT name, surname, cellno FROM users where userid = ".$_SESSION['userid']."";
              $details = $conn->query($sql);
              if($details -> num_rows>0){
                $row = $details->fetch_assoc();
                $name = htmlspecialchars($row['name']);
                $surname = htmlspecialchars($row['surname']);
                $cellno = htmlspecialchars($row['cellno']);
              }
      ?>

    <div class="container rounded bg-white mt-5 mb-5">
        <div class="row">
            <div class="col-md-3 border-right">
                <div class="d-flex flex-column align-items-center text-center p-3 py-5">
                  <img class="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg">
                  <?php
                  echo "<span class='font-weight-bold'>Hello</span>";
                  echo "<span class='text-black-50'>".$_SESSION['email']."</span>";
                  ?>
                  </div>
            </div>
            <div class="col-md-5 border-right">
              <div class="p-3 py-5">
                    <form method="POST">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h4 class="text-right">Profile Settings</h4>
                        </div>
                        <div class="row mt-2">
                            <div class="col-md-6">
                                <label class="labels">Name</label>
                                <input type="text" name="name" class="form-control" placeholder="first name" value="<?php echo $name ?>">
                            </div>
                            <div class="col-md-6">
                                <label class="labels">Surname</label>
                                <input type="text" name="surname" class="form-control" value="<?php echo $surname ?>" placeholder="surname">
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <label class="labels">Mobile Number</label>
                                <input type="text" name="cellno" class="form-control" placeholder="enter phone number" value="<?php echo $cellno ?>">
                            </div>
                            <div class="col-md-12">
                                <label class="labels">Email</label>
                                <input type="text" name="email" class="form-control" placeholder="enter email id" value="<?php echo $_SESSION['email']; ?>">
                            </div>
                        </div>
                        <div class="row mt-3">
                        </div>
                        <div class="mt-5 text-center">
                            <button class="btn btn-primary profile-button" name="submit"type="submit">Save Profile</button>
                        </div>
                    </form>
                    <?php
                        if (isset($_POST['submit'])) {
                          $name = $_POST['name'];
                          $surname = $_POST['surname'];
                          $cellno = $_POST['cellno'];
                          $email = $_POST['email'];
                          $userid = $_SESSION['userid'];
                      
                          // Validate email format
                          if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                              echo "Invalid email format";
                              exit;
                          }
                      
                          // Check if email already exists in the database for another user
                          $stmt = $conn->prepare("SELECT email FROM users WHERE email = ?");
                          $stmt->bind_param("s", $email);
                          $stmt->execute();
                          $stmt->store_result();
                      
                          if ($stmt->num_rows > 0 && $email != $_SESSION['email']) {
                              echo "Email already exists";
                              exit;
                          }
                          $stmt->close();
                      
                          // Update the user's profile
                          $stmt = $conn->prepare("UPDATE users SET name = ?, surname = ?, cellno = ?, email = ? WHERE userid = ?");
                          $stmt->bind_param("sssss", $name, $surname, $cellno, $email, $userid);
                      
                          if ($stmt->execute()) {
                            echo '<div class="alert alert-success" role="alert" style="margin-top: 10px">Profile Updated successfully!</div>';
                            $_SESSION['email'] = $email;  // Update session email if changed
                          } else {
                              echo "Error updating profile";
                          }
                      
                          $stmt->close();
                          $conn->close();
                      }                      
                    ?> 
                </div>
            </div>
            <div class="col-md-4">
                <div class="p-3 py-5">
                    <div class="d-flex justify-content-between align-items-center experience"><span>Orders</span><span class="border px-3 p-1 add-experience"><i class="fa fa-plus"></i>&nbsp;</span></div><br>
                    <?php
                      $sql = "SELECT orderid, date, status FROM orders WHERE userid = ".$_SESSION['userid']."";
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
                            <button type="button" class="btn btn-info btn-sm" onclick="showOrderDetails(' . htmlspecialchars($row["orderid"]) . ')">View Details</button>
                            </div>
                            <div id="order-details-' . htmlspecialchars($row["orderid"]) . '" class="order-details mt-3" style="display: none;"></div>
                          ';
                        }     
                      }else{
                        echo "error";
                      }

                    ?>
                    <script>
                        function showOrderDetails(orderId) {
                            var orderDetailsDiv = document.getElementById('order-details-' + orderId);
                            if (orderDetailsDiv.style.display === 'none') {
                                fetch('getOrderDetailsUser.php?orderid=' + orderId)
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
                    
                </div>
                
            </div>
        </div>
      </div>
    </div>

    <?php
      include 'footer.php';
    ?>
</body>
</html>