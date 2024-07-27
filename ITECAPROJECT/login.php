<?php
    include 'session.php';
    require 'dbconn.php';

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get user inputs
        $email = $_POST["email"];
        $password = $_POST["password"];
    
        // Prepare statement
        $stmt = $conn->prepare("SELECT userid, password FROM users WHERE email = ?");
        if (!$stmt) {
            echo "<script>alert('Prepare failed: " . $conn->error . "');</script>";
            exit();
        }
        
        // Bind parameters and execute statement
        $stmt->bind_param("s", $email);
        if (!$stmt->execute()) {
            echo "<script>alert('Execute failed: " . $stmt->error . "');</script>";
            exit();
        }
        
        // Store result and check if user exists
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
                
            $stmt->bind_result($userid, $hashed_password);
            $stmt->fetch();
            $_SESSION['userid'] = $userid;
        
            // Verify the provided password with the stored hashed password
            if (password_verify($password, $hashed_password)) {
                $_SESSION['email'] = $email;
                $_SESSION['login'] = true;
            } else {
                header("Location: login.php");
                echo "<script>alert('Invalid password.');</script>";
                exit();
            }
            // Redirect based on the presence of cart data
            $redirect_page = isset($_SESSION['cart_data']) ? 'cart.php' : 'index.php';
            header("Location: $redirect_page");
            exit();
        } else {
            header("Location: login.php");
            echo "<script>alert('Invalid email or password.');</script>";
            exit();
        }
    
        // Close statement and connection
        $stmt->close();
        $conn->close();
   }
   
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TinyWorld/Login</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>
  <script>  
      function validateEmail(email) {
        // Regular expression for validating email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }

      function validatePassword(password) {
        // You can implement your own password validation logic here
        // For simplicity, let's just check if the password is at least 6 characters long
        return password.length >= 8;
      }

      function validateForm(){
        const email = document.getElementById('floatingInput').value;
        const password = document.getElementById('floatingPassword').value;

        if (validateEmail(email) && validatePassword(password)) {
            return true;
        } else {
            // Display error messages or handle invalid data as needed
            alert('Please enter valid email and passwords, and ensure passwords match.');
            return false;
        }
      }
    </script>

    <div class="container col-xl-10 col-xxl-8 px-4 py-5">
        <div class="row align-items-center g-lg-5 py-5">
          <div class="col-lg-7 text-center text-lg-start">
                <img src="/assets/tinyworld-logo.PNG" class="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" loading="lazy">        
          </div>
          <div class="col-md-10 mx-auto col-lg-5">
            <h4 style="text-align: center;">log In</h4>
            
            <form class="p-4 p-md-5 border rounded-3 bg-body-tertiary" onsubmit="return validateForm()" method="POST">
              <div class="form-floating mb-3">
                <input type="email" class="form-control" id="floatingInput" name="email" placeholder="name@example.com">
                <label for="floatingInput">Email address</label>
              </div>
              <div class="form-floating mb-3">
                <input type="password" class="form-control" id="floatingPassword" name="password" placeholder="Password">
                <label for="floatingPassword">Password</label>
              </div>
              <div class="checkbox mb-3">
                <label>
                  <input type="checkbox" id="showPW" name="showPW"> Show Password
                </label>
              </div>
              <button class="w-100 btn btn-lg btn-primary" type="submit" name="submit">log In</button>
              <a href="/signup.php" style="margin-top: 5px;"><small style="text-align: center;">Don't have an account, Sign Up now.</small></a>
              <hr class="my-4">
              <small class="text-body-secondary">By Logging In, you agree to the terms of use. <br>If you have forgotten your password, please email emily@tinyworld.com</small>
            </form>
            
          </div>
        </div>
      </div>

      <script>
        document.getElementById('showPW').addEventListener('change', function() {
          const passwordField = document.getElementById('floatingPassword');
          passwordField.type = this.checked ? 'text' : 'password';
      });
      </script>
</body>
</html>