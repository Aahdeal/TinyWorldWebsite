document.addEventListener('DOMContentLoaded', function() {
    emailjs.init(""); // Replace with your User ID

    // Ensure the hidden div exists before proceeding
    var sendDiv = document.getElementById('send');
    if (sendDiv) {
        // Get form data
        var formData = {
            email: document.getElementById('email').value,
            cellNo: document.getElementById('cellNo').value,
            order: document.getElementById('oID').value,
            total: document.getElementById('total').value,
            delivery: document.getElementById('delivery').value
        };

        // Send email
        emailjs.send("service_oegpffl", "template_gfp8dnq", formData)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
            }, function(error) {
                console.log('FAILED...', error);
            });
    }
});