<?php
    include 'session.php';
    $activePage = 'contactus';
    include 'header.php';
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TinyWorld/Contact</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>
<div class="container col-xl-10 col-xxl-8 px-4 py-5">
    <div class="row align-items-center g-lg-5 py-5">
        <div class="col-lg-7 text-center text-lg-start">
            <h1 class="display-4 fw-bold lh-1 text-body-emphasis mb-3">What's on your mind?</h1>
            <p class="col-lg-10 fs-4">Talk to us.</p>
        </div>
        <div class="col-md-10 mx-auto col-lg-5">
        <form id="contactForm" class="p-4 p-md-5 border rounded-3 bg-body-tertiary">
            <div class="form-floating mb-3">
                <input type="email" class="form-control" id="floatingInputEmail" placeholder="name@example.com">
                <label for="floatingInputEmail">Email address</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="floatingInputName" placeholder="Name">
                <label for="floatingInputName">Name</label>
            </div>
            <div class="form-floating mb-3">
                <input type="text" style="height: 150px;" class="form-control" id="floatingInputMessage" placeholder="Message">
                <label for="floatingInputMessage">Insert Query Here</label>
            </div>
            <button class="w-100 btn btn-lg btn-primary" type="submit">Send</button>
            <hr class="my-4">
            <small class="text-body-secondary">By clicking Send, we will review your message and contact you via email</small>
        </form>
        </div>
    </div>
</div>

<?php
include 'footer.php';
?>

<script src="https://cdn.emailjs.com/dist/email.min.js"></script>
<script src="sendEmailQuery.js"></script>

</body>
</html>
