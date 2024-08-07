document.addEventListener("DOMContentLoaded", function() {
    fetch('users.json')
        .then(response => response.json())
        .then(data => {
            const driversList = document.getElementById('drivers-list');
            const drivers = data.filter(user => user.role === 'driver');

            drivers.forEach(driver => {
                const driverItem = document.createElement('div');
                driverItem.className = 'driver-item';
                driverItem.innerHTML = `
                    <p>نام: ${driver.name}</p>
                    <p>ایمیل: ${driver.email}</p>
                    <p>شهر: ${driver.city}</p>
                    <p>منطقه: ${driver.area}</p>
                    <button class="block-button" data-email="${driver.email}">بلاک کردن</button>
                `;
                driversList.appendChild(driverItem);
            });

            const blockButtons = document.querySelectorAll('.block-button');
            blockButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const email = this.getAttribute('data-email');
                    blockDriver(email);
                });
            });
        });
});

function blockDriver(email) {
    alert(`راننده با ایمیل ${email} بلاک شد.`);
}
