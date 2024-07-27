<?php
session_start();
include 'dbconn.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);

    // Check if the email already exists in the database
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Email already exists
        echo "<script>alert('Email already exists in the database.'); window.location.href = 'signup.php';</script>";
        exit();
    } else {
        // Insert the data into the database
        $stmt->close();
        $stmt = $conn->prepare("INSERT INTO users (email, password, name, surname, cellno) VALUES (?, ?, '', '', '')");
        $stmt->bind_param("ss", $email, $password);
        
        if ($stmt->execute()) {
            $_SESSION['email'] = $email;
            $_SESSION['login'] = true;
            $stmt->close();
            
            $stmt = $conn->prepare("SELECT userid FROM users WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $stmt->store_result();
            
            if ($stmt->num_rows > 0) {
                $stmt->bind_result($userid);
                $stmt->fetch();
                $_SESSION['userid'] = $userid;

                $redirect_page = isset($_SESSION['cart_data']) ? 'cart.php' : 'index.php';
                header("Location: $redirect_page");
                exit();
            } else {
                echo "<script>alert('User ID not found.'); window.location.href = 'signup.php';</script>";
                exit();
            }
        } else {
            echo "<script>alert('Error inserting data into the database.'); window.location.href = 'signup.php';</script>";
        }
    }

    $stmt->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TinyWorld/SignUp</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>
    <script>
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return password.length >= 8;
    }

    function validateForm() {
        const email = document.getElementById('floatingInput').value;
        const password = document.getElementById('floatingPassword').value;
        const rePassword = document.getElementById('rePassword').value;

        if (validateEmail(email) && validatePassword(password) && password === rePassword) {
            return true;
        } else {
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
            <h4 style="text-align: center;">Join Us</h4>

            <form class="p-4 p-md-5 border rounded-3 bg-body-tertiary" onsubmit="return validateForm()" method="POST">
              <div class="form-floating mb-3">
                <input type="email" class="form-control" id="floatingInput" name="email" placeholder="name@example.com" required>
                <label for="floatingInput">Email address</label>
              </div>
              <div class="form-floating mb-3">
                <input type="password" class="form-control" id="floatingPassword" name="password" placeholder="Password" required>
                <label for="floatingPassword">Password</label>
              </div>
              <div class="form-floating mb-3">
                <input type="password" class="form-control" id="rePassword" placeholder="Password" required>
                <label for="rePassword">Re-enter Password</label>
              </div>
              <div class="checkbox mb-3">
                <label>
                  <input type="checkbox" id="showPW" name="showPW"> Show Password
                </label>
              </div>
              <button class="w-100 btn btn-lg btn-primary" type="submit" name="submit">Sign up</button>
              <hr class="my-4">
              <small class="text-body-secondary">By clicking Sign up, you agree to the terms of use.</small>
            </form>

          </div>
        </div>
      </div>

      <script>
        document.getElementById('showPW').addEventListener('change', function() {
          const passwordField = document.getElementById('floatingPassword');
          const reEnterField = document.getElementById('rePassword');
          passwordField.type = this.checked ? 'text' : 'password';
          reEnterField.type = this.checked ? 'text' : 'password';
      });
      </script>
</body>
</html>
