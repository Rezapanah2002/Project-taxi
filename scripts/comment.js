document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("comment-form");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        if (validateForm(name, email, message)) {
            displaySuccessMessage();
        } else {
            alert("لطفا تمام فیلدها را به درستی پر کنید.");
        }
    });

    function validateForm(name, email, message) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return name.trim() !== "" && emailPattern.test(email) && message.trim() !== "";
    }

    function displaySuccessMessage() {
        alert("پیام شما با موفقیت ارسال شد.");
        form.reset();
    }
});
