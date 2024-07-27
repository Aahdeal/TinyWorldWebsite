(function(){
    emailjs.init(""); // Replace with your User ID

    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form data
        var formData = {
            email: document.getElementById('floatingInputEmail').value,
            name: document.getElementById('floatingInputName').value,
            message: document.getElementById('floatingInputMessage').value
        };

        // Send email
        emailjs.send("service_oegpffl", "template_jav09bm", formData)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Message sent successfully!');
                document.getElementById('contactForm').reset(); // Reset form after successful submission
            }, function(error) {
                console.log('FAILED...', error);
                alert('Failed to send message. Please try again later.');
            });
    });
})();
